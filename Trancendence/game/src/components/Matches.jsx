import React, { useEffect, useMemo, useState } from "react";
import Match from "./Players/Match";
import "./History/History.css";
import "./Matches.css";
import { api } from "../api/api";
import { useMatches } from "./utils/MatchesContext";
import { GAMES_PER_MATCH } from "./Canvas";
import { parseDDMMYYYY } from "./utils/Helpers";
import { padToN } from "./utils/Helpers";




const Matches = () => {
  const { matches } = useMatches(); 
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    api("/api/users")
      .then((pData) => {
        const users = Array.isArray(pData) ? pData : pData.users || [];
        setProfiles(users);
      })
      .catch(console.error);
  }, []);

  const last15Matches = useMemo(() => {
   
    const byId = new Map(profiles.map((p) => [String(p.id), p]));

    return [...(matches || [])]
      .sort((a, b) => parseDDMMYYYY(b.date) - parseDDMMYYYY(a.date))
      .slice(0, 15)
      .map((m) => {
        const player = byId.get(String(m.playerId));
        const opponent = byId.get(String(m.opponentId));
        const fromGamesP = Array.isArray(m.games)
          ? m.games.map((g) => Number(g.playerPoints ?? 0))
          : null;
        const fromGamesO = Array.isArray(m.games)
          ? m.games.map((g) => Number(g.opponentPoints ?? 0))
          : null;

        const pPts = padToN(m.playerPoints ?? fromGamesP, GAMES_PER_MATCH);
        const oPts = padToN(m.opponentPoints ?? fromGamesO, GAMES_PER_MATCH);


        return {
          id: m.id,
          date: m.date,
          p_image: player?.image || "",
          p_name: player?.p_name || "Unknown",
          p_score: Number(m.playerScore ?? 0),
          g_score: Number(m.opponentScore ?? 0),
          g_image: opponent?.image || "",
          g_name: opponent?.p_name || "Unknown",
          p_g_1: pPts[0],
          p_g_2: pPts[1],
          p_g_3: pPts[2],
          p_g_4: pPts[3],
          o_g_1: oPts[0],
          o_g_2: oPts[1],
          o_g_3: oPts[2],
          o_g_4: oPts[3],
          alt: "",
        };
      });
  }, [profiles, matches]);

  return (
    <div className="matchesList">
      {last15Matches.map((m) => (
        <Match key={m.id} {...m} />
      ))}
    </div>
  );
};

export default Matches;
