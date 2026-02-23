import React from "react";
import Avatar from "../Elements/Avatar";

const ActionsSelect = ({ options, onAction }) => {
  return (
    <select
      className="inpA"
      defaultValue=""
      onChange={(e) => {
        const value = e.target.value;
        e.target.value = "";
        if (!value)
            return;
        onAction(value);
      }}
      style={{ minWidth: 160 }}
      aria-label="User actions"
    >
      <option value="" disabled>
        Actions…
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

const UsersTable = ({
  rows,
  loading,
  onToggleRole,
  onToggleActive,
  onForceOffline,
  onResetState,
  onDeleteUser,
}) => {
  return (
    <div>
      <table className="usersTable">
        <thead className="tableHeader">
          <tr>
            <th>ID</th>
            <th>Avatar</th>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Active</th>
            <th>Available</th>
            <th>Last seen</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {!loading && rows.length === 0 && (
            <tr className="usersContainer">
              <td colSpan={9} style={{ padding: 14, opacity: 0.8 }}>
                No users found.
              </td>
            </tr>
          )}

          {rows.map((u) => {
            const id = u.id;
            const email = u.email;
            const name =
              u.p_name ||
              `${u.firstName || ""} ${u.lastName || ""}`.trim() ||
              "—";

            const isAdmin = u.role === "admin";
            const isActive = !!u.is_active;
            const isAvailable = !!u.is_available;
            const lastSeen = u.last_seen;
            const image = u.image;

            const options = [
              { value: "toggleRole", label: isAdmin ? "Remove admin" : "Make admin" },
              { value: "toggleActive", label: "Force logout" },
              { value: "forceOffline", label: "Force offline" },
              { value: "reset", label: "Reset state" },
              { value: "delete", label: "Delete user" },
            ];

            return (
              <tr key={id} className="userContainer">
                <td>{id}</td>
                <td>
                  <Avatar image={image} name={name} classN={"uImg"} />
                </td>
                <td>{email}</td>
                <td>{name}</td>
                <td>{isAdmin ? "admin" : "user"}</td>
                <td>{isActive ? "yes" : "no"}</td>
                <td>{isAvailable ? "yes" : "no"}</td>
                <td>{lastSeen ? new Date(lastSeen).toLocaleString() : "—"}</td>
                <td>
                  <ActionsSelect
                    options={options}
                    onAction={(action) => {
                      if (action === "toggleRole") onToggleRole({ id, isAdmin });
                      if (action === "toggleActive") onToggleActive({ id, isActive });
                      if (action === "forceOffline") onForceOffline({ id });
                      if (action === "reset") onResetState({ id });
                      if (action === "delete") onDeleteUser({ id, email });
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

export default UsersTable;
