import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Create backend/.env and set DATABASE_URL."
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);


