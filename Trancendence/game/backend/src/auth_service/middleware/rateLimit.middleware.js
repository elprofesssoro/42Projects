const buckets = new Map();

const nowMs = () => Date.now();

const getIp = (req) => {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) {
    const ip = xff.split(",")[0].trim();
    if (ip) return ip;
  }
  return req.ip || req.connection?.remoteAddress || "unknown";
};

const getClientId = (req) => {
  const v = req.headers["x-client-id"];
  if (typeof v === "string" && v.trim()) return v.trim();
  return "nocid";
};

const getUserIdFromAuth = (req) => {
  const h = req.headers.authorization || req.headers.Authorization;
  if (!h || typeof h !== "string") return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  const token = m[1];
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const payloadJson = Buffer.from(parts[1], "base64url").toString("utf8");
    const payload = JSON.parse(payloadJson);
    const sub = payload?.sub;
    if (sub === undefined || sub === null) return null;
    return String(sub);
  } catch {
    return null;
  }
};

const pathOf = (req) => req.originalUrl || req.url || "";

const shouldSkip = (req) => {
  const p = pathOf(req);
  if (p.startsWith("/api/presence/ping")) return true;
  if (p.startsWith("/api/auth/refresh")) return true;
  if (p.startsWith("/uploads/")) return true;
  if (p === "/health") return true;
  return false;
};

const isVerifyOpponent = (req) => {
  const p = pathOf(req);
  return p === "/api/auth/verify-opponent" || p.endsWith("/api/auth/verify-opponent");
};

const takeToken = (key, burst, refillPerSec) => {
  const now = nowMs();
  const b = buckets.get(key);

  if (!b) {
    const tokensLeft = burst - 1;
    buckets.set(key, { tokens: tokensLeft, last: now });
    return { ok: true, remaining: Math.max(0, Math.floor(tokensLeft)), retryAfterSec: 0 };
  }

  const elapsedSec = (now - b.last) / 1000;
  const refilled = b.tokens + elapsedSec * refillPerSec;
  const tokens = Math.min(burst, refilled);

  if (tokens < 1) {
    b.tokens = tokens;
    b.last = now;
    const need = 1 - tokens;
    const retryAfterSec = Math.max(1, Math.ceil(need / refillPerSec));
    return { ok: false, remaining: 0, retryAfterSec };
  }

  const nextTokens = tokens - 1;
  b.tokens = nextTokens;
  b.last = now;

  return { ok: true, remaining: Math.max(0, Math.floor(nextTokens)), retryAfterSec: 0 };
};

const setRateHeaders = (res, limit, remaining, retryAfterSec) => {
  res.set({
    "X-RateLimit-Limit": String(limit),
    "X-RateLimit-Remaining": String(Math.max(0, remaining)),
  });

  if (retryAfterSec > 0) {
    res.set({ "Retry-After": String(retryAfterSec), "X-RateLimit-Remaining": "0" });
  }
};

const rateLimit = (req, res, next) => {
  if (shouldSkip(req)) return next();

  const ip = getIp(req);
  const clientId = getClientId(req);
  const userId = getUserIdFromAuth(req) || "anon";
  const baseKey = `${ip}|${clientId}|${userId}`;

  if (isVerifyOpponent(req)) {
    const burst = 300;
    const refillPerSec = 300 / 60;
    const r = takeToken(`verify:${baseKey}`, burst, refillPerSec);

    setRateHeaders(res, burst, r.remaining, r.retryAfterSec);

    if (!r.ok) {
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please try again later.",
        retryAfter: r.retryAfterSec,
      });
    }

    return next();
  }

  const burst = 300;
  const refillPerSec = 300 / 60;
  const r = takeToken(`global:${baseKey}`, burst, refillPerSec);

  setRateHeaders(res, burst, r.remaining, r.retryAfterSec);

  if (!r.ok) {
    return res.status(429).json({
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: r.retryAfterSec,
    });
  }

  next();
};

export default rateLimit;