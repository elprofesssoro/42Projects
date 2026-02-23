import { asyncHandler } from "../utils/asyncHandler.js";
import { query } from "../db.js";

const GAMES_PER_MATCH = 3;

const zeroArraySql = () =>
  `ARRAY[${Array.from({ length: GAMES_PER_MATCH }, () => "0").join(",")}]::int[]`;

export const matchesController = {
  list: asyncHandler(async (req, res) => {
    const { rows } = await query(`
      SELECT
        m.id::int AS id,
        to_char(m.played_at, 'DD/MM/YYYY') AS date,
        m.player1_id::int AS "playerId",
        m.player2_id::int AS "opponentId",

        COALESCE(SUM(CASE WHEN mg.player1_points > mg.player2_points THEN 1 ELSE 0 END), 0)::int AS "playerScore",
        COALESCE(SUM(CASE WHEN mg.player2_points > mg.player1_points THEN 1 ELSE 0 END), 0)::int AS "opponentScore",

        COALESCE(
          array_agg(mg.player1_points ORDER BY mg.game_number)
            FILTER (WHERE mg.match_id IS NOT NULL),
          ${zeroArraySql()}
        ) AS "playerPoints",
        COALESCE(
          array_agg(mg.player2_points ORDER BY mg.game_number)
            FILTER (WHERE mg.match_id IS NOT NULL),
          ${zeroArraySql()}
        ) AS "opponentPoints",

        COALESCE(
          json_agg(
            json_build_object(
              'gameNumber', mg.game_number,
              'playerPoints', mg.player1_points,
              'opponentPoints', mg.player2_points
            )
            ORDER BY mg.game_number
          ) FILTER (WHERE mg.match_id IS NOT NULL),
          '[]'::json
        ) AS games

      FROM matches m
      LEFT JOIN match_games mg
        ON mg.match_id = m.id
       AND mg.game_number BETWEEN 1 AND ${GAMES_PER_MATCH}
      GROUP BY m.id
      ORDER BY m.played_at DESC, m.id DESC
    `);

    res.json({ matches: rows });
  }),

  create: asyncHandler(async (req, res) => {
    const {
      date,
      playerId,
      opponentId,
      playerPoints,
      opponentPoints,
      mode = "private",
    } = req.body || {};

    if (!date || !playerId || !opponentId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!Array.isArray(playerPoints) || playerPoints.length !== GAMES_PER_MATCH) {
      return res
        .status(400)
        .json({ error: `playerPoints must be array of ${GAMES_PER_MATCH}` });
    }
    if (!Array.isArray(opponentPoints) || opponentPoints.length !== GAMES_PER_MATCH) {
      return res
        .status(400)
        .json({ error: `opponentPoints must be array of ${GAMES_PER_MATCH}` });
    }

    const pId = Number(playerId);
    const oId = Number(opponentId);

    const me = Number(req.user?.id);
    if (!me || me !== pId) {
      return res.status(403).json({ error: "Forbidden: invalid playerId" });
    }

    let pScore = 0;
    let oScore = 0;

    for (let i = 0; i < GAMES_PER_MATCH; i++) {
      const p = Number(playerPoints[i] ?? 0);
      const o = Number(opponentPoints[i] ?? 0);
      if (p > o) pScore++;
      else if (o > p) oScore++;
    }

    const winnerId = pScore > oScore ? pId : oScore > pScore ? oId : null;

    const insertMatch = await query(
      `
      INSERT INTO matches
        (played_at, mode, status, player1_id, player2_id, winner_id, player1_games_won, player2_games_won)
      VALUES
         (now(), $1, 'finished', $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [mode, pId, oId, winnerId, pScore, oScore]
    );

    const matchId = insertMatch.rows[0].id;

    for (let i = 0; i < GAMES_PER_MATCH; i++) {
      const p1 = Number(playerPoints[i]);
      const p2 = Number(opponentPoints[i]);
      const gameWinnerId = p1 > p2 ? pId : p2 > p1 ? oId : null;

      await query(
        `
        INSERT INTO match_games (match_id, game_number, player1_points, player2_points, winner_id)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (match_id, game_number) DO UPDATE
        SET player1_points = EXCLUDED.player1_points,
            player2_points = EXCLUDED.player2_points,
            winner_id      = EXCLUDED.winner_id
        `,
        [matchId, i + 1, p1, p2, gameWinnerId]
      );
    }

    const { rows } = await query(
      `
      SELECT
        m.id::int AS id,
        to_char(m.played_at, 'DD/MM/YYYY') AS date,
        m.player1_id::int AS "playerId",
        m.player2_id::int AS "opponentId",
        m.player1_games_won::int AS "playerScore",
        m.player2_games_won::int AS "opponentScore",
        COALESCE(
          array_agg(mg.player1_points ORDER BY mg.game_number)
            FILTER (WHERE mg.match_id IS NOT NULL),
          ${zeroArraySql()}
        ) AS "playerPoints",
        COALESCE(
          array_agg(mg.player2_points ORDER BY mg.game_number)
            FILTER (WHERE mg.match_id IS NOT NULL),
          ${zeroArraySql()}
        ) AS "opponentPoints",
        COALESCE(
          json_agg(
            json_build_object(
              'gameNumber', mg.game_number,
              'playerPoints', mg.player1_points,
              'opponentPoints', mg.player2_points
            )
            ORDER BY mg.game_number
          ) FILTER (WHERE mg.match_id IS NOT NULL),
          '[]'::json
        ) AS games
      FROM matches m
      LEFT JOIN match_games mg
        ON mg.match_id = m.id
       AND mg.game_number BETWEEN 1 AND ${GAMES_PER_MATCH}
      WHERE m.id = $1
      GROUP BY m.id
      `,
      [matchId]
    );

    res.status(201).json({ match: rows[0] });
    console.log("playerPoints length:", playerPoints?.length, "opponentPoints length:", opponentPoints?.length);
    console.log("max gameNumber:", Math.max(...(games || []).map(g => g.gameNumber || 0)));

  }),
  
};
