const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOW_DAYS = 7;

function timestampMs(timestamp) {
  const value = Date.parse(timestamp);
  return Number.isNaN(value) ? null : value;
}

function isoOrNull(ms) {
  return ms === null ? null : new Date(ms).toISOString();
}

/**
 * Aggregate the single global event stream into a compact page-analytics
 * summary. Pure: it only reads the events array and never uses the current
 * time, so the same data always produces the same result.
 *
 * `visitsLast7Days` is relative to the newest event in the data, not Date.now(),
 * so historical simulation runs stay deterministic.
 */
export function getPageStats(events) {
  const times = events
    .map((event) => timestampMs(event.timestamp))
    .filter((value) => value !== null);
  const firstTime = times.length > 0 ? Math.min(...times) : null;
  const lastTime = times.length > 0 ? Math.max(...times) : null;
  const windowStart = lastTime === null ? null : lastTime - WINDOW_DAYS * DAY_MS;

  const pagesById = new Map();
  const transitions = new Map();

  for (const event of events) {
    const time = timestampMs(event.timestamp);

    let page = pagesById.get(event.pageId);
    if (!page) {
      page = {
        pageId: event.pageId,
        path: event.path,
        visits: 0,
        lastVisited: null,
        lastVisitedTime: null,
        durationTotal: 0,
        durationCount: 0,
        visitsLast7Days: 0,
      };
      pagesById.set(event.pageId, page);
    }

    page.visits += 1;
    if (time !== null && (page.lastVisitedTime === null || time > page.lastVisitedTime)) {
      page.lastVisitedTime = time;
      page.path = event.path; // report the most recently seen path for this page
      page.lastVisited = isoOrNull(time);
    }
    if (windowStart !== null && time !== null && time >= windowStart) {
      page.visitsLast7Days += 1;
    }
    if (Number.isFinite(event.durationMs) && event.durationMs >= 0) {
      page.durationTotal += event.durationMs;
      page.durationCount += 1;
    }

    if (event.fromPageId) {
      const key = `${event.fromPageId}\u0000${event.pageId}`;
      transitions.set(key, (transitions.get(key) ?? 0) + 1);
    }
  }

  const pages = [...pagesById.values()]
    .map((page) => ({
      pageId: page.pageId,
      path: page.path,
      visits: page.visits,
      lastVisited: page.lastVisited,
      avgDurationMs:
        page.durationCount === 0 ? 0 : Math.round(page.durationTotal / page.durationCount),
      visitsLast7Days: page.visitsLast7Days,
    }))
    .sort((a, b) => b.visits - a.visits || a.pageId.localeCompare(b.pageId));

  const topTransitions = [...transitions.entries()]
    .map(([key, count]) => {
      const [fromPageId, toPageId] = key.split("\u0000");
      return { fromPageId, toPageId, count };
    })
    .sort(
      (a, b) =>
        b.count - a.count ||
        a.fromPageId.localeCompare(b.fromPageId) ||
        a.toPageId.localeCompare(b.toPageId),
    )
    .slice(0, 10);

  return {
    totalVisits: events.length,
    firstSeen: isoOrNull(firstTime),
    lastSeen: isoOrNull(lastTime),
    pages,
    topTransitions,
  };
}
