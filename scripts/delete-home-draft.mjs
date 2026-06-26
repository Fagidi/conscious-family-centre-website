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

const client = createClient({
  projectId: envVars.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: envVars.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: envVars.SANITY_WRITE_TOKEN,
  useCdn: false,
});

try {
  await client.delete("drafts.homePage");
  console.log("✓ Stale homePage draft deleted — the published version is now visible in Studio.");
} catch (e) {
  if (e.statusCode === 404) {
    console.log("No draft found — homePage is already in a clean published state.");
  } else {
    console.error("Error:", e.message);
  }
}
