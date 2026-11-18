import { useLocation } from "react-router";

import { findMenuTrail } from "../../src/config/menu";
import MockPage from "../../src/pages/MockPage";

/**
 * Single route module shared by every generated route in routes.ts.
 * The menu config decides which node is rendered for a URL.
 */
export default function MockRoute() {
  const { pathname } = useLocation();
  const trail = findMenuTrail(pathname);
  const node = trail.at(-1);

  return (
    <MockPage
      node={
        node ?? {
          id: "not-found",
          title: "Page not found",
          path: pathname,
        }
      }
    />
  );
}
