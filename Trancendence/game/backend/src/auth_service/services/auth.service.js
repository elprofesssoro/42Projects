import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../db.js";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  process.env.SECRET ||
  "change_me_to_a_long_random_secret";

const JWTR_SECRET =
  process.env.REFRESH_TOKEN ||
  "change_me_to_a_long_random_secret";

const normEmail = (v) => String(v || "").trim().toLowerCase();

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

const toPublicUser = (row) => ({
  id: Number(row.id),
  email: row.email,
  role: row.role,
  firstName: row.first_name ?? "",
  lastName: row.last_name ?? "",
  gender: row.gender ?? "",
  country: row.country ?? "Unknown",
  p_name:
    row.p_name ??
    `${row.first_name ?? ""} ${row.last_name ?? ""}`.trim() ??
    row.email,
  image: row.image ?? row.avatar_url ?? "/img/player_default.png",
  available: row.is_available === true,
  last_seen: row.last_seen ?? null,
});

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
  if (!u) throw new Error("User not found");

  const payload = {
    sub: u.id,
    role: u.role,
    email: u.email,
    ...(hasTokenVersion ? { tokenVersion } : {}),
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  const tokenR = jwt.sign(payload, JWTR_SECRET, { expiresIn: "2h" });
  return { token, tokenR };
}

export const authService = {
  verifyCredentials: async ({ email, password }) => {
    const e = normEmail(email);
    const p = String(password || "");
    if (!e || !p)
      throw new Error("Invalid credentials");

    const hasDeletedAt = await usersHasColumn("deleted_at");

    const { rows } = await query(
      `
      SELECT id, email, password_hash
      FROM users
      WHERE email = $1
      ${hasDeletedAt ? "AND deleted_at IS NULL" : ""}
      LIMIT 1
      `,
      [e]
    );

    const row = rows[0];
    if (!row || !row.password_hash)
      throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(p, row.password_hash);
    if (!ok)
      throw new Error("Invalid credentials");

    return { id: Number(row.id), email: row.email };
  },

  register: async ({ email, password, firstName, lastName, gender, country }) => {
    const e = normEmail(email);
    const p = String(password || "");
    if (!e || !p)
      throw new Error("Missing email/password");

    const safeFirst =
      (firstName && String(firstName).trim()) || String(e).split("@")[0];
    const safeLast = (lastName && String(lastName).trim()) || "";
    const safeGender = (gender && String(gender).trim()) || "other";
    const safeCountry = (country && String(country).trim()) || "Unknown";
    const pName = `${safeFirst}${safeLast ? " " + safeLast : ""}`.trim();

    const exists = await query(`SELECT 1 FROM users WHERE email = $1`, [e]);
    if (exists.rows.length)
      throw new Error("Email already exists");

    const passwordHash = await bcrypt.hash(p, 10);
    const hasPName = await usersHasColumn("p_name");
    const hasImage = await usersHasColumn("image");
    const hasIsAvail = await usersHasColumn("is_available");
    const hasLastSeen = await usersHasColumn("last_seen");
    const hasDeletedAt = await usersHasColumn("deleted_at");
    const hasTokenVersion = await usersHasColumn("token_version");

    const cols = ["email", "role", "first_name", "last_name", "gender", "country", "password_hash"];
    const vals = ["$1", "'user'", "$2", "$3", "$4", "$5", "$6"];
    const params = [e, safeFirst, safeLast, safeGender, safeCountry, passwordHash];

    if (hasPName) {
      cols.push("p_name");
      vals.push("$7");
      params.push(pName);
    }

    if (hasImage) {
      cols.push("image");
      vals.push(hasPName ? "$8" : "$7");
      params.push("/img/player_default.png");
    }

    if (hasIsAvail) {
      cols.push("is_available");
      vals.push("true");
    }

    if (hasLastSeen) {
      cols.push("last_seen");
      vals.push("now()");
    }

    if (hasDeletedAt) {
      cols.push("deleted_at");
      vals.push("NULL");
    }

    if (hasTokenVersion) {
      cols.push("token_version");
      vals.push("0");
    }

    const { rows } = await query(
      `
      INSERT INTO users (${cols.join(", ")})
      VALUES (${vals.join(", ")})
      RETURNING
        id, email, role, first_name, last_name, gender, country,
        ${hasPName ? "p_name," : ""}
        avatar_url, ${hasImage ? "image," : ""} ${hasIsAvail ? "is_available," : ""} ${hasLastSeen ? "last_seen," : ""}
        ${hasTokenVersion ? "token_version," : ""}
        1 AS _dummy
      `,
      params
    );

    const user = toPublicUser(rows[0]);
    const { token, tokenR } = await signTokenForUserId(user.id);
    console.log(tokenR);
    const hasRefreshToken = await usersHasColumn("refresh_token");

    if (hasRefreshToken) {
      await query(
        `UPDATE users SET refresh_token = $1 WHERE id = $2`,
        [tokenR, user.id]
      );
    }
    return { token, user, tokenR };
  },

  login: async ({ email, password }) => {
    const e = normEmail(email);
    const p = String(password || "");
    if (!e || !p) throw new Error("Missing email/password");

    const hasDeletedAt = await usersHasColumn("deleted_at");

    const { rows } = await query(
      `
      SELECT
        id, email, role, first_name, last_name, gender, country, p_name,
        avatar_url, image, is_available, last_seen,
        password_hash
      FROM users
      WHERE email = $1
      ${hasDeletedAt ? "AND deleted_at IS NULL" : ""}
      LIMIT 1
      `,
      [e]
    );

    const row = rows[0];
    if (!row || !row.password_hash)
      throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(p, row.password_hash);
    if (!ok)
      throw new Error("Invalid credentials");

    const { token, tokenR } = await signTokenForUserId(Number(row.id));
    console.log(tokenR);
    const hasIsAvail = await usersHasColumn("is_available");
    const hasLastSeen = await usersHasColumn("last_seen");
    const hasRefreshToken = await usersHasColumn("refresh_token");

    if (hasIsAvail || hasLastSeen) {
      const sets = [];
      const params = [row.id];
      if (hasIsAvail)
        sets.push(`is_available = true`);
      if (hasLastSeen)
        sets.push(`last_seen = now()`);
      if (hasRefreshToken) {
        params.push(tokenR);
        sets.push(`refresh_token = $${params.length}`);
      }
      if (sets.length) {
        await query(`UPDATE users SET ${sets.join(", ")} WHERE id = $1`, params);
      }
    }

    const user = toPublicUser(row);

    return { token, user, tokenR };
  },
};
