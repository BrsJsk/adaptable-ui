import { Outlet } from "react-router";

import Sidebar from "../../src/components/Sidebar";
import { menu } from "../../src/config/menu";

export default function AppLayout() {
  // TODO: navigation tracking hook goes here

  return (
    <div className="flex min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <aside className="w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="px-3 pb-6 text-base font-semibold">Adaptable UI</div>
        <Sidebar nodes={menu} />
      </aside>

      <main className="flex-1 p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
