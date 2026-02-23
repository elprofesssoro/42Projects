
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { api, setAccessToken } from "../../api/api";
import { getSocket, disconnectSocket } from "../../api/socketClient";

const AUTH_KEY = "pong_auth_v1";
const AuthContext = createContext(null);

const safeParse = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const looksLikeJwt = (token) =>
  typeof token === "string" && token.split(".").length === 3;

const getErrStatus = (err) => {
  const s = err?.status;
  return Number.isFinite(Number(s)) ? Number(s) : null;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = safeParse(localStorage.getItem(AUTH_KEY));
    if (saved?.token && looksLikeJwt(saved.token)) {
      setAccessToken(saved.token);
      return saved;
    }
    return { token: null, user: null };
  });

  const pingIntervalRef = useRef(null);
  const meInFlightRef = useRef(false);
  const retryAfterRef = useRef(0);

  const isAuthenticated = Boolean(auth?.token && auth?.user);

  const login = useCallback(({ token, user }) => {
    const next = { token, user };
    setAuth(next);
    setAccessToken(token);
    localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  }, []);

  const logout = useCallback(async () => {
    const token = auth?.token;

    try {
      if (token) {
        try {
          await api("/api/presence/offline", { method: "POST", token });
        } catch {}
      }

      await api("/api/auth/logout", { method: "POST", token });
    } catch {
    } finally {
      localStorage.removeItem(AUTH_KEY);
      setAccessToken(null);
      setAuth({ token: null, user: null });
      disconnectSocket();
    }
  }, [auth?.token]);

  useEffect(() => {
    const handleTokenRefresh = (event) => {
      const newToken = event.detail?.token;
      if (!newToken || !looksLikeJwt(newToken)) return;

      setAccessToken(newToken);
      setAuth((prev) => ({ ...prev, token: newToken }));

      const saved = safeParse(localStorage.getItem(AUTH_KEY)) || {};
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({ ...saved, token: newToken })
      );
    };

    window.addEventListener("tokenRefreshed", handleTokenRefresh);
    return () => window.removeEventListener("tokenRefreshed", handleTokenRefresh);
  }, []);

  useEffect(() => {
    const onExpired = () => {
      logout();
    };

    window.addEventListener("sessionExpired", onExpired);
    window.addEventListener("authExpired", onExpired);
    return () => {
      window.removeEventListener("sessionExpired", onExpired);
      window.removeEventListener("authExpired", onExpired);
    };
  }, [logout]);

  useEffect(() => {
    const saved = safeParse(localStorage.getItem(AUTH_KEY));
    if (!saved?.token || !saved?.user) return;
    if (!looksLikeJwt(saved.token)) return;

    setAuth((prev) => (prev?.token ? prev : saved));
    setAccessToken(saved.token);

    const now = Date.now();
    if (now < retryAfterRef.current) return;
    if (meInFlightRef.current) return;

    meInFlightRef.current = true;

    api("/api/auth/me", { token: saved.token })
      .then((res) => {
        const next = { token: saved.token, user: res.user };
        setAuth(next);
        setAccessToken(saved.token);
        localStorage.setItem(AUTH_KEY, JSON.stringify(next));
      })
      .catch((err) => {
        const status = getErrStatus(err);

        if (status === 429) {
          const retryAfter =
            err?.data?.retryAfter && Number.isFinite(Number(err.data.retryAfter))
              ? Number(err.data.retryAfter)
              : 5;
          retryAfterRef.current = Date.now() + retryAfter * 1000;
          return;
        }

        if (status === 401 || status === 403) {
          localStorage.removeItem(AUTH_KEY);
          setAccessToken(null);
          setAuth({ token: null, user: null });
          disconnectSocket();
          return;
        }

        console.warn("[AuthProvider] /api/auth/me failed:", err);
      })
      .finally(() => {
        meInFlightRef.current = false;
      });
  }, []);

  useEffect(() => {
    if (auth?.token) getSocket(auth.token);
    else disconnectSocket();
  }, [auth?.token]);

  useEffect(() => {
    if (!isAuthenticated || !auth?.token) return;

    const token = auth.token;
    const ping = async () => {
      try {
        await api("/api/presence/ping", { method: "POST", token });
      } catch {}
    };

    ping();
    pingIntervalRef.current = setInterval(ping, 30_000);

    return () => {
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, auth?.token]);

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      isAuthenticated,
      login,
      logout,
    }),
    [auth.token, auth.user, isAuthenticated, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx)
      throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
