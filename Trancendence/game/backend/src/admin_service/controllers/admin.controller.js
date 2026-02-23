import { query } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIO } from "../socket/io.js";


const ONLINE_WINDOW_SECONDS = 90;

let usersColsCache = null;
async function usersHasColumn(col) {
  if (!usersColsCache) {
    const { rows } = await query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='users'
      `
    );
    usersColsCache = new Set(rows.map((r) => r.column_name));
  }
  return usersColsCache.has(col);
}

const parseBool = (v) => {
  if (v === true || v === false)
      return v;
  if (typeof v !== "string")
      return null;
  const s = v.toLowerCase();
  if (s === "true")
      return true;
  if (s === "false")
      return false;
  return null;
};

const clampInt = (v, def, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n))
      return def;
  return Math.max(min, Math.min(max, Math.trunc(n)));
};

const safeText = (v, max = 400) => {
  const s = String(v ?? "");
  return s.length > max ? s.slice(0, max) : s;
};


const logAdminAction = async (req, { action, target_type = null, target_id = null, meta = {} }) => {
  try {
    const adminUserId = req.user?.id ?? null;

    const ip =
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
      req.ip ||
      null;

    const ua = safeText(req.headers["user-agent"], 400);

    await query(
      `
      INSERT INTO admin_audit_log (admin_user_id, action, target_type, target_id, meta, ip, user_agent)
      VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7)
      `,
      [
        adminUserId,
        action,
        target_type,
        target_id,
        JSON.stringify(meta || {}),
        ip,
        ua,
      ]
    );
  } catch {
    
  }
};

export const adminController = {
  listUsers: asyncHandler(async (req, res) => {
    const search = String(req.query.search || "").trim().toLowerCase();
    const role = String(req.query.role || "").trim().toLowerCase();
    const active = parseBool(req.query.active);
    const available = parseBool(req.query.available);

    const where = [];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      where.push(
        `(LOWER(u.email) LIKE $${i}
          OR LOWER(COALESCE(u.p_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u.first_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u.last_name,'')) LIKE $${i})`
      );
    }

    if (role === "admin" || role === "user") {
      params.push(role);
      where.push(`u.role = $${params.length}`);
    }

    if (active !== null) {
      params.push(active);
      where.push(`COALESCE(u.is_active, true) = $${params.length}`);
    }

    if (available !== null) {
      params.push(available);
      where.push(`COALESCE(u.is_available, false) = $${params.length}`);
    }

    params.push(ONLINE_WINDOW_SECONDS);
    const onlineWindowParam = params.length;
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await query(
      `
      SELECT
        u.id::int AS id,
        u.email,
        u.role,
        u.first_name AS "firstName",
        u.last_name  AS "lastName",
        u.gender,
        u.country,
        u.p_name,
        u.image,
        COALESCE(u.is_active, true) AS is_active,
        COALESCE(u.is_available, false) AS is_available,
        u.last_seen,
        (
          COALESCE(u.is_available, false) = true
          AND u.last_seen > (now() - ($${onlineWindowParam} * interval '1 second'))
        ) AS "availableNow"
      FROM users u
      ${whereSql}
      ORDER BY u.id ASC
      `,
      params
    );
    res.json({ users: rows });
  }),

  updateUser: asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  if (!targetId)
      return res.status(400).json({ error: "Invalid user id" });

  const me = Number(req.user?.id);
  const { role, is_active, forceOffline } = req.body || {};

  if (role === "user" && me && targetId === me) {
    return res.status(400).json({ error: "You cannot demote yourself." });
  }

  if (role === "user") {
    const { rows: targetRows } = await query(`SELECT role FROM users WHERE id = $1`, [targetId]);
    const currentRole = String(targetRows[0]?.role || "").toLowerCase();
    if (currentRole === "admin") {
      const { rows: adminCountRows } = await query(
        `SELECT COUNT(*)::int AS c FROM users WHERE role = 'admin'`
      );
      const adminCount = adminCountRows[0]?.c ?? 0;
      if (adminCount <= 1) {
        return res.status(400).json({ 
          error: "Cannot demote the last admin." 
        });
      }
    }
  }

  const sets = [];
  const params = [];
  const meta = {};

  if (role === "admin" || role === "user") {
    params.push(role);
    sets.push(`role = $${params.length}`);
    meta.role = role;
  }

  const hasIsActive = await usersHasColumn("is_active");
  if (typeof is_active === "boolean" && hasIsActive) {
    params.push(is_active);
    sets.push(`is_active = $${params.length}`);
    meta.is_active = is_active;
  }

  const hasIsAvail = await usersHasColumn("is_available");
  const hasLastSeen = await usersHasColumn("last_seen");
  if (forceOffline === true) {
    if (hasIsAvail)
        sets.push(`is_available = false`);
    if (hasLastSeen)
        sets.push(`last_seen = now()`);
    meta.forceOffline = true;

    try {
      const io = getIO();
      io.in(`user:${targetId}`).disconnectSockets(true);
    } catch {
      // ignore if io not initialized
    }
  }

  if (!sets.length) {
    return res.status(400).json({ 
      error: "No valid fields to update." 
    });
  }

  params.push(targetId);

  await query(
    `
    UPDATE users
    SET ${sets.join(", ")}
    WHERE id = $${params.length}
    `,
    params
  );

  await logAdminAction(req, {
    action: "user.update",
    target_type: "user",
    target_id: targetId,
    meta,
  });
  res.json({ ok: true });
}),



  resetUser: asyncHandler(async (req, res) => {
    const targetId = Number(req.params.id);
    if (!targetId) return res.status(400).json({ 
      error: "Invalid user id" 
    });

    await query(`UPDATE users SET is_available = false, last_seen = now() WHERE id = $1`, [
      targetId,
    ]);

    const { rowCount } = await query(
      `
      UPDATE game_invites
      SET status = 'rejected'
      WHERE status IN ('pending','accepted')
        AND (from_user_id = $1 OR to_user_id = $1)
      `,
      [targetId]
    );

    await logAdminAction(req, {
      action: "user.reset_state",
      target_type: "user",
      target_id: targetId,
      meta: { invitesRejected: rowCount || 0 },
    });
    res.json({ ok: true });
  }),

  logoutUser: asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  if (!targetId)
      return res.status(400).json({ 
    error: "Invalid user id" 
  });

  await query(
    `UPDATE users SET token_version = COALESCE(token_version, 0) + 1 WHERE id = $1`,
    [targetId]
  );

  try {
    const { getIO } = await import("../socket/io.js");
    getIO().in(`user:${targetId}`).disconnectSockets(true);
  } catch {}
  res.json({ ok: true, loggedOut: true });
}),


  deleteUser: asyncHandler(async (req, res) => {
  const targetId = Number(req.params.id);
  if (!targetId)
      return res.status(400).json({ error: "Invalid user id" });

  const me = Number(req.user?.id);
  if (me && targetId === me) {
    return res.status(400).json({ 
      error: "You cannot delete yourself." 
    });
  }

  const { rows: targetRows } = await query(`SELECT role FROM users WHERE id = $1`, [targetId]);
  const targetRole = String(targetRows[0]?.role || "").toLowerCase();
  if (targetRole === "admin") {
    const { rows: adminCountRows } = await query(
      `SELECT COUNT(*)::int AS c FROM users WHERE role = 'admin'`
    );
    const adminCount = adminCountRows[0]?.c ?? 0;
    if (adminCount <= 1) {
      return res.status(400).json({ 
        error: "Cannot delete the last admin." 
      });
    }
  }

  const hasDeletedAt = await usersHasColumn("deleted_at");
  const hasIsActive = await usersHasColumn("is_active");
  const hasIsAvail = await usersHasColumn("is_available");
  const hasLastSeen = await usersHasColumn("last_seen");
  const hasTokenVersion = await usersHasColumn("token_version");

  const sets = [];
  if (hasDeletedAt)
      sets.push(`deleted_at = now()`);
  if (hasIsActive)
      sets.push(`is_active = false`);
  if (hasIsAvail)
      sets.push(`is_available = false`);
  if (hasLastSeen)
      sets.push(`last_seen = now()`);
  if (hasTokenVersion)
      sets.push(`token_version = COALESCE(token_version, 0) + 1`);

  if (!sets.length) {
    sets.push(`last_seen = now()`);
  }

  await query(`UPDATE users SET ${sets.join(", ")} WHERE id = $1`, [targetId]);

  const { rowCount } = await query(
    `
    UPDATE game_invites
    SET status = 'rejected'
    WHERE status IN ('pending','accepted')
      AND (from_user_id = $1 OR to_user_id = $1)
    `,
    [targetId]
  );

  try {
    const io = getIO();
    io.in(`user:${targetId}`).disconnectSockets(true);
  } catch {
    // ignore if io not initialized
  }

  await logAdminAction(req, {
    action: "user.deactivate",
    target_type: "user",
    target_id: targetId,
    meta: { invitesRejected: rowCount || 0, softDelete: hasDeletedAt, tokenRevoked: hasTokenVersion },
  });
  res.json({ ok: true, deleted: "soft" });
}),

  listInvites: asyncHandler(async (req, res) => {
    const status = String(req.query.status || "").trim().toLowerCase();
    const search = String(req.query.search || "").trim().toLowerCase();
    const page = clampInt(req.query.page, 1, 1, 100000);
    const limit = clampInt(req.query.limit, 50, 1, 200);
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (status && ["pending", "accepted", "rejected", "completed"].includes(status)) {
      params.push(status);
      where.push(`gi.status = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      where.push(
        `(
          LOWER(COALESCE(uf.email,'')) LIKE $${i}
          OR LOWER(COALESCE(ut.email,'')) LIKE $${i}
          OR LOWER(COALESCE(uf.p_name,'')) LIKE $${i}
          OR LOWER(COALESCE(ut.p_name,'')) LIKE $${i}
          OR LOWER(COALESCE(uf.first_name,'')) LIKE $${i}
          OR LOWER(COALESCE(uf.last_name,'')) LIKE $${i}
          OR LOWER(COALESCE(ut.first_name,'')) LIKE $${i}
          OR LOWER(COALESCE(ut.last_name,'')) LIKE $${i}
        )`
      );
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows: countRows } = await query(
      `
      SELECT COUNT(*)::int AS total
      FROM game_invites gi
      JOIN users uf ON uf.id = gi.from_user_id
      JOIN users ut ON ut.id = gi.to_user_id
      ${whereSql}
      `,
      params
    );

    const total = countRows[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    params.push(limit);
    const limitParam = params.length;
    params.push(offset);
    const offsetParam = params.length;

    const { rows } = await query(
      `
      SELECT
        gi.id::int AS id,
        gi.from_user_id::int AS "fromUserId",
        gi.to_user_id::int AS "toUserId",
        gi.status,
        gi.created_at,
        uf.email AS from_email,
        uf.p_name AS from_name,
        uf.image AS from_image,
        ut.email AS to_email,
        ut.p_name AS to_name,
        ut.image AS to_image

      FROM game_invites gi
      JOIN users uf ON uf.id = gi.from_user_id
      JOIN users ut ON ut.id = gi.to_user_id
      ${whereSql}
      ORDER BY gi.id DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
      `,
      params
    );
    res.json({ invites: rows, page, limit, total, totalPages });
  }),

  cancelInvite: asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!id)
        return res.status(400).json({ 
      error: "Invalid invite id" 
    });

    const { rows } = await query(
      `
      UPDATE game_invites
      SET status = 'rejected'
      WHERE id = $1
        AND status IN ('pending','accepted')
      RETURNING id::int AS id, status
      `,
      [id]
    );

    if (!rows[0]) {
      return res.status(404).json({ 
        error: "Invite not found or not cancellable" 
      });
    }

    await logAdminAction(req, {
      action: "invite.cancel",
      target_type: "invite",
      target_id: id,
      meta: { newStatus: "rejected" },
    });
    res.json({ ok: true, invite: rows[0] });
  }),

  clearStuckInvites: asyncHandler(async (req, res) => {
    const minutes = Number(req.body?.minutes ?? 20);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return res.status(400).json({ 
        error: "Invalid minutes" 
      });
    }

    const { rows } = await query(
      `
      UPDATE game_invites
      SET status = 'rejected'
      WHERE status IN ('pending','accepted')
        AND created_at < (now() - ($1 * interval '1 minute'))
      RETURNING id
      `,
      [minutes]
    );

    await logAdminAction(req, {
      action: "invite.clear_stuck",
      target_type: "invite",
      target_id: null,
      meta: { minutes, cleared: rows.length },
    });

    res.json({ ok: true, cleared: rows.length });
  }),


  listMatches: asyncHandler(async (req, res) => {
    const search = String(req.query.search || "").trim().toLowerCase();
    const mode = String(req.query.mode || "all").trim().toLowerCase();
    const status = String(req.query.status || "all").trim().toLowerCase();

    const page = clampInt(req.query.page, 1, 1, 100000);
    const limit = clampInt(req.query.limit, 50, 1, 200);
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (mode !== "all" && mode) {
      params.push(mode);
      where.push(`LOWER(COALESCE(m.mode,'')) = $${params.length}`);
    }

    if (status !== "all" && status) {
      params.push(status);
      where.push(`LOWER(COALESCE(m.status,'')) = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      where.push(
        `(
          LOWER(COALESCE(u1.email,'')) LIKE $${i}
          OR LOWER(COALESCE(u2.email,'')) LIKE $${i}
          OR LOWER(COALESCE(u1.p_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u2.p_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u1.first_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u1.last_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u2.first_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u2.last_name,'')) LIKE $${i}
        )`
      );
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows: countRows } = await query(
      `
      SELECT COUNT(*)::int AS total
      FROM matches m
      JOIN users u1 ON u1.id = m.player1_id
      JOIN users u2 ON u2.id = m.player2_id
      ${whereSql}
      `,
      params
    );

    const total = countRows[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    params.push(limit);
    const limitParam = params.length;
    params.push(offset);
    const offsetParam = params.length;

    const { rows } = await query(
      `
      SELECT
        m.id::int AS id,
        m.played_at,
        m.mode,
        m.status,
        m.winner_id::int AS winner_id,
        m.player1_id::int AS p1_id,
        u1.email AS p1_email,
        COALESCE(u1.p_name, (u1.first_name || ' ' || u1.last_name)) AS p1_name,
        u1.image AS p1_image,
        m.player2_id::int AS p2_id,
        u2.email AS p2_email,
        COALESCE(u2.p_name, (u2.first_name || ' ' || u2.last_name)) AS p2_name,
        u2.image AS p2_image,
        COALESCE(m.player1_games_won, 0)::int AS p1_games_won,
        COALESCE(m.player2_games_won, 0)::int AS p2_games_won

      FROM matches m
      JOIN users u1 ON u1.id = m.player1_id
      JOIN users u2 ON u2.id = m.player2_id
      ${whereSql}
      ORDER BY m.played_at DESC NULLS LAST, m.id DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
      `,
      params
    );

    res.json({ matches: rows, page, limit, total, totalPages });
  }),

  listTournaments: asyncHandler(async (req, res) => {
    const search = String(req.query.search || "").trim().toLowerCase();

    const where = [];
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      where.push(
        `(LOWER(COALESCE(ts.t_name,'')) LIKE $${i}
          OR LOWER(COALESCE(t.name,'')) LIKE $${i}
          OR CAST(t.id AS TEXT) LIKE $${i})`
      );
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows } = await query(
      `
      SELECT
        t.id::int AS id,
        COALESCE(ts.t_name, t.name, ('Tournament #' || t.id::text)) AS name,
        COALESCE(ts.t_date, TO_CHAR(t.starts_at, 'YYYY-MM-DD')) AS date,
        COALESCE(ts.t_date_iso, t.starts_at) AS date_iso,
        COALESCE(t.status, 'scheduled') AS status,
        COALESCE(t.visibility, 'public') AS visibility,
        (
          SELECT COUNT(*)::int
          FROM tournament_participants tp
          WHERE tp.tournament_id = t.id
        ) AS "participantsCount"
      FROM tournaments t
      LEFT JOIN tournament_schedule ts
        ON ts.tournament_id = t.id
      ${whereSql}
      ORDER BY COALESCE(ts.t_date_iso, t.starts_at) DESC NULLS LAST, t.id DESC
      `,
      params
    );

    res.json({ tournaments: rows });
  }),

  listTournamentSubscriptions: asyncHandler(async (req, res) => {
    const tournamentId = Number(req.params.id);
    if (!tournamentId) return res.status(400).json({ error: "Invalid tournament id" });

    const search = String(req.query.search || "").trim().toLowerCase();
    const page = clampInt(req.query.page, 1, 1, 100000);
    const limit = clampInt(req.query.limit, 50, 1, 200);
    const offset = (page - 1) * limit;
    const { rows: tpCols } = await query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='tournament_participants'
      `
    );
    const tpColSet = new Set(tpCols.map((r) => r.column_name));
    const hasCreatedAt = tpColSet.has("created_at");

    const where = [`tp.tournament_id = $1`];
    const params = [tournamentId];

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      where.push(
        `(
          LOWER(COALESCE(u.email,'')) LIKE $${i}
          OR LOWER(COALESCE(u.p_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u.first_name,'')) LIKE $${i}
          OR LOWER(COALESCE(u.last_name,'')) LIKE $${i}
        )`
      );
    }

    const whereSql = `WHERE ${where.join(" AND ")}`;

    const { rows: countRows } = await query(
      `
      SELECT COUNT(*)::int AS total
      FROM tournament_participants tp
      JOIN users u ON u.id = tp.user_id
      ${whereSql}
      `,
      params
    );

    const total = countRows[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    params.push(limit);
    const limitParam = params.length;
    params.push(offset);
    const offsetParam = params.length;

    const { rows } = await query(
      `
      SELECT
        u.id::int AS "userId",
        u.email,
        u.p_name,
        u.first_name AS "firstName",
        u.last_name  AS "lastName",
        u.image,
        ${hasCreatedAt ? "tp.created_at AS subscribed_at" : "NULL::timestamp AS subscribed_at"}
      FROM tournament_participants tp
      JOIN users u ON u.id = tp.user_id
      ${whereSql}
      ORDER BY ${hasCreatedAt ? "tp.created_at DESC" : "u.id DESC"}
      LIMIT $${limitParam} OFFSET $${offsetParam}
      `,
      params
    );

    res.json({ subscriptions: rows, page, limit, total, totalPages });
  }),

  cancelTournamentSubscription: asyncHandler(async (req, res) => {
    const tournamentId = Number(req.params.tournamentId);
    const userId = Number(req.params.userId);
    if (!tournamentId || !userId) {
      return res.status(400).json({ error: "Invalid tournamentId/userId" });
    }

    const { rowCount } = await query(
      `
      DELETE FROM tournament_participants
      WHERE tournament_id = $1 AND user_id = $2
      `,
      [tournamentId, userId]
    );

    if (!rowCount) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    await logAdminAction(req, {
      action: "tournament.subscription.cancel",
      target_type: "tournament_participant",
      target_id: null,
      meta: { tournamentId, userId },
    });

    res.json({ ok: true });
  }),

  getMatchDetails: asyncHandler(async (req, res) => {
    const matchId = Number(req.params.id);
    if (!matchId)
        return res.status(400).json({ error: "Invalid match id" });

    const { rows } = await query(
      `
      SELECT
        m.id::int AS id,
        m.played_at,
        m.mode,
        m.status,
        m.winner_id::int AS winner_id,
        m.player1_id::int AS p1_id,
        m.player2_id::int AS p2_id,
        COALESCE(m.player1_games_won, 0)::int AS p1_games_won,
        COALESCE(m.player2_games_won, 0)::int AS p2_games_won,
        u1.email AS p1_email,
        COALESCE(u1.p_name, (u1.first_name || ' ' || u1.last_name)) AS p1_name,
        u1.image AS p1_image,
        u2.email AS p2_email,
        COALESCE(u2.p_name, (u2.first_name || ' ' || u2.last_name)) AS p2_name,
        u2.image AS p2_image,
        COALESCE(
          json_agg(
            json_build_object(
              'gameNumber', mg.game_number,
              'p1', mg.player1_points,
              'p2', mg.player2_points,
              'winnerId', mg.winner_id
            )
            ORDER BY mg.game_number
          ) FILTER (WHERE mg.match_id IS NOT NULL),
          '[]'::json
        ) AS games
      FROM matches m
      JOIN users u1 ON u1.id = m.player1_id
      JOIN users u2 ON u2.id = m.player2_id
      LEFT JOIN match_games mg
        ON mg.match_id = m.id
       AND mg.game_number BETWEEN 1 AND 4
      WHERE m.id = $1
      GROUP BY m.id, u1.email, u1.p_name, u1.first_name, u1.last_name, u1.image,
               u2.email, u2.p_name, u2.first_name, u2.last_name, u2.image
      `,
      [matchId]
    );

    if (!rows[0])
        return res.status(404).json({ error: "Match not found" });

    res.json({ match: rows[0] });
  }),

  deleteMatch: asyncHandler(async (req, res) => {
    const matchId = Number(req.params.id);
    if (!matchId) return res.status(400).json({ 
      error: "Invalid match id" 
    });

    await query(`DELETE FROM match_games WHERE match_id = $1`, [matchId]);
    await query(`DELETE FROM matches WHERE id = $1`, [matchId]);

    await logAdminAction(req, {
      action: "match.delete",
      target_type: "match",
      target_id: matchId,
      meta: {},
    });

    res.json({ ok: true });
  }),

  

  createTournament: asyncHandler(async (req, res) => {
  const name = String(req.body?.name || "").trim();
  const startsAt = req.body?.startsAt; 
  const visibility = String(req.body?.visibility || "public");
  const status = String(req.body?.status || "not_started");

  if (!name)
      return res.status(400).json({ error: "Missing name" });
  if (!startsAt)
      return res.status(400).json({ error: "Missing startsAt" });

  const registrationOpensOffsetMs = Number(
    req.body?.registrationOpensOffsetMs ?? 10 * 24 * 60 * 60 * 1000
  );
  const registrationClosesOffsetMs = Number(
    req.body?.registrationClosesOffsetMs ?? 5 * 24 * 60 * 60 * 1000
  );

  if (!Number.isFinite(registrationOpensOffsetMs) || registrationOpensOffsetMs <= 0) {
    return res.status(400).json({ error: "Invalid registrationOpensOffsetMs" });
  }
  if (!Number.isFinite(registrationClosesOffsetMs) || registrationClosesOffsetMs <= 0) {
    return res.status(400).json({ error: "Invalid registrationClosesOffsetMs" });
  }
  if (registrationClosesOffsetMs >= registrationOpensOffsetMs) {
    return res.status(400).json({ error: "Close offset must be smaller than open offset" });
  }

  const adminUserId = Number(req.user?.id) || null;

  await query("BEGIN");
  try {
    const { rows: tRows } = await query(
  `
  INSERT INTO tournaments (
    name, starts_at, status, visibility, created_by,
    registration_opens_offset_ms, registration_closes_offset_ms
  )
  VALUES ($1, $2::timestamptz, $3, $4, $5, $6, $7)
  RETURNING id::int AS id
  `,
  [
    name,
    startsAt,
    status,
    visibility,
    adminUserId,
    registrationOpensOffsetMs,
    registrationClosesOffsetMs,
  ]
);

    const tournamentId = tRows[0]?.id;
    if (!tournamentId)
        throw new Error("Failed to create tournament");
    await query(
  `
  INSERT INTO tournament_schedule (tournament_id, t_name, t_date, t_date_iso, t_starts_at)
  VALUES (
    $1,
    $2,
    TO_CHAR($3::timestamptz, 'DD/MM/YYYY'),
    ($3::timestamptz)::date,
    $3::timestamptz
  )
  ON CONFLICT (tournament_id) DO UPDATE SET
    t_name = EXCLUDED.t_name,
    t_date = EXCLUDED.t_date,
    t_date_iso = EXCLUDED.t_date_iso,
    t_starts_at = EXCLUDED.t_starts_at,
    updated_at = now()
  `,
  [tournamentId, name, startsAt]
);

    await logAdminAction(req, {
      action: "tournament.create",
      target_type: "tournament",
      target_id: tournamentId,
      meta: {
        name,
        startsAt,
        visibility,
        status,
        registrationOpensOffsetMs,
        registrationClosesOffsetMs,
      },
    });

    await query("COMMIT");
    res.json({ ok: true, tournamentId, publicId: tRows[0]?.publicId });
  } catch (e) {
    await query("ROLLBACK");
    throw e;
  }
}),

setTournamentStatus: asyncHandler(async (req, res) => {
  const tournamentId = Number(req.params.id);
  const status = String(req.body?.status || "").trim();

  if (!tournamentId)
      return res.status(400).json({ error: "Invalid tournament id" });
  if (!["not_started", "in_progress", "finished"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const { rowCount } = await query(
    `UPDATE tournaments SET status = $1, updated_at = now() WHERE id = $2`,
    [status, tournamentId]
  );
  if (!rowCount)
      return res.status(404).json({ error: "Tournament not found" });
  res.json({ ok: true });
}),

  archiveTournament: asyncHandler(async (req, res) => {
    const tournamentId = Number(req.params.id);
    if (!tournamentId)
        return res.status(400).json({ error: "Invalid tournament id" });

    await query("BEGIN");
    try {
      const { rowCount } = await query(
        `UPDATE tournaments SET visibility = 'private' WHERE id = $1`,
        [tournamentId]
      );
      if (!rowCount) {
        await query("ROLLBACK");
        return res.status(404).json({ error: "Tournament not found" });
      }

      await query(`DELETE FROM tournament_schedule WHERE tournament_id = $1`, [tournamentId]);
      await logAdminAction(req, {
        action: "tournament.archive",
        target_type: "tournament",
        target_id: tournamentId,
        meta: {},
      });

      await query("COMMIT");
      res.json({ ok: true });
    } catch (e) {
      await query("ROLLBACK");
      throw e;
    }
  }),

  deleteTournament: asyncHandler(async (req, res) => {
    const tournamentId = Number(req.params.id);
    if (!tournamentId)
        return res.status(400).json({ error: "Invalid tournament id" });
    const confirm = String(req.query.confirm || req.body?.confirm || ""); // allow ?confirm=DELETE

    const { rows: infoRows } = await query(
      `
      SELECT
        t.id::int AS id,
        t.status,
        COALESCE((
          SELECT COUNT(*)::int
          FROM tournament_participants tp
          WHERE tp.tournament_id = t.id
        ), 0) AS "participantsCount"
      FROM tournaments t
      WHERE t.id = $1
      `,
      [tournamentId]
    );

    const info = infoRows[0];
    if (!info)
        return res.status(404).json({ error: "Tournament not found" });

    const participantsCount = Number(info.participantsCount || 0);
    const status = String(info.status || "");
    const allowedByRule = participantsCount === 0 || status === "not_started";
    const needsStrongConfirm = status === "finished" || status === "in_progress";

    if (needsStrongConfirm && confirm !== "DELETE") {
      return res.status(400).json({
        error:
          `Tournament is "${status}" with ${participantsCount} participants. ` +
          `Archive it, or delete with ?confirm=DELETE`,
      });
    }

    if (!allowedByRule && !needsStrongConfirm) {
      return res.status(400).json({
        error:
          `Delete blocked. Must have 0 participants OR status=not_started. ` +
          `This tournament is status="${status}" participants=${participantsCount}.`,
      });
    }

    await query("BEGIN");
    try {
      await query(`DELETE FROM tournament_participants WHERE tournament_id = $1`, [tournamentId]);
      await query(`DELETE FROM tournament_schedule WHERE tournament_id = $1`, [tournamentId]);
      await query(`DELETE FROM tournament_bracket_matches WHERE tournament_id = $1`, [tournamentId]);
      await query(`DELETE FROM tournament_matches WHERE tournament_id = $1`, [tournamentId]);
      await query(`DELETE FROM tournaments WHERE id = $1`, [tournamentId]);
      await logAdminAction(req, {
        action: "tournament.delete",
        target_type: "tournament",
        target_id: tournamentId,
        meta: { status, participantsCount },
      });
      await query("COMMIT");
      res.json({ ok: true });
    } catch (e) {
      await query("ROLLBACK");
      throw e;
    }
  }),

 
  listAudit: asyncHandler(async (req, res) => {
    const search = String(req.query.search || "").trim().toLowerCase();
    const action = String(req.query.action || "").trim().toLowerCase();
    const page = clampInt(req.query.page, 1, 1, 100000);
    const limit = clampInt(req.query.limit, 50, 1, 200);
    const offset = (page - 1) * limit;

    const where = [];
    const params = [];

    if (action) {
      params.push(action);
      where.push(`LOWER(al.action) = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      const i = params.length;
      where.push(
        `(
          LOWER(COALESCE(u.email,'')) LIKE $${i}
          OR LOWER(COALESCE(u.p_name,'')) LIKE $${i}
          OR LOWER(COALESCE(al.target_type,'')) LIKE $${i}
          OR CAST(al.target_id AS TEXT) LIKE $${i}
        )`
      );
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const { rows: countRows } = await query(
      `
      SELECT COUNT(*)::int AS total
      FROM admin_audit_log al
      LEFT JOIN users u ON u.id = al.admin_user_id
      ${whereSql}
      `,
      params
    );

    const total = countRows[0]?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    params.push(limit);
    const limitParam = params.length;
    params.push(offset);
    const offsetParam = params.length;

    const { rows } = await query(
      `
      SELECT
        al.id::int AS id,
        al.created_at,
        al.action,
        al.target_type,
        al.target_id::int AS target_id,
        al.meta,
        al.ip,
        al.user_agent,
        al.admin_user_id::int AS admin_user_id,
        u.email AS admin_email,
        u.p_name AS admin_name,
        u.image AS admin_image
      FROM admin_audit_log al
      LEFT JOIN users u ON u.id = al.admin_user_id
      ${whereSql}
      ORDER BY al.created_at DESC, al.id DESC
      LIMIT $${limitParam} OFFSET $${offsetParam}
      `,
      params
    );
    res.json({ logs: rows, page, limit, total, totalPages });
  }),
};