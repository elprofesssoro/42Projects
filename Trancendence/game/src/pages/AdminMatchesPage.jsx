import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../components/Admin/Admin.css";
import { useAuth } from "../components/utils/AuthContext";
import { useApi } from "../components/utils/useApi";
import Hero from "../components/Hero";
import MatchesTable from "../components/Admin/MatchesTable";
import MatchDetailsModal from "../components/Admin/MatchDetailsModal";
import AdminNav from "../components/Admin/AdminNav";
import Pagination from "../components/Elements/Pagination";

const LIMIT_OPTIONS = [25, 50, 100, 200];

const AdminMatchesPage = () => {
  const { token } = useAuth();
  const apiSafe = useApi();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search.trim())
        p.set("search", search.trim());
    if (mode !== "all")
        p.set("mode", mode);
    if (status !== "all")
        p.set("status", status);
    p.set("page", String(page));
    p.set("limit", String(limit));
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [search, mode, status, page, limit]);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2000);
  };

  const loadMatches = useCallback(async () => {
    if (!token)
        return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiSafe(`/api/admin/matches${queryString}`, { token });
      if (!data) {
        setRows([]);
        setTotal(0);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      setRows(Array.isArray(data?.matches) ? data.matches : []);
      setTotal(Number(data?.total ?? 0));
      setTotalPages(Number(data?.totalPages ?? 1));
      setPage(Number(data?.page ?? page));
      setLimit(Number(data?.limit ?? limit));
    } catch (e) {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      setError("Failed to load matches");
    } finally {
      setLoading(false);
    }
  }, [token, queryString, page, limit, apiSafe]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    setPage(1);
  }, [search, mode, status, limit]);

  const viewMatch = async (id) => {
    setError("");
    setSuccess("");
    setDetailsLoading(true);
    setSelectedMatch(null);
    setDetailsOpen(true);

    try {
      const data = await apiSafe(`/api/admin/matches/${Number(id)}`, { token });
      if (!data) {
        setDetailsOpen(false);
        setDetailsLoading(false);
        return;
      }

      setSelectedMatch(data?.match || null);
    } catch (e) {
      setError("Failed to load match details");
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const deleteMatch = async (id) => {
    const ok = window.confirm(
      `Delete match #${id}?\n\nThis deletes match + its games.`
    );
    if (!ok) return;

    setError("");
    setSuccess("");

    try {
      const res = await apiSafe(`/api/admin/matches/${Number(id)}`, {
        method: "DELETE",
        token,
      });

      if (!res)
          return;

      flashSuccess("Match deleted");
      await loadMatches();
    } catch (e) {
      setError("Delete failed");
    }
  };

  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  return (
    <main>
      <Hero hero="profileHero" />
      <h1>Admin · Matches</h1>
      <AdminNav />

      <div className="adminSearch-container">
        <input
          className="inpA"
          placeholder="Search by email / name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="inpA" value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="all">All modes</option>
          <option value="private">private</option>
          <option value="tournament">tournament</option>
        </select>

        <select
          className="inpA"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="finished">finished</option>
          <option value="active">active</option>
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
        <button type="button" className="btnRefresh" onClick={loadMatches}>
          Refresh
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

      <MatchesTable
        rows={rows}
        loading={loading}
        onView={viewMatch}
        onDelete={deleteMatch}
      />

      <MatchDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        match={selectedMatch}
      />

      {detailsOpen && detailsLoading && (
        <div style={{ marginTop: 8, opacity: 0.75, fontSize: 13 }}>
          Loading match details…
        </div>
      )}

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

export default AdminMatchesPage;
