import React from "react";
import "../History/History.css";
import "../Matches.css";
import Avatar from "../Elements/Avatar";



const Match = ({
  p_image,
  alt,
  p_name,
  p_score,
  date,
  g_score,
  g_image,
  g_name,
  p_g_1,
  p_g_2,
  p_g_3,
  p_g_4,
  o_g_1,
  o_g_2,
  o_g_3,
  o_g_4,
}) => {
  return (
    <div className="match">
      <div className="player">
        <div>
          <Avatar image={p_image} alt={alt} classN={"imgM"}/>
        </div>
        <div className="pointsName">
          <div className="pName">
            <h4>{p_name}</h4>
          </div>
          <div className="Points">
            <p>/{p_g_1} /</p>
            <p>{p_g_2} /</p>
            <p>{p_g_3} /</p>
            <p>{p_g_4}</p>
          </div>
        </div>
        <h3>{p_score}</h3>
      </div>
      <div>
        <div className="date">
          <h6>{date}</h6>
        </div>
      </div>
      <div className="player">
        <h3>{g_score}</h3>
        <div className="pointsName">
          <div className="pName">
            <h4>{g_name}</h4>
          </div>
          <div className="Points">
            <p>/{o_g_1} /</p>
            <p>{o_g_2} /</p>
            <p>{o_g_3} /</p>
            <p>{o_g_4}</p>
          </div>
        </div>
        <div>
          <Avatar image={g_image} alt={alt} classN={"imgM"}/>
        </div>
      </div>
    </div>
  );
};

export default Match;
