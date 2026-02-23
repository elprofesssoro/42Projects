import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./AuthContext";
import { getSocket } from "../../api/socketClient";
import { useApi } from "./useApi";

const FriendsContext = createContext(null);

export const FriendsProvider = ({ children }) => {
  const { token, isAuthenticated, user } = useAuth();
  const meId = user?.id;

  const apiSafe = useApi();

  const [friendIds, setFriendIds] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshFriends = useCallback(async () => {
    if (!isAuthenticated || !token || !meId) {
      setFriendIds([]);
      setIncoming([]);
      setOutgoing([]);
      return;
    }

    setLoading(true);
    try {
      const data = await apiSafe("/api/friends/me", { token });
      if (!data)
          return;

      const reqs = await apiSafe("/api/friends/requests", { token });
      if (!reqs)
          return;

      setFriendIds(Array.isArray(data?.friendIds) ? data.friendIds : []);
      setIncoming(Array.isArray(reqs?.incoming) ? reqs.incoming : []);
      setOutgoing(Array.isArray(reqs?.outgoing) ? reqs.outgoing : []);
    } finally {
      setLoading(false);
    }
  }, [apiSafe, isAuthenticated, token, meId]);

  useEffect(() => {
    refreshFriends();
  }, [refreshFriends]);

  useEffect(() => {
    const s = getSocket(token);
    if (!s)
        return;

    const onUpdate = () => {
      refreshFriends();
    };

    s.on("friends:update", onUpdate);
    return () => {
      s.off("friends:update", onUpdate);
    };
  }, [refreshFriends, token]);

  const isFriend = useCallback(
    (id) => {
      if (!id)
          return false;
      return friendIds.some((x) => String(x) === String(id));
    },
    [friendIds]
  );

  const friendRequestState = useCallback(
    (otherUserId) => {
      const uid = Number(otherUserId);
      if (!uid || !meId)
          return { state: "none", request: null };

      const out = outgoing.find((r) => Number(r.toUserId) === uid);
      if (out)
          return { state: "outgoing", request: out };

      const inc = incoming.find((r) => Number(r.fromUserId) === uid);
      if (inc)
          return { state: "incoming", request: inc };

      return { state: "none", request: null };
    },
    [outgoing, incoming, meId]
  );

  const sendFriendRequest = useCallback(
    async (toUserId) => {
      if (!token || !meId || !toUserId)
          return;

      const res = await apiSafe("/api/friends/requests", {
        method: "POST",
        token,
        body: { toUserId: Number(toUserId) },
      });

      if (!res)
          return;
      await refreshFriends();
    },
    [apiSafe, token, meId, refreshFriends]
  );

  const cancelFriendRequest = useCallback(
    async (requestId) => {
      if (!token || !requestId)
          return;

      const res = await apiSafe(`/api/friends/requests/${Number(requestId)}/cancel`, {
        method: "POST",
        token,
      });

      if (!res)
          return;
      await refreshFriends();
    },
    [apiSafe, token, refreshFriends]
  );

  const acceptFriendRequest = useCallback(
    async (requestId) => {
      if (!token || !requestId)
          return;

      const res = await apiSafe(`/api/friends/requests/${Number(requestId)}/accept`, {
        method: "POST",
        token,
      });

      if (!res)
          return;
      await refreshFriends();
    },
    [apiSafe, token, refreshFriends]
  );

  const rejectFriendRequest = useCallback(
    async (requestId) => {
      if (!token || !requestId)
          return;

      const res = await apiSafe(`/api/friends/requests/${Number(requestId)}/reject`, {
        method: "POST",
        token,
      });

      if (!res) return;
      await refreshFriends();
    },
    [apiSafe, token, refreshFriends]
  );

  const removeFriend = useCallback(
    async (id) => {
      if (!token || !meId || !id)
          return;

      const res = await apiSafe(`/api/friends/${Number(id)}`, {
        method: "DELETE",
        token,
      });

      if (!res)
          return;
      await refreshFriends();
    },
    [apiSafe, token, meId, refreshFriends]
  );

  const value = useMemo(
    () => ({
      friendIds,
      incoming,
      outgoing,
      loading,
      refreshFriends,
      isFriend,
      friendRequestState,
      sendFriendRequest,
      cancelFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
    }),
    [
      friendIds,
      incoming,
      outgoing,
      loading,
      refreshFriends,
      isFriend,
      friendRequestState,
      sendFriendRequest,
      cancelFriendRequest,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
    ]
  );

  return (
    <FriendsContext.Provider value={value}>{children}</FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const ctx = useContext(FriendsContext);
  if (!ctx)
      throw new Error("useFriends must be used inside <FriendsProvider>");
  return ctx;
};
