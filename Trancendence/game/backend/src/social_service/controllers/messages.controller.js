import { query } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getIO } from "../socket/io.js";

const emitToUsers = (eventName, userIds = [], payload = undefined) => {
  try {
    const io = getIO();
    userIds
      .map((x) => Number(x))
      .filter(Boolean)
      .forEach((uid) => io.to(`user:${uid}`).emit(eventName, payload));
  } catch {}
};

const clampInt = (v, def, min, max) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, Math.trunc(n)));
};

export const messagesController = {
  listSystem: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const { rows } = await query(
      `
      SELECT
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        type,
        payload,
        created_at,
        read_at
      FROM system_messages
      WHERE to_user_id = $1
        AND read_at IS NULL
      ORDER BY id DESC
      LIMIT 30
      `,
      [me]
    );

    res.json({ messages: rows });
  }),

  markSystemRead: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const msgId = Number(req.params?.id);
    if (!msgId) return res.status(400).json({ error: "Invalid message id" });

    const { rows } = await query(
      `
      UPDATE system_messages
      SET read_at = now()
      WHERE id = $1
        AND to_user_id = $2
        AND read_at IS NULL
      RETURNING
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        type,
        payload,
        created_at,
        read_at
      `,
      [msgId, me]
    );

    if (!rows[0]) return res.status(404).json({ error: "Message not found / not yours / already read" });

    emitToUsers("system:update", [me], { kind: "system:update" });
    res.json({ message: rows[0] });
  }),

  unreadCounts: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const { rows } = await query(
      `
      SELECT sender_id::int AS "fromUserId", COUNT(*)::int AS "count"
      FROM messages
      WHERE receiver_id = $1
        AND read_at IS NULL
        AND deleted_at IS NULL
      GROUP BY sender_id
      `,
      [me]
    );

    const counts = {};
    for (const r of rows) counts[r.fromUserId] = r.count;
    res.json({ counts });
  }),

  listThread: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const otherId = Number(req.params?.userId);
    if (!otherId) return res.status(400).json({ error: "Invalid userId" });
    if (otherId === me) return res.json({ messages: [] });

    const limit = clampInt(req.query?.limit, 200, 1, 200);

    const beforeIdRaw = req.query?.beforeId;
    const beforeId =
      beforeIdRaw === undefined || beforeIdRaw === null || beforeIdRaw === ""
        ? null
        : Number(beforeIdRaw);

    const beforeClause = Number.isFinite(beforeId) ? "AND id < $3" : "";
    const params = Number.isFinite(beforeId) ? [me, otherId, beforeId] : [me, otherId];

    const { rows } = await query(
      `
      SELECT *
      FROM (
        SELECT
          id::int AS id,
          sender_id::int AS "fromUserId",
          receiver_id::int AS "toUserId",
          body,
          created_at,
          read_at,
          deleted_at
        FROM messages
        WHERE (
          (sender_id = $1 AND receiver_id = $2)
          OR
          (sender_id = $2 AND receiver_id = $1)
        )
        AND deleted_at IS NULL
        ${beforeClause}
        ORDER BY id DESC
        LIMIT ${limit}
      ) t
      ORDER BY id ASC
      `,
      params
    );

    res.json({ messages: rows });
  }),

  sendToThread: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const otherId = Number(req.params?.userId);
    if (!otherId) return res.status(400).json({ error: "Invalid userId" });
    if (otherId === me) return res.status(400).json({ error: "Cannot message yourself" });

    const body = String(req.body?.body ?? "").trim();
    if (!body) return res.status(400).json({ error: "Empty message" });
    if (body.length > 2000) return res.status(400).json({ error: "Message too long" });

    const { rows } = await query(
      `
      INSERT INTO messages (sender_id, receiver_id, body, created_at)
      VALUES ($1, $2, $3, now())
      RETURNING
        id::int AS id,
        sender_id::int AS "fromUserId",
        receiver_id::int AS "toUserId",
        body,
        created_at
      `,
      [me, otherId, body]
    );

    const msg = rows[0];

    emitToUsers("chat:message", [me, otherId], { message: msg });
    emitToUsers("chat:update", [me, otherId], { threadWith: otherId });

    res.status(201).json({ message: msg });
  }),

  markThreadRead: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const otherId = Number(req.params?.userId);
    if (!otherId) return res.status(400).json({ error: "Invalid userId" });
    if (otherId === me) return res.json({ ok: true, updated: 0 });

    const result = await query(
      `
      UPDATE messages
      SET read_at = now()
      WHERE receiver_id = $1
        AND sender_id = $2
        AND read_at IS NULL
        AND deleted_at IS NULL
      `,
      [me, otherId]
    );

    const updated = result.rowCount || 0;

    if (updated > 0) {
      emitToUsers("chat:update", [me, otherId], { threadWith: otherId });
      emitToUsers("chat:read", [me, otherId], { readBy: me, threadWith: otherId });
    }

    res.json({ ok: true, updated });
  }),

  deleteMessage: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me) return res.status(401).json({ error: "Unauthorized" });

    const id = Number(req.params?.id);
    if (!id) return res.status(400).json({ error: "Invalid message id" });

    const { rows } = await query(
      `
      UPDATE messages
      SET deleted_at = now()
      WHERE id = $1
        AND sender_id = $2
        AND deleted_at IS NULL
      RETURNING
        id::int AS id,
        sender_id::int AS "fromUserId",
        receiver_id::int AS "toUserId"
      `,
      [id, me]
    );

    const msg = rows[0];
    if (!msg) return res.status(404).json({ error: "Message not found / not yours" });

    emitToUsers("chat:update", [msg.fromUserId, msg.toUserId], { threadWith: msg.toUserId });
    emitToUsers("chat:delete", [msg.fromUserId, msg.toUserId], { id });

    res.json({ ok: true });
  }),
};
