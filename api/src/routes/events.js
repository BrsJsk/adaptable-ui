import { randomUUID } from "node:crypto";
import { Router } from "express";
import { db } from "../db.js";

const router = Router();

const KEBAB_CASE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/;
const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

function requireString(value, field) {
  if (typeof value !== "string" || value.trim() === "") {
    throw badRequest(`${field} must be a non-empty string`);
  }
  return value.trim();
}

function requirePageId(value, field) {
  const pageId = requireString(value, field);
  if (!KEBAB_CASE.test(pageId)) {
    throw badRequest(`${field} must be a non-empty kebab-case string`);
  }
  return pageId;
}

function normalizeEvent(input, index) {
  const prefix = index === null ? "" : `events[${index}].`;
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw badRequest(`${prefix || "event"} must be an object`);
  }

  const timestamp =
    input.timestamp === undefined || input.timestamp === null
      ? new Date().toISOString()
      : requireString(input.timestamp, `${prefix}timestamp`);
  if (!ISO_DATE.test(timestamp) || Number.isNaN(Date.parse(timestamp))) {
    throw badRequest(`${prefix}timestamp must be a valid ISO 8601 string`);
  }

  const event = {
    id: randomUUID(),
    pageId: requirePageId(input.pageId, `${prefix}pageId`),
    path: requireString(input.path, `${prefix}path`),
    fromPageId:
      input.fromPageId === undefined || input.fromPageId === null
        ? null
        : requirePageId(input.fromPageId, `${prefix}fromPageId`),
    timestamp: new Date(timestamp).toISOString(),
  };

  if (input.durationMs !== undefined && input.durationMs !== null) {
    if (
      typeof input.durationMs !== "number" ||
      !Number.isFinite(input.durationMs) ||
      input.durationMs < 0
    ) {
      throw badRequest(`${prefix}durationMs must be a non-negative number`);
    }
    event.durationMs = input.durationMs;
  }

  return event;
}

function parseDateQuery(value, field) {
  if (value === undefined) return null;
  if (typeof value !== "string" || !ISO_DATE.test(value) || Number.isNaN(Date.parse(value))) {
    throw badRequest(`${field} must be a valid ISO 8601 date`);
  }
  return Date.parse(value);
}

function parseLimit(value) {
  if (value === undefined) return DEFAULT_LIMIT;
  if (typeof value !== "string" || !/^\d+$/.test(value) || Number(value) < 1) {
    throw badRequest("limit must be a positive integer");
  }
  return Math.min(Number(value), MAX_LIMIT);
}

// POST /api/events - one event object or { events: [...] }. Nothing is written
// until every event in a batch has been validated, so a bad event writes none.
// Both path shapes are accepted so the router works whether it is mounted at
// /api or directly at /api/events.
const EVENT_PATHS = ["/", "/events"];

router.post(EVENT_PATHS, async (req, res) => {
  const body = req.body;
  const isBatch =
    body !== null &&
    typeof body === "object" &&
    !Array.isArray(body) &&
    "events" in body;

  let stored;
  if (isBatch) {
    if (!Array.isArray(body.events) || body.events.length === 0) {
      throw badRequest("events must be a non-empty array");
    }
    stored = body.events.map((event, index) => normalizeEvent(event, index));
  } else {
    stored = [normalizeEvent(body, null)];
  }

  await db.update((data) => {
    data.events.push(...stored);
  });

  res.status(201).json(isBatch ? stored : stored[0]);
});

// GET /api/events - newest first, with optional exact-match and date filters.
router.get(EVENT_PATHS, (req, res) => {
  const { pageId } = req.query;
  const from = parseDateQuery(req.query.from, "from");
  const to = parseDateQuery(req.query.to, "to");
  if (from !== null && to !== null && from > to) {
    throw badRequest("from must not be later than to");
  }
  const limit = parseLimit(req.query.limit);

  const events = db.data.events
    .filter((event) => {
      if (pageId !== undefined && event.pageId !== pageId) return false;
      const time = Date.parse(event.timestamp);
      if (from !== null && time < from) return false;
      if (to !== null && time > to) return false;
      return true;
    })
    .map((event, index) => ({ event, index }))
    .sort(
      (a, b) =>
        Date.parse(b.event.timestamp) - Date.parse(a.event.timestamp) ||
        b.index - a.index,
    )
    .slice(0, limit)
    .map(({ event }) => event);

  res.json(events);
});

// DELETE /api/events - reset helper for simulations, disabled in production.
router.delete(EVENT_PATHS, async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res
      .status(403)
      .json({ error: "Clearing events is disabled in production" });
  }

  const deleted = db.data.events.length;
  await db.update((data) => {
    data.events.length = 0;
  });
  res.json({ deleted });
});

export default router;
