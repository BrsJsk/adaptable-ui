import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("settings", "routes/settings/layout.tsx", [
      index("routes/settings/general.tsx"),
      route("profile", "routes/settings/profile.tsx"),
      route("notifications", "routes/settings/notifications.tsx"),
    ]),
    route("analytics", "routes/analytics.tsx"),
    route("event-logs", "routes/event-logs.tsx"),
    route("about", "routes/about.tsx"),
  ]),
] satisfies RouteConfig;
