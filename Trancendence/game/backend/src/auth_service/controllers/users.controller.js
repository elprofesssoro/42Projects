import { asyncHandler } from "../utils/asyncHandler.js";
import { query } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const ONLINE_WINDOW_SECONDS = 90;

const MAX_PNAME_LEN = 34;
const MIN_PNAME_LEN = 2;
const MAX_EMAIL_LEN = 40;
const MAX_IMAGE_LEN = 2048;
const MAX_PASSWORD_LEN = 200;

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.SECRET ||
  "change_me_to_a_long_random_secret";

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

function isValidEmail(email) {
  if (!email)
      return false;
  if (email.length > MAX_EMAIL_LEN)
      return false;
  const e = String(email).trim().toLowerCase();
  if (!e.includes("@"))
      return false;
  if (e.startsWith("@") || e.endsWith("@"))
      return false;
  if (e.includes(".."))
      return false;
  const at = e.indexOf("@");
  const local = e.slice(0, at);
  const domain = e.slice(at + 1);
  if (!local || !domain)
      return false;
  if (!domain.includes("."))
      return false;
  if (/\s/.test(e))
      return false;
  return true;
}

function normalizePName(v) {
  if (typeof v !== "string")
      return null;
  const s = v.trim().replace(/\s+/g, " ");
  if (!s)
      return "";
  return s;
}

function validatePName(p) {
  if (p === null)
      return null;
  if (typeof p !== "string")
      return "Invalid p_name";
  const s = p.trim().replace(/\s+/g, " ");
  if (!s) return "p_name cannot be empty";
  if (s.length < MIN_PNAME_LEN)
      return `p_name must be at least ${MIN_PNAME_LEN} characters`;
  if (s.length > MAX_PNAME_LEN)
      return `p_name must be at most ${MAX_PNAME_LEN} characters`;
  return null;
}

