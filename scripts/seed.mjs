/**
 * Seed script — populates Sanity with the fallback content from lib/content.ts.
 *
 * Run:  node scripts/seed.mjs
 *       node scripts/seed.mjs --skip-images   (text only, much faster)
 *
 * Idempotent: uses createOrReplace, so re-running overwrites existing data.
 * WARNING: running this after editors have made changes will reset those edits.
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

console.log(`Seeding project "${projectId}" / dataset "${dataset}"`);

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

async function img(seed, alt, caption) {
  const asset = await uploadImage(seed);
  if (!asset) return undefined;
  return { _type: "imageWithAlt", asset, alt, caption: caption || undefined };
}

function ctaObj(label, href, variant = "primary") {
  return { _type: "cta", label, href, variant, _key: k() };
}

function seoObj(title, description, keywords) {
  return {
    _type: "seo",
    title,
    description,
    ...(keywords ? { keywords } : {}),
  };
}

function slugObj(value) {
  return { _type: "slug", current: value };
}

function blockText(text) {
  return [
    {
      _type: "block",
      _key: k(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: k(), text, marks: [] }],
    },
  ];
}

async function save(doc) {
  await client.createOrReplace(doc);
  console.log(`  ✓ ${doc._type} ${doc._id}`);
}

/* ── Phase 1: Upload all placeholder images ──────────────────────── */

const IMAGE_SEEDS = [
  "cfc-hero", "cfc-about",
  "cfc-about-hero", "cfc-story",
  "cfc-env-1", "cfc-env-2", "cfc-env-3", "cfc-env-4", "cfc-env-5",
  "cfc-community",
  "cfc-programs-hero", "cfc-programs-overview",
  "cfc-gallery-hero", "cfc-gallery-community",
  "cfc-faq-hero", "cfc-contact-hero",
  "cfc-stayplay", "cfc-forest", "cfc-homeschool", "cfc-arts",
  "stayplay-g1", "stayplay-g2", "stayplay-g3",
  "forest-g1", "forest-g2", "forest-g3",
  "homeschool-g1", "homeschool-g2", "homeschool-g3",
  "arts-g1", "arts-g2", "arts-g3",
  "cfc-camp",
  ...Array.from({ length: 12 }, (_, i) => `cfc-gallery-${i + 1}`),
  "cfc-story-nature-1", "cfc-story-nature-2",
];

if (!skipImages) {
  console.log(`\nUploading ${IMAGE_SEEDS.length} placeholder images…`);
  const BATCH = 5;
  for (let i = 0; i < IMAGE_SEEDS.length; i += BATCH) {
    const batch = IMAGE_SEEDS.slice(i, i + BATCH);
    await Promise.all(batch.map((s) => uploadImage(s)));
    console.log(`  ${Math.min(i + BATCH, IMAGE_SEEDS.length)}/${IMAGE_SEEDS.length}`);
  }
} else {
  console.log("\n--skip-images: skipping image uploads");
}

/* ── Phase 2: Collection documents ───────────────────────────────── */

console.log("\nCreating collection documents…");

// ── FAQ categories ──

const FAQ_CATS = [
  { slug: "general", title: "General", description: "The essentials — ages, hours, and location.", displayOrder: 1 },
  { slug: "programs", title: "Programs", description: "About our programs and how to take part.", displayOrder: 2 },
  { slug: "philosophy", title: "Learning Philosophy", description: "How and why children learn here.", displayOrder: 3 },
  { slug: "participation", title: "Family Participation", description: "How families take part day to day.", displayOrder: 4 },
  { slug: "enrollment", title: "Enrollment", description: "Getting started at the centre.", displayOrder: 5 },
  { slug: "camps", title: "Camps", description: "Holiday camp and registration.", displayOrder: 6 },
  { slug: "safety", title: "Safety", description: "Looking after your child.", displayOrder: 7 },
];

for (const cat of FAQ_CATS) {
  await save({
    _id: `faqCat-${cat.slug}`,
    _type: "faqCategory",
    title: cat.title,
    slug: slugObj(cat.slug),
    description: cat.description,
    displayOrder: cat.displayOrder,
  });
}

// ── FAQ items ──

