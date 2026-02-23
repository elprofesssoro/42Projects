import React from "react";
import {Link, Outlet} from 'react-router-dom'
import Hero from "../components/Hero";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";
import { useAuth } from "../components/utils/AuthContext";


const Results = () =>{

    const { isAuthenticated } = useAuth(false);

    return (
        <main>
            <Hero hero="rankingHero"/>
            <h1>Results</h1>
            <nav className="results-nav">
                <Link to='ranking'>Rankings</Link>
                <Link to='matches'>Matches</Link>
            </nav>
            <Outlet/>
            {!isAuthenticated && <PrivacyPolicy />}
        </main>
    )
}

export default Results