import React from "react";
import "./Tournament.css";
import Avatar from "../Elements/Avatar";
import { useApi } from "../utils/useApi"; 
import { useAuth } from "../utils/AuthContext";

const TournamentMatch = ({
  tournamentId,
  bracketMatchId,
  player1Id,
  player2Id,
  playedMatchId,
  winnerId,
  status,
  p_image,
  alt,
  p_name,
  p_score,
  date,
  g_score,
  g_image,
  g_name,
  onUpdated,
  actionsEnabled = true,
}) => {
  const { user, token } = useAuth();
  const apiSafe = useApi();

  const isReady = Boolean(player1Id) && Boolean(player2Id);
  const isFinished =
    Boolean(playedMatchId) || Boolean(winnerId) || status === "finished";
  const isAdmin = user?.role === "admin";
  const isParticipant =
    Number(user?.id) === Number(player1Id) ||
    Number(user?.id) === Number(player2Id);

  const canRegister =
    actionsEnabled && isReady && !isFinished && isAdmin;
  const canUndo = actionsEnabled && isAdmin && isFinished;
  const canAdvance = actionsEnabled && isAdmin && !isFinished && !isReady;

  const registerResult = async () => {
    if (!token)
        return;

    const pm = window.prompt(
      "Enter playedMatchId (from your Private Game match id):"
    );
    if (!pm)
        return;

    const playedMatchIdNum = Number(pm);
    if (!Number.isFinite(playedMatchIdNum) || playedMatchIdNum <= 0) {
      return alert("Invalid playedMatchId");
    }

    const who = window.prompt(
      `Who won?\nType "1" for ${p_name}\nType "2" for ${g_name}`
    );
    if (who !== "1" && who !== "2")
        return;

    const winnerIdNum = who === "1" ? Number(player1Id) : Number(player2Id);
    if (!Number.isFinite(winnerIdNum) || winnerIdNum <= 0) {
      return alert("Invalid winner selection");
    }

    try {
      const res = await apiSafe(
        `/api/tournaments/${Number(
          tournamentId
        )}/bracket/${Number(bracketMatchId)}/result`,
        {
          method: "POST",
          token,
          body: {
            playedMatchId: playedMatchIdNum,
            winnerId: winnerIdNum,
          },
        }
      );

      if (!res)
          return;
      if (typeof onUpdated === "function") onUpdated();
    } catch (e) {
      console.error(e);
      alert("Failed to register result. Check console.");
    }
  };

  const advanceWinner = async () => {
  if (!token) return;

  const p1 = Number(player1Id);
  const p2 = Number(player2Id);

  const hasP1 = Number.isFinite(p1) && p1 > 0;
  const hasP2 = Number.isFinite(p2) && p2 > 0;

  let chosenWinner = null;

  if (hasP1 && !hasP2) {
    const ok = window.confirm(`Advance ${p_name || "Player 1"} to the next round? (BYE)`);
    if (!ok) return;
    chosenWinner = p1;
  } else if (!hasP1 && hasP2) {
    const ok = window.confirm(`Advance ${g_name || "Player 2"} to the next round? (BYE)`);
    if (!ok) return;
    chosenWinner = p2;
  } else {
    const input = window.prompt(
      `This match has missing players (TBD).\n` +
        `Enter the userId of the player you want to advance:`
    );
    if (!input) return;

    const idNum = Number(input);
    if (!Number.isFinite(idNum) || idNum <= 0) {
      alert("Invalid userId");
      return;
    }
    chosenWinner = idNum;
  }

  if (!Number.isFinite(chosenWinner) || chosenWinner <= 0) return;

  try {
    const res = await apiSafe(
      `/api/tournaments/${Number(tournamentId)}/bracket/${Number(bracketMatchId)}/advance`,
      {
        method: "POST",
        token,
        body: { winnerId: chosenWinner },
      }
    );

    if (!res) return;
    if (typeof onUpdated === "function") onUpdated();
  } catch (e) {
    console.error(e);
    alert(e?.message || "Failed to advance. Check console.");
  }
};


  const undoResult = async () => {
    if (!token)
        return;

    const ok = window.confirm(
      `Undo this result?\n\nThis will clear the winner and the played match id.\n` +
        `If a downstream match (semi/final) is already finished, you must undo that one first.`
    );
    if (!ok)
        return;

    try {
      const res = await apiSafe(
        `/api/tournaments/${Number(
          tournamentId
        )}/bracket/${Number(bracketMatchId)}/reset`,
        {
          method: "POST",
          token,
        }
      );

      if (!res)
          return;
      if (typeof onUpdated === "function") onUpdated();
    } catch (e) {
      console.error(e);
      alert(
        e?.message ||
          "Failed to undo result. Check console (it may be blocked because a downstream match is finished)."
      );
    }
  };


  return (
    <div className="tMatch">
      <h6 className="tDate">{date}</h6>
      <div className="tPlayer">
        <span><Avatar image={p_image} alt={alt} classN={"tImgM"} /></span>
        <div className="tPName">{p_name}</div>
        <span>{p_score}</span>
      </div>
      <div className="tDivider"></div>
      <div className="tPlayer">
        <span><Avatar image={g_image} alt={alt} classN={"tImgM"} /></span>
        <div className="tPName">{g_name}</div>
        <span>{g_score}</span>
      </div>

      {(canRegister || canUndo || canAdvance) && (
        <div>
          {canRegister && (
            <button
              type="button"
              className="registerGame"
              onClick={registerResult}
            >
              Register result
            </button>
          )}

          {canAdvance && (
            <button type="button" className="Advance" onClick={advanceWinner}>
              Advance
            </button>
          )}

          {canUndo && (
            <button type="button" className="unduResult" onClick={undoResult}>
              Undo result
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TournamentMatch;