const FAQS = [
  { q: "What ages do you cater for?", a: "We welcome children from birth to age 10 across our programs.", cat: "general", featured: true, popular: true, order: 1 },
  { q: "What are your opening hours?", a: "We're open Monday to Saturday, 10:00–15:00, and closed on Sundays.", cat: "general", featured: true, order: 2 },
  { q: "Where are you located?", a: "Inside BMT Garden, opposite Legacy Centre, Wuse 2, Abuja.", cat: "general", featured: true, popular: true, order: 3 },
  { q: "Do I need to book in advance?", a: "Yes — we recommend booking ahead, as places are limited.", cat: "general", order: 4 },
  { q: "Which programs are right for my child's age?", a: "We welcome children from birth to age 10. Stay & Play suits our youngest, while Forest School, Homeschool Hub and Creative Arts are designed for older explorers and big kids.", cat: "programs", popular: true, order: 1 },
  { q: "How do I join a program?", a: "The best first step is to book a visit so you can see the centre and meet us. We'll help you find the right fit and explain how to get started.", cat: "programs", featured: true, order: 2 },
  { q: "Do you offer drop-in or regular sessions?", a: "Stay & Play runs as relaxed drop-in sessions. Our other programs run on a regular basis — get in touch for current schedules, as places are limited.", cat: "programs", order: 3 },
  { q: "Where do the programs take place?", a: "All programs run from our home inside BMT Garden, opposite Legacy Centre in Wuse 2, Abuja, with plenty of outdoor space.", cat: "programs", order: 4 },
  { q: "What is your learning philosophy?", a: "We believe children learn best through play and time in nature, supported by a community that cares for the whole family. Our days are child-led and unhurried.", cat: "philosophy", featured: true, popular: true, order: 1 },
  { q: "Do you follow a fixed curriculum?", a: "Rather than a fixed curriculum, we follow each child's curiosity — creating the conditions for confidence, creativity, and connection to grow at their own pace.", cat: "philosophy", order: 2 },
  { q: "Can I stay with my child?", a: "Yes — our Stay & Play sessions are relaxed, drop-in mornings where little ones explore alongside a trusted grown-up.", cat: "participation", order: 1 },
  { q: "Do you support homeschooling families?", a: "Yes. Our Homeschool Hub is a warm community where homeschooling families learn together and find connection and support.", cat: "participation", popular: true, order: 2 },
  { q: "How do I get started?", a: "The best first step is to book a visit. We'll show you around, answer your questions, and help you find the right fit for your family.", cat: "enrollment", featured: true, order: 1 },
  { q: "How does Summer Camp registration work?", a: "Registration for our Summer Camp is open and places are limited. Full details will be confirmed here — please contact us for the latest information.", cat: "camps", featured: true, order: 1 },
  { q: "What ages is camp for?", a: "Camp details, including age groups and availability, are managed in our CMS and confirmed each season. Contact us for current details.", cat: "camps", order: 2 },
  { q: "How do you keep children safe?", a: "Your child's wellbeing is our priority. We're happy to talk through our approach in person — please book a visit or contact us.", cat: "safety", order: 1 },
];

for (let i = 0; i < FAQS.length; i++) {
  const f = FAQS[i];
  const slug = f.q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);
  await save({
    _id: `faq-${slug}`,
    _type: "faq",
    question: f.q,
    answer: blockText(f.a),
    category: { _type: "reference", _ref: `faqCat-${f.cat}` },
    featured: f.featured || false,
    popular: f.popular || false,
    order: f.order,
  });
}

// ── Gallery categories ──

const GALLERY_CATS = [
  { slug: "learning", title: "Learning", description: "Curiosity, discovery, and learning through play.", order: 1 },
  { slug: "nature", title: "Nature", description: "Forest school, garden play, and time outdoors.", order: 2 },
  { slug: "creativity", title: "Creativity", description: "Art, music, and making.", order: 3 },
  { slug: "community", title: "Community", description: "Families and friendships growing together.", order: 4 },
  { slug: "camps", title: "Camps", description: "Holiday camp adventures.", order: 5 },
];

