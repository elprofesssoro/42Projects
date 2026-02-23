import { GAMES_PER_MATCH } from "../Canvas";

export const normalizeUsers = (data) =>
  Array.isArray(data)
    ? data
    : Array.isArray(data?.users)
    ? data.users
    : [];



export const parseDDMMYYYY = (s) => {
  if (!s || typeof s !== "string")
      return 0;
  const [dd, mm, yyyy] = s.split("/").map(Number);
  if (!dd || !mm || !yyyy)
      return 0;
  return new Date(yyyy, mm - 1, dd).getTime();
};


export const padToN = (arr, n) => {
  const out = Array.isArray(arr) ? [...arr] : [];
  while (out.length < n)
      out.push(0);
  return out.slice(0, n);
};


export const pointsToString = (arr) => {
  const v = padToN(arr, GAMES_PER_MATCH);
  return v.map((x) => `/${Number(x) || 0}`).join(" ");
};



export const MATCH_WIN_POINTS = 40;

export const GAME_WIN_POINTS = 10;


