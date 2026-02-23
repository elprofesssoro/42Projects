import React from "react";
import AvatarCell from "../Elements/AvatarCell";

const ActionsSelect = ({ onAction }) => (
  <select
    className="inpA"
    defaultValue=""
    onChange={(e) => {
      const v = e.target.value;
      e.target.value = "";
      if (!v)
          return;
      onAction(v);
    }}
    style={{ minWidth: 160 }}
  >
    <option value="" disabled>
      Actions…
    </option>
    <option value="view">View details</option>
    <option value="delete">Delete</option>
  </select>
);


const MatchesTable = ({ rows = [], loading, onView, onDelete }) => {
  return (
    <div>
      <table className="usersTable">
        <thead className="tableHeader">
          <tr >
            <th>ID</th>
            <th>Played</th>
            <th>Mode</th>
            <th>Status</th>
            <th>Player 1</th>
            <th>Player 2</th>
            <th>Score</th>
            <th>Winner</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading && rows.length === 0 && (
            <tr className="userContainer">
              <td colSpan={9} style={{ padding: 14, opacity: 0.8 }}>
                No matches found.
              </td>
            </tr>
          )}

          {rows.map((m) => {
            const playedAt = m.played_at ? new Date(m.played_at).toLocaleString() : "—";
            const score = `${Number(m.p1_games_won ?? 0)} : ${Number(m.p2_games_won ?? 0)}`;

            let winnerLabel = "—";
            if (m.winner_id === m.p1_id)
                winnerLabel = m.p1_name || "Player 1";
            else if (m.winner_id === m.p2_id)
                winnerLabel = m.p2_name || "Player 2";
            else if (m.winner_id == null)
                winnerLabel = "tie";

            return (
              <tr key={m.id} className="userContainer2">
                <td>{m.id}</td>
                <td>{playedAt}</td>
                <td>{m.mode || "—"}</td>
                <td>{m.status || "—"}</td>
                <td>
                  <AvatarCell image={m.p1_image} name={m.p1_name} email={m.p1_email} />
                </td>
                <td>
                  <AvatarCell image={m.p2_image} name={m.p2_name} email={m.p2_email} />
                </td>
                <td >{score}</td>
                <td >{winnerLabel}</td>
                <td >
                  <ActionsSelect
                    onAction={(action) => {
                      if (action === "view")
                          onView(m.id);
                      if (action === "delete")
                          onDelete(m.id);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MatchesTable;
