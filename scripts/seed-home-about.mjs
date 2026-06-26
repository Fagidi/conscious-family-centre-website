/**
 * Migration: seed the homePage and aboutPage singleton documents.
 *
 * Run:  node scripts/seed-home-about.mjs
 *       node scripts/seed-home-about.mjs --skip-images   (text + structure only)
 *
 * Idempotent — uses createOrReplace so it is safe to re-run.
 * Only touches the two documents: does NOT overwrite Programs, Gallery, FAQ,
 * Team, or any other content the editor has already published.
 *
 * After running, open /studio → Homepage and About Us, then click Publish
 * on each document. The website will reflect the Sanity content within ~60s.
 */

import { createClient } from "@sanity/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const skipImages = process.argv.includes("--skip-images");

/* ── Load .env.local ─────────────────────────────────────────────── */

const envPath = resolve(__dirname, "..", ".env.local");
const envVars = {};
for (const line of readFileSync(envPath, "utf-8").split("\n")) {
  const m = line.match(/^([A-Z_]+)="(.*)"/);
  if (m) envVars[m[1]] = m[2];
}

const projectId = envVars.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = envVars.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = envVars.SANITY_WRITE_TOKEN;

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

console.log(`\nMigrating homePage + aboutPage → project "${projectId}" / dataset "${dataset}"`);

/* ── Helpers ──────────────────────────────────────────────────────── */

let keyN = 0;
const k = () => `k${++keyN}`;
const withKeys = (arr) => arr.map((item) => ({ ...item, _key: k() }));

const imageCache = {};

async function uploadImage(seed) {
  if (skipImages) return null;
  if (imageCache[seed]) return imageCache[seed];
  const url = `https://picsum.photos/seed/${seed}/1200/800`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await client.assets.upload("image", buffer, {
      filename: `${seed}.jpg`,
      contentType: "image/jpeg",
    });
    const ref = { _type: "reference", _ref: asset._id };
    imageCache[seed] = ref;
    return ref;
  } catch (e) {
    console.warn(`  ⚠ Image upload failed for "${seed}": ${e.message}`);
    return null;
  }
}

async function img(seed, alt) {
  const asset = await uploadImage(seed);
  if (!asset) return undefined;
  return { _type: "imageWithAlt", asset, alt };
}

function cta(label, href, variant = "primary") {
  return { _type: "cta", label, href, variant, _key: k() };
}

function seo(title, description, keywords) {
  return { _type: "seo", title, description, ...(keywords ? { keywords } : {}) };
}

async function save(doc) {
  await client.createOrReplace(doc);
  console.log(`  ✓ ${doc._type}  (${doc._id})`);
}

/* ── Images ───────────────────────────────────────────────────────── */

if (!skipImages) {
  const seeds = [
    "cfc-hero", "cfc-about",
    "cfc-about-hero", "cfc-story",
    "cfc-env-1", "cfc-env-2", "cfc-env-3", "cfc-env-4", "cfc-env-5",
    "cfc-community",
  ];
  console.log(`\nUploading ${seeds.length} images…`);
  for (let i = 0; i < seeds.length; i += 5) {
    const batch = seeds.slice(i, i + 5);
    await Promise.all(batch.map((s) => uploadImage(s)));
    console.log(`  ${Math.min(i + 5, seeds.length)}/${seeds.length}`);
  }
} else {
  console.log("\n--skip-images: skipping image uploads");
}

/* ── Homepage ─────────────────────────────────────────────────────── */

console.log("\nCreating homePage document…");

const homeHero = await img("cfc-hero", "Children exploring and playing outdoors at Conscious Family Centre");
const homeAbout = await img("cfc-about", "Children and carers together at Conscious Family Centre");

