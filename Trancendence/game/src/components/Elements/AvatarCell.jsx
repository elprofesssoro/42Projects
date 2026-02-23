import React from "react";
import Avatar from "./Avatar";

const AvatarCell = ({ image, name }) => {
  return (
    <div className="avatar-cell">
      <Avatar image={image} alt={name} classN={"uImg"}/>
      <p className="avatar-name">{name}</p>
    </div>
  );
};

export default AvatarCell;
