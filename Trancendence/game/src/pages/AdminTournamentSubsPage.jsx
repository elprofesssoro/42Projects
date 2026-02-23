import React, { useCallback, useEffect, useMemo, useState } from "react";
import "../components/Admin/Admin.css";
import { useAuth } from "../components/utils/AuthContext";
import { useApi } from "../components/utils/useApi"; 
import Hero from "../components/Hero";
import AdminNav from "../components/Admin/AdminNav";
import Pagination from "../components/Elements/Pagination";
import TournamentSubsTable from "../components/Admin/TournamentSubsTable";
import CreateTournamentModal from "../components/Admin/CreateTournamentModal";

const LIMIT_OPTIONS = [25, 50, 100, 200];

const AdminTournamentSubsPage = () => {
  const { token } = useAuth();
  const apiSafe = useApi();

  const [tournaments, setTournaments] = useState([]);
  const [tournamentsLoading, setTournamentsLoading] = useState(false);
  const [tournamentId, setTournamentId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const selectedTournament = useMemo(() => {
    const id = Number(tournamentId);
    return tournaments.find((t) => Number(t.id) === id) || null;
  }, [tournaments, tournamentId]);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2000);
  };

  const loadTournaments = useCallback(async () => {
    if (!token)
        return;

    setTournamentsLoading(true);
    try {
      const data = await apiSafe(`/api/admin/tournaments`, { token });
      if (!data) {
        setTournaments([]);
        setTournamentsLoading(false);
        return;
      }
      setTournaments(Array.isArray(data?.tournaments) ? data.tournaments : []);
    } catch (e) {
      setTournaments([]);
    } finally {
      setTournamentsLoading(false);
    }
  }, [token, apiSafe]);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  const queryString = useMemo(() => {
    const p = new URLSearchParams();
    if (search.trim())
        p.set("search", search.trim());
    p.set("page", String(page));
    p.set("limit", String(limit));
    const s = p.toString();
    return s ? `?${s}` : "";
  }, [search, page, limit]);

  const loadSubscriptions = useCallback(async () => {
    if (!token)
        return;

    if (!tournamentId) {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await apiSafe(
        `/api/admin/tournaments/${Number(
          tournamentId
        )}/subscriptions${queryString}`,
        { token }
      );

      if (!data) {
        setRows([]);
        setTotal(0);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      setRows(Array.isArray(data?.subscriptions) ? data.subscriptions : []);
      setTotal(Number(data?.total ?? 0));
      setTotalPages(Number(data?.totalPages ?? 1));
      setPage(Number(data?.page ?? page));
      setLimit(Number(data?.limit ?? limit));
    } catch (e) {
      setRows([]);
      setTotal(0);
      setTotalPages(1);
      setError("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  }, [token, tournamentId, queryString, page, limit, apiSafe]);

  useEffect(() => {
    loadSubscriptions();
  }, [loadSubscriptions]);

  useEffect(() => {
    setPage(1);
  }, [search, limit, tournamentId]);

  const cancelSubscription = async (userId, userName) => {
    if (!tournamentId)
        return;

    const tName = selectedTournament?.name || `Tournament #${tournamentId}`;
    const ok = window.confirm(
      `Remove ${userName || "this user"} from "${tName}"?`
    );
    if (!ok)
        return;

    setError("");
    setSuccess("");

    try {
      const res = await apiSafe(
        `/api/admin/tournaments/${Number(
          tournamentId
        )}/subscriptions/${Number(userId)}`,
        { method: "DELETE", token }
      );

      if (!res)
          return;
      flashSuccess("Subscription cancelled");
      await loadSubscriptions();
      await loadTournaments();
    } catch (e) {
      setError("Cancel failed");
    }
  };

  const createTournament = async ({
    name,
    startsAt,
    visibility,
    status,
    registrationOpensOffsetMs,
    registrationClosesOffsetMs,
  }) => {
    if (!token) return;

    setCreateError("");
    setError("");
    setSuccess("");
    setCreating(true);

    try {
      const data = await apiSafe(`/api/admin/tournaments`, {
        method: "POST",
        token,
        body: {
          name,
          startsAt,
          visibility,
          status,
          registrationOpensOffsetMs,
          registrationClosesOffsetMs,
        },
      });

      if (!data)
          return;
      flashSuccess("Tournament created");
      setCreateOpen(false);
      await loadTournaments();
      if (data?.tournamentId) {
        setTournamentId(String(data.tournamentId));
      }
    } catch (e) {
      setCreateError("Create failed");
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const deleteSelectedTournament = async () => {
    if (!selectedTournament) return;

    setError("");
    setSuccess("");

    const { id, name, status, participantsCount } = selectedTournament;
    const allowedByRule =
      Number(participantsCount || 0) === 0 || status === "not_started";
    const needsStrongConfirm = status === "finished" || status === "in_progress";

    if (!allowedByRule && !needsStrongConfirm) {
      return setError(
        "Delete blocked by rules (must be 0 participants or not_started)."
      );
    }

    if (needsStrongConfirm) {
      const input = window.prompt(
        `Tournament "${name}" is ${status} with ${participantsCount} participants.\n` +
          `Type DELETE to confirm hard delete, or press Cancel and use Archive.`
      );
      if (input !== "DELETE")
          return;

      try {
        const res = await apiSafe(
          `/api/admin/tournaments/${Number(id)}?confirm=DELETE`,
          {
            method: "DELETE",
            token,
          }
        );

        if (!res)
            return;
      } catch (e) {
        return setError("Delete failed");
      }
    } else {
      const ok = window.confirm(`Delete tournament "${name}"?`);
      if (!ok)
          return;

      try {
        const res = await apiSafe(`/api/admin/tournaments/${Number(id)}`, {
          method: "DELETE",
          token,
        });

        if (!res)
            return;
      } catch (e) {
        return setError("Delete failed");
      }
    }

    flashSuccess("Tournament deleted");
    setTournamentId("");
    setRows([]);
    await loadTournaments();
  };

  const setTournamentStatus = async (status) => {
    if (!selectedTournament)
        return;

    setError("");
    setSuccess("");

    try {
      const res = await apiSafe(
        `/api/admin/tournaments/${Number(selectedTournament.id)}/status`,
        {
          method: "PATCH",
          token,
          body: { status },
        }
      );

      if (!res)
          return;
      flashSuccess(`Tournament marked as ${status}`);
      await loadTournaments();
    } catch (e) {
      setError("Failed to set status");
    }
  };

  const showingFrom = total === 0 ? 0 : (page - 1) * limit + 1;
  const showingTo = Math.min(page * limit, total);

  return (
    <main>
      <Hero hero="profileHero" />
      <h1>Admin · Tournaments</h1>
      <AdminNav />

      <div className="divInviteBtns">
        <button
          type="button"
          className="btnRefresh"
          onClick={() => {
            setCreateError("");
            setCreateOpen(true);
          }}
        >
          Create
        </button>

        <button type="button" className="btnRefresh" onClick={loadTournaments}>
          Refresh
        </button>

        <button
          type="button"
          className="btnRefresh"
          onClick={() => setTournamentStatus("in_progress")}
          disabled={!selectedTournament}
          title="Mark selected tournament as in progress"
        >
          Start
        </button>

        <button
          type="button"
          className="btnRefresh"
          onClick={() => setTournamentStatus("finished")}
          disabled={!selectedTournament}
          title="Mark selected tournament as finished"
        >
          Finish
        </button>

        <button
          type="button"
          className="btnRefresh"
          onClick={deleteSelectedTournament}
          disabled={!selectedTournament}
          title="Delete selected tournament"
        >
          Delete
        </button>
      </div>

      <div className="adminSearch-container">
        <select
          className="inpA"
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
          disabled={tournamentsLoading}
          title="Select tournament"
        >
          <option value="">
            {tournamentsLoading ? "Loading tournaments…" : "Select a tournament…"}
          </option>
          {tournaments.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} {t.date ? `(${t.date})` : ""} · {t.participantsCount ?? 0} ·{" "}
              {t.status}
            </option>
          ))}
        </select>

        <input
          className="inpA"
          placeholder="Search by email / name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={!tournamentId}
        />

        <select
          className="inpA"
          value={String(limit)}
          onChange={(e) => setLimit(Number(e.target.value))}
          title="Rows per page"
          disabled={!tournamentId}
        >
          {LIMIT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>

        <div className="numUsers">
          {!tournamentId
            ? "Pick a tournament"
            : loading
            ? "Loading…"
            : `Showing ${showingFrom}-${showingTo} of ${total}`}
        </div>
      </div>

      <div className="divInviteBtns">
        <button
          type="button"
          className="btnRefresh"
          onClick={loadSubscriptions}
          disabled={!tournamentId}
        >
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

      <TournamentSubsTable rows={rows} loading={loading} onCancel={cancelSubscription} tournamentStatus={deleteSelectedTournament?.status} />

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        loading={loading}
        onPageChange={setPage}
      />

      <CreateTournamentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={createTournament}
        loading={creating}
        error={createError}
      />
    </main>
  );
};

export default AdminTournamentSubsPage;