await save({
  _id: "homePage",
  _type: "homePage",
  hero: {
    eyebrow: "Wuse 2, Abuja · Ages 0–10",
    headline: "Where children grow through nature, play, and community.",
    subhead:
      "A nature-connected playgroup and alternative-learning community for children 0–10 — rooted in play, the outdoors, and conscious family support.",
    ...(homeHero ? { image: homeHero } : {}),
    primaryCta: cta("Book a Visit", "/contact", "primary"),
    secondaryCta: cta("Explore Programs", "/programs", "ghost"),
    tertiaryCta: cta("Summer Camp Registration", "/camp-registration", "secondary"),
  },
  why: {
    eyebrow: "Why families choose us",
    heading: "A gentler, richer way to grow up.",
    intro: "Everything we do is built around the natural world, child-led play, and a community that supports the whole family.",
    pillars: withKeys([
      { title: "Nature-connected learning", description: "Forest school, outdoor play, and weekly Waka Wednesday excursions keep children connected to the natural world.", icon: "leaf" },
      { title: "Learning through play", description: "Play-based, child-led days that nurture curiosity, creativity, and quiet confidence.", icon: "sprout" },
      { title: "A real community", description: "A warm hub for families and homeschoolers, with enrichment clubs and shared support.", icon: "compass" },
      { title: "Conscious, caring people", description: "Intentional, nurturing care for the whole child — and for the families and carers around them.", icon: "sun" },
    ]),
  },
  about: {
    eyebrow: "About us",
    heading: "More than a centre — a community for conscious families.",
    paragraphs: [
      "Conscious Family Centre is a nature-connected playgroup and alternative-learning community in Wuse 2, Abuja, for children from birth to age 10.",
      "We believe children learn best through play and time in nature, supported by a community that cares for the whole family. From stay-and-play sessions to forest school and our homeschool hub, every day is built around curiosity, connection, and joy.",
    ],
    ...(homeAbout ? { image: homeAbout } : {}),
    cta: cta("Learn More", "/about", "ghost"),
  },
  programs: {
    eyebrow: "Our programs",
    heading: "Programs for every age and stage.",
    intro: "From little ones to big kids — play, nature, and learning, woven through every week.",
    cta: cta("View All Programs", "/programs", "ghost"),
  },
  camp: {
    eyebrow: "Holiday camp",
    heading: "Summer STEAM Holiday Camp",
    intro: "A holiday of STEAM projects, forest-school adventures, and creative play. Places are limited.",
  },
  gallery: {
    eyebrow: "Life at CFC",
    heading: "Moments from our days.",
    intro: "Muddy boots, big ideas, and plenty of joy.",
    cta: cta("View Gallery", "/gallery", "ghost"),
  },
  testimonials: {
    eyebrow: "Loved by our families",
    heading: "What parents say.",
  },
  faq: {
    eyebrow: "Good to know",
    heading: "Questions, answered.",
    cta: cta("View All FAQs", "/faq", "ghost"),
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "Come and feel the difference.",
    body: "Visit us in Wuse 2, ask us anything, or secure a place at Summer Camp.",
    ctas: [
      cta("Book a Visit", "/contact", "primary"),
      cta("Contact Us", "/contact", "ghost"),
      cta("Register for Camp", "/camp-registration", "secondary"),
    ],
  },
  seo: seo(
    "Conscious Family Centre — Nature-Connected Learning in Abuja",
    "Nature-connected playgroup and alternative-learning community in Wuse 2, Abuja, for children 0–10: stay & play, forest school, homeschool hub, and holiday camps.",
  ),
});

/* ── About page ───────────────────────────────────────────────────── */

console.log("\nCreating aboutPage document…");

const aboutHero = await img("cfc-about-hero", "Children exploring the garden at Conscious Family Centre");
const aboutStory = await img("cfc-story", "A quiet, joyful moment between a child and carer at the centre");
const aboutCommunity = await img("cfc-community", "Families gathered together at a Conscious Family Centre event");

const envImages = [];
for (let i = 1; i <= 5; i++) {
  const ei = await img(`cfc-env-${i}`, `The learning environment at Conscious Family Centre ${i}`);
  if (ei) envImages.push({ ...ei, _key: k() });
}

