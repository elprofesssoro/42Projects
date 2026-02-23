import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../api/api";
import Tournament from "./Tournament";

const safeMs = (d) => {
  const ms = d ? new Date(d).getTime() : NaN;
  return Number.isFinite(ms) ? ms : null;
};

const PastTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    api("/api/tournaments")
      .then((data) => {
        const list = Array.isArray(data?.tournaments) ? data.tournaments : [];
        if (!alive)
            return;
        setTournaments(list);
      })
      .catch(console.error)
      .finally(() => alive && setLoading(false));

    return () => {
      alive = false;
    };
  }, []);

  const pastTournament = useMemo(() => {
    const now = Date.now();

    const list = tournaments
      .map((t) => ({
        ...t,
        startsMs: safeMs(t.starts_at),
      }))
      .filter((t) => t);
    const finished = list
      .filter((t) => t.status === "finished")
      .sort((a, b) => (b.startsMs ?? 0) - (a.startsMs ?? 0))[0];
    if (finished)
        return finished;
    const startedPast = list
      .filter((t) => t.startsMs !== null && t.startsMs < now)
      .sort((a, b) => b.startsMs - a.startsMs)[0];

    return startedPast || null;
  }, [tournaments]);

  if (loading)
      return <p className="invitationText">Loading past tournament…</p>;
  if (!pastTournament?.id)
      return <p className="invitationText">No past tournament found.</p>;
  return <Tournament tournamentId={Number(pastTournament.id)} />;
};

export default PastTournament;
