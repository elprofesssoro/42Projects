import React from "react";
import "../../pages/Game.css"

const IncomingInvites = ({
  incomingInvites = [],
  nameById,
  onAccept,
  onReject,
  style,
}) => {
  if (!incomingInvites || incomingInvites.length === 0)
      return null;

  return (
    <div style={{ marginTop: 10, ...(style || {}) }}>
      {incomingInvites.map((inv) => (
        <div key={inv.id}>
          <div className="invitationAccept">
            <div>
              Invitation from: <strong>{nameById(inv.fromUserId)}</strong>
            </div>
            <button type="button" onClick={() => onAccept(inv.id)} className="invitationAcceptBtn">
              Accept
            </button>
            <button type="button" onClick={() => onReject(inv.id)} className="invitationAcceptBtn">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IncomingInvites;