async function signTokenForUserId(userId) {
  const hasTokenVersion = await usersHasColumn("token_version");
  let tokenVersion = 0;
  if (hasTokenVersion) {
    const { rows } = await query(
      `SELECT COALESCE(token_version, 0)::int AS token_version FROM users WHERE id = $1 LIMIT 1`,
      [userId]
    );
    tokenVersion = rows[0]?.token_version ?? 0;
  }

  const { rows } = await query(
    `SELECT id::int AS id, email, role FROM users WHERE id = $1 LIMIT 1`,
    [userId]
  );
  const u = rows[0];
  if (!u)
      throw new Error("User not found");

  const payload = {
    sub: u.id,
    role: u.role,
    email: u.email,
    ...(hasTokenVersion ? { tokenVersion } : {}),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

async function loadPublicUser(userId) {
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

      (
        COALESCE(u.is_available, false) = true
        AND u.last_seen > (now() - ($2 * interval '1 second'))
      ) AS available

    FROM users u
    WHERE u.id = $1
      AND u.deleted_at IS NULL
    LIMIT 1
    `,
    [userId, ONLINE_WINDOW_SECONDS]
  );
  return rows[0] || null;
}

export const usersController = {
  list: asyncHandler(async (req, res) => {
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

        (
          COALESCE(u.is_available, false) = true
          AND u.last_seen > (now() - ($1 * interval '1 second'))
        ) AS available

      FROM users u
      WHERE u.deleted_at IS NULL
      ORDER BY u.id ASC
      `,
      [ONLINE_WINDOW_SECONDS]
    );

    res.json({ users: rows });
  }),

  me: asyncHandler(async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) 
        return res.status(401).json({ error: "Unauthorized" });

    const user = await loadPublicUser(userId);
    if (!user)
        return res.status(404).json({ error: "User not found" });
    res.json({ user });
  }),

  byId: asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!id)
        return res.status(400).json({ error: "Invalid user id" });
    const user = await loadPublicUser(id);
    if (!user)
        return res.status(404).json({ error: "User not found" });
    res.json({ user });
  }),

  uploadAvatar: asyncHandler(async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId)
        return res.status(401).json({ error: "Unauthorized" });

    if (!req.file)
        return res.status(400).json({ error: "Missing file" });
    const imageUrl = `/uploads/${req.file.filename}`;
    const hasImage = await usersHasColumn("image");
    if (!hasImage) {
      return res.status(500).json({ error: "Users table has no image column" });
    }
    await query(
      `UPDATE users SET image = $1 WHERE id = $2 AND deleted_at IS NULL`,
      [imageUrl, userId]
    );
    const user = await loadPublicUser(userId);
    res.json({ ok: true, user });
  }),

  updateMe: asyncHandler(async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { p_name, email, image, currentPassword, newPassword } = req.body || {};

    const nextPNameRaw = typeof p_name === "string" ? normalizePName(p_name) : null;
    const nextEmailRaw = typeof email === "string" ? email.trim().toLowerCase() : null;
    const nextImage = typeof image === "string" ? image.trim() : null;

    const wantsPNameChange = nextPNameRaw !== null;
    const wantsEmailChange = typeof nextEmailRaw === "string" && nextEmailRaw.length > 0;
    const wantsPasswordChange = typeof newPassword === "string" && newPassword.length > 0;
    const wantsImageChange = nextImage !== null;

    if (wantsPNameChange) {
      const err = validatePName(nextPNameRaw);
      if (err)
          return res.status(400).json({ error: err });
    }

    if (wantsEmailChange) {
      if (!isValidEmail(nextEmailRaw)) {
        return res.status(400).json({ error: "Invalid email" });
      }
    }

    if (wantsImageChange) {
      if (nextImage && nextImage.length > MAX_IMAGE_LEN) {
        return res.status(400).json({ error: "Image url too long" });
      }
    }

    if (wantsPasswordChange) {
      if (String(newPassword).length > MAX_PASSWORD_LEN) {
        return res.status(400).json({ error: "Password too long" });
      }
      if (String(newPassword).length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
    }

    if ((wantsEmailChange || wantsPasswordChange) && !currentPassword) {
      return res.status(400).json({ error: "Current password is required" });
    }

    if (wantsEmailChange || wantsPasswordChange) {
      const { rows } = await query(
        `SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
        [userId]
      );
      const hash = rows[0]?.password_hash;
      if (!hash)
          return res.status(404).json({ error: "User not found" });

      const ok = await bcrypt.compare(String(currentPassword), hash);
      if (!ok)
          return res.status(400).json({ error: "Current password is incorrect" });
    }

    if (wantsEmailChange) {
      const { rows } = await query(
        `SELECT 1 FROM users WHERE email = $1 AND id <> $2 AND deleted_at IS NULL LIMIT 1`,
        [nextEmailRaw, userId]
      );
      if (rows.length)
          return res.status(400).json({ error: "Email already exists" });
    }

    const sets = [];
    const params = [];

    const hasPName = await usersHasColumn("p_name");
    if (wantsPNameChange && hasPName) {
      params.push(nextPNameRaw);
      sets.push(`p_name = $${params.length}`);
    }

    const hasImage = await usersHasColumn("image");
    if (wantsImageChange && hasImage) {
      params.push(nextImage);
      sets.push(`image = $${params.length}`);
    }

    if (wantsEmailChange) {
      params.push(nextEmailRaw);
      sets.push(`email = $${params.length}`);
    }

    if (wantsPasswordChange) {
      const passwordHash = await bcrypt.hash(String(newPassword), 10);
      params.push(passwordHash);
      sets.push(`password_hash = $${params.length}`);
    }

    const hasTokenVersion = await usersHasColumn("token_version");
    const sensitiveChanged = wantsEmailChange || wantsPasswordChange;
    if (sensitiveChanged && hasTokenVersion) {
      sets.push(`token_version = COALESCE(token_version, 0) + 1`);
    }

    if (!sets.length) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    params.push(userId);
    await query(
      `
      UPDATE users
      SET ${sets.join(", ")}
      WHERE id = $${params.length}
        AND deleted_at IS NULL
      `,
      params
    );

    const user = await loadPublicUser(userId);
    if (!user)
        return res.status(404).json({ error: "User not found" });

    if (sensitiveChanged) {
      const token = await signTokenForUserId(userId);
      return res.json({ ok: true, user, token });
    }
    return res.json({ ok: true, user });
  }),

  deleteMe: asyncHandler(async (req, res) => {
    const userId = Number(req.user?.id);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    const { currentPassword } = req.body || {};
    if (!currentPassword) {
      return res.status(400).json({ error: "Current password is required" });
    }
    const { rows } = await query(
      `SELECT role, password_hash FROM users WHERE id = $1 AND deleted_at IS NULL LIMIT 1`,
      [userId]
    );
    const row = rows[0];
    if (!row?.password_hash) return res.status(404).json({ error: "User not found" });
    const ok = await bcrypt.compare(String(currentPassword), row.password_hash);
    if (!ok)
        return res.status(400).json({ error: "Current password is incorrect" });
    const role = String(row.role || "").toLowerCase();
    if (role === "admin") {
      const { rows: adminCountRows } = await query(
        `SELECT COUNT(*)::int AS c FROM users WHERE role = 'admin' AND deleted_at IS NULL`
      );
      const c = adminCountRows[0]?.c ?? 0;
      if (c <= 1) {
        return res.status(400).json({ error: "Cannot delete the last admin." });
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
    if (!sets.length)
        sets.push(`last_seen = now()`);

    await query(`UPDATE users SET ${sets.join(", ")} WHERE id = $1`, [userId]);

    await query(
      `
      UPDATE game_invites
      SET status = 'rejected'
      WHERE status IN ('pending','accepted')
        AND (from_user_id = $1 OR to_user_id = $1)
      `,
      [userId]
    );

    try {
      const { getIO } = await import("../socket/io.js");
      getIO().in(`user:${userId}`).disconnectSockets(true);
    } catch {}

    res.json({ ok: true, deleted: "soft" });
  }),

  getUserStats: async (req, res, next) => {
    try {
      const userId = Number(req.params.id);
      if (!userId)
          return res.status(400).json({ error: "Invalid user id" });
      const { rows } = await query(
        `
        WITH m AS (
          SELECT *
          FROM matches
          WHERE status = 'finished'
            AND (player1_id = $1 OR player2_id = $1)
        ),
        mg AS (
          SELECT
            mg.*,
            m.player1_id,
            m.player2_id
          FROM match_games mg
          JOIN m ON m.id = mg.match_id
        )
        SELECT
          COALESCE((SELECT COUNT(*) FROM m), 0)::int AS t_matches,
          COALESCE((SELECT COUNT(*) FROM m WHERE winner_id = $1), 0)::int AS w_matches,
          COALESCE((SELECT COUNT(*) FROM m WHERE winner_id IS NOT NULL AND winner_id <> $1), 0)::int AS l_matches,
          COALESCE((SELECT SUM(player1_games_won + player2_games_won) FROM m), 0)::int AS t_games,
          COALESCE((
            SELECT SUM(
              CASE
                WHEN player1_id = $1 THEN player1_games_won
                ELSE player2_games_won
              END
            ) FROM m
          ), 0)::int AS w_games,
          COALESCE((
            SELECT SUM(
              CASE
                WHEN player1_id = $1 THEN player2_games_won
                ELSE player1_games_won
              END
            ) FROM m
          ), 0)::int AS l_games,
          (COALESCE((SELECT COUNT(*) FROM m WHERE winner_id = $1), 0) * 40)::int AS m_points,
          (COALESCE((
            SELECT SUM(
              CASE
                WHEN player1_id = $1 THEN player1_games_won
                ELSE player2_games_won
              END
            ) FROM m
          ), 0) * 10)::int AS g_points
        `,
        [userId]
      );

      const s = rows[0] || {
        t_matches: 0,
        w_matches: 0,
        l_matches: 0,
        t_games: 0,
        w_games: 0,
        l_games: 0,
        m_points: 0,
        g_points: 0,
      };
      s.t_points = Number(s.m_points) + Number(s.g_points);
      return res.json({ stats: s });
    } catch (e) {
      return next(e);
    }
  },
};
