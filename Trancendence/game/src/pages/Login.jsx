import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import "./Login.css";
import { useAuth } from "../components/utils/AuthContext";
import { api } from "../api/api"; 

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const eMail = email.trim().toLowerCase();
    const pass = password;

    if (!eMail || !pass) {
      setError("Please enter email and password");
      return;
    }

    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: { email: eMail, password: pass },
      });

      if (!data?.token || !data?.user?.id) {
        setError(data?.error || "Invalid credentials");
        return;
      }

      login({ token: data.token, user: data.user });

      const from = location.state?.from?.pathname;
      let redirectTo = "/profile";
      if (from && from !== "/login" && from !== "/register") {
        redirectTo = from.startsWith("/profile") ? "/profile" : from;
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed");
    }
  };

  return (
    <main>
      <Hero hero="loginHero" />
      <div className="loginForm">
        <form className="lForm" onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <input
            className="inp"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            placeholder="Email"
            required
          />
          <input
            className="inp"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Password"
            required
          />
          <div className="btF">
            <button type="submit">Login</button>
          </div>
          <div className="btF btF_2">
            <Link to="/register">Create a new account</Link>
          </div>
         <p className="termsConditions">
            <Link to="/privacypolicy">Privacy Policy</Link>
          </p>
        </form>
      </div>
    </main>
  );
};

export default Login;
