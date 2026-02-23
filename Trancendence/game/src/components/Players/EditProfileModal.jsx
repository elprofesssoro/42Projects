import React, { useEffect, useMemo, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import "../Modal/Modal.css";
import { API_BASE } from "../../api/api";
import { useApi } from "../utils/useApi";

const MAX_NAME_LEN = 34;
const MIN_NAME_LEN = 3;
const MAX_EMAIL_LEN = 40;

const EditProfileModal = ({
  open,
  onClose,
  token,
  player,
  onSaved,
  onDelete,
}) => {
  const [pName, setPName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatNewPassword, setRepeatNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const apiSafe = useApi();

  useEffect(() => {
    if (!open)
        return;

    setErr("");
    setLoading(false);
    setPName(player?.p_name || "");
    setEmail(player?.email || "");
    setImageUrl(player?.image || "");
    setAvatarFile(null);
    setCurrentPassword("");
    setNewPassword("");
    setRepeatNewPassword("");
  }, [open, player]);

  const wantsPasswordChange = useMemo(() => {
    return Boolean(newPassword.trim() || repeatNewPassword.trim());
  }, [newPassword, repeatNewPassword]);

  const uploadAvatarFromPC = async () => {
    if (!token)
        return;

    if (!avatarFile) {
      setErr("Please choose an image file first.");
      return;
    }

    setErr("");
    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);

      const res = await fetch(`${API_BASE}/api/users/me/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok)
          throw new Error(data?.error || "Avatar upload failed");

      const nextUser = data?.user;

      if (!nextUser)
          throw new Error("Invalid server response");

      setAvatarFile(null);
      setImageUrl(nextUser.image || "");
      onSaved?.(nextUser);
    } catch (e) {
      setErr(e.message || "Avatar upload failed");
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    if (!token)
        return;
    setErr("");

    const cleanName = pName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length < MIN_NAME_LEN) {
      setErr("Display name is too short");
      return;
    }

    if (cleanName.length > MAX_NAME_LEN) {
      setErr("Display name is too long");
      return;
    }

    if (cleanEmail.length > MAX_EMAIL_LEN) {
      setErr("Email is too long");
      return;
    }

    if (wantsPasswordChange && newPassword !== repeatNewPassword) {
      setErr("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const body = {
        p_name: cleanName,
        email: cleanEmail,
        image: imageUrl.trim(),
        currentPassword: currentPassword || undefined,
        newPassword: wantsPasswordChange ? newPassword : undefined,
      };

      const res = await apiSafe("/api/users/me", {
        method: "PATCH",
        token,
        body,
      });

      if (!res)
          return;

      const nextUser = res?.user;
      const nextToken = res?.token;

      if (!nextUser)
          throw new Error("Invalid server response");
      onSaved?.(nextUser, nextToken);
      onClose?.();
    } catch (e) {
      setErr(e?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (!token)
        return;

    const ok = window.confirm(
      "Delete your profile?\n\nYou must enter your current password to delete.\nThis will log you out."
    );

    if (!ok)
        return;

    setErr("");
    setLoading(true);

    try {
      const res = await apiSafe("/api/users/me", {
        method: "DELETE",
        token,
        body: { currentPassword },
      });

      if (!res)
          return;

      onDelete?.();
    } catch (e) {
      setErr(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  if (!open)
      return null;

  return (
    <div className="modalVerify" onClick={onClose}>
      <div className="modalVerify-edit" onClick={(e) => e.stopPropagation()}>
        <div className="modalEdit-title">
          <h3>Edit profile</h3>
          <FaWindowClose className="vClose-edit" onClick={onClose} />
        </div>

        {err && <div style={{ marginTop: 10, color: "salmon" }}>{err}</div>}

        <div className="modalEdit-body-inputs">
          <input
            className="inpA-edit"
            placeholder="Display name"
            value={pName}
            maxLength={MAX_NAME_LEN}
            onChange={(e) => setPName(e.target.value.slice(0, MAX_NAME_LEN))}
            disabled={loading}
          />

          <input
            className="inpA-edit"
            placeholder="Email"
            type="email"
            value={email}
            maxLength={MAX_EMAIL_LEN}
            onChange={(e) => setEmail(e.target.value.slice(0, MAX_EMAIL_LEN))}
            disabled={loading}
          />

          <div>
            <div className="editModal-upload">
              <b>Upload profile image</b>
            </div>

            <input
              className="inpA-edit"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              disabled={loading}
            />

            <button
              type="button"
              className="btnModal-edit"
              onClick={uploadAvatarFromPC}
              disabled={loading}
            >
              Upload image
            </button>
          </div>

          <div>
            <b>Password required for saving changes or deletion</b>
          </div>

          <input
            className="inpA-edit"
            placeholder="Current password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={loading}
            autoComplete="current-password"
          />

          <p>Change Password (optional)</p>

          <input
            className="inpA-edit"
            placeholder="New password (optional)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />

          <input
            className="inpA-edit"
            placeholder="Repeat new password (optional)"
            type="password"
            value={repeatNewPassword}
            onChange={(e) => setRepeatNewPassword(e.target.value)}
            disabled={loading}
            autoComplete="new-password"
          />
        </div>

        <div>
          <button
            type="button"
            className="btnModal-edit"
            onClick={saveChanges}
            disabled={loading}
          >
            Save changes
          </button>

          <button
            type="button"
            className="btnModal-edit"
            onClick={deleteAccount}
            disabled={loading}
          >
            Delete profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
