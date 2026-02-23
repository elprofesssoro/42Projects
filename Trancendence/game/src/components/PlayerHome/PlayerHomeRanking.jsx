import React, { useEffect, useMemo, useState } from "react";
import SPlayerHome from "./SPlayerHome";
import HeaderRanking from "../utils/HeaderRanking";
import { api } from "../../api/api";
import { useMatches } from "../utils/MatchesContext";
import { MATCH_WIN_POINTS, GAME_WIN_POINTS } from "../utils/Helpers";


const PlayerHomeRanking = () => {
  const [profiles, setProfiles] = useState([]);
  const { matches } = useMatches();

  useEffect(() => {
  api("/api/users")
    .then((pData) => {
      const users = Array.isArray(pData) ? pData : pData.users || [];
      setProfiles(users);
    })
    .catch((err) => console.error("Ranking fetch error:", err));
}, []);


  const rankingData = useMemo(() => {
    const stats = new Map();
    const ensure = (playerId) => {
      if (!stats.has(playerId)) {
        stats.set(playerId, { matchesPlayed: 0, points: 0 });
      }
      return stats.get(playerId);
    };

    for (const m of matches) {
      const p1 = m.playerId;
      const p2 = m.opponentId;
      if (!p1 || !p2)
          continue;

      const p1Stats = ensure(p1);
      const p2Stats = ensure(p2);

      p1Stats.matchesPlayed += 1;
      p2Stats.matchesPlayed += 1;

      const p1GamesWon = Number(m.playerScore ?? 0);
      const p2GamesWon = Number(m.opponentScore ?? 0);

      p1Stats.points += p1GamesWon * GAME_WIN_POINTS;
      p2Stats.points += p2GamesWon * GAME_WIN_POINTS;

      if (p1GamesWon > p2GamesWon)
          p1Stats.points += MATCH_WIN_POINTS;
      else if (p2GamesWon > p1GamesWon)
          p2Stats.points += MATCH_WIN_POINTS;
    }

    const rows = profiles.map((p) => {
      const s = stats.get(p.id) || { matchesPlayed: 0, points: 0 };

      return {
        id: p.id,
        image: p.image,
        alt: p.p_name || "player",
        name: p.p_name || "Unknown",
        country: p.country || "-",
        number_games: s.matchesPlayed,
        points: s.points,
        ranking: 0,
      };
    });

    rows.sort((a, b) => {
      if (b.points !== a.points)
          return b.points - a.points;
      if (b.number_games !== a.number_games)
          return b.number_games - a.number_games;
      return String(a.name).localeCompare(String(b.name));
    });

    rows.forEach((row, idx) => {
      row.ranking = idx + 1;
    });

    return rows;
  }, [profiles, matches]);

  return (
    <>
      <div className="headerRanking">
        <HeaderRanking text="Player" />
        <HeaderRanking text="Name" />
        <HeaderRanking text="Country" />
        <HeaderRanking text="Number of Games" />
        <HeaderRanking text="Points" />
        <HeaderRanking text="Rank" />
      </div>
      {rankingData.map((player) => (
        <SPlayerHome key={player.id} {...player} />
      ))}
    </>
  );
};

export default PlayerHomeRanking;