for (const cat of GALLERY_CATS) {
  await save({
    _id: `galleryCat-${cat.slug}`,
    _type: "galleryCategory",
    title: cat.title,
    slug: slugObj(cat.slug),
    description: cat.description,
    order: cat.order,
  });
}

// ── Gallery items ──

for (let i = 0; i < 12; i++) {
  const cat = GALLERY_CATS[i % GALLERY_CATS.length];
  const image = await img(
    `cfc-gallery-${i + 1}`,
    `Conscious Family Centre — ${cat.title.toLowerCase()} (placeholder ${i + 1})`,
  );
  await save({
    _id: `galleryItem-${i + 1}`,
    _type: "galleryItem",
    ...(image ? { image } : {}),
    title: `${cat.title} moment`,
    slug: slugObj(`placeholder-${i + 1}`),
    category: { _type: "reference", _ref: `galleryCat-${cat.slug}` },
    caption: `A ${cat.title.toLowerCase()} moment at Conscious Family Centre.`,
    tags: [cat.slug, "placeholder"],
    featured: i < 3,
    order: i,
  });
}

// ── Featured stories ──

const storyImg1 = await img("cfc-story-nature-1", "Children exploring outdoors at Conscious Family Centre");
const storyImg2 = await img("cfc-story-nature-2", "A child discovering nature in the garden");

await save({
  _id: "featuredStory-a-day-in-nature",
  _type: "featuredStory",
  title: "A day rooted in nature.",
  slug: slugObj("a-day-in-nature"),
  description:
    "From muddy mornings in the garden to quiet moments under the trees, our days are shaped by the outdoors — where children explore, take safe risks, and grow in confidence.",
  images: withKeys([storyImg1, storyImg2].filter(Boolean).map((im) => ({ ...im }))),
  cta: ctaObj("Explore Programs", "/programs", "ghost"),
  order: 0,
});

// ── Testimonials (placeholders) ──

const TESTIMONIALS = [
  { quote: "A short, heartfelt quote from a parent will appear here once added in the CMS.", name: "Parent name", age: "Parent of a 4-year-old" },
  { quote: "Add a second parent testimonial in Studio — names and consent on file.", name: "Parent name", age: "Parent of a 6-year-old" },
  { quote: "A third testimonial placeholder, ready to be replaced with real words.", name: "Parent name", age: "Parent of a 2-year-old" },
];

for (let i = 0; i < TESTIMONIALS.length; i++) {
  const t = TESTIMONIALS[i];
  await save({
    _id: `testimonial-${i + 1}`,
    _type: "testimonial",
    quote: t.quote,
    authorName: t.name,
    childAge: t.age,
    consent: false,
    order: i,
  });
}

// ── Programs ──

