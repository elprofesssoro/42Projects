import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../components/Admin/Admin.css";
import { useAuth } from "../components/utils/AuthContext";
import { useApi } from "../components/utils/useApi";
import Hero from "../components/Hero";
import UsersTable from "../components/Admin/UsersTable";
import AdminNav from "../components/Admin/AdminNav";
import Pagination from "../components/Elements/Pagination";

const LIMIT_OPTIONS = [25, 50, 100, 200];

const AdminUsersPage = () => {
  const { token } = useAuth();
  const apiSafe = useApi();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [sort, setSort] = useState("newest");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search.trim()) p.set("search", search.trim());
    if (role !== "all") p.set("role", role);
    if (sort) p.set("sort", sort);
    p.set("page", String(page));
    p.set("limit", String(limit));
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [search, role, sort, page, limit]);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2000);
  };

  const loadUsers = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiSafe(`/api/admin/users${queryString}`, { token });
      if (!data) {
        setRows([]);
        setTotal(0);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      const list = Array.isArray(data?.users) ? data.users : Array.isArray(data) ? data : [];
      setRows(list);

      const t = Number(data?.total);
      const tp = Number(data?.totalPages);
      const p = Number(data?.page);
      const l = Number(data?.limit);

      setTotal(Number.isFinite(t) ? t : list.length);
      setTotalPages(Number.isFinite(tp) ? tp : Math.max(1, Math.ceil((Number.isFinite(t) ? t : list.length) / limit)));
      setPage(Number.isFinite(p) ? p : page);
      setLimit(Number.isFinite(l) ? l : limit);
    } catch (e) {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token, queryString, apiSafe, page, limit]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    setPage(1);
  }, [search, role, sort, limit]);

  const updateRole = async (userId, nextRole) => {
    setError("");
    setSuccess("");
    try {
      const res = await apiSafe(`/api/admin/users/${Number(userId)}/role`, {
        method: "POST",
        token,
        body: { role: nextRole },
      });
      if (!res) return;
      flashSuccess("Role updated");
      await loadUsers();
    } catch (e) {
      setError("Failed to update role");
    }
  };

  const banUser = async (userId) => {
    const ok = window.confirm("Ban this user?");
    if (!ok) return;

    setError("");
    setSuccess("");
    try {
      const res = await apiSafe(`/api/admin/users/${Number(userId)}/ban`, {
        method: "POST",
        token,
      });
      if (!res) return;
      flashSuccess("User banned");
      await loadUsers();
    } catch (e) {
      setError("Ban failed");
    }
  };

  const unbanUser = async (userId) => {
    const ok = window.confirm("Unban this user?");
    if (!ok) return;

    setError("");
    setSuccess("");
    try {
      const res = await apiSafe(`/api/admin/users/${Number(userId)}/unban`, {
        method: "POST",
        token,
      });
      if (!res) return;
      flashSuccess("User unbanned");
      await loadUsers();
    } catch (e) {
      setError("Unban failed");
    }
  };

  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  return (
    <main>
      <Hero hero="profileHero" />
      <h1>Admin · Users</h1>
      <AdminNav />

      <div className="adminSearch-container">
        <input
          className="inpA"
          placeholder="Search by email / name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="inpA" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="all">All roles</option>
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <select className="inpA" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
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
        <button type="button" className="btnRefresh" onClick={loadUsers}>
          Refresh
        </button>
      </div>

      {error && (
        <div className="invitationText" style={{ color: "red", marginBottom: 10 }}>
          {error}
        </div>
      )}
      {success && (
        <div className="invitationText" style={{ color: "green", marginBottom: 10 }}>
          {success}
        </div>
      )}

      <UsersTable
        rows={rows}
        loading={loading}
        onUpdateRole={updateRole}
        onBan={banUser}
        onUnban={unbanUser}
      />

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

export default AdminUsersPage;
