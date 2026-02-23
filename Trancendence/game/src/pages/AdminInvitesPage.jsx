import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../components/Admin/Admin.css";
import { useAuth } from "../components/utils/AuthContext";
import { useApi } from "../components/utils/useApi";
import Hero from "../components/Hero";
import InvitesTable from "../components/Admin/InvitesTable";
import AdminNav from "../components/Admin/AdminNav";
import Pagination from "../components/Elements/Pagination";

const LIMIT_OPTIONS = [25, 50, 100, 200];

const AdminInvitesPage = () => {
  const { token } = useAuth();
  const apiSafe = useApi();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search.trim())
        p.set("search", search.trim());
    if (status !== "all")
        p.set("status", status);
    p.set("page", String(page));
    p.set("limit", String(limit));
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [search, status, page, limit]);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2000);
  };

  const loadInvites = useCallback(async () => {
    if (!token)
        return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiSafe(`/api/admin/invites${queryString}`, { token });
      if (!data) {
        setRows([]);
        setTotal(0);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const list = Array.isArray(data?.invites) ? data.invites : [];
      setRows(list);
      setTotal(Number(data?.total ?? 0));
      setTotalPages(Number(data?.totalPages ?? 1));
      setPage(Number(data?.page ?? page));
      setLimit(Number(data?.limit ?? limit));
    } catch (e) {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      setError("Failed to load invites");
    } finally {
      setLoading(false);
    }
  }, [token, queryString, page, limit, apiSafe]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  useEffect(() => {
    setPage(1);
  }, [search, status, limit]);

  const cancelInvite = async (id) => {
    const ok = window.confirm(
      "Force cancel this invite?\n\nThis sets status to 'rejected' even if it was accepted."
    );
    if (!ok)
        return;

    setError("");
    setSuccess("");

    try {
      const res = await apiSafe(`/api/admin/invites/${Number(id)}/cancel`, {
        method: "POST",
        token,
      });
      if (!res)
          return;

      flashSuccess("Invite cancelled");
      await loadInvites();
    } catch (e) {
      setError("Cancel failed");
    }
  };

  const clearStuck = async () => {
    const minutesStr = window.prompt(
      "Clear stuck invites older than how many minutes?",
      "20"
    );
    if (!minutesStr)
        return;

    const minutes = Number(minutesStr);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      setError("Invalid minutes value");
      return;
    }

    const ok = window.confirm(
      `Cancel ALL pending/accepted invites older than ${minutes} minutes?`
    );
    if (!ok)
        return;

    setError("");
    setSuccess("");

    try {
      const data = await apiSafe(`/api/admin/invites/clear-stuck`, {
        method: "POST",
        token,
        body: { minutes },
      });
      if (!data)
          return;

      flashSuccess(`Cleared ${data?.cleared || 0} invite(s)`);
      setPage(1);
      await loadInvites();
    } catch (e) {
      setError("Clear stuck failed");
    }
  };

  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  return (
    <main>
      <Hero hero="profileHero" />
      <h1>Admin · Invites</h1>
      <AdminNav />

      <div className="adminSearch-container">
        <input
          className="inpA"
          placeholder="Search by user email / name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="inpA"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="pending">pending</option>
          <option value="accepted">accepted</option>
          <option value="rejected">rejected</option>
          <option value="completed">completed</option>
        </select>

        <select
          className="inpA"
          value={String(limit)}
          onChange={(e) => setLimit(Number(e.target.value))}
          title="Rows per page"
        >
          {LIMIT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>

        <div className="numUsers">
          {loading ? "Loading…" : `Showing ${showingFrom}-${showingTo} of ${total}`}
        </div>
      </div>

      <div className="divInviteBtns">
        <button type="button" className="btnRefresh" onClick={loadInvites}>
          Refresh
        </button>
        <button type="button" className="btnRefresh" onClick={clearStuck}>
          Clear stuck
        </button>
      </div>

      {error && (
        <div className="invitationText" style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}
      {success && (
        <div
          className="invitationText"
          style={{ color: "green", marginBottom: 10 }}
        >
          {success}
        </div>
      )}

      <InvitesTable rows={rows} loading={loading} onCancel={cancelInvite} />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        loading={loading}
        onPageChange={setPage}
      />
    </main>
  );
};

export default AdminInvitesPage;
