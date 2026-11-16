import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
};

const settingsItems: NavItem[] = [
  { to: "/settings", label: "General", end: true },
  { to: "/settings/profile", label: "Profile" },
  { to: "/settings/notifications", label: "Notifications" },
];

function navLinkClass({ isActive }: { isActive: boolean }) {
  return [
    "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  ].join(" ");
}

export default function AppLayout() {
  const { pathname } = useLocation();
  const settingsActive = pathname.startsWith("/settings");
  const [settingsOpen, setSettingsOpen] = useState(settingsActive);

  return (
    <div className="flex min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <aside className="w-64 shrink-0 border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="px-3 pb-6 text-base font-semibold">Adaptable UI</div>
        <nav className="space-y-1">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>

          <div>
            <NavLink
              to="/settings"
              end
              onClick={() => setSettingsOpen((open) => !open)}
              aria-expanded={settingsOpen}
              className={({ isActive }) =>
                [
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive || settingsActive
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
                ].join(" ")
              }
            >
              Settings
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
                className={[
                  "h-4 w-4 transition-transform",
                  settingsOpen ? "rotate-90" : "",
                ].join(" ")}
              >
                <path
                  d="M7.5 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NavLink>

            {settingsOpen ? (
              <div className="mt-1 space-y-1 border-l border-gray-200 pl-3 dark:border-gray-800">
                {settingsItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={navLinkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>

          <NavLink to="/analytics" className={navLinkClass}>
            Analytics
          </NavLink>
          <NavLink to="/event-logs" className={navLinkClass}>
            Event Logs
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
