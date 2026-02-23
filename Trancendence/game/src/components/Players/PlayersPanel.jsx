import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "../utils/AuthContext";
import { api } from "../../api/api";
import { useApi } from "../utils/useApi";
import Avatar from "../Elements/Avatar";
import { usePresence } from "../utils/PresenceContext";
import { getSocket } from "../../api/socketClient";

const PlayersPanel = ({
  opponentId = null,
  onSelectOpponent,
  invites = [],
  refreshInvites,
  onInviteSent,
  onStatusChange,
}) => {
  const { user, token } = useAuth();
  const me = user?.id;
  const [profiles, setProfiles] = useState([]);
  const [actionError, setActionError] = useState("");
  const [recentRejectedByOpponent, setRecentRejectedByOpponent] = useState({});
  const rejectTimersRef = useRef({});
  const dismissedRejectedInviteIdsRef = useRef(new Set());
  const apiSafe = useApi();
  usePresence();

  const DISMISSED_KEY = useMemo(() => {
    return me ? `pong_dismissed_rejected_invites_v1_${me}` : null;
  }, [me]);

  useEffect(() => {
    if (!DISMISSED_KEY) return;

    try {
      const raw = localStorage.getItem(DISMISSED_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      dismissedRejectedInviteIdsRef.current = new Set(
        Array.isArray(arr) ? arr.map((n) => Number(n)).filter(Boolean) : []
      );
    } catch {
      dismissedRejectedInviteIdsRef.current = new Set();
    }
  }, [DISMISSED_KEY]);

  const persistDismissed = useCallback(() => {
    if (!DISMISSED_KEY) return;
    try {
      const MAX = 200;
      const list = Array.from(dismissedRejectedInviteIdsRef.current)
        .map((n) => Number(n))
        .filter(Boolean)
        .slice(-MAX);

      dismissedRejectedInviteIdsRef.current = new Set(list);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(list));
    } catch {}
  }, [DISMISSED_KEY]);

  const loadUsers = useCallback(async () => {
    if (!token) return;

    const data = await apiSafe("/api/users", { token });
    if (!data) return;

    const list = Array.isArray(data) ? data : data?.users || [];
    setProfiles(
      list.map((u) => ({
        ...u,
        available: u.available ?? u.is_available ?? false,
      }))
    );
  }, [apiSafe, token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    if (!token) return;

    const s = getSocket(token);
    if (!s) return;

    const refreshAll = () => {
      loadUsers();
      if (typeof refreshInvites === "function") refreshInvites();
    };

    const onPresence = () => loadUsers();

    const onInvitesUpdate = () => {
      if (typeof refreshInvites === "function") refreshInvites();
    };

    s.on("presence:update", onPresence);

    s.on("invites:update", onInvitesUpdate);
    s.on("invite:update", onInvitesUpdate);
    s.on("invite:updated", onInvitesUpdate);
    s.on("invites:updated", onInvitesUpdate);
    s.on("invitation:update", onInvitesUpdate);
    s.on("invitation:updated", onInvitesUpdate);

    s.on("connect", refreshAll);
    s.on("reconnect", refreshAll);

    return () => {
      s.off("presence:update", onPresence);

      s.off("invites:update", onInvitesUpdate);
      s.off("invite:update", onInvitesUpdate);
      s.off("invite:updated", onInvitesUpdate);
      s.off("invites:updated", onInvitesUpdate);
      s.off("invitation:update", onInvitesUpdate);
      s.off("invitation:updated", onInvitesUpdate);

      s.off("connect", refreshAll);
      s.off("reconnect", refreshAll);
    };
  }, [token, loadUsers, refreshInvites]);

  useEffect(() => {
    if (!token) return;

    const id = setInterval(() => {
      loadUsers();
      if (typeof refreshInvites === "function") refreshInvites();
    }, 5000);

    return () => clearInterval(id);
  }, [token, loadUsers, refreshInvites]);

  const currentProfile = useMemo(() => {
    return profiles.find((p) => String(p.id) === String(me)) || null;
  }, [profiles, me]);

  const availableOpponents = useMemo(() => {
    return profiles
      .filter((p) => String(p.id) !== String(me))
      .filter((p) => p.available === true);
  }, [profiles, me]);

  const opponentProfile = useMemo(() => {
    if (!opponentId) return null;
    return profiles.find((p) => String(p.id) === String(opponentId)) || null;
  }, [profiles, opponentId]);

  const latestBetweenSelected = useMemo(() => {
    if (!me || !opponentId) return null;

    const between = invites.filter(
      (i) =>
        (Number(i.fromUserId) === Number(me) &&
          Number(i.toUserId) === Number(opponentId)) ||
        (Number(i.fromUserId) === Number(opponentId) &&
          Number(i.toUserId) === Number(me))
    );

    if (!between.length) return null;
    return between.sort((a, b) => Number(b.id) - Number(a.id))[0];
  }, [invites, me, opponentId]);

  const outgoingPendingToSelected = useMemo(() => {
    if (!me || !opponentId) return null;
    return (
      invites.find(
        (i) =>
          i.status === "pending" &&
          Number(i.fromUserId) === Number(me) &&
          Number(i.toUserId) === Number(opponentId)
      ) || null
    );
  }, [invites, me, opponentId]);

  const incomingPendingFromSelected = useMemo(() => {
    if (!me || !opponentId) return null;
    return (
      invites.find(
        (i) =>
          i.status === "pending" &&
          Number(i.fromUserId) === Number(opponentId) &&
          Number(i.toUserId) === Number(me)
      ) || null
    );
  }, [invites, me, opponentId]);

  useEffect(() => {
    if (!opponentId || !latestBetweenSelected) return;
    const key = String(opponentId);

    if (latestBetweenSelected.status !== "rejected") {
      if (rejectTimersRef.current[key]) {
        clearTimeout(rejectTimersRef.current[key]);
        rejectTimersRef.current[key] = null;
      }

      setRecentRejectedByOpponent((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }

    const latestId = Number(latestBetweenSelected.id);

    if (dismissedRejectedInviteIdsRef.current.has(latestId)) {
      if (rejectTimersRef.current[key]) {
        clearTimeout(rejectTimersRef.current[key]);
        rejectTimersRef.current[key] = null;
      }
      setRecentRejectedByOpponent((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return;
    }

    setRecentRejectedByOpponent((prev) => {
      const existing = prev[key];
      if (existing && Number(existing.inviteId) === latestId) return prev;
      return {
        ...prev,
        [key]: { inviteId: latestId, at: Date.now() },
      };
    });

    if (rejectTimersRef.current[key]) {
      clearTimeout(rejectTimersRef.current[key]);
    }

    rejectTimersRef.current[key] = setTimeout(() => {
      dismissedRejectedInviteIdsRef.current.add(latestId);
      persistDismissed();

      setRecentRejectedByOpponent((prev) => {
        const cur = prev[key];
        if (!cur || Number(cur.inviteId) !== latestId) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });

      rejectTimersRef.current[key] = null;
    }, 5000);

    return () => {
      if (rejectTimersRef.current[key]) {
        clearTimeout(rejectTimersRef.current[key]);
        rejectTimersRef.current[key] = null;
      }
    };
  }, [opponentId, latestBetweenSelected, persistDismissed]);

  useEffect(() => {
    return () => {
      Object.values(rejectTimersRef.current).forEach((t) => t && clearTimeout(t));
      rejectTimersRef.current = {};
    };
  }, []);

  const handleSelect = (e) => {
    setActionError("");
    const value = e.target.value;
    const nextId = value ? Number(value) : null;
    if (typeof onSelectOpponent === "function") onSelectOpponent(nextId);
  };

  const sendInvite = async () => {
    setActionError("");
    if (!token || !opponentId) return;
    if (outgoingPendingToSelected) return;

    try {
      await api("/api/invites", {
        method: "POST",
        token,
        body: { toUserId: Number(opponentId) },
      });

      setRecentRejectedByOpponent((prev) => {
        const next = { ...prev };
        delete next[String(opponentId)];
        return next;
      });

      const key = String(opponentId);
      if (rejectTimersRef.current[key]) {
        clearTimeout(rejectTimersRef.current[key]);
        rejectTimersRef.current[key] = null;
      }

      if (typeof onInviteSent === "function") onInviteSent();
      if (typeof refreshInvites === "function") await refreshInvites();
    } catch (e) {
      console.error(e);
      setActionError(String(e?.message || "Invite failed"));
    }
  };

  const cancelInvite = async (inviteId) => {
    setActionError("");
    if (!token || !inviteId) return;

    try {
      const res = await apiSafe(`/api/invites/${Number(inviteId)}/cancel`, {
        method: "POST",
        token,
      });

      if (!res) return;
      if (typeof refreshInvites === "function") {
        await refreshInvites();
      }
      if (typeof onSelectOpponent === "function") {
        onSelectOpponent(null);
      }
    } catch (e) {
      console.error(e);
      setActionError(String(e?.message || "Cancel failed"));
    }
  };

  const inPanelStatus = useMemo(() => {
    if (!opponentId) return "none";

    if (incomingPendingFromSelected) return "incoming-pending";
    if (outgoingPendingToSelected) return "outgoing-pending";
    if (latestBetweenSelected?.status === "accepted") return "accepted";
    if (latestBetweenSelected?.status === "rejected") {
      const rec = recentRejectedByOpponent[String(opponentId)];
      if (rec && Number(rec.inviteId) === Number(latestBetweenSelected.id)) {
        if (Date.now() - Number(rec.at) < 10000) return "rejected";
      }
      return "invite";
    }
    return "invite";
  }, [
    opponentId,
    incomingPendingFromSelected,
    outgoingPendingToSelected,
    latestBetweenSelected,
    recentRejectedByOpponent,
  ]);

  useEffect(() => {
    if (typeof onStatusChange === "function") {
      onStatusChange(inPanelStatus);
    }
  }, [inPanelStatus, onStatusChange]);

  const canHostCancel = useMemo(() => {
    if (!latestBetweenSelected) return false;
    const isHost = Number(latestBetweenSelected.fromUserId) === Number(me);
    const cancellable =
      latestBetweenSelected.status === "pending" ||
      latestBetweenSelected.status === "accepted";
    return isHost && cancellable;
  }, [latestBetweenSelected, me]);

  return (
    <div>
      <div className="selectOpp">
        <label htmlFor="opponentSelect">Select opponent: </label>{" "}
        <select
          id="opponentSelect"
          value={opponentId ?? ""}
          onChange={handleSelect}
          disabled={!me}
        >
          <option value="">View Available</option>
          {availableOpponents.map((p) => (
            <option key={p.id} value={p.id}>
              {p.p_name}
            </option>
          ))}
        </select>
      </div>

      <div className="pCon">
        <div className="pPlayers">
          {currentProfile ? (
            <>
              <div>
                <Avatar
                  image={currentProfile.image}
                  alt={currentProfile.p_name}
                  classN={"pImg"}
                />
              </div>
              <div className="pName">{currentProfile.p_name}</div>

              {canHostCancel ? (
                <button
                  type="button"
                  onClick={() => cancelInvite(latestBetweenSelected.id)}
                  className="pendingOpp"
                  style={{ marginLeft: 10 }}
                  title="Cancel this invite"
                >
                  Cancel
                </button>
              ) : null}
            </>
          ) : (
            <div>Loading current player…</div>
          )}
        </div>
        <div>|</div>
        <div className="pPlayers">
          {opponentProfile ? (
            <>
              <div className="pName">{opponentProfile.p_name}</div>
              <div>
                <Avatar
                  image={opponentProfile.image}
                  alt={opponentProfile.p_name}
                  classN={"pImg"}
                />
              </div>
              <div>
                {inPanelStatus === "incoming-pending" ? (
                  <button type="button" disabled className="pendingOpp">
                    Pending
                  </button>
                ) : inPanelStatus === "outgoing-pending" ? (
                  <button type="button" disabled className="pendingOpp">
                    Pending
                  </button>
                ) : inPanelStatus === "accepted" ? (
                  <button type="button" disabled className="pendingOpp">
                    Accepted
                  </button>
                ) : inPanelStatus === "rejected" ? (
                  <button type="button" disabled className="pendingOpp">
                    Rejected
                  </button>
                ) : (
                  <button type="button" onClick={sendInvite} className="pendingOpp">
                    Invite
                  </button>
                )}
              </div>
            </>
          ) : (
            <div>Waiting for opponent…</div>
          )}
        </div>
      </div>

      {actionError ? (
        <div style={{ marginTop: 8, fontSize: 13 }}>{actionError}</div>
      ) : null}
    </div>
  );
};

export default PlayersPanel;
