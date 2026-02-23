import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { query } from "../db.js";
import { getIO } from "../socket/io.js";

const router = express.Router();

router.post("/ping", async (req, res) => {
  const id = Number(req.user.id);

  await query(
    `UPDATE users SET is_available = true, last_seen = now() WHERE id = $1`,
    [id]
  );

  try {
    getIO().emit("presence:update", { userId: id });
  } catch {}

  res.json({ ok: true });
});

router.post("/offline", requireAuth, async (req, res) => {
  const id = Number(req.user.id);

  await query(`UPDATE users SET is_available = false WHERE id = $1`, [id]);

  try {
    getIO().emit("presence:update", { userId: id });
  } catch {}

  res.json({ ok: true });
});

export default router;
