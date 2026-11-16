import type { Route } from "./+types/event-logs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Event Logs" },
    { name: "description", content: "Event logs page" },
  ];
}

export default function EventLogs() {
  return <h1 className="text-2xl font-semibold">Event Logs</h1>;
}
