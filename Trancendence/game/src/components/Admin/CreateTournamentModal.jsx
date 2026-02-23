import React, { useEffect, useMemo, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import "../Modal/Modal.css";
import "../Admin/Admin.css";

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

const CreateTournamentModal = ({
  open,
  onClose,
  onCreate,
  loading = false,
  error = "",
}) => {
  const [name, setName] = useState("");
  const [startsAtDate, setStartsAtDate] = useState(""); 
  const [startInMinutes, setStartInMinutes] = useState(30); 
  const [visibility] = useState("private");
  const [status, setStatus] = useState("not_started");
  const [unit, setUnit] = useState("days"); 
  const [openOffset, setOpenOffset] = useState(10);
  const [closeOffset, setCloseOffset] = useState(5);

  const canSubmit = useMemo(() => {
    if (loading)
        return false;
    if (!name.trim())
        return false;
    if (unit === "minutes") {
      return Number.isFinite(Number(startInMinutes)) && Number(startInMinutes) >= 1;
    }
    return Boolean(startsAtDate);
  }, [name, startsAtDate, unit, startInMinutes, loading]);

  useEffect(() => {
    if (!open)
        return;

    setName("");
    setStartsAtDate("");
    setStatus("not_started");
    setUnit("days");
    setOpenOffset(10);
    setCloseOffset(5);
    setStartInMinutes(30);
  }, [open]);

  const submit = async () => {

    if (!canSubmit)
        return;
    const factor = unit === "minutes" ? MINUTE_MS : DAY_MS;
    const registrationOpensOffsetMs = Number(openOffset) * factor;
    const registrationClosesOffsetMs = Number(closeOffset) * factor;

    if (!Number.isFinite(registrationOpensOffsetMs) || registrationOpensOffsetMs <= 0)
        return;
    if (!Number.isFinite(registrationClosesOffsetMs) || registrationClosesOffsetMs <= 0)
        return;
    if (registrationClosesOffsetMs >= registrationOpensOffsetMs)
        return;

    let startsAtIso = "";
    if (unit === "minutes") {
      const mins = Number(startInMinutes);
      const startMs = Date.now() + mins * MINUTE_MS;
      startsAtIso = new Date(startMs).toISOString();
    } else {
      const local = new Date(`${startsAtDate}T00:00:00`);
      startsAtIso = new Date(local.getTime()).toISOString();
    }

    await onCreate({
      name: name.trim(),
      startsAt: startsAtIso,
      visibility,
      status,
      registrationOpensOffsetMs,
      registrationClosesOffsetMs,
    });
  };

  if (!open)
      return null;
  const closeTooBig = Number(closeOffset) >= Number(openOffset);

  return (
    <div className="modalVerify" onClick={onClose}>
      <div
        className="modalVerify-body-tournament"
        onClick={(e) => e.stopPropagation()}
      >
        <FaWindowClose className="vClose-tournament" onClick={onClose} />
        <div className="modalVerify-tournament-title">
          <h3>Create Tournament</h3>
          <p>
            <i>
              Fill the fields and click <b>Create</b>.
            </i>
          </p>
        </div>
        <div>
          <div className="modalVerify-body-inputs">
            <input
              className="inpA-tournament"
              placeholder="Tournament name…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <select
              className="inpA-tournament"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              disabled={loading}
              title="Registration offsets unit"
            >
              <option value="days">days</option>
              <option value="minutes">minutes (test)</option>
            </select>
            {unit === "minutes" ? (
              <input
                className="inpA-tournament"
                type="number"
                min="1"
                step="1"
                value={startInMinutes}
                onChange={(e) =>
                  setStartInMinutes(e.target.value === "" ? "" : Number(e.target.value))
                }
                disabled={loading}
                title="Tournament starts in (minutes from now)"
                placeholder="Starts in (minutes)"
              />
            ) : (
              <input
                className="inpA-tournament"
                type="date"
                value={startsAtDate}
                onChange={(e) => setStartsAtDate(e.target.value)}
                disabled={loading}
                title="Start date"
              />
            )}

            <select
              className="inpA-tournament"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
              title="Status"
            >
              <option value="not_started">not_started</option>
              <option value="in_progress">in_progress</option>
              <option value="finished">finished</option>
            </select>

            <input
              className="inpA-tournament"
              type="number"
              min="1"
              step="1"
              value={openOffset}
              onChange={(e) =>
                setOpenOffset(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={loading}
              title={`Registration opens (${unit} before start)`}
              placeholder={`Opens (${unit})`}
            />

            <input
              className="inpA-tournament"
              type="number"
              min="1"
              step="1"
              value={closeOffset}
              onChange={(e) =>
                setCloseOffset(e.target.value === "" ? "" : Number(e.target.value))
              }
              disabled={loading}
              title={`Registration closes (${unit} before start)`}
              placeholder={`Closes (${unit})`}
            />
          </div>

          {closeTooBig ? (
            <div className="invitationText" style={{ color: "red", marginTop: 12 }}>
              Close offset must be smaller than open offset.
            </div>
          ) : null}

          {error ? (
            <div className="invitationText" style={{ color: "red", marginTop: 12 }}>
              {error}
            </div>
          ) : null}
        </div>

        <div className="btnVerify-container">
          <button className="btnVerify" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button
            className="btnVerify"
            type="button"
            onClick={submit}
            disabled={!canSubmit || closeTooBig}
            style={{ marginLeft: 10 }}
            title={
              !canSubmit
                ? "Name and start required"
                : closeTooBig
                ? "Close must be smaller than open"
                : "Create tournament"
            }
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTournamentModal;
