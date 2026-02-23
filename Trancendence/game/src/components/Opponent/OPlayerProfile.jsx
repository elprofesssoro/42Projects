import React from "react";
import "../Players/Profile.css";
import Avatar from "../Elements/Avatar.jsx"


const OPlayerProfile = ({ p_name, image, alt, ranking = null }) => {

  return (
    <div>
      <div className="playerHeader">
        <Avatar image={image} alt={alt} classN={"plImage"}/>
        <div className="profileName-header">
          <h2>{p_name}</h2>
          {ranking ? (
            <h4 className="profileRank">Rank: {ranking}</h4>
          ) : null}
        </div>
      </div>
        <div className="style-fix">-</div>
    </div>
  );
};

export default OPlayerProfile;
