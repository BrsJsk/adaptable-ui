import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

import { findMenuTrail } from "../config/menu";

/**
 * Records one event per page view via the app's own /api/events server route,
 * which forwards it to the Express API. Tracking errors never break navigation.
 *
 * Duration is intentionally omitted here; the simulated-user generator sends it.
 */
export function usePageTracking() {
  const { pathname } = useLocation();
  const previousPageId = useRef<string | null>(null);

  useEffect(() => {
    // The index route redirects, so don't record the bare root URL.
    if (pathname === "/") return;

    // Only menu pages are tracked; utility pages such as /stats are not visits.
    const pageId = findMenuTrail(pathname).at(-1)?.id;
    if (!pageId || pageId === previousPageId.current) return;

    const fromPageId = previousPageId.current;
    previousPageId.current = pageId;

    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageId, path: pathname, fromPageId }),
    }).catch((error) => {
      console.warn("Failed to record page visit", error);
    });
  }, [pathname]);
}