const PROGRAMS = [
  {
    slug: "stay-and-play", title: "Stay & Play", type: "stay-and-play",
    ageBands: ["little-ones", "explorers"], order: 1,
    summary: "Relaxed, drop-in play sessions for little ones and their grown-ups.",
    heroSeed: "cfc-stayplay", heroAlt: "Toddlers and carers at a stay-and-play session",
    learningExperience: "Unhurried mornings of open-ended play, where babies and toddlers explore at their own pace alongside a trusted grown-up — and parents find a warm, welcoming community.",
    keyBenefits: ["Builds early confidence in a gentle setting", "Time for parents and carers to connect", "Sensory, open-ended play"],
    typicalActivities: ["Free play and exploration", "Sensory and messy play", "Songs and story time", "Outdoor garden play"],
    gallerySlugs: ["stayplay-g1", "stayplay-g2", "stayplay-g3"],
    ctaLabel: "Book a Visit",
    seo: { title: "Stay & Play — Drop-in Play Sessions in Wuse 2", description: "Relaxed drop-in play sessions for babies and toddlers and their grown-ups at Conscious Family Centre, Wuse 2, Abuja." },
  },
  {
    slug: "forest-school", title: "Forest School", type: "forest-school",
    ageBands: ["explorers", "big-kids"], order: 2,
    summary: "Outdoor, nature-based learning that builds confidence and curiosity.",
    heroSeed: "cfc-forest", heroAlt: "Children exploring at forest school",
    learningExperience: "Child-led days in the open air, where children take safe risks, follow their curiosity, and build a deep connection with the natural world.",
    keyBenefits: ["Confidence through safe, real challenges", "A genuine connection with nature", "Independence and resilience"],
    typicalActivities: ["Outdoor exploration", "Nature crafts", "Free play in the garden", "Seasonal discovery"],
    gallerySlugs: ["forest-g1", "forest-g2", "forest-g3"],
    ctaLabel: "Book a Visit",
    seo: { title: "Forest School — Nature-Based Learning in Abuja", description: "Outdoor, nature-based forest school for children in Wuse 2, Abuja — building confidence, curiosity and a love of the natural world." },
  },
  {
    slug: "homeschool-hub", title: "Homeschool Hub", type: "homeschool-hub",
    ageBands: ["explorers", "big-kids"], order: 3,
    summary: "A warm learning community for homeschooling families.",
    heroSeed: "cfc-homeschool", heroAlt: "Children learning together at the homeschool hub",
    learningExperience: "A supportive home base for homeschooling families — where children learn together, make friends, and grow within a community that shares the journey.",
    keyBenefits: ["Community and friendship for homeschoolers", "Shared, social learning", "Support for the whole family"],
    typicalActivities: ["Group learning sessions", "Collaborative projects", "Enrichment activities", "Outdoor play"],
    gallerySlugs: ["homeschool-g1", "homeschool-g2", "homeschool-g3"],
    ctaLabel: "Register Interest",
    seo: { title: "Homeschool Hub — A Learning Community in Abuja", description: "A warm, supportive homeschool community in Wuse 2, Abuja, where children learn together and families find connection." },
  },
  {
    slug: "creative-arts", title: "Creative Arts", type: "creative-arts",
    ageBands: ["explorers", "big-kids"], order: 4,
    summary: "Hands-on art, music, and making for curious minds.",
    heroSeed: "cfc-arts", heroAlt: "Children making art at Conscious Family Centre",
    learningExperience: "Joyful, hands-on sessions where children express themselves through art, music and making — process over product, imagination over instruction.",
    keyBenefits: ["Creativity and self-expression", "Fine-motor and sensory development", "Joyful, process-led making"],
    typicalActivities: ["Painting and drawing", "Music and movement", "Crafts and making", "Imaginative play"],
    gallerySlugs: ["arts-g1", "arts-g2", "arts-g3"],
    ctaLabel: "Book a Visit",
    seo: { title: "Creative Arts — Art, Music & Making for Children", description: "Hands-on creative arts sessions — art, music and making — for children at Conscious Family Centre, Wuse 2, Abuja." },
  },
];

for (const p of PROGRAMS) {
  const heroImage = await img(p.heroSeed, p.heroAlt);
  const galleryImages = [];
  for (const gs of p.gallerySlugs) {
    const gi = await img(gs, `Conscious Family Centre — ${p.slug} gallery`);
    if (gi) galleryImages.push({ ...gi, _key: k() });
  }
  await save({
    _id: `program-${p.slug}`,
    _type: "program",
    title: p.title,
    slug: slugObj(p.slug),
    type: p.type,
    ageBands: p.ageBands,
    summary: p.summary,
    ...(heroImage ? { heroImage } : {}),
    learningExperience: p.learningExperience,
    keyBenefits: p.keyBenefits,
    typicalActivities: p.typicalActivities,
    ...(galleryImages.length > 0 ? { gallery: galleryImages } : {}),
    cta: ctaObj(p.ctaLabel, "/contact", "primary"),
    seo: seoObj(p.seo.title, p.seo.description),
    order: p.order,
  });
}

// ── Camp session ──

const campHero = await img("cfc-camp", "Children at summer holiday camp");

await save({
  _id: "camp-summer-steam-2026",
  _type: "campSession",
  title: "Summer STEAM Holiday Camp",
  slug: slugObj("summer-steam-camp-2026"),
  season: "Summer 2026",
  theme: "STEAM & Nature",
  ageBand: "Ages 4–10",
  ...(campHero ? { heroImage: campHero } : {}),
  startDate: "2026-08-03",
  endDate: "2026-08-14",
  dailySchedule: "9:00 – 14:00, Monday to Friday",
  capacity: 30,
  priceNGN: 0,
  included: ["STEAM projects", "Forest-school sessions", "Creative arts", "Daily outdoor play"],
  packingList: [],
  status: "open",
  seo: seoObj("Summer STEAM Holiday Camp", "STEAM and nature holiday camp for children 4–10 in Abuja."),
});

