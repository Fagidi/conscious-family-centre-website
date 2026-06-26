/**
 * Seed the campSettings singleton document in Sanity.
 *
 * Run:  node scripts/seed-camp-settings.mjs
 *
 * Idempotent — uses createOrReplace, so safe to re-run without
 * duplicating data. After running, open /studio → Summer Camp →
 * Camp Settings and click Publish.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envVars = {};
for (const line of readFileSync(resolve(__dirname, "..", ".env.local"), "utf-8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="(.*)"/);
  if (m) envVars[m[1]] = m[2];
}

const projectId = envVars.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset   = envVars.NEXT_PUBLIC_SANITY_DATASET || "production";
const token     = envVars.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

console.log(`\nSeeding campSettings → project "${projectId}" / dataset "${dataset}"\n`);

await client.createOrReplace({
  _id:   "campSettings",
  _type: "campSettings",
  programmeYear:          "2026",
  capacity:               50,
  acceptingRegistrations: true,
  notes:                  "Future Makers Summer Experience 2026 — July & August.",
});

console.log("✓ campSettings seeded.");
console.log(`
Next steps:
  1. Open Studio → Summer Camp → Camp Settings
  2. Review the values (capacity is set to 50)
  3. Click Publish

The Camp Dashboard will read the capacity figure from this document.
`);
