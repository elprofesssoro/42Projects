import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Tournament from "./Tournament";
import { useApi } from "../utils/useApi";

const toMs = (d) => {
  const ms = d ? new Date(d).getTime() : NaN;
  return Number.isFinite(ms) ? ms : null;
};

const parseDurationToMs = (s) => {
  if (!s || typeof s !== "string")
      return null;
  const m = s.trim().toLowerCase().match(/^(\d+)\s*(ms|s|m|h|d)$/);
  if (!m)
      return null;

  const n = Number(m[1]);
  const unit = m[2];
  if (!Number.isFinite(n) || n <= 0)
      return null;

  switch (unit) {
    case "ms":
      return n;
    case "s":
      return n * 1000;
    case "m":
      return n * 60 * 1000;
    case "h":
      return n * 60 * 60 * 1000;
    case "d":
      return n * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
};

const DEFAULT_STALE_MS = 5 * 24 * 60 * 60 * 1000;
const POLL_MS = 15_000;

const CurrentTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [chosenId, setChosenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const apiSafe = useApi();

  const staleWindowMs = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const staleParam = params.get("stale");
    return parseDurationToMs(staleParam) ?? DEFAULT_STALE_MS;
  }, [location.search]);


  const didFirstLoadRef = useRef(false);

  const loadTournaments = useCallback(
    async ({ showSpinner } = { showSpinner: false }) => {
      if (showSpinner)
          setLoading(true);

      const data = await apiSafe("/api/tournaments");
      if (!data) {
        setTournaments([]);
        if (showSpinner)
            setLoading(false);
        return;
      }

      const list = Array.isArray(data?.tournaments) ? data.tournaments : [];
      setTournaments(list);

      if (showSpinner)
          setLoading(false);
    },
    [apiSafe]
  );

  useEffect(() => {
    let alive = true;
    let timer = null;

    (async () => {
      await loadTournaments({ showSpinner: true });
      if (!alive)
          return;

      didFirstLoadRef.current = true;

      timer = setInterval(() => {
      
        loadTournaments({ showSpinner: false });
      }, POLL_MS);
    })();

    return () => {
      alive = false;
      if (timer)
          clearInterval(timer);
    };
  }, [loadTournaments]);

  
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && didFirstLoadRef.current) {
        loadTournaments({ showSpinner: false });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [loadTournaments]);

  const currentTournament = useMemo(() => {
    const now = Date.now();

    const list = (tournaments || [])
      .map((t) => ({
        ...t,
        startsMs: toMs(t.starts_at),
      }))
      .filter((t) => t.startsMs !== null);

    const inProgressRecent = list
      .filter((t) => t.status === "in_progress")
      .filter((t) => t.startsMs <= now)
      .filter((t) => now - t.startsMs <= staleWindowMs)
      .sort((a, b) => b.startsMs - a.startsMs)[0];

    if (inProgressRecent)
        return inProgressRecent;

    const upcoming = list
      .filter((t) => t.status === "not_started")
      .filter((t) => t.startsMs > now)
      .sort((a, b) => a.startsMs - b.startsMs)[0];

    if (upcoming)
        return upcoming;

    const anyNotStarted = list
      .filter((t) => t.status === "not_started")
      .sort((a, b) => b.startsMs - a.startsMs)[0];

    return anyNotStarted || null;
  }, [tournaments, staleWindowMs]);

  useEffect(() => {
    setChosenId(currentTournament?.id ? Number(currentTournament.id) : null);
  }, [currentTournament]);

 
  useEffect(() => {
    if (!chosenId) return;
    apiSafe(`/api/tournaments/${chosenId}/bracket`);
  }, [chosenId, apiSafe]);

  if (loading)
      return <p className="invitationText">Loading current tournament…</p>;
  if (!chosenId)
      return <p className="invitationText">No current tournament available.</p>;


  return (
    <div>
      <Tournament tournamentId={chosenId} />
    </div>
  );
};

export default CurrentTournament;