/* ── Phase 3: Singleton documents ────────────────────────────────── */

console.log("\nCreating singleton documents…");

// ── Site Settings ──

await save({
  _id: "siteSettings",
  _type: "siteSettings",
  siteName: "Conscious Family Centre",
  tagline: "Nature-connected learning where children and families grow.",
  phone: "+234 803 518 3784",
  whatsapp: "+234 803 518 3784",
  email: "hello@consciousfamilycentre.com",
  address: {
    line: "Inside BMT Garden, Opp. Legacy Centre",
    area: "Wuse 2",
    city: "Abuja, FCT 904101",
    mapUrl: "https://maps.google.com/?q=BMT+Garden+Wuse+2+Abuja",
  },
  hours: ["Mon–Sat: 10:00 – 15:00", "Sun: Closed"],
  socials: {
    instagram: "https://instagram.com/consciousfamilycentre",
    facebook: "https://facebook.com/consciousfamilycentre",
  },
  announcement: {
    active: true,
    text: "Summer Camp registration is now open — places are limited.",
    ctaLabel: "Register",
    link: "/camp-registration",
  },
  defaultSeo: seoObj(
    "Conscious Family Centre — Nature-Connected Learning in Abuja",
    "A nature-connected playgroup and alternative-learning community in Wuse 2, Abuja, for children 0–10. Stay & play, homeschool hub, forest school, holiday camps and more.",
    ["playgroup Abuja", "forest school Abuja", "homeschool community Wuse 2", "holiday camp for kids Abuja", "nanny training Abuja"],
  ),
});

// ── Navigation ──

await save({
  _id: "navigation",
  _type: "navigation",
  header: withKeys([
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ]),
  footer: withKeys([
    {
      heading: "Explore",
      links: withKeys([
        { label: "About", href: "/about" },
        { label: "Programs", href: "/programs" },
        { label: "Gallery", href: "/gallery" },
        { label: "FAQ", href: "/faq" },
      ]),
    },
    {
      heading: "Get started",
      links: withKeys([
        { label: "Book a Visit", href: "/contact" },
        { label: "Summer Camp", href: "/camp-registration" },
        { label: "Contact Us", href: "/contact" },
      ]),
    },
  ]),
});

// ── Homepage ──

const homeHero = await img("cfc-hero", "Children exploring and playing outdoors at Conscious Family Centre");
const homeAbout = await img("cfc-about", "Children and carers together at Conscious Family Centre");

await save({
  _id: "homePage",
  _type: "homePage",
  hero: {
    eyebrow: "Wuse 2, Abuja · Ages 0–10",
    headline: "Where children grow through nature, play, and community.",
    subhead: "A nature-connected playgroup and alternative-learning community for children 0–10 — rooted in play, the outdoors, and conscious family support.",
    ...(homeHero ? { image: homeHero } : {}),
    primaryCta: ctaObj("Book a Visit", "/contact", "primary"),
    secondaryCta: ctaObj("Explore Programs", "/programs", "ghost"),
    tertiaryCta: ctaObj("Summer Camp Registration", "/camp-registration", "secondary"),
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
    cta: ctaObj("Learn More", "/about", "ghost"),
  },
  programs: {
    eyebrow: "Our programs",
    heading: "Programs for every age and stage.",
    intro: "From little ones to big kids — play, nature, and learning, woven through every week.",
    cta: ctaObj("View All Programs", "/programs", "ghost"),
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
    cta: ctaObj("View Gallery", "/gallery", "ghost"),
  },
  testimonials: {
    eyebrow: "Loved by our families",
    heading: "What parents say.",
  },
  faq: {
    eyebrow: "Good to know",
    heading: "Questions, answered.",
    cta: ctaObj("View All FAQs", "/faq", "ghost"),
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "Come and feel the difference.",
    body: "Visit us in Wuse 2, ask us anything, or secure a place at Summer Camp.",
    ctas: [
      ctaObj("Book a Visit", "/contact", "primary"),
      ctaObj("Contact Us", "/contact", "ghost"),
      ctaObj("Register for Camp", "/camp-registration", "secondary"),
    ],
  },
  seo: seoObj(
    "Conscious Family Centre — Nature-Connected Learning in Abuja",
    "Nature-connected playgroup and alternative-learning community in Wuse 2, Abuja, for children 0–10: stay & play, forest school, homeschool hub, and holiday camps.",
  ),
});

