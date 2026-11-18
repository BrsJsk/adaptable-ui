import { Router } from "express";
import { db } from "../db.js";
import { getPageStats } from "../services/stats.js";

const router = Router();

// GET /api/stats - compact page analytics for the single test user.
router.get("/stats", (req, res) => {
  res.json(getPageStats(db.data.events));
});

export default router;
