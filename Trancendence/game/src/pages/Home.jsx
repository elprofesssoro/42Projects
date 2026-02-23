import React from "react";
import Hero from "../components/Hero";
import "./Home.css";
import Button from "../components/Button";
import { useAuth } from "../components/utils/AuthContext";
import PrivacyPolicy from "../components/PrivacyPolicy/PrivacyPolicy";

const Home = () => {
  const { isAuthenticated } = useAuth();

  const tournamentDest = isAuthenticated ? "/tournament/private" : "/tournament";
  const gameDest = isAuthenticated ? "/game/private" : "/game";

  return (
    <main>
      <Hero hero="defaultHero" />
      <h1>PONG TOURNAMENT</h1>
      <div className="underline"></div>
      <div className="btn-container">
        <Button dest={tournamentDest} children="Tournament Game" />
        <Button dest={gameDest} children="1 x 1 Game" />
      </div>
      <PrivacyPolicy/>
    </main>
  );
};

export default Home;
