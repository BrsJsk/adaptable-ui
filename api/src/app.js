import cors from "cors";
import express from "express";
import eventsRouter from "./routes/events.js";
import statsRouter from "./routes/stats.js";

export function createApp() {
  const app = express();

  // Comma-separated origins let the same server serve local Vite (5173) and
  // the built app from docker compose (3000).
  const origins = (process.env.CORS_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.use(cors({ origin: origins.length === 1 ? origins[0] : origins }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api", eventsRouter);
  app.use("/api", statsRouter);

  app.use((req, res) => {
    res.status(404).json({ error: `Not found: ${req.method} ${req.path}` });
  });

  app.use((err, req, res, next) => {
    const status =
      Number.isInteger(err.status) && err.status >= 400 && err.status < 600
        ? err.status
        : 500;
    if (status === 500) console.error(err);
    res.status(status).json({ error: status === 500 ? "Internal server error" : err.message });
  });

  return app;
}