// ── About page ──

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
    mission: "We are a nature-connected playgroup and alternative-learning community in Wuse 2, Abuja — nurturing children from birth to age 10 through play, the outdoors, and conscious support for the whole family.",
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
      ctaObj("Book a Visit", "/contact", "primary"),
      ctaObj("Explore Programs", "/programs", "ghost"),
      ctaObj("Register for Summer Camp", "/camp-registration", "secondary"),
    ],
  },
  seo: seoObj(
    "About Us — Our Story, Philosophy & Community",
    "Conscious Family Centre is a nature-connected family learning centre in Wuse 2, Abuja. Discover our story, our conscious-education philosophy, and the community children grow up in.",
    ["family learning centre Abuja", "conscious education Abuja", "nature-based learning Wuse 2", "forest school philosophy", "homeschool community Abuja"],
  ),
});

// ── Programs page ──

const progHero = await img("cfc-programs-hero", "Children exploring across Conscious Family Centre's programs");
const progOverview = await img("cfc-programs-overview", "A child absorbed in play at Conscious Family Centre");

await save({
  _id: "programsPage",
  _type: "programsPage",
  hero: {
    eyebrow: "Our programs",
    title: "Learning that follows the child.",
    intro: "From relaxed stay-and-play mornings to forest-school adventures, every program is built around play, nature, and the whole family — for children from birth to age 10.",
    ...(progHero ? { image: progHero } : {}),
    primaryCta: ctaObj("Book a Visit", "/contact", "primary"),
    secondaryCta: ctaObj("Register Interest", "/contact", "ghost"),
  },
  overview: {
    eyebrow: "Our approach",
    heading: "One philosophy, many ways to grow.",
    paragraphs: [
      "Every program at Conscious Family Centre shares the same roots: children learn best through play, through time in nature, and within a community that cares for the whole family.",
      "Rather than a fixed curriculum, we follow each child's curiosity — creating the conditions for confidence, creativity, and connection to grow at their own pace.",
    ],
    ...(progOverview ? { image: progOverview } : {}),
  },
  outcomes: {
    eyebrow: "Why our programs matter",
    heading: "What children carry with them.",
    intro: "Across every program, we nurture the qualities that matter long after childhood.",
    cards: withKeys([
      { title: "Confidence", description: "Safe, real challenges that help children believe in themselves.", icon: "sprout" },
      { title: "Creativity", description: "Open-ended play and making that put imagination first.", icon: "sun" },
      { title: "Curiosity", description: "Child-led days that protect the instinct to wonder and explore.", icon: "compass" },
      { title: "Connection", description: "Friendship, family, and a real sense of belonging.", icon: "leaf" },
      { title: "Independence", description: "Room to try, to choose, and to grow at their own pace.", icon: "sprout" },
    ]),
  },
  experience: {
    eyebrow: "Learning through experience",
    heading: "How learning happens here.",
    intro: "Less sitting still, more getting stuck in.",
    items: withKeys([
      { title: "Nature learning", description: "Forest school, garden play, and weekly excursions keep the outdoors central.", icon: "leaf" },
      { title: "Creative exploration", description: "Art, music, and making, led by each child's imagination.", icon: "sun" },
      { title: "Family engagement", description: "We support parents, carers, and homeschoolers — not just children.", icon: "compass" },
      { title: "Community connection", description: "A warm hub where families and friendships grow together.", icon: "sprout" },
    ]),
  },
  gallery: { eyebrow: "In our programs", heading: "Moments from our days.", intro: "Muddy boots, big ideas, and plenty of joy." },
  faq: { eyebrow: "Good to know", heading: "Program questions, answered." },
  testimonials: { eyebrow: "Loved by our families", heading: "What parents say." },
  finalCta: {
    eyebrow: "Take the next step",
    heading: "Find the right program for your child.",
    body: "Visit us in Wuse 2, ask us anything, or secure a place at Summer Camp.",
    ctas: [
      ctaObj("Book a Visit", "/contact", "primary"),
      ctaObj("Contact Us", "/contact", "ghost"),
      ctaObj("Register for Summer Camp", "/camp-registration", "secondary"),
    ],
  },
  seo: seoObj(
    "Programs — Play, Nature & Learning for Children 0–10",
    "Explore Conscious Family Centre's programs in Wuse 2, Abuja: Stay & Play, Forest School, Homeschool Hub and Creative Arts — play-based, nature-connected learning for children from birth to age 10.",
    ["children's programs Abuja", "forest school Wuse 2", "stay and play Abuja", "homeschool hub Abuja", "creative arts for children Abuja"],
  ),
});

