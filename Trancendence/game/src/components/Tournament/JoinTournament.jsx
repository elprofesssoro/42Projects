import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "../utils/AuthContext";
import { GiTrophyCup } from "react-icons/gi";
import { useApi } from "../utils/useApi";
import "./Tournament.css";
import SubscribedTournaments from "./SubscribedTournaments";

const normalizeScheduleRow = (t) => ({
  ...t,
  tournament_id: t.tournamentId ?? t.tournament_id ?? null,

  t_name: t.t_name ?? t.tName ?? t.name ?? "",
  t_date: t.t_date ?? t.tDate ?? t.date ?? "",

  t_date_iso: t.t_date_iso ?? t.tDateIso ?? t.t_dateIso ?? t.starts_at ?? null,
  startsAt: t.startsAt ?? t.starts_at ?? t.start_at ?? null,

  registrationOpensAt:
    t.registrationOpensAt ??
    t.registration_opens_at ??
    t.registration_opensAt ??
    null,
  registrationClosesAt:
    t.registrationClosesAt ??
    t.registration_closes_at ??
    t.registration_closesAt ??
    null,
  registrationOpensOffsetMs:
    t.registrationOpensOffsetMs ??
    t.registration_opens_offset_ms ??
    t.registration_opensOffsetMs ??
    null,
  registrationClosesOffsetMs:
    t.registrationClosesOffsetMs ??
    t.registration_closes_offset_ms ??
    t.registration_closesOffsetMs ??
    null,
});

const toNiceError = (e) => {
  if (!e)
      return "Request failed";
  if (typeof e === "string")
      return e;
  if (e?.message)
      return e.message;
  try {
    return JSON.stringify(e);
  } catch {
    return "Request failed";
  }
};

