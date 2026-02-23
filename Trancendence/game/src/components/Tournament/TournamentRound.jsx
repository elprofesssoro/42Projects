import React from "react";
import TournamentMatch from "./TournamentMatch";

const TournamentRound = ({ title, matches, onUpdated, actionsEnabled }) => {
  if (!matches.length)
      return null;

  return (
    <div className="tournamentRound">
      <h3 className="tournamentRoundTitle">{title}</h3>
      <div className="tMatchesList">
        {matches.map((m) => (
          <TournamentMatch
            key={m.id}
            {...m}
            onUpdated={onUpdated}
            actionsEnabled={actionsEnabled}   
          />
        ))}
      </div>
    </div>
  );
};

export default TournamentRound;