// ── Gallery page ──

const galHero = await img("cfc-gallery-hero", "Children exploring and playing at Conscious Family Centre");
const galCommunity = await img("cfc-gallery-community", "Families together at Conscious Family Centre");

await save({
  _id: "galleryPage",
  _type: "galleryPage",
  hero: {
    eyebrow: "Gallery",
    title: "Life at Conscious Family Centre.",
    intro: "A visual story of learning, exploration, creativity, and connection — the everyday moments that make our community what it is.",
    ...(galHero ? { image: galHero } : {}),
  },
  intro: {
    eyebrow: "Our world, in pictures",
    heading: "What a day here looks like.",
    paragraphs: [
      "We believe children learn best through play and time in nature — and these moments tell that story better than words can.",
      "Browse our days: muddy boots and big ideas, art and music, friendships and family, and plenty of joy.",
    ],
  },
  gallery: { eyebrow: "Explore", heading: "Moments from our days.", intro: "Filter by what you'd like to see, or search for a moment." },
  featuredMoments: { eyebrow: "Featured moments", heading: "A few of our favourites.", intro: "Small moments that capture the spirit of the centre." },
  community: {
    eyebrow: "Our community",
    heading: "More than a centre — a family.",
    paragraphs: [
      "Belonging is at the heart of what we do. Families find each other here over shared mornings, and children grow up surrounded by friends of every age.",
      "There's always a reason to gather, explore, and grow together.",
    ],
    ...(galCommunity ? { image: galCommunity } : {}),
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "Picture your child here.",
    body: "The best way to feel the atmosphere is to visit. Come and see us in Wuse 2.",
    ctas: [
      ctaObj("Book a Visit", "/contact", "primary"),
      ctaObj("Explore Programs", "/programs", "ghost"),
      ctaObj("Register for Camp", "/camp-registration", "secondary"),
    ],
  },
  seo: seoObj(
    "Gallery — Life at Our Family Learning Centre in Abuja",
    "A visual story of life at Conscious Family Centre, Wuse 2, Abuja — learning, nature, creativity and community for children from birth to age 10.",
    ["family learning centre Abuja gallery", "nature-based learning photos", "forest school Abuja", "children's learning environment Wuse 2"],
  ),
});

// ── FAQ page ──

const faqHero = await img("cfc-faq-hero", "A warm moment at Conscious Family Centre");

await save({
  _id: "faqPage",
  _type: "faqPage",
  hero: {
    eyebrow: "FAQ",
    title: "Questions, thoughtfully answered.",
    intro: "Everything you need to know about life at Conscious Family Centre — search, or browse by topic.",
    ...(faqHero ? { image: faqHero } : {}),
  },
  featured: { eyebrow: "Most asked", heading: "Popular questions.", intro: "The questions families ask us most." },
  browse: { eyebrow: "Browse", heading: "Find your answer.", intro: "Filter by topic or search for a specific question." },
  support: {
    eyebrow: "Still have questions?",
    heading: "We're here to help.",
    body: "Can't find what you're looking for? We'd love to hear from you — come and visit, or get in touch.",
    ctas: [
      ctaObj("Contact Us", "/contact", "primary"),
      ctaObj("Book a Visit", "/contact", "ghost"),
      ctaObj("Register for Camp", "/camp-registration", "secondary"),
    ],
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "The best answer is a visit.",
    body: "Come and feel the atmosphere for yourself in Wuse 2, Abuja.",
    ctas: [
      ctaObj("Book a Visit", "/contact", "primary"),
      ctaObj("Explore Programs", "/programs", "ghost"),
      ctaObj("Contact Us", "/contact", "secondary"),
    ],
  },
  seo: seoObj(
    "FAQ — Answers for Families",
    "Answers to common questions about Conscious Family Centre in Wuse 2, Abuja — programs, ages, philosophy, family participation, camps and more.",
    ["family learning centre FAQ Abuja", "conscious education questions", "forest school FAQ", "children's programs Wuse 2"],
  ),
});

