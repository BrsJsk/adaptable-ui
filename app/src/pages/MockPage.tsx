import { Link } from "react-router";

import { findMenuTrail, type MenuNode } from "../config/menu";

type MockPageProps = {
  node: MenuNode;
};

type TablePreview = {
  columns: string[];
  rows: string[][];
};

const tablePreviews: Record<string, TablePreview> = {
  Orders: {
    columns: ["Order", "Customer", "Status", "Total"],
    rows: [
      ["#1042", "Amelia Stone", "Paid", "$128.00"],
      ["#1041", "Noah Brooks", "Processing", "$74.50"],
      ["#1040", "Mia Chen", "Refunded", "$39.00"],
    ],
  },
  Products: {
    columns: ["SKU", "Product", "Stock", "Status"],
    rows: [
      ["TEE-BLK-M", "Classic Tee", "42", "Active"],
      ["MUG-CER-W", "Ceramic Mug", "8", "Low stock"],
      ["BAG-CNV-01", "Canvas Tote", "0", "Out of stock"],
    ],
  },
  Customers: {
    columns: ["Customer", "Email", "Orders", "Segment"],
    rows: [
      ["Amelia Stone", "amelia@example.com", "12", "Returning"],
      ["Noah Brooks", "noah@example.com", "3", "New"],
      ["Mia Chen", "mia@example.com", "27", "VIP"],
    ],
  },
  Logs: {
    columns: ["Time", "Endpoint", "Status", "Attempts"],
    rows: [
      ["09:42:11", "orders/create", "200", "1"],
      ["09:41:58", "inventory/update", "503", "3"],
      ["09:38:04", "customers/upsert", "200", "1"],
    ],
  },
};

const formFields: Record<string, string[]> = {
  General: ["Store name", "Currency", "Time zone"],
  Security: ["Current password", "New password", "Confirm password"],
  "Two-factor authentication": ["Authentication method", "Phone number"],
  Webhooks: ["Endpoint URL", "Signing secret", "Description"],
  Notifications: ["Email address", "Digest frequency"],
  "Contact support": ["Subject", "Email address", "Message"],
};

const cardPreviews: Record<string, Array<{ label: string; value: string }>> = {
  Dashboard: [
    { label: "Orders today", value: "24" },
    { label: "Revenue today", value: "$1,860" },
    { label: "New customers", value: "7" },
  ],
  Reports: [
    { label: "Revenue", value: "$48,210" },
    { label: "Orders", value: "1,284" },
    { label: "Avg. order", value: "$37.54" },
  ],
  Marketing: [
    { label: "Active campaigns", value: "12" },
    { label: "Emails sent", value: "9,430" },
    { label: "Click-through rate", value: "4.8%" },
  ],
  Help: [
    { label: "Articles viewed", value: "318" },
    { label: "Open tickets", value: "5" },
    { label: "Avg. response", value: "2h 14m" },
  ],
};

const panelClass =
  "rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900";
const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950";

function TablePreview({ table }: { table: TablePreview }) {
  return (
    <div className={panelClass}>
      <div className="mb-3 flex flex-wrap gap-2">
        <input
          type="search"
          aria-label="Search sample rows"
          placeholder="Search..."
          className={`${inputClass} max-w-xs`}
        />
        <select
          aria-label="Filter sample rows"
          className={`${inputClass} max-w-40`}
        >
          <option>All statuses</option>
          <option>Active</option>
          <option>Archived</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <tr>
              {table.columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="border-b border-gray-200 px-3 py-2 font-medium dark:border-gray-800"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr
                key={row.join("-")}
                className="border-b border-gray-100 last:border-0 dark:border-gray-800"
              >
                {row.map((cell, index) => (
                  <td
                    key={`${row[0]}-${index}`}
                    className="px-3 py-2 text-gray-700 dark:text-gray-300"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
        Showing {table.rows.length} sample rows.
      </p>
    </div>
  );
}

function FormPreview({ title }: { title: string }) {
  const fields = formFields[title] ?? ["Name", "Description", "Default value"];

  return (
    <form
      className={`${panelClass} max-w-xl space-y-4`}
      onSubmit={(event) => event.preventDefault()}
    >
      {fields.map((field) => (
        <label key={field} className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700 dark:text-gray-300">
            {field}
          </span>
          <input type="text" placeholder={field} className={inputClass} />
        </label>
      ))}
      <button
        type="button"
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Save changes
      </button>
    </form>
  );
}

function CardPreview({
  cards,
}: {
  cards: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className={panelClass}>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {card.label}
          </p>
          <p className="mt-2 text-2xl font-semibold">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

function Preview({ node, section }: { node: MenuNode; section: string }) {
  const text = `${node.title} ${section}`.toLowerCase();

  if (/log/.test(text)) {
    return <TablePreview table={tablePreviews.Logs} />;
  }

  if (
    section === "Orders" ||
    section === "Products" ||
    section === "Customers"
  ) {
    return <TablePreview table={tablePreviews[section]} />;
  }

  if (
    /setting|account|security|profile|notification|billing|general|integration|webhook|contact|support/.test(
      text,
    )
  ) {
    return <FormPreview title={node.title} />;
  }

  return (
    <CardPreview
      cards={
        cardPreviews[section] ?? [
          { label: "Total items", value: "42" },
          { label: "Active items", value: "38" },
          { label: "Changes this week", value: "6" },
        ]
      }
    />
  );
}

export default function MockPage({ node }: MockPageProps) {
  const trail = findMenuTrail(node.path);
  const breadcrumbs = trail.length > 0 ? trail : [node];
  const section = breadcrumbs[0]?.title ?? "Dashboard";

  return (
    <article>
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400"
      >
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.id} className="flex items-center gap-1">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {index === breadcrumbs.length - 1 ? (
              <span
                aria-current="page"
                className="font-medium text-gray-700 dark:text-gray-200"
              >
                {crumb.title}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="hover:text-gray-900 hover:underline dark:hover:text-gray-100"
              >
                {crumb.title}
              </Link>
            )}
          </span>
        ))}
      </nav>

      <h1 className="text-2xl font-semibold">{node.title}</h1>

      <pre className="mt-3 w-fit rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
        {`id: ${node.id}\npath: ${node.path}`}
      </pre>

      <p className="mt-4 max-w-2xl text-sm text-gray-600 dark:text-gray-300">
        This is a placeholder page for {node.title}. It gives the menu a real
        destination for navigation experiments; nothing on this page loads data
        or saves changes.
      </p>

      <div className="mt-6 space-y-4">
        <Preview node={node} section={section} />
      </div>
    </article>
  );
}
