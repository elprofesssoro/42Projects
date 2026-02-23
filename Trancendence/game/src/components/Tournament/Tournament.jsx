import React, { useCallback, useEffect, useMemo, useState } from "react";
import TournamentRound from "./TournamentRound";
import "./Tournament.css";
import "../Matches.css";
import "../History/History.css";
import { api } from "../../api/api";
import { padToN } from "../utils/Helpers";



const pickFirst = (...vals) => {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== "")
        return v;
  }
  return null;
};

const Tournament = ({ tournamentId = 101 }) => {

  const [profiles, setProfiles] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [bracket, setBracket] = useState([]);

  const load = useCallback(() => {
    return Promise.all([
      api("/api/users"),
      api("/api/tournaments"),
      api(`/api/tournaments/${Number(tournamentId)}/bracket`),
    ])
      .then(([u, t, b]) => {
        const usersList = Array.isArray(u) ? u : u?.users || [];
        const tournamentsList = Array.isArray(t) ? t : t?.tournaments || [];

        setProfiles(usersList);
        setTournament(
          tournamentsList.find((x) => Number(x.id) === Number(tournamentId)) ||
            null
        );
        setBracket(Array.isArray(b?.bracket) ? b.bracket : []);
      })
      .catch(console.error);
  }, [tournamentId]);

  useEffect(() => {
    load();
  }, [load]);

  const onUpdated = useCallback(() => {
    load();
  }, [load]);

  const actionsEnabled =
    tournament?.status === "not_started" || tournament?.status === "in_progress";

  const roundsForUI = useMemo(() => {
    const byProfileId = new Map(profiles.map((p) => [String(p.id), p]));

    const resolveDisplay = (slot, side /* 'p1' | 'p2' */) => {
      const isP1 = side === "p1";

      const id =
        (isP1 ? slot.player1Id : slot.player2Id) ??
        (isP1 ? slot.mPlayer1Id : slot.mPlayer2Id) ??
        null;

      const live = id ? byProfileId.get(String(id)) : null;

      const nameSnap = isP1
        ? pickFirst(
            slot.player1NameSnapshot,
            slot.player1_name_snapshot,
            slot.p1NameSnapshot,
            slot.p1_name_snapshot
          )
        : pickFirst(
            slot.player2NameSnapshot,
            slot.player2_name_snapshot,
            slot.p2NameSnapshot,
            slot.p2_name_snapshot
          );

      const imgSnap = isP1
        ? pickFirst(
            slot.player1ImageSnapshot,
            slot.player1_image_snapshot,
            slot.p1ImageSnapshot,
            slot.p1_image_snapshot
          )
        : pickFirst(
            slot.player2ImageSnapshot,
            slot.player2_image_snapshot,
            slot.p2ImageSnapshot,
            slot.p2_image_snapshot
          );

      const nameApi = isP1
        ? pickFirst(slot.player1Name, slot.p1Name)
        : pickFirst(slot.player2Name, slot.p2Name);

      const imgApi = isP1
        ? pickFirst(slot.player1Image, slot.p1Image)
        : pickFirst(slot.player2Image, slot.p2Image);

      const finalName =
        pickFirst(nameSnap, nameApi, live?.p_name) ||
        (id ? "Not Available" : "TBD");

      const finalImage = pickFirst(imgSnap, imgApi, live?.image) || "";

      return { id, name: finalName, image: finalImage };
    };

    const byRound = new Map();

    for (const slot of bracket) {
      const key = `${slot.roundNumber}:${slot.roundName || ""}`;

      if (!byRound.has(key)) {
        byRound.set(key, {
          id: key,
          roundNumber: slot.roundNumber,
          title: slot.roundName || `Round ${slot.roundNumber}`,
          matches: [],
        });
      }


      const p1 = resolveDisplay(slot, "p1");
      const p2 = resolveDisplay(slot, "p2");

      const hasPlayed = Boolean(slot.playedMatchId);
      const bracketP1Id = Number(slot.player1Id);
      const matchP1Id = Number(slot.mPlayer1Id);

      const sameSide =
        hasPlayed &&
        Number.isFinite(bracketP1Id) &&
        Number.isFinite(matchP1Id)
          ? bracketP1Id === matchP1Id
          : true;

      const rawP1Games = Number(slot.mPlayer1GamesWon ?? 0);
      const rawP2Games = Number(slot.mPlayer2GamesWon ?? 0);

      const rawP1Pts = padToN(slot.mPlayer1Points);
      const rawP2Pts = padToN(slot.mPlayer2Points);

      const pGames = hasPlayed ? (sameSide ? rawP1Games : rawP2Games) : "";
      const oGames = hasPlayed ? (sameSide ? rawP2Games : rawP1Games) : "";

      const pPts = hasPlayed ? (sameSide ? rawP1Pts : rawP2Pts) : ["", "", "", ""];
      const oPts = hasPlayed ? (sameSide ? rawP2Pts : rawP1Pts) : ["", "", "", ""];

      byRound.get(key).matches.push({
        id: Number(slot.id),
        tournamentId: Number(tournamentId),
        bracketMatchId: Number(slot.id),
        player1Id: slot.player1Id ? Number(slot.player1Id) : null,
        player2Id: slot.player2Id ? Number(slot.player2Id) : null,
        playedMatchId: slot.playedMatchId ? Number(slot.playedMatchId) : null,
        winnerId: slot.winnerId ? Number(slot.winnerId) : null,
        status: slot.status || "",
        date: slot.playedDate || "",
        p_image: p1.image || "",
        p_name: p1.name || "TBD",
        p_score: pGames,
        g_image: p2.image || "",
        g_name: p2.name || "TBD",
        g_score: oGames,
        p_g_1: hasPlayed ? pPts[0] : "",
        p_g_2: hasPlayed ? pPts[1] : "",
        p_g_3: hasPlayed ? pPts[2] : "",
        p_g_4: hasPlayed ? pPts[3] : "",
        o_g_1: hasPlayed ? oPts[0] : "",
        o_g_2: hasPlayed ? oPts[1] : "",
        o_g_3: hasPlayed ? oPts[2] : "",
        o_g_4: hasPlayed ? oPts[3] : "",
        alt: "",
        onUpdated,
      });
    }

    const rounds = Array.from(byRound.values()).sort(
      (a, b) => a.roundNumber - b.roundNumber
    );
    for (const r of rounds) {
      r.matches = r.matches.slice();
    }
    return rounds;
  }, [profiles, bracket, tournamentId, onUpdated]);

  return (
    <div>
      <header className="tournamentHeader">
        <h2>{tournament?.name || "Tournament"}</h2>
        {tournament && (
          <p className="tournamentMeta">
            Status: <b>{tournament.status}</b> • Players:{" "}
            <b>{tournament.participants?.length || 0}</b>
          </p>
        )}
      </header>
      <div className="tournament">
        {!tournament ? (
          <p className="invitationText">Tournament not found.</p>
        ) : roundsForUI.length === 0 ? (
          <p className="invitationText">No bracket slots found for this tournament.</p>
        ) : (
          roundsForUI.map((r) => (
            <TournamentRound
              key={r.id}
              title={r.title}
              matches={r.matches}
              actionsEnabled={actionsEnabled}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Tournament;
