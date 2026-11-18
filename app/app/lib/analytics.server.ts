// Server-only: browser code talks to the app's own /api/* routes instead.
// Set API_BASE_URL in any environment where the API is not on localhost:3001.
export function getApiBaseUrl() {
  return process.env.API_BASE_URL ?? "http://localhost:3001";
}

export type PageStat = {
  pageId: string;
  path: string;
  visits: number;
  lastVisited: string | null;
  avgDurationMs: number;
  visitsLast7Days: number;
};

export type TransitionStat = {
  fromPageId: string;
  toPageId: string;
  count: number;
};

export type PageStats = {
  totalVisits: number;
  firstSeen: string | null;
  lastSeen: string | null;
  pages: PageStat[];
  topTransitions: TransitionStat[];
};

/** Fetch the compact analytics payload from the Express API. */
export async function getPageStats(): Promise<PageStats> {
  const response = await fetch(`${getApiBaseUrl()}/api/stats`);
  if (!response.ok) {
    throw new Error(`Analytics API returned ${response.status}`);
  }
  return (await response.json()) as PageStats;
}
