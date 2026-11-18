import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

import { flattenMenu, menu } from "../src/config/menu";

// Every page comes from the menu config; adding a node adds its route too.
const pages = flattenMenu(menu).map((node) =>
  route(node.path.slice(1), "routes/mock-page.tsx", { id: node.id }),
);

export default [
  layout("routes/layout.tsx", [index("routes/index.tsx"), ...pages]),
] satisfies RouteConfig;
