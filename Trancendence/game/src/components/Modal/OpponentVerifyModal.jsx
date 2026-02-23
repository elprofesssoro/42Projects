import React, { useRef, useState } from "react";
import "./Modal.css";
import { FaWindowClose } from "react-icons/fa";

const OpponentVerifyModal = ({
  open,
  onClose,
  onSubmit,
  title = "Opponent verification",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inFlightRef = useRef(false);
  const lastSubmitAtRef = useRef(0);

  if (!open)
      return null;

  const normalizeError = (e) => {
    const status = e?.status || e?.response?.status || e?.data?.status;
    const data = e?.data || e?.response?.data;

    const message =
      (typeof data === "string" ? data : data?.message || data?.error) ||
      e?.message ||
      "";

    if (status === 429) {
      const retryAfter =
        e?.data?.retryAfter ||
        e?.retryAfter ||
        (typeof data === "object" ? data?.retryAfter : null);
      return retryAfter
        ? `Too many attempts. Try again in ${retryAfter}s.`
        : "Too many attempts. Please try again shortly.";
    }

    if (status === 401)
        return "Invalid credentials.";
    if (status === 403)
        return message || "Credentials do not match opponent.";
    if (message.toLowerCase().includes("invalid credential"))
        return "Invalid credentials.";
    if (message.toLowerCase().includes("credential") && message.toLowerCase().includes("opponent"))
      return "Credentials do not match opponent.";

    return message || "Verification failed.";
  };

  const submit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (inFlightRef.current)
        return;
    if (now - lastSubmitAtRef.current < 800)
        return;
    lastSubmitAtRef.current = now;

    setErr("");

    const eMail = email.trim().toLowerCase();
    if (!eMail || !password) {
      setErr("Please enter email and password.");
      return;
    }

    inFlightRef.current = true;
    setIsSubmitting(true);

    try {
      await onSubmit({ email: eMail, password });
      setEmail("");
      setPassword("");
      setErr("");
    } catch (e2) {
      setErr(normalizeError(e2));
    } finally {
      inFlightRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modalVerify" onClick={onClose}>
      <div className="modalVerify-body" onClick={(e) => e.stopPropagation()}>
        <div className="modalVerify-title">
          <h3>{title}</h3>
          <FaWindowClose className="vClose" onClick={onClose} />
        </div>

        <p>Opponent must enter credentials on the host PC to start the match.</p>

        <form className="vForm" onSubmit={submit}>
          <input
            className="inp"
            type="email"
            placeholder="Opponent email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (err)
                  setErr("");
            }}
            disabled={isSubmitting}
            autoComplete="off"
          />
          <input
            className="inp"
            type="password"
            placeholder="Opponent password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (err)
                  setErr("");
            }}
            disabled={isSubmitting}
            autoComplete="off"
          />

          {err ? (
            <div style={{ color: "red", fontSize: 13, marginBottom: 10 }}>{err}</div>
          ) : null}

          <div className="btnVerify-container">
            <button className="btnVerify" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button className="btnVerify" type="submit" disabled={isSubmitting}>
              Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpponentVerifyModal;
