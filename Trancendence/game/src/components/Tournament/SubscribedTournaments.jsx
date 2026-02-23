import React, { useEffect, useMemo, useState } from "react";
import "./Tournament.css";
import { GiTrophyCup } from "react-icons/gi";
import { useAuth } from "../utils/AuthContext";
import { useApi } from "../utils/useApi";

const normalizeTournamentRow = (t) => ({
  ...t,
  t_name: t.t_name ?? t.tName ?? t.name ?? "",
  t_date: t.t_date ?? t.tDate ?? t.date ?? "",
  tournament_id: t.tournament_id ?? t.tournamentId ?? t.id ?? null,
});

const extractQualifiedIdsFromBracket = (data) => {
  const rows = Array.isArray(data?.bracket) ? data.bracket : [];
  const round1 = rows.filter((m) => Number(m?.roundNumber) === 1);

  const set = new Set();
  for (const m of round1) {
    const a = Number(m?.player1Id);
    const b = Number(m?.player2Id);
    if (Number.isFinite(a) && a > 0) set.add(a);
    if (Number.isFinite(b) && b > 0) set.add(b);
  }
  return Array.from(set);
};

const SubscribedTournaments = ({ subscribedIds = [], tournaments = [], loading }) => {
  const { token, user, isAuthenticated } = useAuth();
  const apiSafe = useApi();

  const myId = user?.id;

  const subscribedTournaments = useMemo(() => {
    const idSet = new Set(subscribedIds.map(Number));
    return (tournaments || [])
      .map(normalizeTournamentRow)
      .filter((t) => idSet.has(Number(t.tournament_id)));
  }, [subscribedIds, tournaments]);

  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!isAuthenticated || !token || !myId) {
        if (alive) setStatusMap({});
        return;
      }

      const ids = subscribedTournaments.map((t) => Number(t.tournament_id)).filter(Boolean);
      if (!ids.length) {
        if (alive) setStatusMap({});
        return;
      }

      const next = {};
      for (const tid of ids) next[tid] = "Pending";
      if (alive) setStatusMap(next);

      for (const tid of ids) {
        if (!alive) return;

        const data = await apiSafe(`/api/tournaments/${tid}/bracket`, { token });
        if (!alive) return;

        const qualifiedIds = extractQualifiedIdsFromBracket(data);

        if (!qualifiedIds.length) {
          next[tid] = "Pending";
        } else {
          next[tid] = qualifiedIds.includes(Number(myId)) ? "Qualified" : "Not qualified";
        }

        if (alive) setStatusMap({ ...next });
      }
    })();

    return () => {
      alive = false;
    };
  }, [apiSafe, token, isAuthenticated, myId, subscribedTournaments]);

  return (
    <div className="subscribedTournaments">
      <h3>Your Tournaments</h3>
      <div className="jTrophy">
        <GiTrophyCup />
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : subscribedTournaments.length === 0 ? (
        <p>You are not subscribed to any tournaments.</p>
      ) : (
        <ul>
          {subscribedTournaments.map((t) => {
            const tid = Number(t.tournament_id);
            const status = tid ? statusMap?.[tid] : "";
            return (
              <li key={t.tournament_id}>
                <div>
                  <strong>{t.t_name}</strong>
                  {t.t_date ? ` (${t.t_date})` : ""}
                </div>
                {status ? <div style={{ marginTop: 6 }}>{status}</div> : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SubscribedTournaments;
