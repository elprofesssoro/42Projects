import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSocket } from "../../api/socketClient";
import { useAuth } from "./AuthContext";

export const ONLINE_TTL_MS = 45_000; 

const PresenceContext = createContext(null);

export function PresenceProvider({ children }) {
  const { token } = useAuth();
  const [now, setNow] = useState(() => Date.now());

  
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  
  useEffect(() => {
    const s = getSocket(token);
    if (!s)
        return;

    const onPresence = () => setNow(Date.now());
    s.on("presence:update", onPresence);

    return () => s.off("presence:update", onPresence);
  }, [token]);

  const value = useMemo(() => {
    const lastSeenMs = (u) => {
      const v = u?.last_seen ?? u?.lastSeen ?? null; 
      if (!v)
          return 0;
      const t = new Date(v).getTime();
      return Number.isFinite(t) ? t : 0;
    };

    const isOnline = (u) => {
      const ls = lastSeenMs(u);
      if (!ls)
          return false;
      return now - ls <= ONLINE_TTL_MS;
    };

    return { now, isOnline, lastSeenMs, ONLINE_TTL_MS };
  }, [now]);

  return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
}

export function usePresence() {
  const ctx = useContext(PresenceContext);
  if (!ctx)
      throw new Error("usePresence must be used within <PresenceProvider>");
  return ctx;
}
