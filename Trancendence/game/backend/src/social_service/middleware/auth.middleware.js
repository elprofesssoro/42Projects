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
  if (!token)
      return res.status(401).json({ error: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const userId = Number(payload.sub ?? payload.id);
    if (!userId)
        return res.status(401).json({ error: "Invalid or expired token" });

    // const hasDeletedAt = await usersHasColumn("deleted_at");
    const hasTokenVersion = await usersHasColumn("token_version");
   const { rows } = await query(
  `
  SELECT
    id::int AS id,
    email,
    role,
    first_name AS "firstName",
    last_name  AS "lastName",
    gender,
    country,
    p_name,
    image,
    COALESCE(is_available, true) AS available,
    COALESCE(token_version, 0)::int AS token_version
  FROM users
  WHERE id = $1
    AND deleted_at IS NULL
  `,
  [userId]
);

    const user = rows[0];
    if (!user)
        return res.status(401).json({ error: "Invalid or expired token" });

    if (payload.tokenVersion !== undefined) {
      if (Number(payload.tokenVersion) !== Number(user.token_version)) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    }


    if (hasTokenVersion && payload.tokenVersion !== undefined) {
      const tokenV = Number(payload.tokenVersion);
      if (!Number.isFinite(tokenV) || tokenV !== Number(user.token_version)) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};