import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSONFilePreset } from "lowdb/node";

export const defaultData = { events: [] };

// Relative DB_FILE paths are resolved from the api/ package root so the API
// behaves the same when started from the repo root, api/, or a container.
const apiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const dbFilePath = path.resolve(
  apiRoot,
  process.env.DB_FILE || "./data/db.json",
);

await mkdir(path.dirname(dbFilePath), { recursive: true });

export const db = await JSONFilePreset(dbFilePath, structuredClone(defaultData));

// Make sure db.json exists on the very first run, before any events arrive.
await db.write();
