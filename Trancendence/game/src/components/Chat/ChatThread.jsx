import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { getSocket } from "../../api/socketClient";
import "./ChatList.css";
import { useApi } from "../utils/useApi";
import { MdDeleteForever } from "react-icons/md";
import { resolveImageUrl } from "../utils/imageUrl";



const MIN_SEND_INTERVAL_MS = 300;
const PAGE_SIZE = 200;

const ChatThread = ({ otherUser, onClose, onRead }) => {
  const { token, user } = useAuth();
  const apiSafe = useApi();

  const myId = user?.id;
  const otherId = otherUser?.id;

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [otherTyping, setOtherTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const listRef = useRef(null);
  const bottomRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);

  const typingHideTimerRef = useRef(null);
  const typingStopTimerRef = useRef(null);
  const lastTypingSentAtRef = useRef(0);

  const fetchSeqRef = useRef(0);

  const formatTimestamp = (ts) => {
    if (!ts)
        return "";
    const d = new Date(ts);
    if (Number.isNaN(d.getTime()))
        return "";
    return d.toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getMessageTimestamp = (m) =>
    m?.created_at || m?.createdAt || m?.created || m?.timestamp || null;

  const normalizeMessages = (arr) => {
    const a = Array.isArray(arr) ? arr : [];
    return a
      .map((m) => ({
        ...m,
        id: Number(m.id),
        fromUserId: Number(m.fromUserId),
        toUserId: Number(m.toUserId),
        body: m.body ?? "",
      }))
      .filter((m) => m.id && m.fromUserId && m.toUserId);
  };

  const fetchThread = async ({ beforeId = null, prepend = false } = {}) => {
    if (!token || !otherId)
        return;

    const seq = ++fetchSeqRef.current;

    const qs = new URLSearchParams();
    qs.set("limit", String(PAGE_SIZE));
    if (beforeId)
        qs.set("beforeId", String(beforeId));
    qs.set("t", String(Date.now()));

    const data = await apiSafe(`/api/messages/thread/${otherId}?${qs.toString()}`, { token });
    if (!data)
        return;
    if (seq !== fetchSeqRef.current)
        return;

    const next = normalizeMessages(data?.messages);

    if (prepend) {
      setMessages((prev) => {
        const seen = new Set(prev.map((x) => x.id));
        const merged = [...next.filter((x) => !seen.has(x.id)), ...prev];
        merged.sort((a, b) => a.id - b.id);
        return merged;
      });
    } else {
      setMessages(next);
    }

    if (!next.length || next.length < PAGE_SIZE)
        setHasMore(false);
  };

  const markRead = async () => {
    if (!token || !otherId)
        return;
    const res = await apiSafe(`/api/messages/thread/${otherId}/read`, {
      method: "POST",
      token,
    });
    if (!res)
        return;
    onRead?.();
  };

  useEffect(() => {
    if (!token || !otherId)
        return;
    setHasMore(true);
    shouldAutoScrollRef.current = true;

    (async () => {
      await fetchThread();
      await markRead();
    })();
  }, [token, otherId]);

  useEffect(() => {
    const s = getSocket(token);
    if (!s)
        return;

    const onUpdate = async () => {
      await fetchThread();
      await markRead();
    };

    s.on("chat:update", onUpdate);
    return () => s.off("chat:update", onUpdate);
  }, [token, otherId]);

  useEffect(() => {
    if (shouldAutoScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    const s = getSocket(token);
    if (!s || !otherId)
        return;

    const onTyping = ({ fromUserId, isTyping } = {}) => {
      if (Number(fromUserId) !== Number(otherId))
          return;

      if (isTyping) {
        setOtherTyping(true);
        if (typingHideTimerRef.current) clearTimeout(typingHideTimerRef.current);
        typingHideTimerRef.current = setTimeout(() => {
          setOtherTyping(false);
          typingHideTimerRef.current = null;
        }, 1200);
      } else {
        setOtherTyping(false);
        if (typingHideTimerRef.current) {
          clearTimeout(typingHideTimerRef.current);
          typingHideTimerRef.current = null;
        }
      }
    };

    s.on("chat:typing", onTyping);
    return () => {
      s.off("chat:typing", onTyping);
      if (typingHideTimerRef.current) {
        clearTimeout(typingHideTimerRef.current);
        typingHideTimerRef.current = null;
      }
    };
  }, [token, otherId]);

  const emitTyping = (isTyping) => {
    const s = getSocket(token);
    if (!s || !otherId)
        return;
    s.emit("chat:typing", { toUserId: otherId, isTyping: Boolean(isTyping) });
  };

  const handleTextChange = (v) => {
    setText(v);
    const now = Date.now();

    if (now - lastTypingSentAtRef.current > 700) {
      lastTypingSentAtRef.current = now;
      emitTyping(true);
    }

    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    typingStopTimerRef.current = setTimeout(() => {
      emitTyping(false);
      typingStopTimerRef.current = null;
    }, 1200);
  };

  useEffect(() => {
    return () => {
      if (typingStopTimerRef.current) {
        clearTimeout(typingStopTimerRef.current);
        typingStopTimerRef.current = null;
      }
    };
  }, []);

  const loadOlder = async () => {
    if (loadingOlder || !hasMore)
        return;
    const oldest = messages?.[0]?.id;
    if (!oldest)
        return;

    setLoadingOlder(true);
    try {
      const el = listRef.current;
      const prevScrollHeight = el ? el.scrollHeight : 0;
      const prevScrollTop = el ? el.scrollTop : 0;

      await fetchThread({ beforeId: oldest, prepend: true });

      requestAnimationFrame(() => {
        const el2 = listRef.current;
        if (!el2)
            return;
        const newScrollHeight = el2.scrollHeight;
        el2.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
      });
    } finally {
      setLoadingOlder(false);
    }
  };

  const sendMessage = async () => {
    const msg = text.trim();
    if (!msg || !token || !otherId)
        return;

    const now = Date.now();
    if (now < cooldownUntil)
        return;
    if (isSending)
        return;

    setIsSending(true);
    const nextAllowed = now + MIN_SEND_INTERVAL_MS;
    setCooldownUntil(nextAllowed);

    try {
      const res = await apiSafe(`/api/messages/thread/${otherId}`, {
        method: "POST",
        token,
        body: { body: msg },
      });

      if (!res)
          return;

      setText("");
      emitTyping(false);
      shouldAutoScrollRef.current = true;

      await fetchThread();
      await markRead();
    } finally {
      const wait = Math.max(0, nextAllowed - Date.now());
      setTimeout(() => setIsSending(false), wait);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const deleteMessage = async (messageId) => {
    if (!messageId || !token)
        return;

    const ok = window.confirm("Delete this message?");
    if (!ok)
        return;

    const res = await apiSafe(`/api/messages/${messageId}`, {
      method: "DELETE",
      token,
    });
    if (!res)
        return;

    await fetchThread();
    await markRead();
  };

  const onScroll = () => {
    const el = listRef.current;
    if (!el)
        return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    shouldAutoScrollRef.current = dist < 40;
  };

  const headerAvatarSrc = useMemo(() => resolveImageUrl(otherUser?.image), [otherUser?.image]);

  const disabled = !text.trim() || isSending || Date.now() < cooldownUntil;

  return (
    <div className="chatB">
      <div className="chatBHeader">
        <div className="chatBHeader-container">
          <img className="chatBImg" src={headerAvatarSrc} alt={otherUser?.p_name || "user"} />
          <div>
            <div>{otherUser?.p_name}</div>
            <div className="chatBelem-1">{otherTyping ? "Typing…" : " "}</div>
          </div>
        </div>

        <button className="chatB-close" type="button" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="chatBtext-box" ref={listRef} onScroll={onScroll}>
        {hasMore ? (
          <button
            type="button"
            onClick={loadOlder}
            disabled={loadingOlder}
            className={`send-button ${!loadingOlder ? "enabled" : ""}`}
            style={{ alignSelf: "center", cursor: loadingOlder ? "not-allowed" : "pointer" }}
          >
            {loadingOlder ? "Loading…" : "Load older"}
          </button>
        ) : null}

        {messages.map((m) => {
          const mine = Number(m.fromUserId) === Number(myId);
          const avatarRaw = mine ? user?.image : otherUser?.image;
          const avatarSrc = resolveImageUrl(avatarRaw);
          const ts = formatTimestamp(getMessageTimestamp(m));

          return (
            <div key={m.id} className={`msgRow ${mine ? "mine" : "other"}`}>
              <img className="msgAvatar" src={avatarSrc} alt="avatar" />
              <div className="msgContent">
                <div className="msgMetaRow">
                  {ts ? <div className="msgMeta">{ts}</div> : <div className="msgMeta" />}
                  {mine ? (
                    <button type="button" className="msgDeleteBtn" onClick={() => deleteMessage(m.id)}>
                      <MdDeleteForever />
                    </button>
                  ) : null}
                </div>

                {m.deleted_at ? (
                  <div className={`message ${mine ? "mine" : "other"} deleted`}>
                    <i>Message deleted</i>
                  </div>
                ) : (
                  <div className={`message ${mine ? "mine" : "other"}`}>{m.body}</div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="chatBcomposer">
        <textarea
          className="chatBcomposer-text"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a message…"
          rows={1}
        />
        <button className={`send-button ${text.trim() ? "enabled" : ""}`} onClick={sendMessage} disabled={disabled}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatThread;
