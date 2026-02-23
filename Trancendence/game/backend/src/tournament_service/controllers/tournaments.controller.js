import { query } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

let tpColsCache = null;
async function tournamentParticipantsHasColumn(col) {
  if (!tpColsCache) {
    const { rows } = await query(
      `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='tournament_participants'
      `
    );
    tpColsCache = new Set(rows.map((r) => r.column_name));
  }
  return tpColsCache.has(col);
}

const DEFAULT_OPENS_MS = 10 * 24 * 60 * 60 * 1000;
const DEFAULT_CLOSES_MS = 5 * 24 * 60 * 60 * 1000;

const GAME_WIN_POINTS = 5;
const MATCH_WIN_POINTS = 20;

async function backfillAdvancements(tournamentId) {
  
  await query(
    `
    UPDATE tournament_bracket_matches t
    SET
      player1_id = s.winner_id,
      status = CASE
        WHEN t.status <> 'finished' AND s.winner_id IS NOT NULL AND t.player2_id IS NOT NULL THEN 'scheduled'
        ELSE t.status
      END
    FROM tournament_bracket_matches s
    WHERE t.tournament_id = $1
      AND s.tournament_id = $1
      AND t.source_match1_id = s.id
      AND s.winner_id IS NOT NULL
      AND (t.player1_id IS NULL OR t.player1_id <> s.winner_id)
    `,
    [tournamentId]
  );

  await query(
    `
    UPDATE tournament_bracket_matches t
    SET
      player2_id = s.winner_id,
      status = CASE
        WHEN t.status <> 'finished' AND s.winner_id IS NOT NULL AND t.player1_id IS NOT NULL THEN 'scheduled'
        ELSE t.status
      END
    FROM tournament_bracket_matches s
    WHERE t.tournament_id = $1
      AND s.tournament_id = $1
      AND t.source_match2_id = s.id
      AND s.winner_id IS NOT NULL
      AND (t.player2_id IS NULL OR t.player2_id <> s.winner_id)
    `,
    [tournamentId]
  );

 
  await query(
    `
    UPDATE tournament_bracket_matches
    SET status = 'scheduled'
    WHERE tournament_id = $1
      AND status = 'pending'
      AND player1_id IS NOT NULL
      AND player2_id IS NOT NULL
    `,
    [tournamentId]
  );
}

