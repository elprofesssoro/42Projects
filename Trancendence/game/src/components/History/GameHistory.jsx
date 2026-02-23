import React, { useEffect, useMemo, useState } from "react";
import SHistory from "./SHistory";
import "./History.css";
import { useAuth } from "../utils/AuthContext";
import { useMatches } from "../utils/MatchesContext";
import { GAMES_PER_MATCH } from "../Canvas";
import { useApi } from "../utils/useApi";
import { resolveImageUrl } from "../utils/imageUrl";
import { normalizeUsers } from "../utils/Helpers";
import { parseDDMMYYYY } from "../utils/Helpers";
import { pointsToString } from "../utils/Helpers";



const GameHistory = () => {
  const { user } = useAuth();
  const myId = user?.id;
  const { matches } = useMatches();
  const [profiles, setProfiles] = useState([]);
  const apiSafe = useApi();


  useEffect(() => {
  let cancelled = false;

  (async () => {
    const usersData = await apiSafe("/api/users");
    if (!usersData)
        return; 
    if (!cancelled)
        setProfiles(normalizeUsers(usersData));
  })();

  return () => {
    cancelled = true;
  };
}, [apiSafe]);


  const profileById = useMemo(() => {
    const map = new Map();
    for (const p of profiles)
        map.set(String(p.id), p);
    return map;
  }, [profiles]);

  const rows = useMemo(() => {

    if (!myId)
        return [];
    const myIdStr = String(myId);
    const meProfile = profileById.get(myIdStr) || null;
    const mine = (matches || []).filter(
      (m) => String(m.playerId) === myIdStr || String(m.opponentId) === myIdStr
    );

    const top5 = [...mine]
      .sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date))
      .slice(0, 5);

    return top5.map((m) => {
      const iAmPlayer1 = String(m.playerId) === myIdStr;
      const oppId = iAmPlayer1 ? m.opponentId : m.playerId;
      const opp = profileById.get(String(oppId));
      const fromGamesP = Array.isArray(m.games)
        ? m.games.map((g) => Number(g.playerPoints ?? 0))
        : null;
      const fromGamesO = Array.isArray(m.games)
        ? m.games.map((g) => Number(g.opponentPoints ?? 0))
        : null;
      const zeros = Array(GAMES_PER_MATCH).fill(0);
      const myGamePts = iAmPlayer1 ? (fromGamesP || zeros) : (fromGamesO || zeros);
      const oppGamePts = iAmPlayer1 ? (fromGamesO || zeros) : (fromGamesP || zeros);


      return {
        id: m.id,
        date: m.date,
        p_image: resolveImageUrl(meProfile?.image ?? user?.image),
        p_name: meProfile?.p_name ?? user?.p_name,
        p_score: iAmPlayer1 ? m.playerScore : m.opponentScore,
        g_image: resolveImageUrl(opp?.image),
        g_name: opp?.p_name,
        g_score: iAmPlayer1 ? m.opponentScore : m.playerScore,
        p1_score: pointsToString(myGamePts),
        p2_score: pointsToString(oppGamePts),
        alt: "",
      };
    });
  }, [matches, myId, profileById, user]);

  if (!myId)
      return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div className="historyList">
      {rows.length === 0 ? (
        <div className="invitationText">No matches found.</div>
      ) : (
        rows.map((row) => <SHistory key={row.id} {...row} />)
      )}
    </div>
  );
};

export default GameHistory;
