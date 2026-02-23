import { io } from "socket.io-client";

let socket = null;
let currentToken = null;
let currentUrl = null;

const DEFAULT_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "https://localhost:3443";

const API_URL =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  DEFAULT_ORIGIN;

export const getSocket = (token) => {
  if (!token) return null;

  if (socket && (currentToken !== token || currentUrl !== API_URL)) {
    socket.disconnect();
    socket = null;
    currentToken = null;
    currentUrl = null;
  }

  if (!socket) {
    currentToken = token;
    currentUrl = API_URL;

    socket = io(API_URL, {
      path: "/socket.io/",
      auth: { token },
      transports: ["polling", "websocket"],
      upgrade: true,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    currentToken = null;
    currentUrl = null;
  }
};