const asDate = (value) => {
  if (!value)
      return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const formatDateOnlyGB = (value) => {
  const d = asDate(value);
  if (!d)
      return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};

const formatDateTimeGB = (value) => {
  const d = asDate(value);
  if (!d)
      return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

const extractQualifiedIdsFromBracket = (data) => {
  const bracket = Array.isArray(data?.bracket)
    ? data.bracket
    : Array.isArray(data?.matches)
    ? data.matches
    : Array.isArray(data)
    ? data
    : [];

  const quarterIds = new Set();

  for (const m of bracket) {
    const roundNumber = Number(m?.roundNumber ?? m?.round_number ?? m?.round ?? m?.roundNo);
    if (roundNumber !== 1)
        continue;

    const p1 = Number(m?.player1Id ?? m?.player1_id ?? m?.p1Id ?? m?.p1_id);
    const p2 = Number(m?.player2Id ?? m?.player2_id ?? m?.p2Id ?? m?.p2_id);

    if (Number.isFinite(p1) && p1 > 0)
        quarterIds.add(p1);
    if (Number.isFinite(p2) && p2 > 0)
        quarterIds.add(p2);
  }

  return Array.from(quarterIds);
};

const JoinTournament = () => {

  const { user, token, isAuthenticated } = useAuth();
  const playerId = user?.id;
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [subscribedIds, setSubscribedIds] = useState([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [actionError, setActionError] = useState("");
  const [qualifiedIds, setQualifiedIds] = useState([]);
  const [qualLoading, setQualLoading] = useState(false);

  const apiSafe = useApi();

  useEffect(() => {
    let alive = true;

    (async () => {
      setLoadingSchedule(true);
      const data = await apiSafe("/api/tournaments/schedule");
      if (!alive)
          return;

      if (!data) {
        setTournaments([]);
        setLoadingSchedule(false);
        return;
      }

      const list = Array.isArray(data) ? data : data?.schedule || [];
      setTournaments(list.map(normalizeScheduleRow));
      setLoadingSchedule(false);
    })();

    return () => {
      alive = false;
    };
  }, [apiSafe]);

  const refreshMySubscriptions = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setSubscribedIds([]);
      return;
    }

    setLoadingSubs(true);

    const data = await apiSafe("/api/tournaments/me/subscriptions", { token });
    if (!data) {
      setSubscribedIds([]);
      setLoadingSubs(false);
      return;
    }

    const subs = Array.isArray(data?.subscriptions) ? data.subscriptions : [];
    setSubscribedIds(subs.map((x) => Number(x)).filter(Boolean));

    setLoadingSubs(false);
  }, [isAuthenticated, token, apiSafe]);

  useEffect(() => {
    refreshMySubscriptions();
  }, [refreshMySubscriptions]);

  const assertSubscribedInDb = useCallback(
    async (tid) => {
      if (!token)
          return false;
      const data = await apiSafe("/api/tournaments/me/subscriptions", { token });
      if (!data)
          return false;
      const subs = Array.isArray(data?.subscriptions) ? data.subscriptions : [];
      return subs.map(Number).includes(Number(tid));
    },
    [token, apiSafe]
  );

  const availableTournaments = useMemo(() => {
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (tournaments || [])
      .map(normalizeScheduleRow)
      .filter((t) => t.tournament_id)
      .filter((t) => t.startsAt || t.t_date_iso)
      .filter((t) => {
        if (t.startsAt) {
          const ms = new Date(t.startsAt).getTime();
          return Number.isFinite(ms) && ms > now;
        }
        const d = new Date(t.t_date_iso);
        d.setHours(0, 0, 0, 0);
        return d >= today;
      });
  }, [tournaments]);

  const selectedIdNum = useMemo(
    () => Number(selectedTournamentId),
    [selectedTournamentId]
  );

  const isSubscribed = useMemo(() => {
    if (!selectedIdNum)
        return false;
    return subscribedIds.includes(selectedIdNum);
  }, [subscribedIds, selectedIdNum]);

  const selectedTournament = useMemo(() => {
    if (!selectedIdNum)
        return null;
    return (tournaments || [])
      .map(normalizeScheduleRow)
      .find((t) => Number(t.tournament_id) === selectedIdNum);
  }, [tournaments, selectedIdNum]);

  const startsAtValue = useMemo(() => {
    if (!selectedTournament)
        return null;
    return selectedTournament.startsAt || selectedTournament.t_date_iso || null;
  }, [selectedTournament]);

  const startsAtMs = useMemo(() => {
    const d = asDate(startsAtValue);
    return d ? d.getTime() : null;
  }, [startsAtValue]);

  const tournamentDateLabel = useMemo(() => {
    return formatDateOnlyGB(startsAtValue);
  }, [startsAtValue]);

  const registrationOpensLabel = useMemo(() => {
    if (!selectedTournament)
        return "";
    if (selectedTournament.registrationOpensAt) {
      return formatDateTimeGB(selectedTournament.registrationOpensAt);
    }

    const off = selectedTournament.registrationOpensOffsetMs;
    if (
      startsAtMs != null &&
      off != null &&
      Number.isFinite(Number(off)) &&
      Number(off) > 0
    ) {
      const ms = startsAtMs - Number(off);
      return formatDateTimeGB(new Date(ms).toISOString());
    }

    return "";
  }, [selectedTournament, startsAtMs]);

  const registrationClosesLabel = useMemo(() => {
    if (!selectedTournament)
        return "";

    if (selectedTournament.registrationClosesAt) {
      return formatDateTimeGB(selectedTournament.registrationClosesAt);
    }

    const off = selectedTournament.registrationClosesOffsetMs;
    if (
      startsAtMs != null &&
      off != null &&
      Number.isFinite(Number(off)) &&
      Number(off) > 0
    ) {
      const ms = startsAtMs - Number(off);
      return formatDateTimeGB(new Date(ms).toISOString());
    }

    return "";
  }, [selectedTournament, startsAtMs]);

  useEffect(() => {
    let alive = true;

    (async () => {
      setQualifiedIds([]);
      setQualLoading(false);
      if (!selectedIdNum)
          return;
      if (!isAuthenticated || !token)
          return;
      if (!isSubscribed)
          return;
      setQualLoading(true);
      const data = await apiSafe(`/api/tournaments/${selectedIdNum}/bracket`, {
        token,
      });

      if (!alive)
          return;
      if (!data) {
        setQualifiedIds([]);
        setQualLoading(false);
        return;
      }

      const ids = extractQualifiedIdsFromBracket(data);
      setQualifiedIds(ids);
      setQualLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [apiSafe, token, isAuthenticated, selectedIdNum, isSubscribed]);

  const qualificationLabel = useMemo(() => {
    if (!selectedIdNum || !playerId)
        return "";
    if (!isSubscribed)
        return "";
    if (qualLoading)
        return "Checking…";
    if (!qualifiedIds.length)
        return "Pending";

    const inTop8 = qualifiedIds.includes(Number(playerId));
    return inTop8 ? "Qualified ✅" : "Not qualified ❌";
  }, [selectedIdNum, playerId, isSubscribed, qualLoading, qualifiedIds]);

  const subscribe = async () => {
    setActionError("");
    if (!isAuthenticated || !token || !selectedIdNum)
        return;

    try {
      const res = await apiSafe(`/api/tournaments/${selectedIdNum}/join`, {
        method: "POST",
        token,
      });

      if (!res)
          return;

      await refreshMySubscriptions();

      const ok = await assertSubscribedInDb(selectedIdNum);
      if (!ok)
          setActionError("Subscribe request sent, but DB did not record it.");
    } catch (e) {
      console.error(e);
      setActionError(toNiceError(e));
      await refreshMySubscriptions();
    }
  };

  const unsubscribe = async () => {
    setActionError("");
    if (!isAuthenticated || !token || !selectedIdNum)
        return;

    try {
      const res = await apiSafe(`/api/tournaments/${selectedIdNum}/leave`, {
        method: "POST",
        token,
      });

      if (!res)
          return;

      await refreshMySubscriptions();
      const still = await assertSubscribedInDb(selectedIdNum);
      if (still) {
        setActionError("Unsubscribe request sent, but DB still shows you subscribed.");
      }
    } catch (e) {
      console.error(e);
      setActionError(toNiceError(e));
      await refreshMySubscriptions();
    }
  };

  return (
    <div>
      <h2>Join Tournament</h2>
      {!playerId && (
        <p>You must be logged in to subscribe (this page should be private).</p>
      )}

      <div className="tSubscribe">
        <div className="tForm">
          <label htmlFor="tournamentSelect">Choose Tournament:</label>{" "}
          <select
            id="tournamentSelect"
            value={selectedTournamentId}
            onChange={(e) => setSelectedTournamentId(e.target.value)}
            disabled={loadingSchedule || !availableTournaments.length}
          >
            <option value="">
              {loadingSchedule
                ? "Loading…"
                : availableTournaments.length
                ? "select"
                : "No upcoming tournaments"}
            </option>

            {availableTournaments.map((t) => {
              const iso = t.startsAt || t.t_date_iso;
              const dateLabel = iso ? formatDateOnlyGB(iso) : t.t_date;
              return (
                <option
                  key={Number(t.tournament_id)}
                  value={String(t.tournament_id)}
                >
                  {t.t_name} ({dateLabel})
                </option>
              );
            })}
          </select>
        </div>

        <div className="jTrophy">
          <GiTrophyCup />
        </div>

        {selectedTournamentId && (
          <div>
            <p className="jTStatus">
              Status:{" "}
              <b>
                {loadingSubs
                  ? "Checking…"
                  : isSubscribed
                  ? "Subscribed ✅"
                  : "Not subscribed ❌"}
              </b>
            </p>

            {qualificationLabel ? (
              <p className="jTStatus" style={{ marginTop: 6 }}>
                Qualification: <b>{qualificationLabel}</b>
              </p>
            ) : null}

            {tournamentDateLabel ? (
              <p style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>
                Tournament date: <b>{tournamentDateLabel}</b>
              </p>
            ) : null}

            {registrationOpensLabel ? (
              <p style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>
                Subscription opens: <b>{registrationOpensLabel}</b>
              </p>
            ) : null}

            {registrationClosesLabel ? (
              <p style={{ marginTop: 6, fontSize: 13, opacity: 0.85 }}>
                Subscription closes: <b>{registrationClosesLabel}</b>
              </p>
            ) : null}

            {actionError ? (
              <p style={{ marginTop: 8, fontSize: 13, color: "red" }}>
                {actionError}
              </p>
            ) : null}

            {!isSubscribed ? (
              <button
                type="button"
                onClick={subscribe}
                disabled={!playerId || loadingSubs}
                className="sTBtn"
              >
                Subscribe
              </button>
            ) : (
              <button
                type="button"
                onClick={unsubscribe}
                disabled={!playerId || loadingSubs}
                className="sTBtn"
              >
                Unsubscribe
              </button>
            )}
          </div>
        )}
      </div>

      <SubscribedTournaments
        subscribedIds={subscribedIds}
        tournaments={tournaments}
        loading={loadingSubs}
      />
    </div>
  );
};

export default JoinTournament;
