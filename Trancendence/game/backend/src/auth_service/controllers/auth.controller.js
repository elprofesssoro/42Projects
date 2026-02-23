// auth.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { authService } from "../services/auth.service.js";
import { query } from "../db.js";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || process.env.SECRET || "change_me_to_a_long_random_secret";
const JWTR_SECRET =
  process.env.REFRESH_TOKEN || "change_me_to_a_long_random_secret";

const normEmail = (v) => String(v || "").trim().toLowerCase();
const cookieSecure = process.env.NODE_ENV !== "test";

export const authController = {
  register: asyncHandler(async (req, res) => {
    const { email, password, firstName, lastName, gender, country } = req.body || {};

    const e = normEmail(email);
    const p = String(password || "");

    if (!e || !p) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    let data;
    try {
      data = await authService.register({
        email: e,
        password: p,
        firstName,
        lastName,
        gender,
        country,
      });
    } catch (err) {
      const msg = String(err?.message || "").toLowerCase();

      if (err?.code === "23505" || msg.includes("already") || msg.includes("exists")) {
        return res.status(409).json({ error: "Email already in use" });
      }
      if (
        err?.status === 400 ||
        msg.includes("invalid") ||
        msg.includes("email") ||
        msg.includes("password")
      ) {
        return res.status(400).json({ error: "Invalid registration data" });
      }
      throw err;
    }

    res.cookie("jwt", data.tokenR, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const { tokenR, ...responseData } = data;
    return res.status(201).json(responseData);
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body || {};
    const e = normEmail(email);
    const p = String(password || "");

    if (!e || !p) {
      return res.status(400).json({ error: "Missing email/password" });
    }

    let data;
    try {
      data = await authService.login({ email: e, password: p });
    } catch (err) {
      const msg = String(err?.message || "").toLowerCase();
      const isInvalid =
        err?.status === 401 ||
        err?.code === "INVALID_CREDENTIALS" ||
        msg.includes("invalid") ||
        msg.includes("credentials") ||
        msg.includes("password") ||
        msg.includes("not found");

      if (isInvalid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      throw err;
    }

    res.cookie("jwt", data.tokenR, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    const { tokenR, ...responseData } = data;
    return res.json(responseData);
  }),

  me: asyncHandler(async (req, res) => {
    const id = Number(req.user?.id);
    if (!id) return res.status(401).json({ error: "Unauthorized" });

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
        COALESCE(is_available, false) AS available
      FROM users
      WHERE id = $1
      `,
      [id]
    );

    if (!rows[0]) return res.status(404).json({ error: "User not found" });
    res.json({ user: rows[0] });
  }),

  verifyOpponent: asyncHandler(async (req, res) => {
    const hostId = Number(req.user?.id);
    if (!hostId) return res.status(401).json({ error: "Unauthorized" });

    const { opponentId, email, password, inviteId } = req.body || {};
    const oppId = Number(opponentId);
    const invId = Number(inviteId);
    const e = normEmail(email);
    const p = String(password || "");

    if (!oppId || !invId || !e || !p) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { rows: invRows } = await query(
      `
      SELECT id, from_user_id, to_user_id, status
      FROM game_invites
      WHERE id = $1
      `,
      [invId]
    );

    const inv = invRows[0];
    if (!inv) return res.status(404).json({ error: "Invite not found" });

    const a = Number(inv.from_user_id);
    const b = Number(inv.to_user_id);
    const isBetweenPair = (a === hostId && b === oppId) || (a === oppId && b === hostId);

    if (!isBetweenPair || inv.status !== "accepted") {
      return res.status(403).json({ error: "Invite is not accepted for this pair" });
    }

    let verified;
    try {
      verified = await authService.verifyCredentials({ email: e, password: p });
    } catch (err) {
      const msg = String(err?.message || "").toLowerCase();
      const isInvalid =
        err?.status === 401 ||
        err?.code === "INVALID_CREDENTIALS" ||
        msg.includes("invalid") ||
        msg.includes("credentials") ||
        msg.includes("password") ||
        msg.includes("not found");

      if (isInvalid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      throw err;
    }

    if (Number(verified.id) !== oppId) {
      return res.status(403).json({ error: "Credentials do not match opponent" });
    }

    return res.json({
      ok: true,
      opponent: { id: Number(verified.id), email: verified.email },
    });
  }),

  refresh: asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: "strict",
        path: "/",
      });
      return res.status(401).json({ error: "No refresh token" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWTR_SECRET);
    } catch {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: "strict",
        path: "/",
      });
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    const userId = decoded.sub;

    const { rows } = await query(
      `SELECT id::int AS id, email, role, refresh_token
       FROM users
       WHERE id = $1 AND refresh_token = $2
       LIMIT 1`,
      [userId, refreshToken]
    );

    if (rows.length === 0) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: "strict",
        path: "/",
      });
      return res.status(401).json({ error: "Refresh token revoked" });
    }

    const user = rows[0];

    const { rows: versionRows } = await query(
      `SELECT COALESCE(token_version, 0)::int AS token_version
       FROM users
       WHERE id = $1
       LIMIT 1`,
      [user.id]
    );

    const tokenVersion = versionRows[0]?.token_version ?? 0;
    if (decoded.tokenVersion !== undefined && decoded.tokenVersion !== tokenVersion) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: "strict",
        path: "/",
      });
      return res.status(401).json({ error: "Token version mismatch" });
    }

    const payload = {
      sub: user.id,
      role: user.role,
      email: user.email,
      tokenVersion,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });

    return res.json({ token });
  }),
};
