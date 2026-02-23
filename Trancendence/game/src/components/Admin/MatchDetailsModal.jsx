import React from "react";
import { FaWindowClose } from "react-icons/fa";
import "../Modal/Modal.css";
import Row from "./Row";


const MatchDetailsModal = ({ open, onClose, match }) => {

  if (!open)
      return null;
  const played = match?.played_at ? new Date(match.played_at).toLocaleString() : "—";
  const score = `${Number(match?.p1_games_won ?? 0)} : ${Number(match?.p2_games_won ?? 0)}`;

  const winner =
    match?.winner_id === match?.p1_id
      ? match?.p1_name
      : match?.winner_id === match?.p2_id
      ? match?.p2_name
      : match?.winner_id == null
      ? "tie"
      : "—";

  const games = Array.isArray(match?.games) ? match.games : [];

  return (
    <div className="modalVerify" onClick={onClose}>
      <div className="modalVerify-body" onClick={(e) => e.stopPropagation()}>
        <div className="modalVerify-title">
          <h3>Match #{match?.id} details</h3>
          <FaWindowClose className="vClose" onClick={onClose} />
        </div>
        <div style={{ marginTop: 10 }}>
          <Row label="Played" value={played} />
          <Row label="Mode" value={match?.mode || "—"} />
          <Row label="Status" value={match?.status || "—"} />
          <Row label="Score" value={score} />
          <Row label="Winner" value={winner || "—"} />
        </div>
        <div className="matchDetails-modal-title">
          Games
        </div>
        <div className="matchDetails-modal-wrapper">
          <table className="matchDetails-table">
            <thead>
              <tr className="matchDetails-table_tr">
                <th className="matchDetails-table_th">#</th>
                <th className="matchDetails-table_th">
                  {match?.p1_name || "Player 1"}
                </th>
                <th className="matchDetails-table_th">
                  {match?.p2_name || "Player 2"}
                </th>
                <th className="matchDetails-table_th">Winner</th>
              </tr>
            </thead>
            <tbody>
              {games.length === 0 && (
                <tr className="userContainer">
                  <td colSpan={4} style={{ padding: 10, opacity: 0.75 }}>
                    No game rows found.
                  </td>
                </tr>
              )}

              {games.map((g) => {
                const w =
                  g.winnerId === match?.p1_id
                    ? match?.p1_name
                    : g.winnerId === match?.p2_id
                    ? match?.p2_name
                    : g.winnerId == null
                    ? "tie"
                    : "—";

                return (
                  <tr className="matchDetails-table_tr">
                    <td className="matchDetails-table_td">{g.gameNumber}</td>
                    <td className="matchDetails-table_td">{g.p1}</td>
                    <td className="matchDetails-table_td">{g.p2}</td>
                    <td className="matchDetails-table_td">{w}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="btnVerify-container">
          <button className="btnVerify" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailsModal;