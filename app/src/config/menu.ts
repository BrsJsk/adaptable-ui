export type MenuNode = {
  id: string;
  title: string;
  path: string;
  icon?: string;
  children?: MenuNode[];
};

export const menu: MenuNode[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    path: "/dashboard",
    icon: "dashboard",
    children: [
      {
        id: "dashboard-recent-activity",
        title: "Recent activity",
        path: "/dashboard/recent-activity",
      },
      {
        id: "dashboard-key-metrics",
        title: "Key metrics",
        path: "/dashboard/key-metrics",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders",
    path: "/orders",
    icon: "orders",
    children: [
      {
        id: "orders-all-orders",
        title: "All orders",
        path: "/orders/all-orders",
      },
      {
        id: "orders-fulfillment",
        title: "Fulfillment",
        path: "/orders/fulfillment",
        children: [
          {
            id: "orders-fulfillment-pending-shipments",
            title: "Pending shipments",
            path: "/orders/fulfillment/pending-shipments",
          },
        ],
      },
      {
        id: "orders-returns",
        title: "Returns",
        path: "/orders/returns",
        children: [
          {
            id: "orders-returns-return-requests",
            title: "Return requests",
            path: "/orders/returns/return-requests",
          },
          {
            id: "orders-returns-warranty-claims",
            title: "Warranty claims",
            path: "/orders/returns/warranty-claims",
            children: [
              {
                id: "orders-returns-warranty-claims-claim-review",
                title: "Claim review",
                path: "/orders/returns/warranty-claims/claim-review",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    path: "/products",
    icon: "products",
    children: [
      {
        id: "products-all-products",
        title: "All products",
        path: "/products/all-products",
      },
      {
        id: "products-inventory",
        title: "Inventory",
        path: "/products/inventory",
      },
      {
        id: "products-categories",
        title: "Categories",
        path: "/products/categories",
      },
      {
        id: "products-catalog",
        title: "Catalog",
        path: "/products/catalog",
        children: [
          {
            id: "products-catalog-collections",
            title: "Collections",
            path: "/products/catalog/collections",
          },
        ],
      },
    ],
  },
  {
    id: "customers",
    title: "Customers",
    path: "/customers",
    icon: "customers",
    children: [
      {
        id: "customers-all-customers",
        title: "All customers",
        path: "/customers/all-customers",
      },
      {
        id: "customers-segments",
        title: "Segments",
        path: "/customers/segments",
      },
      {
        id: "customers-loyalty",
        title: "Loyalty program",
        path: "/customers/loyalty",
        children: [
          {
            id: "customers-loyalty-tiers",
            title: "Tiers",
            path: "/customers/loyalty/tiers",
          },
        ],
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    path: "/marketing",
    icon: "marketing",
    children: [
      {
        id: "marketing-campaigns",
        title: "Campaigns",
        path: "/marketing/campaigns",
      },
      {
        id: "marketing-email-templates",
        title: "Email templates",
        path: "/marketing/email-templates",
      },
      {
        id: "marketing-discounts",
        title: "Discounts",
        path: "/marketing/discounts",
      },
      {
        id: "marketing-affiliates",
        title: "Affiliates",
        path: "/marketing/affiliates",
      },
    ],
  },
  {
    id: "reports",
    title: "Reports",
    path: "/reports",
    icon: "reports",
    children: [
      {
        id: "reports-sales",
        title: "Sales",
        path: "/reports/sales",
        children: [
          {
            id: "reports-sales-regional",
            title: "Regional",
            path: "/reports/sales/regional",
            children: [
              {
                id: "reports-sales-regional-by-country",
                title: "By country",
                path: "/reports/sales/regional/by-country",
              },
            ],
          },
        ],
      },
      {
        id: "reports-inventory",
        title: "Inventory",
        path: "/reports/inventory",
      },
      {
        id: "reports-tax",
        title: "Tax",
        path: "/reports/tax",
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    path: "/settings",
    icon: "settings",
    children: [
      {
        id: "settings-general",
        title: "General",
        path: "/settings/general",
      },
      {
        id: "settings-account",
        title: "Account",
        path: "/settings/account",
        children: [
          {
            id: "settings-account-security",
            title: "Security",
            path: "/settings/account/security",
            children: [
              {
                id: "settings-account-security-two-factor",
                title: "Two-factor authentication",
                path: "/settings/account/security/two-factor",
              },
            ],
          },
        ],
      },
      {
        id: "settings-integrations",
        title: "Integrations",
        path: "/settings/integrations",
        children: [
          {
            id: "settings-integrations-webhooks",
            title: "Webhooks",
            path: "/settings/integrations/webhooks",
            children: [
              {
                id: "settings-integrations-webhooks-delivery-logs",
                title: "Delivery logs",
                path: "/settings/integrations/webhooks/delivery-logs",
              },
            ],
          },
        ],
      },
      {
        id: "settings-notifications",
        title: "Notifications",
        path: "/settings/notifications",
      },
    ],
  },
  {
    id: "help",
    title: "Help",
    path: "/help",
    icon: "help",
    children: [
      {
        id: "help-contact-support",
        title: "Contact support",
        path: "/help/contact-support",
      },
    ],
  },
];

export default menu;

/** Depth-first list of every node, in config order. */
export function flattenMenu(nodes: MenuNode[] = menu): MenuNode[] {
  return nodes.flatMap((node) => [node, ...flattenMenu(node.children ?? [])]);
}

/** Ancestor-to-leaf chain for a path, used for breadcrumbs and menu expansion. */
export function findMenuTrail(
  path: string,
  nodes: MenuNode[] = menu,
): MenuNode[] {
  const target = path.length > 1 ? path.replace(/\/+$/, "") : path;

  for (const node of nodes) {
    if (node.path === target) return [node];
    if (node.children) {
      const trail = findMenuTrail(target, node.children);
      if (trail.length > 0) return [node, ...trail];
    }
  }

  return [];
}
