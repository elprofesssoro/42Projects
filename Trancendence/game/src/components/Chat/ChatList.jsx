import React, { useEffect, useMemo, useState, useCallback } from "react";
import ChatListProfile from "./ChatListProfile";
import ChatThread from "./ChatThread";
import "./ChatList.css";
import { FaWindowClose } from "react-icons/fa";
import { useAuth } from "../utils/AuthContext";
import { useFriends } from "../utils/FriendsContext";
import { getSocket } from "../../api/socketClient";
import { useApi } from "../utils/useApi";
import { usePresence } from "../utils/PresenceContext";
import { normalizeUsers } from "../utils/Helpers";



const ChatList = ({ handleChat }) => {
  const { user, token } = useAuth();
  const myId = user?.id;

  const { friendIds, refreshFriends } = useFriends();
  const [profiles, setProfiles] = useState([]);
  const [unreadMap, setUnreadMap] = useState({});
  const [activeUserId, setActiveUserId] = useState(null);

  const apiSafe = useApi();
  const { isOnline } = usePresence();

  const loadUsers = useCallback(async () => {
    if (!token) return;

    const usersData = await apiSafe("/api/users", { token });
    if (!usersData) return;

    const list = normalizeUsers(usersData).map((u) => ({
      ...u,
      available: u.available ?? u.is_available ?? false,
    }));

    setProfiles(list);
  }, [token, apiSafe]);

  const loadUnread = useCallback(async () => {
    if (!token) {
      setUnreadMap({});
      return;
    }

    const data = await apiSafe("/api/messages/unread", { token });
    if (!data) return;

    setUnreadMap(data?.counts && typeof data.counts === "object" ? data.counts : {});
  }, [token, apiSafe]);

  useEffect(() => {
    if (!token) return;
    loadUsers();
  }, [token, loadUsers]);

  useEffect(() => {
    if (!token || !myId) return;
    refreshFriends();
    loadUnread();
  }, [token, myId, refreshFriends, loadUnread]);

  useEffect(() => {
    const s = getSocket(token);
    if (!s) return;

    const onChatUpdate = () => {
      loadUnread();
      if (!activeUserId) refreshFriends();
    };

    s.on("chat:update", onChatUpdate);
    return () => s.off("chat:update", onChatUpdate);
  }, [token, activeUserId, refreshFriends, loadUnread]);

  useEffect(() => {
    const s = getSocket(token);
    if (!s) return;

    const onPresence = () => {
      loadUsers();
    };

    s.on("presence:update", onPresence);
    return () => {
      s.off("presence:update", onPresence);
    };
  }, [token, loadUsers]);

  useEffect(() => {
    if (!token) return;
    const id = setInterval(() => loadUsers(), 60000);
    return () => clearInterval(id);
  }, [token, loadUsers]);

  const friendsToChatWith = useMemo(() => {
    if (!myId) return [];
    return profiles
      .filter((p) => String(p.id) !== String(myId))
      .filter((p) => friendIds.some((id) => String(id) === String(p.id)));
  }, [profiles, friendIds, myId]);

  const activeUser = useMemo(() => {
    if (!activeUserId) return null;
    return profiles.find((p) => String(p.id) === String(activeUserId)) || null;
  }, [profiles, activeUserId]);

  const getUnreadForUser = useCallback(
    (uid) => {
      if (!uid) return 0;
      if (activeUserId && String(uid) === String(activeUserId)) return 0;
      return Number(unreadMap?.[uid] || 0);
    },
    [unreadMap, activeUserId]
  );

  const openThread = useCallback((uid) => {
    setActiveUserId(uid);
    setUnreadMap((prev) => {
      const next = { ...(prev || {}) };
      delete next[uid];
      return next;
    });
  }, []);

  return (
    <div className="chatList">
      <div className="clBtn">
        <FaWindowClose onClick={handleChat} />
      </div>

      {friendsToChatWith.map((player) => (
        <div key={player.id} onClick={() => openThread(player.id)}>
          <ChatListProfile
            {...player}
            unread={getUnreadForUser(player.id)}
           isOnline={player?.available === true}
          />
        </div>
      ))}

      {activeUser ? (
        <ChatThread
          otherUser={activeUser}
          onClose={() => setActiveUserId(null)}
          onRead={() => loadUnread()}
        />
      ) : null}
    </div>
  );
};

export default ChatList;
