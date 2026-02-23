import React from "react";
import AvatarCell from "../Elements/AvatarCell";


const prettyMeta = (meta) => {
  try {
    if (!meta)
        return "—";
    const s = JSON.stringify(meta);
    return s.length > 120 ? s.slice(0, 120) + "…" : s;
  } catch {
    return "—";
  }
};

const AuditTable = ({ rows = [], loading }) => {
  return (
    <div >
      <table className="usersTable">
        <thead>
          <tr className="tableHeader">
            <th>Time</th>
            <th>Admin</th>
            <th>Action</th>
            <th>Target</th>
            <th>Meta</th>
            <th>IP</th>
          </tr>
        </thead>

        <tbody>
          {!loading && rows.length === 0 && (
            <tr className="userContainer">
              <td colSpan={6} style={{ padding: 14, opacity: 0.8 }}>
                No audit events.
              </td>
            </tr>
          )}

          {rows.map((r) => {
            const when = r.created_at ? new Date(r.created_at).toLocaleString() : "—";
            const target = r.target_type ? `${r.target_type}:${r.target_id ?? "—"}` : "—";

            return (
              <tr key={String(r.id)} className="userContainer2">
                <td>{when}</td>
                <td >
                  <AvatarCell
                    image={r.admin_image}
                    name={r.admin_name}
                    email={r.admin_email}
                  />
                </td>
                <td>{r.action}</td>
                <td>{target}</td>
                <td className="metaCell">
                <div
                  className="metaScroll"
                  title={JSON.stringify(r.meta || {})}
                >
                  {prettyMeta(r.meta)}
                </div>
              </td>
                <td>{r.ip || "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AuditTable;
