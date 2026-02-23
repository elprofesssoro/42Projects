import React, { useEffect, useMemo, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import PlayerProfile from "../components/Players/PlayerProfile";
import EditProfileModal from "../components/Players/EditProfileModal";
import { useAuth } from "../components/utils/AuthContext";
import { useMatches } from "../components/utils/MatchesContext";
import { useApi } from "../components/utils/useApi";
import { MATCH_WIN_POINTS, GAME_WIN_POINTS } from "../components/utils/Helpers";

const Profile = () => {
  const apiSafe = useApi();
  const navigate = useNavigate();
  const { token, login, logout } = useAuth();
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState("");
  const [loadingMe, setLoadingMe] = useState(false);
  const { matches } = useMatches();
  const [rank, setRank] = useState(null);
  const [stats, setStats] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!token) {
        if (alive) {
          setPlayer(null);
          setStats(null);
          setRank(null);
          setError("Please log in.");
        }
        return;
      }

      try {
        setError("");
        setLoadingMe(true);

        const data = await apiSafe("/api/users/me", { token });
        if (!alive)
            return;

        if (!data?.user)
            throw new Error("Invalid response from /api/users/me");
        setPlayer(data.user);
      } catch (e) {
        if (!alive)
            return;
        setError(e?.message || "Failed to load profile");
      } finally {
        if (alive)
            setLoadingMe(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token, apiSafe]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!player?.id || !token || !matches)
          return;

      try {
        const res = await apiSafe("/api/users", { token });
        if (!alive)
            return;

        const users = Array.isArray(res) ? res : res.users || [];
        const arr = users.map((u) => ({ ...u, points: 0 }));

        matches.forEach((m) => {
          const p1 = arr.find((u) => u.id === m.playerId);
          const p2 = arr.find((u) => u.id === m.opponentId);
          if (!p1 || !p2)
              return;

          if (m.playerScore > m.opponentScore)
              p1.points += MATCH_WIN_POINTS;
          else if (m.opponentScore > m.playerScore)
              p2.points += MATCH_WIN_POINTS;

          p1.points += m.playerScore * GAME_WIN_POINTS;
          p2.points += m.opponentScore * GAME_WIN_POINTS;
        });

        arr.sort((a, b) => b.points - a.points);
        const index = arr.findIndex((u) => u.id === player.id);
        if (alive)
            setRank(index !== -1 ? index + 1 : null);
      } catch (e) {
        console.error("Ranking calc failed:", e);
        if (alive)
            setRank(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [player?.id, matches, token, apiSafe]);

  useEffect(() => {
    let alive = true;

    (async () => {
      if (!token || !player?.id)  
        return;

      try {
        const s = await apiSafe(`/api/users/${player.id}/stats`, { token });
        if (!alive)
            return;
        setStats(s?.stats || null);
      } catch {
        if (!alive)
            return;
        setStats(null);
      }
    })();

    return () => {
      alive = false;
    };
  }, [token, player?.id, apiSafe]);

  const avatarSrc = useMemo(() => {
    if (!player?.image)
        return "";
    const v = typeof player.image === "string" ? String(player.image).length : 0;
    const sep = String(player.image).includes("?") ? "&" : "?";
    return `${player.image}${sep}v=${encodeURIComponent(v)}`;
  }, [player?.image]);

  const ready = !!player;
  const safeName = player?.p_name || "";

  return (
    <main>
      <Hero hero="profileHero" />
      {error && <p style={{ padding: 16 }}>{error}</p>}
      {!error && (
        <div style={{ minHeight: 520, visibility: ready ? "visible" : "hidden" }}>
          <PlayerProfile
            p_name={safeName}
            image={avatarSrc}
            alt={safeName}
            ranking={rank}
            onEdit={() => (ready ? setEditOpen(true) : null)}
          />

          <EditProfileModal
            open={ready && editOpen}
            onClose={() => setEditOpen(false)}
            token={token}
            player={player}
            onSaved={(nextUser, nextToken) => {
              setPlayer(nextUser);
              login({ token: nextToken || token, user: nextUser });
            }}
            onDelete={() => {
              logout();
              navigate("/", { replace: true });
            }}
          />
        </div>
      )}

      <nav className="profile-nav">
        <Link to="">Profile</Link>
        <Link to="gamehistory">History</Link>
        <Link to="friends">Friends</Link>
        <Link to="statistics">Statistics</Link>
      </nav>

      <Outlet context={{ player, stats, loadingMe }} />
    </main>
  );
};

export default Profile;
