import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../components/Admin/Admin.css";
import { useAuth } from "../components/utils/AuthContext";
import Hero from "../components/Hero";
import AuditTable from "../components/Admin/AuditTable";
import AdminNav from "../components/Admin/AdminNav";
import Pagination from "../components/Elements/Pagination";
import { useApi } from "../components/utils/useApi";

const LIMIT_OPTIONS = [25, 50, 100, 200];

const AdminAuditPage = () => {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const apiSafe = useApi();

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search.trim())
        p.set("search", search.trim());
    if (action.trim())
        p.set("action", action.trim());
    p.set("page", String(page));
    p.set("limit", String(limit));
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [search, action, page, limit]);

  const loadAudit = useCallback(async () => {
  if (!token) return;

  setLoading(true);
  setError("");

  try {
    const data = await apiSafe(`/api/admin/audit${queryString}`, { token });
    if (!data) {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      setLoading(false);
      return;
    }

    setRows(Array.isArray(data?.logs) ? data.logs : []);
    setTotal(Number(data?.total ?? 0));
    setTotalPages(Number(data?.totalPages ?? 1));
    setPage(Number(data?.page ?? page));
    setLimit(Number(data?.limit ?? limit));
  } catch (e) {
    setRows([]);
    setTotal(0);
    setTotalPages(1);
    setError("Failed to load audit log");
  } finally {
    setLoading(false);
  }
}, [token, queryString, page, limit, apiSafe]);


  useEffect(() => {
    loadAudit();
  }, [loadAudit]);

  useEffect(() => {
    setPage(1);
  }, [search, action, limit]);

  
  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  return (
    <main>
      <Hero hero="profileHero" />
      <h1>Admin · Audit</h1>
      <AdminNav/>
      <div className="adminSearch-container">
        <input
          className="inpA"
          placeholder="Search (admin email/name, target type/id)…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          className="inpA"
          placeholder="Action filter (e.g. match.delete)"
          value={action}
          onChange={(e) => setAction(e.target.value)}
        />

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
        <button type="button" className="btnRefresh" onClick={loadAudit}>
          Refresh
        </button>
      </div>
      {error && (
        <div className="invitationText" style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}
      <AuditTable rows={rows} loading={loading} />
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

export default AdminAuditPage;
