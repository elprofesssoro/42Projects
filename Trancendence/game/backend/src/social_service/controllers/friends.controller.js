import { asyncHandler } from "../utils/asyncHandler.js";
import { query } from "../db.js";
import { getIO } from "../socket/io.js";

const pairKey = (a, b) => {
  const x = Number(a);
  const y = Number(b);
  return { a: Math.min(x, y), b: Math.max(x, y) };
};

const insertFriendshipPair = async (u1, u2) => {

  const { a, b } = pairKey(u1, u2);
  await query(
    `
    INSERT INTO friendships (user_id, friend_id)
    SELECT $1, $2
    WHERE NOT EXISTS (
      SELECT 1
      FROM friendships
      WHERE LEAST(user_id, friend_id) = $1
        AND GREATEST(user_id, friend_id) = $2
    )
    `,
    [a, b]
  );
};

const emitFriendsUpdate = (userIds = []) => {
  try {
    const io = getIO();
    userIds
      .map((x) => Number(x))
      .filter(Boolean)
      .forEach((uid) => {
        io.to(`user:${uid}`).emit("friends:update");
      });
  } catch {
    // Socket server not initialized — ignore
  }
};

export const friendsController = {
 
  me: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const { rows } = await query(
      `
      SELECT
        CASE
          WHEN user_id = $1 THEN friend_id
          ELSE user_id
        END::int AS "friendId"
      FROM friendships
      WHERE user_id = $1 OR friend_id = $1
      ORDER BY 1 ASC
      `,
      [me]
    );
    res.json({ friendIds: rows.map((r) => r.friendId) });
  }),

  remove: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me)
      return res.status(401).json({ error: "Unauthorized" });
    const friendId = Number(req.params?.friendId);
    if (!friendId)
      return res.status(400).json({ error: "Invalid friendId" });
    const { a, b } = pairKey(me, friendId);
    await query(
      `
      DELETE FROM friendships
      WHERE LEAST(user_id, friend_id) = $1
        AND GREATEST(user_id, friend_id) = $2
      `,
      [a, b]
    );
    emitFriendsUpdate([me, friendId]);
    res.json({ ok: true, friendId });
  }),

  requests: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const { rows: incoming } = await query(
      `
      SELECT
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      FROM friend_requests
      WHERE to_user_id = $1 AND status = 'pending'
      ORDER BY id DESC
      `,
      [me]
    );

    const { rows: outgoing } = await query(
      `
      SELECT
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      FROM friend_requests
      WHERE from_user_id = $1 AND status = 'pending'
      ORDER BY id DESC
      `,
      [me]
    );

    res.json({ incoming, outgoing });
  }),

 
  createRequest: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const toUserId = Number(req.body?.toUserId);
    if (!toUserId || toUserId === me) {
      return res.status(400).json({ error: "Invalid toUserId" });
    }

    {
      const { a, b } = pairKey(me, toUserId);
      const { rows: alreadyFriends } = await query(
        `
        SELECT 1
        FROM friendships
        WHERE LEAST(user_id, friend_id) = $1
          AND GREATEST(user_id, friend_id) = $2
        LIMIT 1
        `,
        [a, b]
      );
      if (alreadyFriends[0]) {
        return res.status(200).json({ 
          ok: true, alreadyFriends: true 
        });
      }
    }

    const { rows: existingIncoming } = await query(
      `
      SELECT id::int AS id
      FROM friend_requests
      WHERE from_user_id = $1
        AND to_user_id = $2
        AND status = 'pending'
      LIMIT 1
      `,
      [toUserId, me]
    );

    if (existingIncoming[0]) {
      const requestId = Number(existingIncoming[0].id);
      await insertFriendshipPair(me, toUserId);
      await query(
        `
        UPDATE friend_requests
        SET status = 'accepted'
        WHERE id = $1
        `,
        [requestId]
      );

      emitFriendsUpdate([me, toUserId]);
      return res.status(200).json({ ok: true, autoAccepted: true });
    }

    const { rows } = await query(
      `
      INSERT INTO friend_requests (from_user_id, to_user_id, status)
      VALUES ($1, $2, 'pending')
      ON CONFLICT (from_user_id, to_user_id)
      DO UPDATE SET status = 'pending'
      RETURNING
        id::int AS id,
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId",
        status,
        created_at
      `,
      [me, toUserId]
    );

    emitFriendsUpdate([me, toUserId]);
    res.status(200).json({ request: rows[0] });
  }),

 
  acceptRequest: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const requestId = Number(req.params?.id);
    if (!requestId)
        return res.status(400).json({ 
      error: "Invalid requestId" 
    });

    const { rows } = await query(
      `
      UPDATE friend_requests
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
      [requestId, me]
    );

    const reqRow = rows[0];
    if (!reqRow) {
      return res
        .status(404)
        .json({ error: "Request not found / not yours / not pending" });
    }

    await insertFriendshipPair(reqRow.fromUserId, reqRow.toUserId);

    emitFriendsUpdate([reqRow.fromUserId, reqRow.toUserId]);
    res.json({ ok: true, request: reqRow });
  }),


  rejectRequest: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const requestId = Number(req.params?.id);
    if (!requestId)
        return res.status(400).json({ error: "Invalid requestId" });
    const { rows } = await query(
      `
      DELETE FROM friend_requests
      WHERE id = $1
        AND to_user_id = $2
        AND status = 'pending'
      RETURNING
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId"
      `,
      [requestId, me]
    );

    const deleted = rows[0];
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Request not found / not yours / not pending" });
    }

    emitFriendsUpdate([deleted.fromUserId, deleted.toUserId]);
    res.json({ ok: true });
  }),


  cancelRequest: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const requestId = Number(req.params?.id);
    if (!requestId)
        return res.status(400).json({ error: "Invalid requestId" });
    const { rows } = await query(
      `
      DELETE FROM friend_requests
      WHERE id = $1
        AND from_user_id = $2
        AND status = 'pending'
      RETURNING
        from_user_id::int AS "fromUserId",
        to_user_id::int AS "toUserId"
      `,
      [requestId, me]
    );

    const deleted = rows[0];
    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Request not found / not yours / not pending" });
    }

    emitFriendsUpdate([deleted.fromUserId, deleted.toUserId]);
    res.json({ ok: true });
  }),
};