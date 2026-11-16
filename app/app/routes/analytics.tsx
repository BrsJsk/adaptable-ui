import type { Route } from "./+types/analytics";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Analytics" },
    { name: "description", content: "Analytics page" },
  ];
}

export default function Analytics() {
  return <h1 className="text-2xl font-semibold">Analytics</h1>;
}
