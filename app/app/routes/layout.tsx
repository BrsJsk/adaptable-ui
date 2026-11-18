import { NavLink, Outlet } from "react-router";

import Sidebar from "../../src/components/Sidebar";
import { menu } from "../../src/config/menu";
import { usePageTracking } from "../../src/hooks/usePageTracking";

export default function AppLayout() {
  usePageTracking();

  return (
    <div className="flex min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="px-3 pb-2 text-base font-semibold">Adaptable UI</div>
        <NavLink
          to="/stats"
          className={({ isActive }) =>
            [
              "mb-4 block rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
            ].join(" ")
          }
        >
          Analytics
        </NavLink>
        <Sidebar nodes={menu} />
      </aside>

      <main className="flex-1 p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
