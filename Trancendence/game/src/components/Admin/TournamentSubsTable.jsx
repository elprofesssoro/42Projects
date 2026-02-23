import React from "react";
import "./Admin.css";
import AvatarCell from "../Elements/AvatarCell";

const TournamentSubsTable = ({ rows, loading, onCancel, tournamentStatus }) => {
  return (
    <div>
      <table className="usersTable">
        <thead className="tableHeader">
          <tr>
            <th>User</th>
            <th>Email</th>
            <th>Subscribed</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading && rows.length === 0 && (
            <tr className="userContainer">
              <td colSpan={4} style={{ padding: 14, opacity: 0.8 }}>
                No subscriptions found.
              </td>
            </tr>
          )}

          {rows.map((r) => {
            const userId = r.userId;
            const name =
              r.p_name ||
              `${r.firstName || ""} ${r.lastName || ""}`.trim() ||
              "—";

            const email = r.email || "—";
            const image = r.image;
            const subscribedAt = r.subscribed_at;

            return (
              <tr key={userId} className="userContainer2">
                <td>
                  <AvatarCell image={image} name={name} email={email} />
                </td>
                <td>{email}</td>
                <td>{subscribedAt ? new Date(subscribedAt).toLocaleString() : "—"}</td>
                <td>
                  <button onClick={() => onCancel(userId, name)}
                  disabled={tournamentStatus === "finished" 
                  ? "Cannot cancel subscribtions for finished tournaments" 
                  : "Cancel subscribtion"}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TournamentSubsTable;