async function generateBracketIfNeeded(tournamentId) {
  const existing = await query(
    `SELECT COUNT(*)::int AS c FROM tournament_bracket_matches WHERE tournament_id = $1`,
    [tournamentId]
  );
  const existingCount = Number(existing.rows?.[0]?.c || 0);
  if (existingCount >= 7) return;

  const { rows: tRows } = await query(
    `
    SELECT
      id::int AS id,
      starts_at,
      registration_opens_offset_ms,
      registration_closes_offset_ms
    FROM tournaments
    WHERE id = $1
    `,
    [tournamentId]
  );
  const t = tRows[0];
  if (!t) return;

  const now = Date.now();
  const startsAtMs = new Date(t.starts_at).getTime();
  if (!Number.isFinite(startsAtMs)) return;

  const closesOffset = Number(t.registration_closes_offset_ms ?? DEFAULT_CLOSES_MS);
  const closesAt = startsAtMs - closesOffset;

  if (now < closesAt && now < startsAtMs) return;

  if (existingCount > 0 && existingCount < 7) {
    const { rows: q } = await query(
      `
      SELECT id::int AS id
      FROM tournament_bracket_matches
      WHERE tournament_id = $1 AND round_number = 1
      ORDER BY slot_number ASC
      `,
      [tournamentId]
    );

    if (q.length === 4) {
      const { rows: sf } = await query(
        `
        SELECT id::int AS id, slot_number::int AS slot_number
        FROM tournament_bracket_matches
        WHERE tournament_id = $1 AND round_number = 2
        ORDER BY slot_number ASC
        `,
        [tournamentId]
      );

      let s1Id = sf.find((x) => Number(x.slot_number) === 1)?.id || null;
      let s2Id = sf.find((x) => Number(x.slot_number) === 2)?.id || null;

      if (!s1Id) {
        const ins = await query(
          `
          INSERT INTO tournament_bracket_matches
            (tournament_id, round_number, round_name, slot_number, player1_id, player2_id, status, source_match1_id, source_match2_id)
          VALUES
            ($1, 2, 'Semifinals', 1, NULL, NULL, 'pending', $2, $3)
          ON CONFLICT (tournament_id, round_number, slot_number) DO UPDATE
          SET
            round_name = EXCLUDED.round_name,
            source_match1_id = COALESCE(tournament_bracket_matches.source_match1_id, EXCLUDED.source_match1_id),
            source_match2_id = COALESCE(tournament_bracket_matches.source_match2_id, EXCLUDED.source_match2_id)
          RETURNING id::int AS id
          `,
          [tournamentId, q[0].id, q[1].id]
        );

        if (ins.rows?.[0]?.id) s1Id = ins.rows[0].id;
        else {
          const sel = await query(
            `
            SELECT id::int AS id
            FROM tournament_bracket_matches
            WHERE tournament_id = $1 AND round_number = 2 AND slot_number = 1
            LIMIT 1
            `,
            [tournamentId]
          );
          s1Id = sel.rows?.[0]?.id || null;
        }
      }

      if (!s2Id) {
        const ins = await query(
          `
          INSERT INTO tournament_bracket_matches
            (tournament_id, round_number, round_name, slot_number, player1_id, player2_id, status, source_match1_id, source_match2_id)
          VALUES
            ($1, 2, 'Semifinals', 2, NULL, NULL, 'pending', $2, $3)
          ON CONFLICT (tournament_id, round_number, slot_number) DO UPDATE
          SET
            round_name = EXCLUDED.round_name,
            source_match1_id = COALESCE(tournament_bracket_matches.source_match1_id, EXCLUDED.source_match1_id),
            source_match2_id = COALESCE(tournament_bracket_matches.source_match2_id, EXCLUDED.source_match2_id)
          RETURNING id::int AS id
          `,
          [tournamentId, q[2].id, q[3].id]
        );

        if (ins.rows?.[0]?.id) s2Id = ins.rows[0].id;
        else {
          const sel = await query(
            `
            SELECT id::int AS id
            FROM tournament_bracket_matches
            WHERE tournament_id = $1 AND round_number = 2 AND slot_number = 2
            LIMIT 1
            `,
            [tournamentId]
          );
          s2Id = sel.rows?.[0]?.id || null;
        }
      }

      const { rows: f } = await query(
        `
        SELECT id::int AS id
        FROM tournament_bracket_matches
        WHERE tournament_id = $1 AND round_number = 3 AND slot_number = 1
        LIMIT 1
        `,
        [tournamentId]
      );

      if (!f[0]?.id) {
        await query(
          `
          INSERT INTO tournament_bracket_matches
            (tournament_id, round_number, round_name, slot_number, player1_id, player2_id, status, source_match1_id, source_match2_id)
          VALUES
            ($1, 3, 'Final', 1, NULL, NULL, 'pending', $2, $3)
          ON CONFLICT (tournament_id, round_number, slot_number) DO UPDATE
          SET
            round_name = EXCLUDED.round_name,
            source_match1_id = COALESCE(tournament_bracket_matches.source_match1_id, EXCLUDED.source_match1_id),
            source_match2_id = COALESCE(tournament_bracket_matches.source_match2_id, EXCLUDED.source_match2_id)
          `,
          [tournamentId, s1Id, s2Id]
        );
      }

      return;
    }

    return;
  }

  const hasCreatedAt = await tournamentParticipantsHasColumn("created_at");
  const { rows: pRows } = await query(
    `
    WITH m AS (
      SELECT
        player1_id::int AS user_id,
        COALESCE(player1_games_won, 0)::int AS games_won,
        CASE
          WHEN COALESCE(player1_games_won,0) > COALESCE(player2_games_won,0) THEN 1
          ELSE 0
        END::int AS match_win
      FROM matches
      WHERE player1_id IS NOT NULL AND player2_id IS NOT NULL
      UNION ALL
      SELECT
        player2_id::int AS user_id,
        COALESCE(player2_games_won, 0)::int AS games_won,
        CASE
          WHEN COALESCE(player2_games_won,0) > COALESCE(player1_games_won,0) THEN 1
          ELSE 0
        END::int AS match_win
      FROM matches
      WHERE player1_id IS NOT NULL AND player2_id IS NOT NULL
    ),
    stats AS (
      SELECT
        user_id,
        COUNT(*)::int AS matches_played,
        (SUM(games_won) * ${GAME_WIN_POINTS} + SUM(match_win) * ${MATCH_WIN_POINTS})::int AS points
      FROM m
      GROUP BY user_id
    )
    SELECT tp.user_id::int AS user_id
    FROM tournament_participants tp
    LEFT JOIN stats s ON s.user_id = tp.user_id
    LEFT JOIN users u ON u.id = tp.user_id
    WHERE tp.tournament_id = $1
    ORDER BY
      COALESCE(s.points, 0) DESC,
      COALESCE(s.matches_played, 0) DESC,
      COALESCE(u.p_name, '') ASC
      ${hasCreatedAt ? ", tp.created_at ASC" : ", tp.user_id ASC"}
    LIMIT 12
    `,
    [tournamentId]
  );

  const subscribed = pRows.map((r) => Number(r.user_id)).filter(Boolean);
  const mains = subscribed.slice(0, 8);
  if (mains.length === 0) return;
  while (mains.length < 8) mains.push(null);

  const qPairs = [
    [mains[0], mains[7]],
    [mains[1], mains[6]],
    [mains[2], mains[5]],
    [mains[3], mains[4]],
  ];

  const qIds = [];
  for (let i = 0; i < 4; i++) {
    const slot = i + 1;
    const [p1, p2] = qPairs[i];

    const ins = await query(
      `
      INSERT INTO tournament_bracket_matches
        (tournament_id, round_number, round_name, slot_number, player1_id, player2_id, status)
      VALUES
        ($1, 1, 'Quarterfinals', $2, $3, $4, 'scheduled')
      ON CONFLICT (tournament_id, round_number, slot_number) DO UPDATE
      SET
        round_name = EXCLUDED.round_name,
        player1_id = COALESCE(tournament_bracket_matches.player1_id, EXCLUDED.player1_id),
        player2_id = COALESCE(tournament_bracket_matches.player2_id, EXCLUDED.player2_id)
      RETURNING id::int AS id
      `,
      [tournamentId, slot, p1, p2]
    );

    if (ins.rows?.[0]?.id) {
      qIds.push(ins.rows[0].id);
      continue;
    }

    const sel = await query(
      `
      SELECT id::int AS id
      FROM tournament_bracket_matches
      WHERE tournament_id = $1 AND round_number = 1 AND slot_number = $2
      LIMIT 1
      `,
      [tournamentId, slot]
    );

    if (!sel.rows?.[0]?.id) return;
    qIds.push(sel.rows[0].id);
  }

  const semi1 = await query(
    `
    INSERT INTO tournament_bracket_matches
      (tournament_id, round_number, round_name, slot_number, player1_id, player2_id, status, source_match1_id, source_match2_id)
    VALUES
      ($1, 2, 'Semifinals', 1, NULL, NULL, 'pending', $2, $3)
    ON CONFLICT (tournament_id, round_number, slot_number) DO UPDATE
    SET
      round_name = EXCLUDED.round_name,
      source_match1_id = COALESCE(tournament_bracket_matches.source_match1_id, EXCLUDED.source_match1_id),
      source_match2_id = COALESCE(tournament_bracket_matches.source_match2_id, EXCLUDED.source_match2_id)
    RETURNING id::int AS id
    `,
    [tournamentId, qIds[0], qIds[1]]
  );

  let s1Id = semi1.rows?.[0]?.id || null;
  if (!s1Id) {
    const sel = await query(
      `
      SELECT id::int AS id
      FROM tournament_bracket_matches
      WHERE tournament_id = $1 AND round_number = 2 AND slot_number = 1
      LIMIT 1
      `,
      [tournamentId]
    );
    s1Id = sel.rows?.[0]?.id || null;
  }

  const semi2 = await query(
    `
    INSERT INTO tournament_bracket_matches
      (tournament_id, round_number, round_name, slot_number, player1_id, player2_id, status, source_match1_id, source_match2_id)
    VALUES
      ($1, 2, 'Semifinals', 2, NULL, NULL, 'pending', $2, $3)
    ON CONFLICT (tournament_id, round_number, slot_number) DO UPDATE
    SET
      round_name = EXCLUDED.round_name,
      source_match1_id = COALESCE(tournament_bracket_matches.source_match1_id, EXCLUDED.source_match1_id),
      source_match2_id = COALESCE(tournament_bracket_matches.source_match2_id, EXCLUDED.source_match2_id)
    RETURNING id::int AS id
    `,
    [tournamentId, qIds[2], qIds[3]]
  );

  let s2Id = semi2.rows?.[0]?.id || null;
  if (!s2Id) {
    const sel = await query(
      `
      SELECT id::int AS id
      FROM tournament_bracket_matches
      WHERE tournament_id = $1 AND round_number = 2 AND slot_number = 2
      LIMIT 1
      `,
      [tournamentId]
    );
    s2Id = sel.rows?.[0]?.id || null;
  }

  await query(
    `
    INSERT INTO tournament_bracket_matches
      (tournament_id, round_number, round_name, slot_number, player1_id, player2_id, status, source_match1_id, source_match2_id)
    VALUES
      ($1, 3, 'Final', 1, NULL, NULL, 'pending', $2, $3)
    ON CONFLICT (tournament_id, round_number, slot_number) DO UPDATE
    SET
      round_name = EXCLUDED.round_name,
      source_match1_id = COALESCE(tournament_bracket_matches.source_match1_id, EXCLUDED.source_match1_id),
      source_match2_id = COALESCE(tournament_bracket_matches.source_match2_id, EXCLUDED.source_match2_id)
    `,
    [tournamentId, s1Id, s2Id]
  );
}


