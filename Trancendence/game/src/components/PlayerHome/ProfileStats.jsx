import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import PlayerStats from "../Elements/PlayerStats";
import { useMatches } from "../utils/MatchesContext";
import { MATCH_WIN_POINTS, GAME_WIN_POINTS } from "../utils/Helpers";


const buildStatsFromMatches = (matches, playerId) => {
  const pid = Number(playerId);
  if (!pid || !Array.isArray(matches)) {
    return {
      t_matches: 0,
      w_matches: 0,
      l_matches: 0,
      t_games: 0,
      w_games: 0,
      l_games: 0,
      t_points: 0,
      m_points: 0,
      g_points: 0,
    };
  }

  let t_matches = 0;
  let w_matches = 0;
  let l_matches = 0;

  let w_games = 0;
  let l_games = 0;

  for (const m of matches) {
    const p1 = Number(m?.playerId);
    const p2 = Number(m?.opponentId);
    if (!p1 || !p2)
        continue;
    if (p1 !== pid && p2 !== pid)
        continue;
    t_matches += 1;
    const p1GamesWon = Number(m?.playerScore ?? 0);
    const p2GamesWon = Number(m?.opponentScore ?? 0);
    const myGamesWon = p1 === pid ? p1GamesWon : p2GamesWon;
    const oppGamesWon = p1 === pid ? p2GamesWon : p1GamesWon;
    w_games += myGamesWon;
    l_games += oppGamesWon;

    if (myGamesWon > oppGamesWon)
        w_matches += 1;
    else if
      (oppGamesWon > myGamesWon) l_matches += 1;
  }

  const t_games = w_games + l_games;
  const m_points = w_matches * MATCH_WIN_POINTS;
  const g_points = w_games * GAME_WIN_POINTS;
  const t_points = m_points + g_points;

  return {
    t_matches,
    w_matches,
    l_matches,
    t_games,
    w_games,
    l_games,
    t_points,
    m_points,
    g_points,
  };
};

const ProfileStats = () => {
  const { stats, player } = useOutletContext();
  const { matches } = useMatches();
  const playerId = player?.id ?? stats?.userId;

  const computed = useMemo(() => {
    return buildStatsFromMatches(matches || [], playerId);
  }, [matches, playerId]);

  const merged = useMemo(() => {
    return {
      ...(stats || {}),
      ...computed,
    };
  }, [stats, computed]);

  if (!playerId)
      return <p className="invitationText">Loading stats…</p>;
  return <PlayerStats {...merged} />;
};

export default ProfileStats;