import React from "react";
import "./Admin.css"
import AvatarCell from "../Elements/AvatarCell";


const InvitesTable = ({ rows, loading, onCancel }) => {
  return (
    <div >
      <table className="usersTable">
        <thead className="tableHeader">
          <tr >
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading && rows.length === 0 && (
            <tr className="userContainer">
              <td colSpan={6} style={{ padding: 14, opacity: 0.8 }}>
                No invites found.
              </td>
            </tr>
          )}

          {rows.map((r) => {
            const id = r.id;
            const createdAt = r.created_at || r.createdAt;
            const canCancel = r.status === "pending" || r.status === "accepted";
            return (
              <tr
                key={id}
                className="userContainer2"
              >
                <td>{id}</td>
                <td >
                  <AvatarCell
                    image={r.from_image}
                    name={r.from_name}
                    email={r.from_email}
                  />
                </td>
                <td >
                  <AvatarCell image={r.to_image} name={r.to_name} email={r.to_email} />
                </td>
                <td>{r.status}</td>
                <td>
                  {createdAt ? new Date(createdAt).toLocaleString() : "—"}
                </td>
                <td>
                  <button
                    disabled={!canCancel}
                    onClick={() => onCancel(id)}
                    title="Cancels pending/accepted invites"
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

export default InvitesTable;
