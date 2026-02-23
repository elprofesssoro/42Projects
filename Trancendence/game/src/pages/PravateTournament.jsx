import React from "react";
import { Link, Outlet } from "react-router-dom";
import Hero from "../components/Hero";
import "../components/Tournament/Tournament.css";


const PrivateTournament = () => {
  return (
    <main className="tournamentPage">
      <Hero hero="tournamentHero" />
      <h1>Tournament</h1>
      <nav className="tournament-nav">
        <Link to=".">Past</Link>
        <Link to="current">Current</Link>
        <Link to="nexttournament">Next</Link>
        <Link to="jointournament">Join</Link>
      </nav>
      <Outlet />
    </main>
  );
};

export default PrivateTournament;
