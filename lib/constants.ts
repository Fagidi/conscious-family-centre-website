import type { AgeBand, AgeBandId, ProgramType } from "./types";

/**
 * Static taxonomy — shared by schemas (option lists), navigation, and
 * components. Editing labels here keeps Studio and the UI in lockstep.
 */

export const AGE_BANDS: Record<AgeBandId, AgeBand> = {
  "little-ones": { id: "little-ones", label: "Little Ones", range: "0–3 years" },
  explorers: { id: "explorers", label: "Explorers", range: "3–6 years" },
  "big-kids": { id: "big-kids", label: "Big Kids", range: "6–10 years" },
};

export const AGE_BAND_LIST: AgeBand[] = Object.values(AGE_BANDS);

export const PROGRAM_LABELS: Record<ProgramType, string> = {
  "stay-and-play": "Stay & Play",
  "homeschool-hub": "Homeschool Hub",
  "forest-school": "Forest School",
  "enrichment-clubs": "Enrichment Clubs",
  "waka-wednesday": "Waka Wednesday",
  "creative-arts": "Creative Arts",
  "nanny-training": "Nanny Intensive Training",
};

/** Route slugs for each program type (mirrors the sitemap). */
export const PROGRAM_SLUGS: Record<ProgramType, string> = {
  "stay-and-play": "stay-and-play",
  "homeschool-hub": "homeschool-hub",
  "forest-school": "forest-school",
  "enrichment-clubs": "enrichment-clubs",
  "waka-wednesday": "waka-wednesday",
  "creative-arts": "creative-arts",
  "nanny-training": "nanny-training",
};
