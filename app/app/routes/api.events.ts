import type { Route } from "./+types/api.events";

import { getApiBaseUrl } from "../lib/analytics.server";

/** Server-side proxy for page visit events posted by usePageTracking(). */
export async function action({ request }: Route.ActionArgs) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await response.text();

    return new Response(body || "{}", {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Could not reach analytics API", error);
    return Response.json({ error: "Analytics API unavailable" }, { status: 502 });
  }
}
