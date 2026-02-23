import jwt from "jsonwebtoken";
import { query } from "../db.js";

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

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = Number(payload.sub ?? payload.id);
    
    if (!userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const { rows } = await query(
      `SELECT
        id::int AS id,
        email,
        role,
        first_name AS "firstName",
        last_name  AS "lastName",
        gender,
        country,
        p_name,
        image,
        COALESCE(is_available, true) AS available
      FROM users
      WHERE id = $1 AND deleted_at IS NULL
      LIMIT 1`,
      [userId]
    );

    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: "User not found or deleted" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};