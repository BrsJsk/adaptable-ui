import type { Route } from "./+types/profile";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings · Profile" },
    { name: "description", content: "Profile settings" },
  ];
}

export default function SettingsProfile() {
  return <h1 className="text-2xl font-semibold">Settings · Profile</h1>;
}
