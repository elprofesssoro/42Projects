import React from "react";
import "./Profile.css";
import Avatar from "../Elements/Avatar";



const PlayerProfile = ({ p_name, image, alt, ranking, onEdit }) => {
 
  return (
    <div>
      <div className="playerHeader">
        <Avatar image={image} alt={alt} classN={"plImage"}/>
        <div className="profileName-header">
          <h2>{p_name}</h2>
          <h4 className="profileRank">Rank: {ranking}</h4>

          {typeof onEdit === "function" && (
            <button
              type="button"
              className="editProfile-btn"
              onClick={onEdit}
            >
              Edit profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile;
