import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../Elements/Avatar";


const SingleFriend = ({ id, image, alt, f_name }) => {
  const navigate = useNavigate();
  

  return (
    <div
      className="friendContainer"
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/opponent/${id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ")
          navigate(`/opponent/${id}`);
      }}
      style={{ cursor: "pointer" }}
      title="View profile"
    >
      <div>
        <Avatar image={image} alt={alt} classN={"friendImage"}/>
      </div>
      <h4>{f_name}</h4>
      <p>...</p>
    </div>
  );
};

export default SingleFriend;
