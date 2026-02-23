import React, { useMemo } from "react";
import "../../pages/Results.css";
import { useAuth } from "../utils/AuthContext";
import { useFriends } from "../utils/FriendsContext";
import { FaBell } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";
import { MdConnectWithoutContact } from "react-icons/md";
import { MdPending } from "react-icons/md";
import { FaUserFriends } from "react-icons/fa";
import Avatar from "../Elements/Avatar";



const SPlayerHome = ({
  id,
  image,
  alt,
  name,
  country,
  number_games,
  points,
  ranking,
}) => {
  const { user } = useAuth();
  const meId = user?.id;

  const {
    isFriend,
    friendRequestState,
    sendFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
  } = useFriends();

  const isMe = useMemo(() => String(meId) === String(id), [meId, id]);

  const alreadyFriend = useMemo(
    () => (!isMe ? isFriend(id) : false),
    [isMe, id, isFriend]
  );

  const reqInfo = useMemo(() => {
    if (isMe)
        return { state: "none", request: null };
    return friendRequestState(id);
  }, [isMe, id, friendRequestState]);


  return (
    <div className="PlayerHomeContainer">
      {reqInfo.state === "incoming" && (
        <FaBell
          className="incomingRequestIcon"
          title="Friend request received"
        />
      )}

      <div className="PlayerHomeContainer_top">
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
      <div className="divider"></div>
      <div className="friendConnect">
        {isMe ? (
          <span>You</span>
        ) : alreadyFriend ? (
          <span className="connectedRemove">
            <div className="checkIcon" title="Connected">
              <FaUserFriends />{" "}
            </div>
            <button
              type="button"
              className="friendRemove"
              onClick={() => removeFriend(id)}
              title="Remove"
            >
              <IoMdCloseCircle className="closeIcon" title="Disconect Friend"/>
            </button>
          </span>
        ) : reqInfo.state === "outgoing" ? (
          <span className="connectedRemove">
            <div  title="Pending">
              <MdPending className="pendingIcon" />
            </div>
            <button
              type="button"
              className="friendRemove"
              onClick={() => cancelFriendRequest(reqInfo.request?.id)}
            >
              <IoMdCloseCircle className="closeIcon" title="Cancel"/>
            </button>
          </span>
        ) : reqInfo.state === "incoming" ? (
          <span className="connectedRemove">
            <button
              type="button"
              className="friendRemove"
              onClick={() => acceptFriendRequest(reqInfo.request?.id)}
              title="Accept"
            >
             <div className="checkIcon" title="Accept">
               ✅{" "}
            </div>
            </button>{" "}
            <button
              type="button"
              className="friendRemove"
              onClick={() => rejectFriendRequest(reqInfo.request?.id)}
            >
              <IoMdCloseCircle className="closeIcon" title="Reject"/>
            </button>
          </span>
        ) : (
          <button
            type="button"
            className="friendRemove"
            onClick={() => sendFriendRequest(id)}
            title="Connect"
          >
            <MdConnectWithoutContact className="connectIcon"/>
          </button>
        )}
      </div>
    </div>
  );
};

export default SPlayerHome;
