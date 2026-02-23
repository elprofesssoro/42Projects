import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import "./Login.css";
import { useAuth } from "../components/utils/AuthContext";
import { useApi } from "../components/utils/useApi";

const FICTIONAL_COUNTRIES = [
  "Narnia",
  "Land of Oz",
  "Hogwarts (Wizarding World)",
  "Neverland",
  "The Shire (Hobbiton)",
  "Middle-earth (Gondor)",
  "Middle-earth (Rohan)",
  "Westeros",
  "Essos",
  "Atlantis",
  "El Dorado",
  "Wonderland",
  "Asgard",
  "Wakanda",
  "Mordor",
  "Rivendell",
  "Avalon",
  "Camelot",
  "Skyrim",
  "Pandora (Avatar)",
];

const Register = () => {
  const apiSafe = useApi();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeat, setRepeat] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fn = firstName.trim();
    const ln = lastName.trim();
    const g = String(gender || "").trim();
    const c = String(country || "").trim();
    const eMail = email.trim().toLowerCase();

    if (!fn || !ln)
        return setError("Please enter your first and last name");
    if (!g)
        return setError("Please select a gender");
    if (!c)
        return setError("Please select a country");
    if (!eMail)
        return setError("Please enter an email");
    if (password !== repeat)
        return setError("Passwords do not match");

    try {
      const body = {
        email: eMail,
        password,
        firstName: fn,
        lastName: ln,
        gender: g,
        country: c,
      };

      const data = await apiSafe("/api/auth/register", {
        method: "POST",
        body,
      });

      if (!data)
          return;

      if (!data?.token || !data?.user?.id) {
        throw new Error(data?.error || "Register failed: invalid server response");
      }

      login({ token: data.token, user: data.user });
      navigate("/profile", { replace: true });
    } catch (err) {
      setError(err?.message || "Registration failed");
    }
  };

  return (
    <main>
      <Hero hero="loginHero" />
      <div className="rForm">
        <form className="lForm" onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* <label>First Name</label> */}
          <input
            className="inp"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
          />

          {/* <label>Last Name</label> */}
          <input
            className="inp"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
          />

          {/* <label>Gender</label> */}
          <select
            className="inp"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* <label>Country</label> */}
          <select
            className="inp"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Select a country</option>
            {FICTIONAL_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* <label>Email</label> */}
          <input
            className="inp"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            placeholder="Email"
          />

          {/* <label>Password</label> */}
          <input
            className="inp"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            placeholder="Password"
            minLength={8}
          />

          {/* <label>Repeat Password</label> */}
          <input
            className="inp"
            type="password"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            autoComplete="new-password"
            required
            placeholder="Repeat Password"
            minLength={8}
          />

          <div className="btF">
            <button type="submit">Register</button>
          </div>

          <div className="lElem">-</div>
           <p className="termsConditions">
            <Link to="/privacypolicy">Privacy Policy</Link>
          </p>
           <div className="lElem">-</div>
        </form>
      </div>
    </main>
  );
};

export default Register;
