import React, { useMemo } from "react";
import { FaRocketchat } from "react-icons/fa";
import "../Matches.css";
import "./ChatList.css";
import { resolveImageUrl } from "../utils/imageUrl";
import Avatar from "../Elements/Avatar";


const ChatListProfile = ({ image, alt, p_name, unread = 0, isOnline = false}) => {
  const imgSrc = useMemo(() => resolveImageUrl(image), [image]);

  return (
    <div className="chatRow">
      <Avatar image={imgSrc} alt={alt} classN={"imgChat"}/>
      <div>
        <h6>
          <span>{p_name}</span>
          {unread > 0 ? (
            <span className="msgNot"
              title={`${unread} unread`}
            >
              {unread > 99 ? "99+" : unread}
            </span>
          ) : null}
        </h6>
      </div>
      <div>
        <p>
            <FaRocketchat style={isOnline ? { color: "#025809ff" } : undefined} />
        </p>
      </div>
    </div>
  );
};

export default ChatListProfile;


