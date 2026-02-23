import React, { useState } from "react";
import { IoMdChatbubbles } from "react-icons/io";
import "./Footer.css";
import ChatList from "../Chat/ChatList";

const Footer = ({ profileId }) => {

  const [chat, setChat] = useState(false);
  const handleChat = () => setChat(!chat);

  return (
    <div>
      <div className="footer">
        <div className="chatBox" onClick={handleChat}>
          <h6>Chat</h6>
          <IoMdChatbubbles />
        </div>
      </div>
      {
        chat ? 
        <ChatList handleChat={handleChat} profileId={profileId} /> 
        : null
      }
    </div>
  );
};

export default Footer;
