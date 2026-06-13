/**
 * Seed the Sanity dataset with the curated launch content from lib/content.ts.
 *
 * Usage:
 *   1. Create a token with Editor rights: sanity.io/manage → API → Tokens
 *   2. Put it in .env.local as SANITY_WRITE_TOKEN="..."
 *   3. npm run seed
 *
 * The script is idempotent — documents use stable _ids and are
 * created-or-replaced, so re-running refreshes rather than duplicates.
 * Unsplash placeholder images are uploaded once as Sanity assets.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@sanity/client";
import {
  siteSettings,
  seoSettings,
  heroes,
  homePage,
  aboutPage,
  servicesPage,
  faqPage,
  contactContent,
  ctaSection,
  services,
  testimonials,
  galleryImages,
  faqItems,
} from "../lib/content";

/* ── Load .env.local (no dotenv dependency) ─────────────────────── */
const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"#]*)"?\s*$/);
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2].trim();
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error("✗ NEXT_PUBLIC_SANITY_PROJECT_ID is not set (.env.local).");
  process.exit(1);
}
if (!token) {
  console.error(
    "✗ SANITY_WRITE_TOKEN is not set.\n" +
      "  Create one with Editor rights at https://sanity.io/manage → API → Tokens\n" +
      '  and add SANITY_WRITE_TOKEN="..." to .env.local.',
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
  useCdn: false,
});

/* ── Helpers ────────────────────────────────────────────────────── */

let keyCounter = 0;
const key = () => `seed-${(keyCounter++).toString(36)}`;

/** Wrap array-of-object items with the _key Sanity requires. */
const withKeys = <T extends object>(items: T[]) =>
  items.map((item) => ({ _key: key(), ...item }));

const imageAssetCache = new Map<string, string>();

/** Upload a remote image once and return a Sanity image field value. */
async function imageRef(url: string | undefined) {
  if (!url) return undefined;
  let assetId = imageAssetCache.get(url);
  if (!assetId) {
    process.stdout.write(`  ↑ uploading ${url.slice(0, 72)}…\n`);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const filename = (new URL(url).pathname.split("/").pop() || "image") + ".jpg";
    const asset = await client.assets.upload("image", buffer, { filename });
    assetId = asset._id;
    imageAssetCache.set(url, assetId);
  }
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

/* ── Build documents ────────────────────────────────────────────── */

async function buildDocuments() {
  const docs: Record<string, unknown>[] = [];

  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    ...siteSettings,
  });

  docs.push({
    _id: "seoSettings",
    _type: "seoSettings",
    metaTitle: seoSettings.metaTitle,
    metaDescription: seoSettings.metaDescription,
    keywords: seoSettings.keywords,
  });

  for (const [page, hero] of Object.entries(heroes)) {
    docs.push({
      _id: `hero-${page}`,
      _type: "hero",
      page,
      eyebrow: hero.eyebrow,
      titleLines: hero.titleLines,
      subtitle: hero.subtitle,
      ctaLabel: hero.ctaLabel,
      ctaHref: hero.ctaHref,
      secondaryCtaLabel: hero.secondaryCtaLabel,
      secondaryCtaHref: hero.secondaryCtaHref,
      image: await imageRef(hero.image),
      imageAlt: hero.imageAlt,
    });
  }

  docs.push({
    _id: "homePage",
    _type: "homePage",
    manifesto: homePage.manifesto,
    stats: withKeys(homePage.stats),
    servicesSection: homePage.servicesSection,
    gallerySection: homePage.gallerySection,
    testimonialsEyebrow: homePage.testimonialsEyebrow,
    seo: homePage.seo,
  });

  docs.push({
    _id: "aboutPage",
    _type: "aboutPage",
    story: {
      eyebrow: aboutPage.story.eyebrow,
      titleLines: aboutPage.story.titleLines,
      paragraphs: aboutPage.story.paragraphs,
      image: await imageRef(aboutPage.story.image),
      imageAlt: aboutPage.story.imageAlt,
      secondImage: await imageRef(aboutPage.story.secondImage),
      secondImageAlt: aboutPage.story.secondImageAlt,
    },
    pillarsSection: aboutPage.pillarsSection,
    pillars: withKeys(aboutPage.pillars),
    closing: aboutPage.closing,
    seo: aboutPage.seo,
  });

  docs.push({
    _id: "servicesPage",
    _type: "servicesPage",
    processSection: servicesPage.processSection,
    processSteps: withKeys(servicesPage.processSteps),
    seo: servicesPage.seo,
  });

  docs.push({
    _id: "faqPage",
    _type: "faqPage",
    sideNote: faqPage.sideNote,
    seo: faqPage.seo,
  });

  docs.push({
    _id: "contactInfo",
    _type: "contactInfo",
    eyebrow: contactContent.eyebrow,
    titleLines: contactContent.titleLines,
    body: contactContent.body,
    image: await imageRef(contactContent.image),
    imageAlt: contactContent.imageAlt,
    eventTypes: contactContent.eventTypes,
    seo: contactContent.seo,
  });

  docs.push({
    _id: "ctaSection",
    _type: "ctaSection",
    eyebrow: ctaSection.eyebrow,
    titleLines: ctaSection.titleLines,
    body: ctaSection.body,
    ctaLabel: ctaSection.ctaLabel,
    ctaHref: ctaSection.ctaHref,
    image: await imageRef(ctaSection.image),
    imageAlt: ctaSection.imageAlt,
  });

  for (const [i, service] of services.entries()) {
    docs.push({
      _id: `service-${service.slug}`,
      _type: "service",
      title: service.title,
      slug: { _type: "slug", current: service.slug },
      eyebrow: service.eyebrow,
      order: i + 1,
      shortDescription: service.shortDescription,
      description: service.description,
      features: service.features,
      image: await imageRef(service.image),
      imageAlt: service.imageAlt,
    });
  }

  for (const [i, t] of testimonials.entries()) {
    docs.push({ _id: `testimonial-${i + 1}`, _type: "testimonial", order: i + 1, ...t });
  }

  for (const [i, img] of galleryImages.entries()) {
    docs.push({
      _id: `galleryImage-${i + 1}`,
      _type: "galleryImage",
      image: await imageRef(img.src),
      alt: img.alt,
      caption: img.caption,
      order: i + 1,
    });
  }

  for (const [i, item] of faqItems.entries()) {
    docs.push({ _id: `faqItem-${i + 1}`, _type: "faqItem", order: i + 1, ...item });
  }

  return docs;
}

/* ── Run ────────────────────────────────────────────────────────── */

async function run() {
  console.log(`Seeding project ${projectId} / dataset ${dataset}…\n`);
  const docs = await buildDocuments();

  let tx = client.transaction();
  for (const doc of docs) tx = tx.createOrReplace(doc as never);
  await tx.commit();

  console.log(`\n✓ Seeded ${docs.length} documents (${imageAssetCache.size} images uploaded).`);
  console.log("  Open /studio to review and publish edits.");
}

run().catch((err) => {
  console.error("✗ Seed failed:", err.message ?? err);
  process.exit(1);
});
