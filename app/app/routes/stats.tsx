import type { Route } from "./+types/stats";

import { getPageStats } from "../lib/analytics.server";

export function loader() {
  return getPageStats();
}

const panelClass =
  "rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900";

function formatDate(iso: string | null) {
  return iso ? `${iso.slice(0, 16).replace("T", " ")} UTC` : "—";
}

function SummaryCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className={panelClass}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default function StatsPage({ loaderData }: Route.ComponentProps) {
  const { totalVisits, firstSeen, lastSeen, pages, topTransitions } = loaderData;
  const maxVisits = Math.max(1, ...pages.map((page) => page.visits));

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Page analytics</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
          Visits recorded by the tracking hook and aggregated by the API.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total visits" value={totalVisits} />
        <SummaryCard label="Pages seen" value={pages.length} />
        <SummaryCard label="First seen" value={formatDate(firstSeen)} />
        <SummaryCard label="Last seen" value={formatDate(lastSeen)} />
      </div>

      <section className={panelClass} aria-labelledby="visits-chart-title">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="visits-chart-title" className="text-lg font-semibold">
            Visits per page
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last 7 days relative to the newest event
          </span>
        </div>

        {pages.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No visits recorded yet. Navigate through the menu to see data here.
          </p>
        ) : (
          <div className="space-y-3">
            {pages.map((page) => (
              <div key={page.pageId}>
                <div className="mb-1 flex justify-between gap-4 text-sm">
                  <span className="truncate font-medium" title={page.path}>
                    {page.pageId}
                  </span>
                  <span className="shrink-0 tabular-nums text-gray-600 dark:text-gray-300">
                    {page.visits} {page.visits === 1 ? "visit" : "visits"}
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                      ({page.visitsLast7Days} recent)
                    </span>
                  </span>
                </div>
                <div
                  className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800"
                  role="img"
                  aria-label={`${page.pageId}: ${page.visits} visits`}
                >
                  <div
                    className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
                    style={{ width: `${(page.visits / maxVisits) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={panelClass} aria-labelledby="transitions-title">
        <h2 id="transitions-title" className="mb-3 text-lg font-semibold">
          Top transitions
        </h2>
        {topTransitions.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No navigation transitions recorded yet.
          </p>
        ) : (
          <ul className="space-y-2 text-sm">
            {topTransitions.map((transition) => (
              <li
                key={`${transition.fromPageId}-${transition.toPageId}`}
                className="flex flex-wrap items-center justify-between gap-2"
              >
                <span className="text-gray-700 dark:text-gray-200">
                  {transition.fromPageId}
                  <span aria-hidden="true" className="mx-2 text-gray-400">
                    →
                  </span>
                  {transition.toPageId}
                </span>
                <span className="tabular-nums text-gray-500 dark:text-gray-400">
                  {transition.count}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
