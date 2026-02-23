import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../utils/AuthContext";

const Navbar = () => {
  
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="nav-center">
        <ul className="nav-links">
          <li>
            <Link to="/" >Home</Link>
          </li>
          <li>|</li>
          <li>
            <Link
              to={isAuthenticated ? "/game/private" : "/game"}
            >
              Play Game
            </Link>
          </li>
          <li>|</li>
          <li>
            <Link to={isAuthenticated ? "/tournament/private" : "/tournament"}
           >Tournament</Link>
          </li>
          <li>|</li>
          <li>
            <Link
              to={isAuthenticated ? "/results/private/ranking" : "/results/ranking"}
            >
            Results
          </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>|</li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>

              {user?.role === "admin" && (
                <>
                  <li>|</li>
                  <li>
                    <Link to="/admin">Admin</Link>
                  </li>
                </>
              )}

              <li>|</li>
              <li>
                <button
                  type="button"
                  className="nav-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li>|</li>
              <li>
                <Link to="/login">Login</Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;