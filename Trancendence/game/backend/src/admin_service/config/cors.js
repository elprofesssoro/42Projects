import "dotenv/config";

const defaultWhitelist = [
  "https://localhost:3443",
  "https://127.0.0.1:3443",

  // optional: keep these for direct CRA access (if you ever open 3002 directly)
  "http://localhost:3002",
  "http://127.0.0.1:3002",

  // optional: your old HTTP nginx entry
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

const whitelist = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map(s => s.trim()).filter(Boolean)
  : defaultWhitelist;

const corsConfig = {
  origin: (origin, callback) => {
    // allow non-browser requests (curl, server-to-server, etc.)
    if (!origin) return callback(null, true);

    if (whitelist.includes(origin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked request from origin: ${origin}`);
    return callback(new Error(`CORS policy: Origin ${origin} is not allowed`), false);
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  exposedHeaders: [
    "Content-Length",
    "X-Total-Count",
    "X-Page",
    "X-Per-Page",
  ],

  maxAge: 86400,
  optionsSuccessStatus: 204,
  preflightContinue: false,
};

export default corsConfig;
