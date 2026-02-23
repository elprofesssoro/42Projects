import React from "react";
import {Link, Outlet} from 'react-router-dom'
import Hero from "../components/Hero";
import  "../components/Tournament/Tournament.css";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";


const TournamentPage = () => {
    return (
        <main className="tournamentPage">
        <Hero hero="tournamentHero" />
          <h1>Tournament</h1>
        <nav className="tournament-nav">
            <Link to="past">Past</Link>
            <Link to=".">Current</Link>
            <Link to='nexttournament'>Next</Link>
        </nav>
        <Outlet/>
        <PrivacyPolicy/>
        </main>
    )
}

export default TournamentPage