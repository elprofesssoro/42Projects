import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import Hero from "../components/Hero";
import OPlayerProfile from "../components/Opponent/OPlayerProfile";
import { useApi } from "../components/utils/useApi";
import { useAuth } from "../components/utils/AuthContext";
import { useMatches } from "../components/utils/MatchesContext";
import "../pages/Results.css";
import { MATCH_WIN_POINTS, GAME_WIN_POINTS } from "../components/utils/Helpers";

const OpponentProfile = () => {
  const { id } = useParams();
  const opponentId = useMemo(() => Number(id), [id]);
  const { token } = useAuth();
  const { matches } = useMatches();
  const apiSafe = useApi();

  const apiRef = useRef(apiSafe);
  useEffect(() => {
    apiRef.current = apiSafe;
  }, [apiSafe]);

  const [opponent, setOpponent] = useState(null);
  const [stats, setStats] = useState(null);
  const [rank, setRank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!opponentId) {
        if (!cancelled) {
          setOpponent(null);
          setStats(null);
          setRank(null);
          setErr("Invalid opponent id");
          setLoading(false);
        }
        return;
      }

      if (!token) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      if (!opponent || Number(opponent?.id) !== Number(opponentId)) {
        setLoading(true);
      }
      setErr("");

      try {
        const u = await apiRef.current(`/api/users/${opponentId}`, { token });
        if (!u)
            return;

        const opp = u?.user || u;
        if (!opp) throw new Error("No user returned");

        let s = null;
        try {
          const res = await apiRef.current(`/api/users/${opponentId}/stats`, { token });
          if (res) s = res?.stats || null;
        } catch {
          s = null;
        }

        if (!cancelled) {
          setOpponent(opp);
          setStats(s);
        }
      } catch {
        if (!cancelled)
            setErr("Failed to load opponent profile");
      } finally {
        if (!cancelled)
            setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [token, opponentId]);

  useEffect(() => {
    if (!token || !opponentId || !matches?.length) return;

    (async () => {
      try {
        const res = await apiRef.current("/api/users", { token });
        if (!res) {
          setRank(null);
          return;
        }

        const users = Array.isArray(res) ? res : res.users || [];
        const arr = users.map((u) => ({ ...u, points: 0 }));

        matches.forEach((m) => {
          const p1 = arr.find((u) => u.id === m.playerId);
          const p2 = arr.find((u) => u.id === m.opponentId);
          if (!p1 || !p2) return;

          if (m.playerScore > m.opponentScore) p1.points += MATCH_WIN_POINTS;
          else if (m.opponentScore > m.playerScore) p2.points += MATCH_WIN_POINTS;

          p1.points += m.playerScore * GAME_WIN_POINTS;
          p2.points += m.opponentScore * GAME_WIN_POINTS;
        });

        arr.sort((a, b) => b.points - a.points);
        const idx = arr.findIndex((u) => Number(u.id) === Number(opponentId));
        setRank(idx !== -1 ? idx + 1 : null);
      } catch {
        setRank(null);
      }
    })();
  }, [token, opponentId, matches]);

  const opponentName = useMemo(() => {
    if (!opponent) return "";
    return (
      opponent.p_name ||
      `${opponent.firstName || ""} ${opponent.lastName || ""}`.trim() ||
      opponent.email ||
      "Opponent"
    );
  }, [opponent]);

  const showLoading = loading && !opponent;
  if (!opponent) return null;


  return (
    <main>
      <Hero hero="profileHero" />
      <div className="profileContainer">
        {err && <p className="invitationText">{err}</p>}
        {showLoading && <p className="invitationText">Loading…</p>}
        {!token && !showLoading && (
          <p className="invitationText">Please log in to view profiles.</p>
        )}

        {token && opponent && (
          <>
            <OPlayerProfile
              p_name={opponentName}
              image={opponent.image}
              alt={opponentName}
              ranking={rank}
            />
            <nav className="profile-nav">
              <Link to="">History</Link>
              <Link to="statistics">Statistics</Link>
            </nav>
            <Outlet context={{ opponentId, opponent, stats, rank }} />
          </>
        )}
      </div>
    </main>
  );
};

export default OpponentProfile;