export const tournamentsController = {
  list: asyncHandler(async (req, res) => {
    await query(`
      UPDATE tournaments
      SET status = 'in_progress', updated_at = now()
      WHERE status = 'not_started'
        AND starts_at <= now()
    `);

    const { rows } = await query(`
      SELECT
        t.id::int AS id,
        t.name,
        t.visibility,
        t.status,
        t.created_by::int AS created_by,
        t.starts_at,
        t.created_at,
        t.updated_at,
        COALESCE(
          (
            SELECT json_agg(tp.user_id::int ORDER BY tp.user_id)
            FROM tournament_participants tp
            WHERE tp.tournament_id = t.id
          ),
          '[]'::json
        ) AS participants,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'roundNumber', r.round_number::int,
                'name', r.round_name,
                'matchIds', r.match_ids
              )
              ORDER BY r.round_number
            )
            FROM (
              SELECT
                tm.round_number,
                tm.round_name,
                array_agg(tm.match_id::int ORDER BY tm.match_id)::int[] AS match_ids
              FROM tournament_matches tm
              WHERE tm.tournament_id = t.id
              GROUP BY tm.round_number, tm.round_name
            ) r
          ),
          '[]'::json
        ) AS rounds
      FROM tournaments t
      ORDER BY t.starts_at ASC NULLS LAST, t.id ASC
    `);
    res.json({ tournaments: rows });
  }),

 schedule: asyncHandler(async (req, res) => {
  const { rows } = await query(
    `
    WITH base AS (
      SELECT
        ts.id::int AS id,
        ts.tournament_id::int AS "tournamentId",
        COALESCE(t.name, ts.t_name) AS "tName",
        ts.t_date AS "tDate",
        ts.t_date_iso AS "tDateIso",
        t.starts_at AS "startsAt",
        t.registration_opens_offset_ms AS "registrationOpensOffsetMs",
        t.registration_closes_offset_ms AS "registrationClosesOffsetMs"
      FROM tournament_schedule ts
      JOIN tournaments t ON t.id = ts.tournament_id
    ),
    upcoming AS (
      SELECT *
      FROM base
      WHERE "tDateIso" >= CURRENT_DATE
    ),
    past_one AS (
      SELECT *
      FROM base
      WHERE "tDateIso" < CURRENT_DATE
      ORDER BY "tDateIso" DESC
      LIMIT 1
    )
    SELECT * FROM past_one
    UNION ALL
    SELECT * FROM upcoming
    ORDER BY "tDateIso" ASC
    `
  );
  res.json({ schedule: rows });
}),

  rounds: asyncHandler(async (req, res) => {
    const tournamentId = Number(req.params.id);
    if (!tournamentId)
        return res.status(400).json({ error: "Invalid tournament id" });

    const { rows } = await query(
      `
      SELECT
        tm.tournament_id::int AS "tournamentId",
        tm.round_number::int AS "roundNumber",
        tm.round_name AS "name",
        array_agg(tm.match_id::int ORDER BY tm.match_id)::int[] AS "matchIds"
      FROM tournament_matches tm
      WHERE tm.tournament_id = $1
      GROUP BY tm.tournament_id, tm.round_number, tm.round_name
      ORDER BY tm.round_number
      `,
      [tournamentId]
    );
    res.json({ rounds: rows });
  }),

  bracket: asyncHandler(async (req, res) => {
    const tournamentId = Number(req.params.id);
    if (!tournamentId)
        return res.status(400).json({ error: "Invalid tournament id" });
    await generateBracketIfNeeded(tournamentId);
    await backfillAdvancements(tournamentId);

    const { rows } = await query(
      `
      SELECT
        tbm.id::int AS id,
        tbm.tournament_id::int AS "tournamentId",
        tbm.round_number::int AS "roundNumber",
        tbm.round_name AS "roundName",
        tbm.slot_number::int AS "slotNumber",
        tbm.player1_id::int AS "player1Id",
        tbm.player2_id::int AS "player2Id",
        tbm.winner_id::int AS "winnerId",
        tbm.status,
        tbm.source_match1_id::int AS "sourceMatch1Id",
        tbm.source_match2_id::int AS "sourceMatch2Id",
        tbm.played_match_id::int AS "playedMatchId",
        tbm.scheduled_at,
        tbm.started_at,
        tbm.finished_at,
        to_char(m.played_at, 'DD/MM/YYYY') AS "playedDate",
        m.player1_id::int AS "mPlayer1Id",
        m.player2_id::int AS "mPlayer2Id",
        COALESCE(m.player1_games_won, 0)::int AS "mPlayer1GamesWon",
        COALESCE(m.player2_games_won, 0)::int AS "mPlayer2GamesWon",
        COALESCE(g.player1_points, ARRAY[0,0,0,0]::int[]) AS "mPlayer1Points",
        COALESCE(g.player2_points, ARRAY[0,0,0,0]::int[]) AS "mPlayer2Points"
      FROM tournament_bracket_matches tbm
      LEFT JOIN matches m ON m.id = tbm.played_match_id
      LEFT JOIN (
        SELECT
          mg.match_id,
          array_agg(mg.player1_points ORDER BY mg.game_number)::int[] AS player1_points,
          array_agg(mg.player2_points ORDER BY mg.game_number)::int[] AS player2_points
        FROM match_games mg
        WHERE mg.game_number BETWEEN 1 AND 4
        GROUP BY mg.match_id
      ) g ON g.match_id = m.id
      WHERE tbm.tournament_id = $1
      ORDER BY tbm.round_number ASC, tbm.slot_number ASC
      `,
      [tournamentId]
    );
    res.json({ bracket: rows });
  }),

 registerBracketResult: asyncHandler(async (req, res) => {
  const tournamentId = Number(req.params.id);
  const bracketMatchId = Number(req.params.matchId);
  const me = Number(req.user?.id);

  const playedMatchId = Number(req.body?.playedMatchId);
  const winnerId = Number(req.body?.winnerId);

  const isPosInt = (n) => Number.isInteger(n) && n > 0;

  if (!isPosInt(tournamentId) || !isPosInt(bracketMatchId)) {
    return res.status(400).json({ error: "Invalid ids" });
  }
  if (!isPosInt(me)) return res.status(401).json({ error: "Unauthorized" });
  if (!isPosInt(playedMatchId) || !isPosInt(winnerId)) {
    return res.status(400).json({ error: "playedMatchId and winnerId are required" });
  }

  // Load bracket match for permission + quick validation
  const { rows: bmRows } = await query(
    `
    SELECT
      id::int AS id,
      tournament_id::int AS "tournamentId",
      round_number::int AS "roundNumber",
      player1_id::int AS "player1Id",
      player2_id::int AS "player2Id",
      winner_id::int AS "winnerId",
      played_match_id::int AS "playedMatchId",
      status
    FROM tournament_bracket_matches
    WHERE id = $1
    `,
    [bracketMatchId]
  );

  const bm = bmRows[0];
  if (!bm || bm.tournamentId !== tournamentId) {
    return res.status(404).json({ error: "Bracket match not found" });
  }

  const isAdmin = req.user?.role === "admin";
  const isParticipant = Number(bm.player1Id) === me || Number(bm.player2Id) === me;

  if (!isAdmin && !isParticipant) {
    return res.status(403).json({ error: "Forbidden" });
  }

  if (!bm.player1Id || !bm.player2Id) {
    return res.status(400).json({ error: "Match is not ready (missing player)" });
  }

  if (winnerId !== Number(bm.player1Id) && winnerId !== Number(bm.player2Id)) {
    return res.status(400).json({ error: "Winner must be one of the match players" });
  }

  if (bm.winnerId || bm.playedMatchId || bm.status === "finished") {
    return res.status(409).json({ error: "Result already registered for this match" });
  }

  // Atomic write: validate played match players, bind match to tournament, finish bracket match,
  // advance winner downstream without overwriting, and update tournament status.
  const bmP1 = Number(bm.player1Id);
  const bmP2 = Number(bm.player2Id);

  const { rows: outRows } = await query(
    `
    WITH played AS (
      SELECT
        id::int AS id,
        player1_id::int AS p1,
        player2_id::int AS p2,
        tournament_id::int AS tournament_id
      FROM matches
      WHERE id = $1
    ),

    valid_played AS (
      SELECT 1 AS ok
      FROM played
      WHERE
        -- match exists
        played.id IS NOT NULL
        -- match players match the bracket players (either order)
        AND (
          (played.p1 = $2 AND played.p2 = $3)
          OR
          (played.p1 = $3 AND played.p2 = $2)
        )
        -- prevent stealing a match already bound to another tournament
        AND (played.tournament_id IS NULL OR played.tournament_id = $4)
    ),

    bind_match AS (
      UPDATE matches
      SET mode = 'tournament',
          tournament_id = $4
      WHERE id = $1
        AND EXISTS (SELECT 1 FROM valid_played)
        AND (tournament_id IS NULL OR tournament_id = $4)
      RETURNING id
    ),

    finish_bm AS (
      UPDATE tournament_bracket_matches
      SET
        played_match_id = $1,
        winner_id = $5,
        status = 'finished',
        finished_at = now(),
        updated_at = now()
      WHERE id = $6
        AND tournament_id = $4
        AND winner_id IS NULL
        AND played_match_id IS NULL
        AND status <> 'finished'
        AND EXISTS (SELECT 1 FROM valid_played)
      RETURNING round_number
    ),

    -- Advance winner to downstream match slots, but DO NOT overwrite if already filled with different player
    adv1 AS (
      UPDATE tournament_bracket_matches
      SET
        player1_id = COALESCE(player1_id, $5),
        status = CASE
          WHEN status <> 'finished'
           AND COALESCE(player1_id, $5) IS NOT NULL
           AND player2_id IS NOT NULL
          THEN 'scheduled'
          ELSE status
        END,
        updated_at = now()
      WHERE tournament_id = $4
        AND source_match1_id = $6
        AND (player1_id IS NULL OR player1_id = $5)
      RETURNING id
    ),

    adv2 AS (
      UPDATE tournament_bracket_matches
      SET
        player2_id = COALESCE(player2_id, $5),
        status = CASE
          WHEN status <> 'finished'
           AND player1_id IS NOT NULL
           AND COALESCE(player2_id, $5) IS NOT NULL
          THEN 'scheduled'
          ELSE status
        END,
        updated_at = now()
      WHERE tournament_id = $4
        AND source_match2_id = $6
        AND (player2_id IS NULL OR player2_id = $5)
      RETURNING id
    ),

    final_round AS (
      SELECT MAX(round_number)::int AS max_round
      FROM tournament_bracket_matches
      WHERE tournament_id = $4
    ),

    final_unfinished AS (
      SELECT 1 AS has_unfinished
      FROM tournament_bracket_matches tbm, final_round fr
      WHERE tbm.tournament_id = $4
        AND tbm.round_number = fr.max_round
        AND tbm.status <> 'finished'
      LIMIT 1
    ),

    upd_t AS (
      UPDATE tournaments
      SET status = CASE
        WHEN EXISTS (SELECT 1 FROM final_unfinished)
          THEN CASE WHEN status = 'not_started' THEN 'in_progress' ELSE status END
        ELSE 'finished'
      END,
      updated_at = now()
      WHERE id = $4
      RETURNING status
    )

    SELECT
      (SELECT COUNT(*)::int FROM valid_played) AS valid_played,
      (SELECT COUNT(*)::int FROM bind_match)  AS match_bound,
      (SELECT COUNT(*)::int FROM finish_bm)   AS bm_finished,
      (SELECT status FROM upd_t)              AS tournament_status
    `,
    [
      playedMatchId, // $1
      bmP1,          // $2
      bmP2,          // $3
      tournamentId,  // $4
      winnerId,      // $5
      bracketMatchId // $6
    ]
  );

  const out = outRows[0] || {
    valid_played: 0,
    match_bound: 0,
    bm_finished: 0,
    tournament_status: null
  };

  if (Number(out.valid_played) === 0) {
    return res.status(400).json({
      error: "Played match is invalid for this bracket match",
      details: "Match not found OR players do not match OR match belongs to another tournament",
    });
  }

  // If someone already registered, finish_bm will be 0
  if (Number(out.bm_finished) === 0) {
    return res.status(409).json({ error: "Result already registered for this match" });
  }

  // If match couldn't be bound (rare), treat as conflict
  if (Number(out.match_bound) === 0) {
    return res.status(409).json({ error: "Could not bind played match to tournament" });
  }

  // Optional: normalize any pending/scheduled statuses downstream (your existing helper)
  await backfillAdvancements(tournamentId);

  res.json({ ok: true, tournamentStatus: out.tournament_status });
}),


  join: asyncHandler(async (req, res) => {
    const tournamentId = Number(req.params.id);
    const me = Number(req.user?.id);
    if (!tournamentId)
        return res.status(400).json({ error: "Invalid tournament id" });
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const { rows: tRows } = await query(
      `
      SELECT
        id::int AS id,
        starts_at,
        status,
        visibility,
        registration_opens_offset_ms,
        registration_closes_offset_ms
      FROM tournaments
      WHERE id = $1
      `,
      [tournamentId]
    );

    const tournament = tRows[0];
    if (!tournament)
        return res.status(404).json({ error: "Tournament not found" });
    const now = Date.now();
    const startsAtMs = new Date(tournament.starts_at).getTime();
    const opensOffset = Number(tournament.registration_opens_offset_ms ?? DEFAULT_OPENS_MS);
    const closesOffset = Number(tournament.registration_closes_offset_ms ?? DEFAULT_CLOSES_MS);
    const opensAt = startsAtMs - opensOffset;
    const closesAt = startsAtMs - closesOffset;

    if (Number.isNaN(startsAtMs)) {
      return res.status(400).json({ error: "Tournament start date is invalid" });
    }

    if (now >= startsAtMs) {
      return res.status(400).json({ error: "Tournament already started (locked)" });
    }

    if (now < opensAt) {
      return res.status(400).json({
        error: "Registration not open yet",
        opensAt,
        closesAt,
        startsAt: startsAtMs,
      });
    }

    if (now > closesAt) {
      return res.status(400).json({
        error: "Registration is closed",
        opensAt,
        closesAt,
        startsAt: startsAtMs,
      });
    }

    const hasCreatedAt = await tournamentParticipantsHasColumn("created_at");

    if (hasCreatedAt) {
      await query(
        `
        INSERT INTO tournament_participants (tournament_id, user_id, created_at)
        VALUES ($1, $2, now())
        ON CONFLICT (tournament_id, user_id) DO NOTHING
        `,
        [tournamentId, me]
      );
    } else {
      await query(
        `
        INSERT INTO tournament_participants (tournament_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (tournament_id, user_id) DO NOTHING
        `,
        [tournamentId, me]
      );
    }

    res.json({ ok: true, tournamentId, userId: me });
  }),

  advanceBracketMatch: asyncHandler(async (req, res) => {
  const tournamentId = Number(req.params.id);
  const bracketMatchId = Number(req.params.matchId);
  const winnerId = Number(req.body?.winnerId);

  if (!tournamentId || !bracketMatchId) {
    return res.status(400).json({ error: "Invalid ids" });
  }
  if (!winnerId || !Number.isFinite(winnerId) || winnerId <= 0) {
    return res.status(400).json({ error: "winnerId is required" });
  }

  
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const { rows: mRows } = await query(
    `
    SELECT
      id::int AS id,
      tournament_id::int AS "tournamentId",
      round_number::int AS "roundNumber",
      player1_id::int AS "player1Id",
      player2_id::int AS "player2Id",
      winner_id::int AS "winnerId",
      played_match_id::int AS "playedMatchId",
      status
    FROM tournament_bracket_matches
    WHERE id = $1
    `,
    [bracketMatchId]
  );

  const bm = mRows[0];
  if (!bm || bm.tournamentId !== tournamentId) {
    return res.status(404).json({ error: "Bracket match not found" });
  }

  if (bm.winnerId || bm.playedMatchId || bm.status === "finished") {
    return res.status(400).json({ error: "Match already finished" });
  }

 
  const isReady = Boolean(bm.player1Id) && Boolean(bm.player2Id);
  if (isReady) {
    return res.status(400).json({
      error: "This match already has two players. Use Register result instead.",
    });
  }

  const { rows: pRows } = await query(
    `
    SELECT 1
    FROM tournament_participants
    WHERE tournament_id = $1 AND user_id = $2
    LIMIT 1
    `,
    [tournamentId, winnerId]
  );
  if (!pRows.length) {
    return res.status(400).json({ error: "Winner must be a tournament participant" });
  }

  
  if (!bm.player1Id && !bm.player2Id) {
    await query(
      `
      UPDATE tournament_bracket_matches
      SET player1_id = $1,
          status = CASE WHEN status <> 'finished' THEN 'pending' ELSE status END
      WHERE id = $2
      `,
      [winnerId, bracketMatchId]
    );
  }

  
  await query(
    `
    UPDATE tournament_bracket_matches
    SET
      played_match_id = NULL,
      winner_id = $1,
      status = 'finished',
      finished_at = now()
    WHERE id = $2
    `,
    [winnerId, bracketMatchId]
  );

  
  await query(
  `
  UPDATE tournament_bracket_matches
  SET
    player1_id = $1::int,
    status = CASE
      WHEN $1::int IS NOT NULL AND player2_id IS NOT NULL THEN 'scheduled'
      ELSE status
    END
  WHERE tournament_id = $2::int AND source_match1_id = $3::int
  `,
  [winnerId, tournamentId, bracketMatchId]
);

await query(
  `
  UPDATE tournament_bracket_matches
  SET
    player2_id = $1::int,
    status = CASE
      WHEN player1_id IS NOT NULL AND $1::int IS NOT NULL THEN 'scheduled'
      ELSE status
    END
  WHERE tournament_id = $2::int AND source_match2_id = $3::int
  `,
  [winnerId, tournamentId, bracketMatchId]
);


 
  await backfillAdvancements(tournamentId);
  if (Number(bm.roundNumber) === 3) {
    await query(
      `UPDATE tournaments SET status = 'finished', updated_at = now() WHERE id = $1`,
      [tournamentId]
    );
  } else {
    await query(
      `
      UPDATE tournaments
      SET status = CASE WHEN status = 'not_started' THEN 'in_progress' ELSE status END,
          updated_at = now()
      WHERE id = $1
      `,
      [tournamentId]
    );
  }

  res.json({ ok: true });
}),


  resetBracketResult: asyncHandler(async (req, res) => {
  const tournamentId = Number(req.params.id);
  const bracketMatchId = Number(req.params.matchId);

  if (!tournamentId || !bracketMatchId) {
    return res.status(400).json({ error: "Invalid ids" });
  }

  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin only" });
  }

  const { rows } = await query(
    `
    SELECT
      id::int AS id,
      tournament_id::int AS "tournamentId",
      round_number::int AS "roundNumber",
      winner_id::int AS "winnerId",
      status
    FROM tournament_bracket_matches
    WHERE id = $1
    `,
    [bracketMatchId]
  );
  const bm = rows[0];
  if (!bm || bm.tournamentId !== tournamentId) {
    return res.status(404).json({ error: "Bracket match not found" });
  }

  const { rows: down } = await query(
    `
    SELECT id::int AS id, round_number::int AS "roundNumber", status
    FROM tournament_bracket_matches
    WHERE tournament_id = $1
      AND (source_match1_id = $2 OR source_match2_id = $2)
    `,
    [tournamentId, bracketMatchId]
  );

  const hasFinishedDownstream = down.some((d) => d.status === "finished");
  if (hasFinishedDownstream) {
    return res.status(400).json({
      error:
        "Cannot reset: a downstream match is already finished. Reset downstream first (final → semi → quarter).",
      downstream: down,
    });
  }

  await query(
    `
    UPDATE tournament_bracket_matches
    SET
      winner_id = NULL,
      played_match_id = NULL,
      status = 'scheduled',
      finished_at = NULL
    WHERE id = $1
    `,
    [bracketMatchId]
  );

  await query(
    `
    UPDATE tournament_bracket_matches
    SET
      player1_id = NULL,
      status = CASE WHEN status <> 'finished' THEN 'pending' ELSE status END
    WHERE tournament_id = $1 AND source_match1_id = $2
    `,
    [tournamentId, bracketMatchId]
  );

  await query(
    `
    UPDATE tournament_bracket_matches
    SET
      player2_id = NULL,
      status = CASE WHEN status <> 'finished' THEN 'pending' ELSE status END
    WHERE tournament_id = $1 AND source_match2_id = $2
    `,
    [tournamentId, bracketMatchId]
  );

  await backfillAdvancements(tournamentId);
  res.json({ ok: true });
}),


  leave: asyncHandler(async (req, res) => {
    const tournamentId = Number(req.params.id);
    const me = Number(req.user?.id);
    if (!tournamentId)
        return res.status(400).json({ error: "Invalid tournament id" });
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const { rows: tRows } = await query(
      `
      SELECT
        id::int AS id,
        starts_at,
        registration_closes_offset_ms
      FROM tournaments
      WHERE id = $1
      `,
      [tournamentId]
    );

    const tournament = tRows[0];
    if (!tournament)
        return res.status(404).json({ error: "Tournament not found" });
    const now = Date.now();
    const startsAtMs = new Date(tournament.starts_at).getTime();
    const closesOffset = Number(tournament.registration_closes_offset_ms ?? DEFAULT_CLOSES_MS);
    const closesAt = startsAtMs - closesOffset;

    if (Number.isNaN(startsAtMs)) {
      return res.status(400).json({ error: "Tournament start date is invalid" });
    }

    if (now > closesAt || now >= startsAtMs) {
      return res.status(400).json({ error: "Registration is closed (locked)" });
    }

    await query(
      `DELETE FROM tournament_participants WHERE tournament_id = $1 AND user_id = $2`,
      [tournamentId, me]
    );

    res.json({ ok: true, tournamentId, userId: me });
  }),

  mySubscriptions: asyncHandler(async (req, res) => {
    const me = Number(req.user?.id);
    if (!me)
        return res.status(401).json({ error: "Unauthorized" });
    const { rows } = await query(
      `
      SELECT DISTINCT tp.tournament_id::int AS "tournamentId"
      FROM tournament_participants tp
      WHERE tp.user_id = $1
      ORDER BY "tournamentId" ASC
      `,
      [me]
    );

    res.json({ subscriptions: rows.map((r) => r.tournamentId) });
  }),

};
