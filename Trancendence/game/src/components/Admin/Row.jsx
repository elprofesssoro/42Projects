import React from "react";


const Row = ({ label, value }) => (
  <div className="matchDetails-row">
    <div className="matchDetails-row_label">{label}</div>
    <div className="matchDetails-row_value">{value}</div>
  </div>
);

export default Row