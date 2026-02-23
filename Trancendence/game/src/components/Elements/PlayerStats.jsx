import React from "react";
import "./Elements.css"

const PlayerStats = ({
  t_matches = 0,
  w_matches = 0,
  l_matches = 0,
  t_games = 0,
  w_games = 0,
  l_games = 0,
  t_points = 0,
  m_points = 0,
  g_points = 0,
}) => {
  return (
    <div className="stats">
      {/* <h2 className="sectionTitle">Stats</h2> */}

      <div className="statsContainer">
        <div className="statsColumn" >
        <div>
          <h4 className="statsHeader">Total Matches</h4>
          <p>{t_matches}</p>
        </div>
        <div>
          <h5>Matches Won</h5>
          <p>{w_matches}</p>
        </div>
        <div>
          <h5>Matches Lost</h5>
          <p>{l_matches}</p>
        </div>
        </div>
        <div className="statsDivider"></div>
        <div className="statsColumn">
        <div>
          <h4 className="statsHeader">Total Games</h4>
          <p>{t_games}</p>
        </div>
        <div>
          <h5>Games Won</h5>
          <p>{w_games}</p>
        </div>
        <div>
          <h5>Games Lost</h5>
          <p>{l_games}</p>
        </div>
        </div>
        <div className="statsDivider"></div>
        <div className="statsColumn">
        <div>
          <h4 className="statsHeader">Total Points</h4>
          <p>{t_points}</p>
        </div>
        <div>
          <h5>Match Points</h5>
          <p>{m_points}</p>
        </div>
        <div>
          <h5>Game Points</h5>
          <p>{g_points}</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