// ── Contact page ──

const contactHero = await img("cfc-contact-hero", "A warm welcome at Conscious Family Centre");

await save({
  _id: "contactPage",
  _type: "contactPage",
  hero: {
    eyebrow: "Contact us",
    title: "Let's start a conversation.",
    intro: "Whether you have a question, want to book a visit, or are ready to get started — we'd love to hear from you. Reaching out is the first step into our community.",
    ...(contactHero ? { image: contactHero } : {}),
  },
  welcome: {
    eyebrow: "We're glad you're here",
    heading: "However you'd like to reach us.",
    paragraphs: [
      "Every message reaches a real person who cares about your family. Share as much or as little as you like — we'll take it from there.",
      "Once you get in touch, we'll reply personally to answer your questions and, when you're ready, help you arrange a visit to see the centre for yourself.",
    ],
  },
  form: {
    eyebrow: "Send a message",
    heading: "Tell us a little about your family.",
    intro: "Fill in the form and we'll be in touch. Fields marked with * are required.",
  },
  visit: {
    eyebrow: "Come and see",
    heading: "Nothing beats a visit.",
    description: "The best way to feel whether Conscious Family Centre is right for your family is to spend a little time with us.",
    benefits: [
      "See our nature-connected spaces in Wuse 2",
      "Meet the people who'll care for your child",
      "Watch play-based learning in action",
      "Ask every question on your mind",
    ],
    cta: ctaObj("Book a Visit", "/contact", "primary"),
  },
  journey: {
    eyebrow: "Getting started",
    heading: "Your journey with us.",
    intro: "Four simple steps from first hello to feeling at home.",
    steps: withKeys([
      { title: "Contact us", description: "Send a message or give us a call — tell us about your family." },
      { title: "Book a visit", description: "Come and experience the centre and meet our team." },
      { title: "Meet our team", description: "We'll help you find the right program for your child." },
      { title: "Join the community", description: "Welcome — your family becomes part of ours." },
    ]),
  },
  camp: {
    eyebrow: "Holiday camp",
    heading: "Summer Camp registration is open.",
    description: "A holiday of STEAM projects, forest-school adventures, and creative play. Places are limited.",
    availabilityNote: "Places are limited — register early to secure your child's spot.",
    cta: ctaObj("Register for Summer Camp", "/camp-registration", "secondary"),
  },
  faq: { eyebrow: "Quick answers", heading: "Before you ask." },
  finalCta: {
    eyebrow: "We can't wait to meet you",
    heading: "Your family belongs here.",
    body: "Reach out, book a visit, or explore our programs — whatever feels right for you.",
    ctas: [
      ctaObj("Contact Us", "/contact", "primary"),
      ctaObj("Book a Visit", "/contact", "ghost"),
      ctaObj("Explore Programs", "/programs", "secondary"),
    ],
  },
  seo: seoObj(
    "Contact Us — Visit Our Family Learning Centre in Abuja",
    "Get in touch with Conscious Family Centre in Wuse 2, Abuja. Ask a question, book a visit, or register interest — a nature-connected learning community for children 0–10.",
    ["contact family learning centre Abuja", "book a visit Wuse 2", "preschool contact Abuja", "nature-based learning enquiry"],
  ),
});

/* ── Done ─────────────────────────────────────────────────────────── */

console.log("\n✅ Seed complete. All fallback content is now in Sanity.");
console.log("   Open /studio to review and edit the content.");
