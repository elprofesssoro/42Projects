import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import { HiOutlineChevronDoubleDown } from "react-icons/hi";
import Canvas from "../components/Canvas";
import "./Game.css";
import { Link } from "react-router-dom";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";

const MODE_KEY = "pong_mode_v1";
const SNAPSHOT_KEY = "pong_snapshot_v1";

const readMode = () => {
  const v = localStorage.getItem(MODE_KEY);
  return v === "running" || v === "paused" || v === "idle" ? v : "idle";
};

const Game = () => {
  
  const [mode, setMode] = useState(readMode);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    localStorage.setItem(MODE_KEY, mode);
  }, [mode]);

  const startNewMatch = () => {
    
    localStorage.removeItem(SNAPSHOT_KEY);
    setResetKey((k) => k + 1);
    setMode("running");
  };

  const pauseResume = () => {
    if (mode === "idle") return;
    setMode((m) => (m === "running" ? "paused" : "running"));
  };

  const stopToInitial = () => {
    
    localStorage.removeItem(SNAPSHOT_KEY);
    setResetKey((k) => k + 1);
    setMode("idle");
  };
 

  return (
    <main>
      <Hero hero="gameHero" />
      <h1>Ready to Play</h1>
      <div className="pb-chevr">
        <HiOutlineChevronDoubleDown />
      </div>
      <nav className="pb-game-nav">
        <div className="gameButtons">
        <button type="button" className="game-nav-Btn" onClick={startNewMatch}>
          Start
        </button>
        <button type="button" className="game-nav-Btn" onClick={pauseResume} disabled={mode === "idle"}>
          {mode === "paused" ? "Resume" : "Pause"}
        </button>
        <button type="button" className="game-nav-Btn" onClick={stopToInitial}>
          Stop
        </button>
        </div>
          <Link to="/login" className="game-nav-Btn"> Join Tournament</Link>
      </nav>
      <div className="gCanvas">
        <Canvas className="canvasStyle" key={resetKey} mode={mode} storageKey={SNAPSHOT_KEY} />
      </div>
      <PrivacyPolicy/>
    </main>
  );
};

export default Game;
