import React from "react";
import { useOutletContext } from "react-router-dom";
import OpponentGameHistory from "../History/OpponentGameHistory";

const OpponentHistory = () => {
  const { opponentId } = useOutletContext();

  return (
    <div className="profileBody">
      <OpponentGameHistory opponentId={opponentId} limit={10} />
    </div>
  );
};

export default OpponentHistory;
