const AUTH_KEY = "pong_auth_v1";
const CLIENT_ID_KEY = "pong_client_id_v1";

export const API_BASE =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_URL) ||
  (typeof window !== "undefined" ? window.location.origin : "https://localhost:3443");

let accessToken = null;
let refreshPromise = null;

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getAccessToken() {
  return accessToken;
}

function getClientId() {
  if (typeof window === "undefined") return "server";
  try {
    let id = sessionStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      if (window.crypto?.randomUUID) id = window.crypto.randomUUID();
      else id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return "nocid";
  }
}

function broadcastTokenRefreshed(token) {
  try {
    window.dispatchEvent(new CustomEvent("tokenRefreshed", { detail: { token } }));
  } catch {}
}

function broadcastSessionExpired() {
  try {
    window.dispatchEvent(new CustomEvent("sessionExpired"));
  } catch {}
}

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Client-Id": getClientId() },
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new ApiError(res.status, txt || "Failed to refresh token");
    }

    const data = await res.json().catch(() => ({}));
    if (!data?.token) throw new ApiError(0, "No token in refresh response");

    setAccessToken(data.token);

    try {
      const saved = JSON.parse(localStorage.getItem(AUTH_KEY) || "{}");
      if (saved?.user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify({ token: data.token, user: saved.user }));
      }
    } catch {}

    broadcastTokenRefreshed(data.token);
    return data.token;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function api(path, options = {}) {
  const {
    token,
    method = "GET",
    body,
    skipAuth = false,
    refreshOn401 = true,
    headers: extraHeaders = {},
  } = options;

  const headers = { ...extraHeaders, "X-Client-Id": getClientId() };

  const hasBody = body !== undefined && body !== null;
  if (hasBody && !headers["Content-Type"]) headers["Content-Type"] = "application/json";

  const useToken = token || (!skipAuth ? accessToken : null);
  if (useToken) headers.Authorization = `Bearer ${useToken}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: "include",
      body: hasBody ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Unable to reach the server. Please check your connection.");
  }

  if (res.status === 429) {
    const retryAfterHeader = res.headers.get("Retry-After");
    const retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
    const data = await res.json().catch(() => ({}));
    throw new ApiError(429, data?.message || "Rate limit exceeded. Please try again later.", {
      retryAfter,
      ...data,
    });
  }

  const isRefreshCall = String(path).includes("/api/auth/refresh");
  if (res.status === 401 && refreshOn401 && !skipAuth && !isRefreshCall) {
    if (!useToken) {
      const data401 = await res.text().catch(() => null);
      throw new ApiError(401, "Unauthorized", data401);
    }

    try {
      const newToken = await refreshAccessToken();
      return api(path, { ...options, token: newToken });
    } catch {
      setAccessToken(null);
      try {
        localStorage.removeItem(AUTH_KEY);
      } catch {}
      broadcastSessionExpired();
      return null;
    }
  }

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : await res.text().catch(() => null);

  if (!res.ok) {
    const message =
      typeof data === "string" ? data : data?.error || data?.message || "Request failed";
    throw new ApiError(res.status, message, data);
  }

  return data;
}
