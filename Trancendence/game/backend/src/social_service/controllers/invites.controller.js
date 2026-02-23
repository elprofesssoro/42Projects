import { query } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIO } from "../socket/io.js";

const emitInviteUpdate = (fromUserId, toUserId, payload) => {
  const io = getIO();
  io.to(`user:${Number(fromUserId)}`).emit("invite:update", payload);
  io.to(`user:${Number(toUserId)}`).emit("invite:update", payload);
};

const emitSystemMessage = (fromUserId, toUserId, msg) => {
  const io = getIO();
  io.to(`user:${Number(toUserId)}`).emit("system:message", msg);
  io.to(`user:${Number(fromUserId)}`).emit("system:message", msg);
};

export const invitesController = {
  list: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const { rows } = await query(
      `
      SELECT
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      FROM game_invites
      WHERE from_user_id = $1 OR to_user_id = $1
      ORDER BY id DESC
      `,
      [me]
    );

    res.json({ invites: rows });
  }),

  incomingPending: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const { rows } = await query(
      `
      SELECT
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      FROM game_invites
      WHERE to_user_id = $1
        AND status = 'pending'
      ORDER BY id DESC
      `,
      [me]
    );

    res.json({ invites: rows });
  }),

  latestBetween: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const otherId = Number(req.params?.otherId);
    if (!otherId) return res.status(400).json({ error: "Invalid otherId" });

    const { rows } = await query(
      `
      SELECT
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      FROM game_invites
      WHERE
        (from_user_id = $1 AND to_user_id = $2)
        OR
        (from_user_id = $2 AND to_user_id = $1)
      ORDER BY id DESC
      LIMIT 1
      `,
      [me, otherId]
    );

    res.json({ invite: rows[0] || null });
  }),

  create: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const toUserId = Number(req.body?.toUserId);
    if (!toUserId) return res.status(400).json({ error: "Missing toUserId" });
    if (toUserId === me) return res.status(400).json({ error: "Cannot invite yourself" });

    const { rows: existingAccepted } = await query(
      `
      SELECT
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      FROM game_invites
      WHERE status = 'accepted'
        AND (
          (from_user_id = $1 AND to_user_id = $2)
          OR
          (from_user_id = $2 AND to_user_id = $1)
        )
      ORDER BY id DESC
      LIMIT 1
      `,
      [me, toUserId]
    );

    if (existingAccepted[0]) {
      const inv = existingAccepted[0];
      emitInviteUpdate(inv.fromUserId, inv.toUserId, {
        type: "invite:existing",
        inviteId: inv.id,
        status: inv.status,
      });
      return res.status(200).json({ invite: inv });
    }

    const { rows: existingPending } = await query(
      `
      SELECT
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      FROM game_invites
      WHERE from_user_id = $1 AND to_user_id = $2 AND status = 'pending'
      ORDER BY id DESC
      LIMIT 1
      `,
      [me, toUserId]
    );

    if (existingPending[0]) {
      const inv = existingPending[0];
      emitInviteUpdate(inv.fromUserId, inv.toUserId, {
        type: "invite:existing",
        inviteId: inv.id,
        status: inv.status,
      });
      return res.status(200).json({ invite: inv });
    }

    const { rows } = await query(
      `
      INSERT INTO game_invites (from_user_id, to_user_id, status, created_at)
      VALUES ($1, $2, 'pending', now())
      RETURNING
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      `,
      [me, toUserId]
    );

    const invite = rows[0];

    emitInviteUpdate(invite.fromUserId, invite.toUserId, {
      type: "invite:new",
      inviteId: invite.id,
      status: invite.status,
    });

    res.status(201).json({ invite });
  }),

  accept: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const inviteId = Number(req.params?.id);
    if (!inviteId) return res.status(400).json({ error: "Invalid invite id" });

    const { rows } = await query(
      `
      UPDATE game_invites
      SET status = 'accepted'
      WHERE id = $1
        AND to_user_id = $2
        AND status = 'pending'
      RETURNING
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      `,
      [inviteId, me]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Invite not found / not yours / not pending" });
    }

    const invite = rows[0];

    emitInviteUpdate(invite.fromUserId, invite.toUserId, {
      type: "invite:accepted",
      inviteId: invite.id,
      status: invite.status,
    });

    res.json({ invite });
  }),

  reject: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const inviteId = Number(req.params?.id);
    if (!inviteId) return res.status(400).json({ error: "Invalid invite id" });

    const { rows } = await query(
      `
      UPDATE game_invites
      SET status = 'rejected'
      WHERE id = $1
        AND to_user_id = $2
        AND status = 'pending'
      RETURNING
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      `,
      [inviteId, me]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Invite not found / not yours / not pending" });
    }

    const invite = rows[0];

    emitInviteUpdate(invite.fromUserId, invite.toUserId, {
      type: "invite:rejected",
      inviteId: invite.id,
      status: invite.status,
    });

    res.json({ invite });
  }),

  cancel: asyncHandler(async (req, res) => {
  const me = Number(req.user?.id);
  if (!me) return res.status(401).json({ error: "Unauthorized" });

  const inviteId = Number(req.params?.id);
  if (!inviteId)
    return res.status(400).json({ error: "Invalid invite id" });

  const { rows } = await query(
    `
    UPDATE game_invites
    SET status = 'rejected'
    WHERE id = $1
      AND from_user_id = $2
      AND status IN ('pending', 'accepted')
    RETURNING
      id::int AS id,
      from_user_id::int AS "fromUserId",
      to_user_id::int AS "toUserId",
      status,
      created_at
    `,
    [inviteId, me]
  );

  const invite = rows[0];
  if (!invite) {
    return res.status(404).json({
      error: "Invite not found / not yours / not pending-or-accepted",
    });
  }

  const { rows: urows } = await query(
    `SELECT p_name FROM users WHERE id = $1`,
    [invite.fromUserId]
  );
  const hostName = urows[0]?.p_name || "Host";

  const systemMsg = {
    type: "invite_cancelled",
    payload: {
      inviteId: invite.id,
      hostName,
      message: `${hostName} cancelled the game invitation.`,
    },
  };

  const io = getIO();

  /* ✅ REAL-TIME delivery */
  io.to(`user:${invite.toUserId}`).emit("system:message", systemMsg);
  io.to(`user:${invite.fromUserId}`).emit("system:message", systemMsg);

  /* keep invite update */
  emitInviteUpdate(invite.fromUserId, invite.toUserId, {
    type: "invite:cancelled",
    inviteId: invite.id,
    status: invite.status,
  });

  res.json({ invite });
}),


  complete: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const inviteId = Number(req.params?.id);
    if (!inviteId) return res.status(400).json({ error: "Invalid invite id" });

    const { rows } = await query(
      `
      UPDATE game_invites
      SET status = 'completed'
      WHERE id = $1
        AND status = 'accepted'
        AND ($2 = from_user_id OR $2 = to_user_id)
      RETURNING
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      `,
      [inviteId, me]
    );

    if (!rows[0]) {
      return res.status(404).json({ error: "Invite not found / not accepted / not participant" });
    }

    const invite = rows[0];

    emitInviteUpdate(invite.fromUserId, invite.toUserId, {
      type: "invite:completed",
      inviteId: invite.id,
      status: invite.status,
    });

    res.json({ invite });
  }),
};
