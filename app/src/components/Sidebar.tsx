import { useState } from "react";
import { NavLink, useLocation } from "react-router";

import { findMenuTrail, type MenuNode } from "../config/menu";

type SidebarProps = {
  nodes: MenuNode[];
};

const iconGlyphs: Record<string, string> = {
  dashboard: "▦",
  orders: "▤",
  products: "▣",
  customers: "◍",
  marketing: "✦",
  reports: "▥",
  settings: "⚙",
  help: "?",
};

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={`h-4 w-4 transition-transform ${open ? "rotate-90" : ""}`}
    >
      <path
        d="M7.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function itemClass({ isActive }: { isActive: boolean }) {
  return [
    "flex min-w-0 flex-1 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100",
  ].join(" ");
}

export default function Sidebar({ nodes }: SidebarProps) {
  const { pathname } = useLocation();
  const [manualOpen, setManualOpen] = useState<Record<string, boolean>>({});

  // Branches on the current route open by default; a manual toggle overrides that.
  const activeAncestors = new Set(
    findMenuTrail(pathname)
      .slice(0, -1)
      .map((node) => node.id),
  );

  function renderNodes(items: MenuNode[], depth: number): React.ReactNode {
    return (
      <ul
        className={
          depth === 0
            ? "space-y-1"
            : "mt-1 space-y-1 border-l border-gray-200 pl-3 dark:border-gray-800"
        }
      >
        {items.map((node) => {
          const children = node.children ?? [];
          const hasChildren = children.length > 0;
          const open = hasChildren
            ? (manualOpen[node.id] ?? activeAncestors.has(node.id))
            : false;

          return (
            <li key={node.id}>
              <div className="flex items-center gap-0.5">
                <NavLink
                  to={node.path}
                  end
                  data-menu-id={node.id}
                  className={itemClass}
                >
                  {node.icon ? (
                    <span
                      aria-hidden="true"
                      className="w-4 shrink-0 text-center text-xs opacity-70"
                    >
                      {iconGlyphs[node.icon] ?? "•"}
                    </span>
                  ) : null}
                  <span className="truncate">{node.title}</span>
                </NavLink>

                {hasChildren ? (
                  <button
                    type="button"
                    aria-label={`${open ? "Collapse" : "Expand"} ${node.title}`}
                    aria-expanded={open}
                    onClick={() =>
                      setManualOpen((current) => ({
                        ...current,
                        [node.id]: !open,
                      }))
                    }
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                  >
                    <Chevron open={open} />
                  </button>
                ) : null}
              </div>

              {hasChildren && open ? renderNodes(children, depth + 1) : null}
            </li>
          );
        })}
      </ul>
    );
  }

  return <nav aria-label="Main menu">{renderNodes(nodes, 0)}</nav>;
}
