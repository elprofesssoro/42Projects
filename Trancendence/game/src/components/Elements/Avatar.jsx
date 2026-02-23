import React from "react";
import { API_BASE } from "../../api/api"; 
import { resolveImageUrl } from "../utils/imageUrl.jsx"



const Avatar = ({ image, alt = "avatar", classN}) => {
  const src = resolveImageUrl(image);

  return image ?(
    <img
      className={classN}
      src={src}
      alt={alt}
      onError={(e) => {
        e.currentTarget.src = "/img/player_default.png";
      }}
    />
  ) : (
    <span className="tImgPlaceholder">-</span>
  );
};

export default Avatar;
