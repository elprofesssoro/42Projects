import React, { useEffect, useMemo, useState } from "react";
import SHistory from "./SHistory";
import "./History.css";
import { useApi } from "../utils/useApi";
import { useMatches } from "../utils/MatchesContext";
import { GAMES_PER_MATCH } from "../Canvas";
import { resolveImageUrl } from "../utils/imageUrl";
import { normalizeUsers } from "../utils/Helpers";
import { parseDDMMYYYY } from "../utils/Helpers";
import { padToN } from "../utils/Helpers";
import { pointsToString } from "../utils/Helpers";




const withCacheBust = (url) =>
  url ? `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}` : "";

const OpponentGameHistory = ({ opponentId, limit = 10 }) => {
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
    const oppId = Number(opponentId);
    if (!oppId)
        return [];

    const oppIdStr = String(oppId);
    const theirs = (matches || []).filter(
      (m) => String(m.playerId) === oppIdStr || String(m.opponentId) === oppIdStr
    );

    const lastN = [...theirs]
      .sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date))
      .slice(0, limit);

    return lastN.map((m) => {
      const opponentIsPlayer1 = String(m.playerId) === oppIdStr;
      const otherId = opponentIsPlayer1 ? m.opponentId : m.playerId;

      const oppProfile = profileById.get(oppIdStr);
      const otherProfile = profileById.get(String(otherId));

      const fromGamesP = Array.isArray(m.games)
        ? m.games.map((g) => Number(g.playerPoints ?? 0))
        : null;
      const fromGamesO = Array.isArray(m.games)
        ? m.games.map((g) => Number(g.opponentPoints ?? 0))
        : null;

      const basePPts = padToN(m.playerPoints ?? fromGamesP, GAMES_PER_MATCH);
      const baseOPts = padToN(m.opponentPoints ?? fromGamesO, GAMES_PER_MATCH);

      const oppGamePts = opponentIsPlayer1 ? basePPts : baseOPts;
      const otherGamePts = opponentIsPlayer1 ? baseOPts : basePPts;

      const oppName = oppProfile?.p_name || "Opponent";
      const otherName = otherProfile?.p_name || "Player";

      return {
        id: m.id,
        date: m.date,
        p_image: withCacheBust(resolveImageUrl(oppProfile?.image)),
        p_name: oppName,
        p_score: opponentIsPlayer1 ? m.playerScore : m.opponentScore,
        p1_score: pointsToString(oppGamePts),
        g_image: withCacheBust(resolveImageUrl(otherProfile?.image)),
        g_name: otherName,
        g_score: opponentIsPlayer1 ? m.opponentScore : m.playerScore,
        p2_score: pointsToString(otherGamePts),
        alt: "",
      };
    });
  }, [matches, opponentId, profileById, limit]);

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

export default OpponentGameHistory;
