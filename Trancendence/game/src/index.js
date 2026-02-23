import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./components/utils/AuthContext";
import { MatchesProvider } from "./components/utils/MatchesContext";
import { FriendsProvider } from "./components/utils/FriendsContext";
import { PresenceProvider } from "./components/utils/PresenceContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PresenceProvider>
          <FriendsProvider>
            <MatchesProvider>
              <App />
            </MatchesProvider>
          </FriendsProvider>
        </PresenceProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


reportWebVitals();
