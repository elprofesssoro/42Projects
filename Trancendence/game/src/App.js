import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import Home from "./pages/Home";
import TournamentPage from "./pages/TournamentPage";
import NextTournament from "./components/Tournament/NextTournament";
import JoinTournament from "./components/Tournament/JoinTournament";
import CurrentTournament from "./components/Tournament/CurrentTournament";
import PastTournament from "./components/Tournament/PastTournament";
import Game from "./pages/Game";
import PrivateGame from "./pages/PrivateGame";
import PrivateTournament from "./pages/PravateTournament";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminInvitesPage from "./pages/AdminInvitesPage";
import AdminMatchesPage from "./pages/AdminMatchesPage";
import AdminAuditPage from "./pages/AdminAuditPage";
import AdminTournamentSubsPage from "./pages/AdminTournamentSubsPage";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OpponentProfile from "./pages/OpponentProfile";
import Error from "./pages/Error";
import Navbar from "./components/Navbar/Navbar";
import Ranking from "./components/Ranking";
import Matches from "./components/Matches";
import ProtectedRoutes from "./components/utils/ProtectedRoutes";
import AdminRoutes from "./components/utils/AdminRoutes";
import PrivateLayout from "./components/utils/PrivateLayout";
import Friends from "./components/friends/Friends";
import GameHistory from "./components/History/GameHistory";
import PlayerProfileHome from "./components/PlayerHome/PlayerProfileHome";
import ProfileStats from "./components/PlayerHome/ProfileStats";
import OpponentHistory from "./components/Opponent/OpponentHistory";
import OpponentStats from "./components/Opponent/OpponentStats";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.jsx"


function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournament" element={<TournamentPage />}>
          <Route index element={<CurrentTournament />} />
           <Route path="past" element={<PastTournament />} />
          <Route path="nexttournament" element={<NextTournament />} />
        </Route>
        <Route path="/game" element={<Game />} />
        <Route path="/results" element={<Results />}>
          <Route index element={<Navigate to="ranking" replace />} />
          <Route path="ranking" element={<Ranking />} />
          <Route path="matches" element={<Matches />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<PrivateLayout />}>
            <Route path="/profile" element={<Profile />}>
              <Route index element={<PlayerProfileHome />} />
              <Route path="gamehistory" element={<GameHistory />} />
              <Route path="friends" element={<Friends />} />
              <Route path="statistics" element={<ProfileStats />} />
            </Route>
            <Route path="/opponent/:id" element={<OpponentProfile />}>
              <Route index element={<OpponentHistory />} />
              <Route path="statistics" element={<OpponentStats />} />
            </Route>
            <Route path="/results/private" element={<Results />}>
              <Route index element={<Navigate to="ranking" replace />} />
              <Route path="ranking" element={<Ranking />} />
              <Route path="matches" element={<Matches />} />
            </Route>
            <Route path="/tournament/private" element={<PrivateTournament />}>
              <Route index element={<PastTournament />} />
              <Route path="current" element={<CurrentTournament />} />
              <Route path="nexttournament" element={<NextTournament />} />
              <Route path="jointournament" element={<JoinTournament />} />
            </Route>
            <Route path="/game/private" element={<PrivateGame />} />
            <Route element={<AdminRoutes />}>
              <Route path="/admin" element={<AdminUsersPage />} />
              <Route path="/admin/invites" element={<AdminInvitesPage />} />
              <Route path="/admin/matches" element={<AdminMatchesPage />} />
              <Route path="/admin/audit" element={<AdminAuditPage />} />
              <Route
                path="/admin/tournament-subs"
                element={<AdminTournamentSubsPage />}
              />
            </Route>
          </Route>
        </Route>
        <Route path="/error" element={<Error />} />
        <Route path="*" element={<Error />} />
        <Route path="/privacypolicy" element={<PrivacyPolicyPage/>}/>
      </Routes>
    
    </>
  );
}

export default App;