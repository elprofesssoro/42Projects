import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";

const Error = () => {

  const location = useLocation();

  const statusRaw = location?.state?.status;
  const status =
    typeof statusRaw === "number"
      ? statusRaw
      : typeof statusRaw === "string" && statusRaw.trim() !== ""
      ? Number(statusRaw)
      : null;

  const messageFromState =
    typeof location?.state?.message === "string" ? location.state.message : "";

  const { title, message } = useMemo(() => {

    const s = Number.isFinite(status) ? status : 404;

    if (s === 0) {
      return {
        title: "Server unreachable",
        message:
          messageFromState ||
          "We couldn’t connect to the server. Please check your internet connection and try again.",
      };
    }

    if (s === 401) {
      return {
        title: "Session expired",
        message:
          messageFromState ||
          "Your session has expired or you are not logged in. Please log in again.",
      };
    }

    if (s === 403) {
      return {
        title: "Access denied",
        message:
          messageFromState ||
          "You don’t have permission to access this page or perform this action.",
      };
    }

    if (s === 404) {
      return {
        title: "Page Not Found",
        message: messageFromState || "The page you’re looking for doesn’t exist.",
      };
    }

    if (s === 409) {
      return {
        title: "Conflict",
        message:
          messageFromState ||
          "This action conflicts with the current state. Please refresh and try again.",
      };
    }

    if (s === 429) {
      return {
        title: "Too many requests",
        message:
          messageFromState ||
          "You’ve hit the rate limit. Please wait a moment and try again.",
      };
    }

    if (s >= 500 && s <= 599) {
      return {
        title: "Server error",
        message:
          messageFromState ||
          "Something went wrong on the server. Please try again in a moment.",
      };
    }

    return {
      title: "Something went wrong",
      message: messageFromState || "An unexpected error occurred.",
    };
  }, [status, messageFromState]);

  const displayStatus = Number.isFinite(status) ? status : 404;

  return (
    <>
      <Hero hero="errorHero" />
      <main>
        <h1 className="error-page">
          {displayStatus} | {title}
        </h1>
        {message ? (
          <p className="invitationText">{message}</p>
        ) : null}
      </main>
    </>
  );
};

export default Error;