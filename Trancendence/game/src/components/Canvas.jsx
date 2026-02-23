import React, { useEffect, useRef } from "react";

export const GAMES_PER_MATCH = 3;
const GAMES_TO_WIN = Math.floor(GAMES_PER_MATCH / 2) + 1;

const Canvas = ({ mode = "idle", storageKey = "pong_snapshot_v1", onMatchOver, ...props }) => {
  const canvasRef = useRef(null);
  const modeRef = useRef(mode);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  const prevModeRef = useRef(mode);
  useEffect(() => {
    const prev = prevModeRef.current;
    prevModeRef.current = mode;

    if (prev === "running" && (mode === "paused" || mode === "idle")) {
      try {
      } catch {}
    }
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas)
        return;

    const ctx = canvas.getContext("2d");

    let W = 800;
    let H = 400;

    const paddleW = 10;
    const paddleH = 100;
    const ballR = 10;

    const leftX = 10;
    let rightX = W - 20;

    const POINTS_TO_WIN_GAME = 21;

    const PADDLE_SPEED = 360;
    const BALL_SPEED_X = 380;
    const BALL_SPEED_Y = 220;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const randSign = () => (Math.random() < 0.5 ? -1 : 1);

    const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };

    const onKeyDown = (e) => {
      if (e.key in keys)
          keys[e.key] = true;
      if (e.key === "ArrowUp" || e.key === "ArrowDown")
          e.preventDefault();
    };

    const onKeyUp = (e) => {
      if (e.key in keys)
          keys[e.key] = false;
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp);

    const state = {
      leftY: H / 2 - paddleH / 2,
      rightY: H / 2 - paddleH / 2,
      ballX: W / 2,
      ballY: H / 2,
      ballVX: BALL_SPEED_X * randSign(),
      ballVY: BALL_SPEED_Y * randSign(),
      leftPts: 0,
      rightPts: 0,
      leftGames: 0,
      rightGames: 0,
      gameIndex: 1,
      matchOver: false,
      winner: null,
      leftPointsByGame: Array(GAMES_PER_MATCH).fill(null),
      rightPointsByGame: Array(GAMES_PER_MATCH).fill(null),
    };

    const resetPositions = () => {
      state.leftY = H / 2 - paddleH / 2;
      state.rightY = H / 2 - paddleH / 2;
      state.ballX = W / 2;
      state.ballY = H / 2;
    };

    const resetBall = (serveDir) => {
      state.ballX = W / 2;
      state.ballY = H / 2;
      state.ballVX = BALL_SPEED_X * serveDir;
      state.ballVY = BALL_SPEED_Y * randSign();
    };

    const applyBoundsAfterResize = () => {
      rightX = W - 20;

      state.leftY = clamp(state.leftY, 0, H - paddleH);
      state.rightY = clamp(state.rightY, 0, H - paddleH);

      state.ballX = clamp(state.ballX, ballR, W - ballR);
      state.ballY = clamp(state.ballY, ballR, H - ballR);
    };

    const getTargetRect = () => {
      const el = canvas.parentElement || canvas;
      const rect = el.getBoundingClientRect();
      const w = Number.isFinite(rect.width) && rect.width > 0 ? rect.width : W;
      const h = Number.isFinite(rect.height) && rect.height > 0 ? rect.height : H;
      return { width: w, height: h };
    };

    let sizedOnce = false;

    const resize = () => {
      const { width, height } = getTargetRect();
      const dpr = window.devicePixelRatio || 1;

      W = Math.max(1, Math.round(width));
      H = Math.max(1, Math.round(height));

      canvas.width = Math.max(1, Math.round(W * dpr));
      canvas.height = Math.max(1, Math.round(H * dpr));

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      rightX = W - 20;

      if (!sizedOnce) {
        resetPositions();
        sizedOnce = true;
      } else {
        applyBoundsAfterResize();
      }
    };

    let resizeObserver = null;
    let usingWindowResize = false;

    try {
      resizeObserver = new ResizeObserver(() => resize());
      if (canvas.parentElement)
          resizeObserver.observe(canvas.parentElement);
      else resizeObserver.observe(canvas);
    } catch {
      usingWindowResize = true;
      window.addEventListener("resize", resize);
    }

    resize();

    let lastSave = 0;
    const saveSnapshot = (force = false) => {
      const now = performance.now();
      if (!force && now - lastSave < 250)
          return;
      lastSave = now;

      localStorage.setItem(
        storageKey,
        JSON.stringify({
          leftY: state.leftY,
          rightY: state.rightY,
          ballX: state.ballX,
          ballY: state.ballY,
          ballVX: state.ballVX,
          ballVY: state.ballVY,
          leftPts: state.leftPts,
          rightPts: state.rightPts,
          leftGames: state.leftGames,
          rightGames: state.rightGames,
          gameIndex: state.gameIndex,
          matchOver: state.matchOver,
          winner: state.winner,
          leftPointsByGame: state.leftPointsByGame,
          rightPointsByGame: state.rightPointsByGame,
        })
      );
    };

    const loadSnapshot = () => {
      const raw = localStorage.getItem(storageKey);
      if (!raw)
          return false;
      try {
        const snap = JSON.parse(raw);
        Object.assign(state, snap);

        state.leftY = clamp(state.leftY, 0, H - paddleH);
        state.rightY = clamp(state.rightY, 0, H - paddleH);

        if (!Array.isArray(state.leftPointsByGame)) {
          state.leftPointsByGame = Array(GAMES_PER_MATCH).fill(null);
        }
        if (!Array.isArray(state.rightPointsByGame)) {
          state.rightPointsByGame = Array(GAMES_PER_MATCH).fill(null);
        }

        if (state.leftPointsByGame.length !== GAMES_PER_MATCH) {
          const fixed = Array(GAMES_PER_MATCH).fill(null);
          for (let i = 0; i < Math.min(state.leftPointsByGame.length, GAMES_PER_MATCH); i++) {
            fixed[i] = state.leftPointsByGame[i];
          }
          state.leftPointsByGame = fixed;
        }
        if (state.rightPointsByGame.length !== GAMES_PER_MATCH) {
          const fixed = Array(GAMES_PER_MATCH).fill(null);
          for (let i = 0; i < Math.min(state.rightPointsByGame.length, GAMES_PER_MATCH); i++) {
            fixed[i] = state.rightPointsByGame[i];
          }
          state.rightPointsByGame = fixed;
        }

        state.gameIndex = clamp(Number(state.gameIndex || 1), 1, GAMES_PER_MATCH);

        applyBoundsAfterResize();
        return true;
      } catch {
        localStorage.removeItem(storageKey);
        return false;
      }
    };

    let snapshotLoaded = false;
    if (modeRef.current !== "idle") {
      snapshotLoaded = loadSnapshot();
    }

    const matchOverNotifiedRef = { current: false };
    const readCurrentSnapshot = () => ({
      leftY: state.leftY,
      rightY: state.rightY,
      ballX: state.ballX,
      ballY: state.ballY,
      ballVX: state.ballVX,
      ballVY: state.ballVY,
      leftPts: state.leftPts,
      rightPts: state.rightPts,
      leftGames: state.leftGames,
      rightGames: state.rightGames,
      gameIndex: state.gameIndex,
      matchOver: state.matchOver,
      winner: state.winner,
      leftPointsByGame: state.leftPointsByGame,
      rightPointsByGame: state.rightPointsByGame,
    });

    const finishMatchIfNeeded = () => {
      const someoneWon = state.leftGames >= GAMES_TO_WIN || state.rightGames >= GAMES_TO_WIN;
      const maxGamesReached = state.gameIndex >= GAMES_PER_MATCH;

      if (!someoneWon && !maxGamesReached)
          return false;

      state.matchOver = true;
      state.winner =
        state.leftGames > state.rightGames ? "LEFT" : state.rightGames > state.leftGames ? "RIGHT" : "TIE";

      saveSnapshot(true);
      if (!matchOverNotifiedRef.current && typeof onMatchOver === "function") {
        matchOverNotifiedRef.current = true;
        onMatchOver(readCurrentSnapshot());
      }
      return true;
    };

    const advanceGame = () => {
      const idx = state.gameIndex - 1;
      if (idx >= 0 && idx < GAMES_PER_MATCH) {
        state.leftPointsByGame[idx] = state.leftPts;
        state.rightPointsByGame[idx] = state.rightPts;
      }

      if (state.leftPts >= POINTS_TO_WIN_GAME)
          state.leftGames += 1;
      if (state.rightPts >= POINTS_TO_WIN_GAME)
          state.rightGames += 1;
      if (finishMatchIfNeeded()) return;

      state.gameIndex += 1;
      state.leftPts = 0;
      state.rightPts = 0;
      resetPositions();
      resetBall(randSign());
      saveSnapshot(true);
    };

    const drawCourt = () => {
      ctx.fillStyle = "#036a77ff";
      ctx.fillRect(0, 0, W, H);
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawActors = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(leftX, state.leftY, paddleW, paddleH);
      ctx.fillRect(rightX, state.rightY, paddleW, paddleH);
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, ballR, 0, Math.PI * 2);
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.closePath();
    };

    const drawUI = () => {
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.font = "18px monospace";
      ctx.fillText(`${state.leftPts}  -  ${state.rightPts}`, W / 2, 30);
      ctx.font = "14px monospace";
      ctx.fillText(`Game ${state.gameIndex}/${GAMES_PER_MATCH}  |  Match: ${state.leftGames}-${state.rightGames}`, W / 2, 55);
      ctx.font = "12px monospace";
      ctx.fillText("Left: W/S   |   Right: ↑/↓", W / 2, H - 12);
    };

    const drawIdleOverlay = () => {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.font = "22px monospace";
      ctx.fillText("PRESS START", W / 2, H / 2);
      ctx.font = "14px monospace";
      ctx.fillText(`First to 21 points • Best of ${GAMES_PER_MATCH}`, W / 2, H / 2 + 28);
    };

    const drawPausedOverlay = () => {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.font = "22px monospace";
      ctx.fillText("PAUSED", W / 2, H / 2);
    };

    const drawMatchOverOverlay = () => {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FFFFFF";
      ctx.textAlign = "center";
      ctx.font = "26px monospace";

      const msg =
        state.winner === "LEFT"
          ? "LEFT PLAYER WINS THE MATCH!"
          : state.winner === "RIGHT"
          ? "RIGHT PLAYER WINS THE MATCH!"
          : "MATCH TIED!";

      ctx.fillText(msg, W / 2, H / 2);
      ctx.font = "14px monospace";
      ctx.fillText(`Final Match Score: ${state.leftGames}-${state.rightGames}`, W / 2, H / 2 + 28);
    };

    const renderFrame = () => {
      drawCourt();
      drawActors();

      if (state.matchOver) {
        drawMatchOverOverlay();
        return;
      }

      const m = modeRef.current;
      if (m === "idle")
          drawIdleOverlay();
      if (m === "paused")
          drawPausedOverlay();
      drawUI();
    };

    const update = (dt) => {
      if (state.matchOver)
          return;

      if (keys.w)
          state.leftY -= PADDLE_SPEED * dt;
      if (keys.s)
          state.leftY += PADDLE_SPEED * dt;
      if (keys.ArrowUp)
          state.rightY -= PADDLE_SPEED * dt;
      if (keys.ArrowDown)
          state.rightY += PADDLE_SPEED * dt;

      state.leftY = clamp(state.leftY, 0, H - paddleH);
      state.rightY = clamp(state.rightY, 0, H - paddleH);

      state.ballX += state.ballVX * dt;
      state.ballY += state.ballVY * dt;

      if (state.ballY - ballR <= 0) {
        state.ballY = ballR;
        state.ballVY *= -1;
      }
      if (state.ballY + ballR >= H) {
        state.ballY = H - ballR;
        state.ballVY *= -1;
      }

      const leftL = leftX;
      const leftR = leftX + paddleW;
      const hitLeft =
        state.ballX - ballR <= leftR &&
        state.ballX + ballR >= leftL &&
        state.ballY + ballR >= state.leftY &&
        state.ballY - ballR <= state.leftY + paddleH;

      if (hitLeft && state.ballVX < 0) {
        state.ballX = leftR + ballR;
        state.ballVX *= -1;
        const rel = (state.ballY - (state.leftY + paddleH / 2)) / (paddleH / 2);
        state.ballVY = BALL_SPEED_Y * rel;
      }

      const rightL = rightX;
      const rightR = rightX + paddleW;
      const hitRight =
        state.ballX + ballR >= rightL &&
        state.ballX - ballR <= rightR &&
        state.ballY + ballR >= state.rightY &&
        state.ballY - ballR <= state.rightY + paddleH;

      if (hitRight && state.ballVX > 0) {
        state.ballX = rightL - ballR;
        state.ballVX *= -1;
        const rel = (state.ballY - (state.rightY + paddleH / 2)) / (paddleH / 2);
        state.ballVY = BALL_SPEED_Y * rel;
      }

      if (state.ballX + ballR < 0) {
        state.rightPts += 1;
        resetBall(-1);
        saveSnapshot(true);
      }
      if (state.ballX - ballR > W) {
        state.leftPts += 1;
        resetBall(1);
        saveSnapshot(true);
      }

      if (state.leftPts >= POINTS_TO_WIN_GAME || state.rightPts >= POINTS_TO_WIN_GAME) {
        advanceGame();
      }
    };

    const saveTimer = setInterval(() => {
      const m = modeRef.current;
      if (state.matchOver)
          return;
      if (m === "running" || m === "paused") {
        saveSnapshot(false);
      }
    }, 500);

    let rafId = null;
    let lastTime = null;
    let lastLoopMode = modeRef.current;

    const loop = (t) => {
      rafId = requestAnimationFrame(loop);

      const m = modeRef.current;
      if (!snapshotLoaded && (m === "running" || m === "paused")) {
        snapshotLoaded = loadSnapshot();
      }
      if (lastLoopMode === "running" && (m === "paused" || m === "idle")) {
        saveSnapshot(true);
      }
      lastLoopMode = m;

      if (m === "idle") {
        lastTime = null;
        renderFrame();
        return;
      }
      if (m === "paused") {
        lastTime = null;
        renderFrame();
        return;
      }

      const prev = lastTime ?? t;
      const dt = (t - prev) / 1000;
      lastTime = t;
      update(Math.min(dt, 0.03));
      renderFrame();
    };

    renderFrame();
    rafId = requestAnimationFrame(loop);

    return () => {
      clearInterval(saveTimer);
      if (rafId)
        cancelAnimationFrame(rafId);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (resizeObserver)
        resizeObserver.disconnect();
      if (usingWindowResize)
        window.removeEventListener("resize", resize);
    };
  }, [storageKey, onMatchOver]);

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
