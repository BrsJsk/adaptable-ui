import type { Route } from "./+types/general";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings" },
    { name: "description", content: "General settings" },
  ];
}

export default function SettingsGeneral() {
  return <h1 className="text-2xl font-semibold">Settings</h1>;
}
