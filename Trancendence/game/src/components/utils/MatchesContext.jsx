import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { api } from "../../api/api";
import { useAuth } from "./AuthContext";




const MatchesContext = createContext(null);


export const MatchesProvider = ({ children }) => {
   const { token } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api("/api/matches", {token});
      setMatches(data.matches || []);
    } catch (e) {
      console.error("refreshMatches failed:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshMatches();
  }, [refreshMatches]);

  const addMatchOptimistic = useCallback((newMatch) => {
    setMatches((prev) => [newMatch, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      matches,
      loading,
      refreshMatches,
      addMatchOptimistic,
      setMatches,
    }),
    [matches, loading, refreshMatches, addMatchOptimistic]
  );
  return <MatchesContext.Provider value={value}>{children}</MatchesContext.Provider>;
};

export const useMatches = () => {
  const ctx = useContext(MatchesContext);
  if (!ctx)
      throw new Error("useMatches must be used inside <MatchesProvider>");
  return ctx;
};