await save({
  _id: "aboutPage",
  _type: "aboutPage",
  hero: {
    eyebrow: "About Conscious Family Centre",
    title: "A place where childhood is allowed to unfold.",
    mission:
      "We are a nature-connected playgroup and alternative-learning community in Wuse 2, Abuja — nurturing children from birth to age 10 through play, the outdoors, and conscious support for the whole family.",
    ...(aboutHero ? { image: aboutHero } : {}),
  },
  story: {
    eyebrow: "Our story",
    heading: "Built around a simple belief.",
    paragraphs: [
      "Conscious Family Centre grew from a simple conviction: that children learn best when they are free to play, to wonder, and to spend their days close to nature.",
      "So we made a place for exactly that — an unhurried, nature-connected community in the heart of Wuse 2, where days are shaped by curiosity rather than the clock, and where the whole family is welcomed in.",
      "Today we are a growing community of families and homeschoolers across Abuja, learning together through stay-and-play mornings, forest-school adventures, and a home for those choosing a gentler path.",
    ],
    ...(aboutStory ? { image: aboutStory } : {}),
    pullQuote: "Children learn best through play and time in nature, supported by a community that cares for the whole family.",
  },
  philosophy: {
    eyebrow: "Our philosophy",
    heading: "How children learn here.",
    intro: "Four beliefs shape every day at the centre — and everything we ask of ourselves as a community.",
    cards: withKeys([
      { title: "Conscious learning", description: "Intentional, unhurried days that follow a child's natural rhythm — not a rigid timetable.", icon: "sun" },
      { title: "Child-led exploration", description: "Play-based, self-directed discovery that nurtures curiosity, creativity, and quiet confidence.", icon: "sprout" },
      { title: "Family-centred approach", description: "We care for the whole family — supporting parents, carers, and homeschoolers, not just children.", icon: "compass" },
      { title: "Nature connection", description: "Forest school, outdoor play, and weekly excursions keep children rooted in the natural world.", icon: "leaf" },
    ]),
  },
  differentiators: {
    eyebrow: "What makes us different",
    heading: "Not a typical childcare centre.",
    intro: "Why families across Abuja are choosing a different way to grow up.",
    items: withKeys([
      { title: "Days built around nature", description: "Forest school and weekly Waka Wednesday excursions put the outdoors at the centre of learning.", icon: "leaf" },
      { title: "Learning through play", description: "Child-led, play-based days that protect curiosity and let confidence grow at its own pace.", icon: "sprout" },
      { title: "A real community", description: "A warm hub for families and homeschoolers — enrichment clubs, shared support, and friendship.", icon: "compass" },
      { title: "Care for the whole family", description: "From stay-and-play to nanny training, we support the grown-ups who care for children too.", icon: "sun" },
    ]),
  },
  environment: {
    eyebrow: "Our learning environment",
    heading: "A garden to grow in.",
    intro: "Tucked inside BMT Garden in Wuse 2, our spaces are calm, green, and made for exploring — indoors and out.",
    ...(envImages.length > 0 ? { images: envImages } : {}),
  },
  team: {
    eyebrow: "Meet the team",
    heading: "The people who make it home.",
    intro: "Warm, intentional educators and facilitators who care for the whole child.",
  },
  testimonials: {
    eyebrow: "Loved by our families",
    heading: "What parents say.",
  },
  community: {
    eyebrow: "Our community",
    heading: "More than a centre — a family.",
    paragraphs: [
      "Belonging is the heart of what we do. Families find each other here over muddy boots and shared mornings, and children grow up surrounded by friends of every age.",
      "From Waka Wednesday excursions to enrichment clubs and our homeschool hub, there's always a reason to gather, explore, and grow together.",
    ],
    ...(aboutCommunity ? { image: aboutCommunity } : {}),
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "Come and feel the difference.",
    body: "Visit us in Wuse 2, explore our programs, or secure a place at Summer Camp.",
    ctas: [
      cta("Book a Visit", "/contact", "primary"),
      cta("Explore Programs", "/programs", "ghost"),
      cta("Register for Summer Camp", "/camp-registration", "secondary"),
    ],
  },
  seo: seo(
    "About Us — Our Story, Philosophy & Community",
    "Conscious Family Centre is a nature-connected family learning centre in Wuse 2, Abuja. Discover our story, our conscious-education philosophy, and the community children grow up in.",
    ["family learning centre Abuja", "conscious education Abuja", "nature-based learning Wuse 2", "forest school philosophy", "homeschool community Abuja"],
  ),
});

/* ── Done ─────────────────────────────────────────────────────────── */

console.log(`
✅ Migration complete.

Next steps:
  1. Open your Sanity Studio → /studio
  2. Click "Homepage" in the left menu → click Publish
  3. Click "About Us" in the left menu → click Publish

The website will pick up changes within ~60 seconds after publishing.
Editing any field in Studio and clicking Publish will update the live site.
`);
