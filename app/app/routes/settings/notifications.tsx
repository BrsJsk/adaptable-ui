import type { Route } from "./+types/notifications";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings · Notifications" },
    { name: "description", content: "Notification settings" },
  ];
}

export default function SettingsNotifications() {
  return <h1 className="text-2xl font-semibold">Settings · Notifications</h1>;
}
