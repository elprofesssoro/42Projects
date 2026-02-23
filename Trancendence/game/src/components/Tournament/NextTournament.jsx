import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import SNextTournament from "./SNextTournament";
import { useApi } from "../utils/useApi";

const formatDDMMYYYY = (value) => {
  if (!value)
      return "";
  if (typeof value === "string" && value.includes("/"))
      return value;

  const d = new Date(value);
  if (Number.isNaN(d.getTime()))
      return "";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const POLL_MS = 30_000;

const NextTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiSafe = useApi();

  const didFirstLoadRef = useRef(false);

  const load = useCallback(
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
      await load({ showSpinner: true });
      if (!alive)
          return;
      didFirstLoadRef.current = true;
      timer = setInterval(() => {
        load({ showSpinner: false });
      }, POLL_MS);
    })();

    return () => {
      alive = false;
      if (timer) clearInterval(timer);
    };
  }, [load]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && didFirstLoadRef.current) {
        load({ showSpinner: false });
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [load]);

  const nextList = useMemo(() => {
    const now = Date.now();

    return (tournaments || [])
      .map((t) => {
        const startsMs = t?.starts_at ? new Date(t.starts_at).getTime() : NaN;
        return {
          id: t.id,
          status: t.status,
          startsMs,
          t_name: t.name,
          t_date: formatDDMMYYYY(t.starts_at),
        };
      })
      .filter((t) => Number.isFinite(t.startsMs))
      .filter((t) => t.startsMs > now)
      .filter((t) => t.status === "not_started")
      .sort((a, b) => a.startsMs - b.startsMs);
  }, [tournaments]);

  return (
    <div className="nextTourCont">
      <h2>Next Tournaments</h2>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="nextTourList">
          {nextList.length === 0 ? (
            <p className="invitationText">No upcoming tournaments.</p>
          ) : (
            nextList.map((t) => <SNextTournament key={t.id} {...t} />)
          )}
        </div>
      )}
    </div>
  );
};

export default NextTournament;