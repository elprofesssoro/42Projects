import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Hero from "../components/Hero";
import { HiOutlineChevronDoubleDown } from "react-icons/hi";
import Canvas from "../components/Canvas";
import PlayersPanel from "../components/Players/PlayersPanel";
import "./Game.css";
import { useAuth } from "../components/utils/AuthContext";
import ConfettiBurst from "../components/Elements/ConfettiBurst";
import { useApi } from "../components/utils/useApi"; 
import { useMatches } from "../components/utils/MatchesContext";
import OpponentVerifyModal from "../components/Modal/OpponentVerifyModal";
import IncomingInvites from "../components/Players/IncomingInvites";
import { getSocket } from "../api/socketClient";
import { API_BASE } from "../api/api"; 
import { resolveImageUrl } from "../components/utils/imageUrl";
import { padToN } from "../components/utils/Helpers";



const withCacheBust = (url) =>
  url ? `${url}${url.includes("?") ? "&" : "?"}v=${Date.now()}` : "";

const readMode = (modeKey) => {
  const v = localStorage.getItem(modeKey);
  return v === "running" || v === "paused" || v === "idle" ? v : "idle";
};


const safeReadJSON = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const PrivateGame = () => {
  const apiSafe = useApi(); 
  const { user, token, isAuthenticated } = useAuth();
  const currentUserId = user?.id || null;
  const { refreshMatches, addMatchOptimistic } = useMatches();

  
  const MODE_KEY = useMemo(
    () => (currentUserId ? `pong_mode_v1_${currentUserId}` : "pong_mode_v1_guest"),
    [currentUserId]
  );
  const SNAPSHOT_KEY = useMemo(
    () =>
      currentUserId ? `pong_snapshot_v1_${currentUserId}` : "pong_snapshot_v1_guest",
    [currentUserId]
  );
  const OPPONENT_KEY = useMemo(
    () =>
      currentUserId ? `pong_opponent_v1_${currentUserId}` : "pong_opponent_v1_guest",
    [currentUserId]
  );
  const SESSION_KEY = useMemo(
    () =>
      currentUserId ? `pong_session_v1_${currentUserId}` : "pong_session_v1_guest",
    [currentUserId]
  );

  
  const migratedRef = useRef(false);
  useEffect(() => {
    if (!currentUserId)
        return;
    if (migratedRef.current)
        return;
    migratedRef.current = true;

    const guestModeKey = "pong_mode_v1_guest";
    const guestSnapshotKey = "pong_snapshot_v1_guest";
    const guestOpponentKey = "pong_opponent_v1_guest";
    const guestSessionKey = "pong_session_v1_guest";

    const migrateIfMissing = (fromKey, toKey) => {
      if (localStorage.getItem(toKey) != null)
          return;
      const v = localStorage.getItem(fromKey);
      if (v != null)
          localStorage.setItem(toKey, v);
    };

    migrateIfMissing(guestModeKey, MODE_KEY);
    migrateIfMissing(guestSnapshotKey, SNAPSHOT_KEY);
    migrateIfMissing(guestOpponentKey, OPPONENT_KEY);
    migrateIfMissing(guestSessionKey, SESSION_KEY);

    // optional cleanup (safe)
    // localStorage.removeItem(guestModeKey);
    // localStorage.removeItem(guestSnapshotKey);
    // localStorage.removeItem(guestOpponentKey);
    // localStorage.removeItem(guestSessionKey);
  }, [currentUserId, MODE_KEY, SNAPSHOT_KEY, OPPONENT_KEY, SESSION_KEY]);

  const [mode, setMode] = useState(() => readMode(MODE_KEY));
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const [opponentId, setOpponentId] = useState(() => {
    const raw = localStorage.getItem(OPPONENT_KEY);
    return raw ? Number(raw) : null;
  });

  const [profiles, setProfiles] = useState([]);
  const [invites, setInvites] = useState([]);
  const [acceptedInviteId, setAcceptedInviteId] = useState(null);
  const [opponentVerified, setOpponentVerified] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [matchOver, setMatchOver] = useState(false);
  const [winnerSide, setWinnerSide] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const resetTimerRef = useRef(null);
  const [resetInSec, setResetInSec] = useState(null);
  const [systemMessages, setSystemMessages] = useState([]);
  const [panelStatus, setPanelStatus] = useState("none");

  
  useEffect(() => {
    const s = safeReadJSON(SESSION_KEY);
    if (s?.verified && s?.opponentId) {
      setOpponentId(Number(s.opponentId));
      setAcceptedInviteId(s?.inviteId ? Number(s.inviteId) : null);
      setOpponentVerified(true);
    }
  }, [SESSION_KEY]);

 
  useEffect(() => {
    (async () => {
      const data = await apiSafe("/api/users");
      if (!data)
          return; 
      const list = Array.isArray(data) ? data : data?.users || [];
      setProfiles(list);
    })().catch((e) => console.error("[PrivateGame] profiles load failed:", e));
  }, [apiSafe]);

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [MODE_KEY, mode]);

  useEffect(() => {
    if (opponentId == null)
        localStorage.removeItem(OPPONENT_KEY);
    else
        localStorage.setItem(OPPONENT_KEY, String(opponentId));
  }, [OPPONENT_KEY, opponentId]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        clearInterval(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };
  }, []);

  const hardResetMatchUI = useCallback(() => {
    localStorage.removeItem(SNAPSHOT_KEY);

    setMode("idle");
    setShowConfetti(false);
    setMatchOver(false);
    setWinnerSide(null);
    setFinalScore(null);
  }, [SNAPSHOT_KEY]);

  const resetToPickAnotherOpponent = useCallback(() => {
    localStorage.removeItem(SNAPSHOT_KEY);
    localStorage.removeItem(OPPONENT_KEY);
    localStorage.removeItem(SESSION_KEY);

    setMode("idle");
    setOpponentVerified(false);
    setAcceptedInviteId(null);
    setOpponentId(null);
    setResetInSec(null);
    setShowConfetti(false);
    setMatchOver(false);
    setWinnerSide(null);
    setFinalScore(null);
  }, [SNAPSHOT_KEY, OPPONENT_KEY, SESSION_KEY]);

  const scheduleResetToPickAnotherOpponent = (seconds = 60) => {
    if (resetTimerRef.current) {
      clearInterval(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    let remaining = seconds;
    setResetInSec(remaining);

    resetTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(resetTimerRef.current);
        resetTimerRef.current = null;
        resetToPickAnotherOpponent();
      } else {
        setResetInSec(remaining);
      }
    }, 1000);
  };

 
  useEffect(() => {
    setMode(readMode(MODE_KEY));
    const raw = localStorage.getItem(OPPONENT_KEY);
    setOpponentId(raw ? Number(raw) : null);

    const sess = safeReadJSON(SESSION_KEY);
    const hasSession = Boolean(sess?.verified && sess?.opponentId);
    const hasSnapshot = Boolean(localStorage.getItem(SNAPSHOT_KEY));

    if (!hasSession) {
      setAcceptedInviteId(null);
      setOpponentVerified(false);
    } else {
      setOpponentVerified(true);
      if (sess?.inviteId)
          setAcceptedInviteId(Number(sess.inviteId));
      if (sess?.opponentId)
          setOpponentId(Number(sess.opponentId));
    }

    setVerifyOpen(false);
    setVerifyError("");
    setPanelStatus("none");

    if (resetTimerRef.current) {
      clearInterval(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    setResetInSec(null);

    if (!(hasSession && hasSnapshot)) {
      hardResetMatchUI();
    }
  }, [MODE_KEY, OPPONENT_KEY, SESSION_KEY, SNAPSHOT_KEY, hardResetMatchUI]);

  const didInitOpponentRef = useRef(false);
  useEffect(() => {
    if (!didInitOpponentRef.current) {
      didInitOpponentRef.current = true;
      return;
    }

    const sess = safeReadJSON(SESSION_KEY);
    if (
      sess?.verified &&
      sess?.opponentId &&
      opponentId &&
      Number(sess.opponentId) === Number(opponentId)
    ) {
      setVerifyError("");
      return;
    }

    if (
      sess?.verified &&
      sess?.opponentId &&
      opponentId &&
      Number(sess.opponentId) !== Number(opponentId)
    ) {
      localStorage.removeItem(SESSION_KEY);
      setOpponentVerified(false);
      setAcceptedInviteId(null);
    }

    setVerifyError("");
    if (!opponentId)
        setPanelStatus("none");
    hardResetMatchUI();
  }, [opponentId, hardResetMatchUI, SESSION_KEY]);

  const refreshInvites = useCallback(async () => {
    if (!token)
        return;
    if (modeRef.current === "running")
        return;

    try {
      const data = await apiSafe("/api/invites", { token });
      if (!data)
          return;
      setInvites(data?.invites || []);
    } catch (e) {
      console.error("[PrivateGame] GET /api/invites failed:", e);
      setInvites([]);
    }
  }, [token, apiSafe]);

  useEffect(() => {
    if (!isAuthenticated || !token)
        return;
    if (mode === "running")
        return;
    refreshInvites();
  }, [isAuthenticated, token, mode, refreshInvites]);

    const refreshSystemMessages = useCallback(async () => {
    if (!token)
        return;
    if (modeRef.current === "running")
        return;

    try {
      const data = await apiSafe("/api/messages/system", { token });
      if (!data)
          return;
      setSystemMessages(data?.messages || []);
    } catch (e) {
      console.warn("[PrivateGame] refreshSystemMessages failed:", e);
    }
  }, [token, apiSafe]);

  useEffect(() => {
    if (!token) return;
    const s = getSocket(token);
    if (!s) return;

    const onInviteUpdate = () => {
      refreshInvites();
      refreshSystemMessages();
    };

    s.on("invite:update", onInviteUpdate);
    return () => {
      s.off("invite:update", onInviteUpdate);
    };
  }, [token, refreshInvites, refreshSystemMessages]);




  useEffect(() => {
    if (!isAuthenticated || !token)
        return;
    if (mode === "running")
        return;
    refreshSystemMessages();
  }, [isAuthenticated, token, mode, refreshSystemMessages]);

  useEffect(() => {
    if (!token)
        return;
    const s = getSocket(token);
    if (!s)
        return;

    const onSystemUpdate = () => {
      refreshSystemMessages();
    };

    s.on("system:update", onSystemUpdate);
    return () => {
      s.off("system:update", onSystemUpdate);
    };
  }, [token, refreshSystemMessages]);

  const markSystemMessageRead = useCallback(
    async (id) => {
      if (!token || !id)
          return;
      const mid = Number(id);
      setSystemMessages((prev) => (prev || []).filter((m) => Number(m.id) !== mid));
      try {
        const res = await apiSafe(`/api/messages/system/${mid}/read`, {
          method: "POST",
          token,
        });
        if (!res)
            return;
        await refreshSystemMessages();
      } catch (e) {
        console.warn("[PrivateGame] markSystemMessageRead failed:", e);
        await refreshSystemMessages();
      }
    },
    [token, refreshSystemMessages, apiSafe]
  );

  const latestBetweenSelected = useMemo(() => {
    if (!currentUserId || !opponentId)
        return null;

    const betweenPair = invites.filter(
      (i) =>
        (Number(i.fromUserId) === Number(currentUserId) &&
          Number(i.toUserId) === Number(opponentId)) ||
        (Number(i.fromUserId) === Number(opponentId) &&
          Number(i.toUserId) === Number(currentUserId))
    );

    if (!betweenPair.length)
        return null;
    return betweenPair.sort((a, b) => Number(b.id) - Number(a.id))[0];
  }, [invites, currentUserId, opponentId]);

  useEffect(() => {
    const sess = safeReadJSON(SESSION_KEY);
    const hasSession = Boolean(sess?.verified && sess?.opponentId);
    if (hasSession)
        return;

    if (!latestBetweenSelected) {
      setAcceptedInviteId(null);
      return;
    }
    setAcceptedInviteId(
      latestBetweenSelected.status === "accepted"
        ? Number(latestBetweenSelected.id)
        : null
    );
  }, [latestBetweenSelected, SESSION_KEY]);

  const incomingPendingToMe = useMemo(() => {
    if (!currentUserId) return [];
    return invites
      .filter((i) => i.status === "pending" && Number(i.toUserId) === Number(currentUserId))
      .sort((a, b) => Number(b.id) - Number(a.id));
  }, [invites, currentUserId]);

  const nameById = useCallback(
    (id) => {
      const p = profiles.find((x) => Number(x.id) === Number(id));
      return p?.p_name || `User #${id}`;
    },
    [profiles]
  );

  const profileById = useCallback(
    (id) => profiles.find((p) => Number(p.id) === Number(id)) || null,
    [profiles]
  );

  const winner = useMemo(() => {
    if (!matchOver || !winnerSide)
        return null;
    if (winnerSide === "TIE")
        return { name: "Match tied", image: null };
    if (winnerSide === "LEFT") {
      const mep = profileById(currentUserId);
      return { name: mep?.p_name || "You", image: mep?.image || null };
    }
    if (winnerSide === "RIGHT") {
      const opp = profileById(opponentId);
      return { name: opp?.p_name || "Opponent", image: opp?.image || null };
    }
    return null;
  }, [matchOver, winnerSide, currentUserId, opponentId, profileById]);

 const acceptInvite = useCallback(
  async (inviteId) => {
    if (!token || !inviteId) return;

    try {
      const res = await apiSafe(`/api/invites/${Number(inviteId)}/accept`, {
        method: "POST",
        token,
      });
      if (!res) return;

      await refreshInvites?.();
    } catch (e) {
      console.error("[PrivateGame] acceptInvite failed:", e);
    }
  },
  [token, refreshInvites, apiSafe]
);

const rejectInvite = useCallback(
  async (inviteId) => {
    if (!token || !inviteId) return;

    try {
      const res = await apiSafe(`/api/invites/${Number(inviteId)}/reject`, {
        method: "POST",
        token,
      });
      if (!res) return;

      await refreshInvites?.();
    } catch (e) {
      console.error("[PrivateGame] rejectInvite failed:", e);
    }
  },
  [token, refreshInvites, apiSafe]
);

const latestCancelMessage = useMemo(() => {
  const list = (systemMessages || [])
    .filter((m) => m?.type === "invite_cancelled")
    .sort((a, b) => Number(b?.id || 0) - Number(a?.id || 0));

  if (!list.length) return null;

  const rawPayload = list[0]?.payload;
  let payload = rawPayload;

  if (typeof rawPayload === "string") {
    try {
      payload = JSON.parse(rawPayload);
    } catch {
      payload = null;
    }
  }

  const text =
    payload?.message || "The host cancelled the invitation.";

  return { id: list[0]?.id ?? 0, text };
}, [systemMessages]);

useEffect(() => {
  const s = getSocket(token);
  if (!s) return;

  const onSystem = (msg) => {
    if (msg?.type === "invite_cancelled") {
      refreshInvites?.();
    }
  };

  s.on("system:message", onSystem);
  return () => s.off("system:message", onSystem);
}, [token, refreshInvites]);


useEffect(() => {
  if (!latestCancelMessage) return;

  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SNAPSHOT_KEY);

  setOpponentVerified(false);
  setAcceptedInviteId(null);
  hardResetMatchUI();
}, [latestCancelMessage, hardResetMatchUI, SESSION_KEY, SNAPSHOT_KEY]);


  

  const startNewMatch = () => {
    hardResetMatchUI();
    setMode("running");
  };

  const pauseResume = () => {
    if (mode === "idle")
        return;
    setMode((m) => (m === "running" ? "paused" : "running"));
  };

  const stopToInitial = () => {
    hardResetMatchUI();
  };

   const verifyOpponent = async ({ email, password }) => {
    const res = await apiSafe("/api/auth/verify-opponent", {
      method: "POST",
      token,
      refreshOn401: false,
      body: { opponentId, inviteId: acceptedInviteId, email, password },
    });

    if (!res) return { ok: false };
    if (!res?.ok) return { ok: false };

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        verified: true,
        opponentId: Number(opponentId),
        inviteId: acceptedInviteId ? Number(acceptedInviteId) : null,
        createdAt: Date.now(),
      })
    );

    hardResetMatchUI();
    setOpponentVerified(true);
    setVerifyOpen(false);
    setMode("idle");

    return { ok: true };
  };

  const handleRegisterGame = () => {
    setVerifyError("");
    if (!isAuthenticated || !token || !currentUserId) {
      setVerifyError("You must be logged in.");
      return;
    }
    if (!opponentId) {
      setVerifyError("Please select an opponent.");
      return;
    }
    if (!acceptedInviteId && !opponentVerified) {
      setVerifyError("Waiting for opponent to accept your invitation...");
      return;
    }
    setVerifyOpen(true);
  };

 


  const handleMatchOver = async (snap) => {
    setMode("idle");
    modeRef.current = "idle";

    const w = snap?.winner || null;
    const lg = Number(snap?.leftGames ?? 0);
    const rg = Number(snap?.rightGames ?? 0);

    setMatchOver(true);
    setWinnerSide(w);
    setFinalScore({ leftGames: lg, rightGames: rg });

    if (opponentVerified && w && w !== "TIE") {
      setConfettiKey((k) => k + 1);
      setShowConfetti(true);
    }

    try {
      if (!isAuthenticated || !token || !currentUserId || !opponentId)
          return;
      if (!opponentVerified)
          return;

      const payload = {
        date: new Date().toLocaleDateString("en-GB"),
        playerId: Number(currentUserId),
        opponentId: Number(opponentId),
        playerScore: lg,
        opponentScore: rg,
        playerPoints: padToN(snap?.leftPointsByGame),
        opponentPoints: padToN(snap?.rightPointsByGame),
      };

      try {
        if (typeof addMatchOptimistic === "function") {
          addMatchOptimistic({
            id: `tmp-${Date.now()}`,
            date: payload.date,
            playerId: payload.playerId,
            opponentId: payload.opponentId,
            playerScore: payload.playerScore,
            opponentScore: payload.opponentScore,
            playerPoints: payload.playerPoints,
            opponentPoints: payload.opponentPoints,
            games: [],
          });
        }
      } catch {}

      const posted = await apiSafe("/api/matches", {
        method: "POST",
        body: payload,
        token,
      });
      if (!posted)
          return;

      await refreshMatches();

      if (acceptedInviteId) {
        try {
          await apiSafe(`/api/invites/${acceptedInviteId}/complete`, {
            method: "POST",
            token,
          });
        } catch (e) {
          console.warn("[PrivateGame] invite complete failed:", e);
        }
      }

      await refreshInvites();
    } catch (e) {
      console.error("[PrivateGame] POST /api/matches failed:", e);
    } finally {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SNAPSHOT_KEY);
      scheduleResetToPickAnotherOpponent(60);
    }
  };

  const StatusSlot = (
    <>
      {resetInSec != null || matchOver ? (
        ""
      ) : incomingPendingToMe.length > 0 ? (
        <IncomingInvites
          incomingInvites={incomingPendingToMe}
          nameById={nameById}
          onAccept={acceptInvite}
          onReject={rejectInvite}
        />
      ) : latestCancelMessage ? (
        <div className="invitationAccept">
          <span> {latestCancelMessage.text} </span>
          <button onClick={() => markSystemMessageRead(latestCancelMessage.id)}>✕</button>
        </div>
      ) : opponentVerified && mode === "idle" ? (
        <div className="invitationText">Opponent verified. Press Start to begin.</div>
      ) : opponentId && panelStatus === "accepted" ? (
        <div className="invitationText">
          Invitation accepted. Click “Register Game” to verify opponent and open the game.
        </div>
      ) : opponentId && panelStatus === "rejected" ? (
        <div className="invitationText">Invitation rejected.</div>
      ) : opponentId && (panelStatus === "invite" || panelStatus === "outgoing-pending") ? (
        <div className="invitationText">
          Waiting for opponent to accept your invitation...
        </div>
      ) : (
        ""
      )}
    </>
  );

  return (
    <main>
      <Hero hero="gameHero" />
      <h1>Register Game</h1>

      <PlayersPanel
        opponentId={opponentId}
        onSelectOpponent={setOpponentId}
        invites={invites}
        refreshInvites={refreshInvites}
        onStatusChange={setPanelStatus}
      />

      <div className="chevr">
        <HiOutlineChevronDoubleDown />
      </div>

      {!opponentVerified ? (
        <>
          <nav className="game-nav">
            <div className="gameButtons">
              <button type="button" className="game-nav-Btn" disabled>
                Start
              </button>
              <button type="button" className="game-nav-Btn" disabled>
                Pause
              </button>
              <button type="button" className="game-nav-Btn" disabled>
                Stop
              </button>
            </div>

            <button type="button" className="game-nav-Btn" onClick={handleRegisterGame}>
              Register Game
            </button>
          </nav>

          {mode === "idle" ? StatusSlot : null}
          {verifyError ? <div className="invitationText">{verifyError}</div> : null}
        </>
      ) : (
        <>
          <nav className="game-nav">
            <div className="gameButtons">
              <button type="button" className="game-nav-Btn" onClick={startNewMatch}>
                Start
              </button>
              <button
                type="button"
                className="game-nav-Btn"
                onClick={pauseResume}
                disabled={mode === "idle"}
              >
                {mode === "paused" ? "Resume" : "Pause"}
              </button>
              <button type="button" className="game-nav-Btn" onClick={stopToInitial}>
                Stop
              </button>
            </div>

            <button type="button" className="game-nav-Btn" onClick={handleRegisterGame}>
              Register Game
            </button>
          </nav>

          {mode === "idle" ? StatusSlot : null}

          {resetInSec != null ? (
            <div className="matchFinnished">
              Match finished — resetting to “View Available” in {resetInSec}s…
            </div>
          ) : null}

          <div className="gCanvas">
            <Canvas
              className="canvasStyle"
              mode={mode}
              storageKey={SNAPSHOT_KEY}
              onMatchOver={handleMatchOver}
            />
            <ConfettiBurst
              key={confettiKey}
              show={showConfetti}
              onDone={() => setShowConfetti(false)}
            />
          </div>

          {winner && matchOver && finalScore ? (
            <div className="winnerBanner">
              {winner.image && winner.name !== "Match tied" ? (
                <div>
                  <img
                    src={withCacheBust(resolveImageUrl(winner.image))}
                    alt={winner.name}
                    width="64"
                    height="64"
                    className="winnerImg"
                  />
                </div>
              ) : null}

              <div className="winnerW">
                <div className="winnerText">
                  {winner.name === "Match tied" ? "Match tied" : `${winner.name} won`}
                </div>
                <div className="winnerValue">
                  {finalScore.leftGames} – {finalScore.rightGames}
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}

      <OpponentVerifyModal
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        onSubmit={verifyOpponent}
      />
    </main>
  );
};

export default PrivateGame;
