import React from "react";
import "../../pages/Results.css";
import Avatar from "../Elements/Avatar";


const SPlayer = ({
  image,
  alt,
  name,
  country,
  number_games,
  points,
  ranking,
}) => {
  
  return (
    <div className="playerContainer">
      <div className="playerC">
        <Avatar image={image} alt={alt} classN={"rImage"}/>
      </div>
      <div className="playerC">
        <p>{name}</p>
      </div>
      <div className="playerC">
        <p>{country}</p>
      </div>
      <div className="playerC">
        <p>{number_games}</p>
      </div>
      <div className="playerC">
        <p>{points}</p>
      </div>
      <div className="playerC">
        <p>{ranking}</p>
      </div>
    </div>
  );
};

export default SPlayer;
