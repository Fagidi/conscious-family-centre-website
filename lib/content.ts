import type {
  SiteSettings,
  Navigation,
  HomeContent,
  AboutContent,
  ProgramsPageContent,
  GalleryPageContent,
  ContactPageContent,
  Program,
  ProgramPreview,
  CampSession,
  Testimonial,
  GalleryItem,
  GalleryCategory,
  FeaturedStory,
  FaqItem,
  FaqCategoryDoc,
  FaqPageContent,
} from "./types";

/**
 * Curated fallback content. The site is whole before any Sanity document
 * exists; published documents win field-by-field (see client.ts).
 *
 * Content sourcing rule (Phase 3): only real Conscious Family Centre content
 * is used as fact (ages 0–10, Wuse 2 location, hours, real program names,
 * nature/play/community identity). Where real copy isn't available verbatim
 * (testimonial quotes, exact hero wording, camp pricing/images), these are
 * clearly-marked CMS placeholders for editors to replace — nothing invented
 * is presented as fact. Placeholder imagery uses picsum (see next.config).
 */

const placeholderImage = (seed: string, alt: string) => ({
  src: `https://picsum.photos/seed/${seed}/1600/1100`,
  alt,
});

export const siteSettings: SiteSettings = {
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
  defaultSeo: {
    title: "Conscious Family Centre — Nature-Connected Learning in Abuja",
    description:
      "A nature-connected playgroup and alternative-learning community in Wuse 2, Abuja, for children 0–10. Stay & play, homeschool hub, forest school, holiday camps and more.",
    keywords: [
      "playgroup Abuja",
      "forest school Abuja",
      "homeschool community Wuse 2",
      "holiday camp for kids Abuja",
      "nanny training Abuja",
    ],
  },
};

export const navigation: Navigation = {
  header: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Programs", href: "/programs" },
    { label: "Gallery", href: "/gallery" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  footer: [
    {
      heading: "Explore",
      links: [
        { label: "About", href: "/about" },
        { label: "Programs", href: "/programs" },
        { label: "Gallery", href: "/gallery" },
        { label: "FAQ", href: "/faq" },
      ],
    },
    {
      heading: "Get started",
      links: [
        { label: "Book a Visit", href: "/contact" },
        { label: "Summer Camp", href: "/camp-registration" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
  ],
};

/* ── Homepage ──────────────────────────────────────────────────── */

export const homeContent: HomeContent = {
  hero: {
    eyebrow: "Wuse 2, Abuja · Ages 0–10",
    headline: "Where children grow through nature, play, and community.",
    subhead:
      "A nature-connected playgroup and alternative-learning community for children 0–10 — rooted in play, the outdoors, and conscious family support.",
    image: placeholderImage("cfc-hero", "Children exploring and playing outdoors at Conscious Family Centre"),
    primaryCta: { label: "Book a Visit", href: "/contact", variant: "primary" },
    secondaryCta: { label: "Explore Programs", href: "/programs", variant: "ghost" },
    tertiaryCta: { label: "Summer Camp Registration", href: "/camp-registration", variant: "secondary" },
  },
  why: {
    eyebrow: "Why families choose us",
    heading: "A gentler, richer way to grow up.",
    intro: "Everything we do is built around the natural world, child-led play, and a community that supports the whole family.",
    pillars: [
      {
        title: "Nature-connected learning",
        description: "Forest school, outdoor play, and weekly Waka Wednesday excursions keep children connected to the natural world.",
        icon: "leaf",
      },
      {
        title: "Learning through play",
        description: "Play-based, child-led days that nurture curiosity, creativity, and quiet confidence.",
        icon: "sprout",
      },
      {
        title: "A real community",
        description: "A warm hub for families and homeschoolers, with enrichment clubs and shared support.",
        icon: "compass",
      },
      {
        title: "Conscious, caring people",
        description: "Intentional, nurturing care for the whole child — and for the families and carers around them.",
        icon: "sun",
      },
    ],
  },
  about: {
    eyebrow: "About us",
    heading: "More than a centre — a community for conscious families.",
    paragraphs: [
      "Conscious Family Centre is a nature-connected playgroup and alternative-learning community in Wuse 2, Abuja, for children from birth to age 10.",
      "We believe children learn best through play and time in nature, supported by a community that cares for the whole family. From stay-and-play sessions to forest school and our homeschool hub, every day is built around curiosity, connection, and joy.",
    ],
    image: placeholderImage("cfc-about", "Children and carers together at Conscious Family Centre"),
    cta: { label: "Learn More", href: "/about", variant: "ghost" },
  },
  programs: {
    eyebrow: "Our programs",
    heading: "Programs for every age and stage.",
    intro: "From little ones to big kids — play, nature, and learning, woven through every week.",
    cta: { label: "View All Programs", href: "/programs", variant: "ghost" },
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
    cta: { label: "View Gallery", href: "/gallery", variant: "ghost" },
  },
  testimonials: {
    eyebrow: "Loved by our families",
    heading: "What parents say.",
  },
  faq: {
    eyebrow: "Good to know",
    heading: "Questions, answered.",
    cta: { label: "View All FAQs", href: "/faq", variant: "ghost" },
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "Come and feel the difference.",
    body: "Visit us in Wuse 2, ask us anything, or secure a place at Summer Camp.",
    ctas: [
      { label: "Book a Visit", href: "/contact", variant: "primary" },
      { label: "Contact Us", href: "/contact", variant: "ghost" },
      { label: "Register for Camp", href: "/camp-registration", variant: "secondary" },
    ],
  },
  seo: {
    title: "Conscious Family Centre — Nature-Connected Learning in Abuja",
    description:
      "Nature-connected playgroup and alternative-learning community in Wuse 2, Abuja, for children 0–10: stay & play, forest school, homeschool hub, and holiday camps.",
  },
};

/* ── About page ────────────────────────────────────────────────── */

export const aboutContent: AboutContent = {
  hero: {
    eyebrow: "About Conscious Family Centre",
    title: "A place where childhood is allowed to unfold.",
    mission:
      "We are a nature-connected playgroup and alternative-learning community in Wuse 2, Abuja — nurturing children from birth to age 10 through play, the outdoors, and conscious support for the whole family.",
    image: placeholderImage("cfc-about-hero", "Children exploring the garden at Conscious Family Centre"),
  },
  story: {
    eyebrow: "Our story",
    heading: "Built around a simple belief.",
    paragraphs: [
      "Conscious Family Centre grew from a simple conviction: that children learn best when they are free to play, to wonder, and to spend their days close to nature.",
      "So we made a place for exactly that — an unhurried, nature-connected community in the heart of Wuse 2, where days are shaped by curiosity rather than the clock, and where the whole family is welcomed in.",
      "Today we are a growing community of families and homeschoolers across Abuja, learning together through stay-and-play mornings, forest-school adventures, and a home for those choosing a gentler path.",
    ],
    image: placeholderImage("cfc-story", "A quiet, joyful moment between a child and carer at the centre"),
    pullQuote: "Children learn best through play and time in nature, supported by a community that cares for the whole family.",
  },
  philosophy: {
    eyebrow: "Our philosophy",
    heading: "How children learn here.",
    intro: "Four beliefs shape every day at the centre — and everything we ask of ourselves as a community.",
    cards: [
      {
        title: "Conscious learning",
        description: "Intentional, unhurried days that follow a child's natural rhythm — not a rigid timetable.",
        icon: "sun",
      },
      {
        title: "Child-led exploration",
        description: "Play-based, self-directed discovery that nurtures curiosity, creativity, and quiet confidence.",
        icon: "sprout",
      },
      {
        title: "Family-centred approach",
        description: "We care for the whole family — supporting parents, carers, and homeschoolers, not just children.",
        icon: "compass",
      },
      {
        title: "Nature connection",
        description: "Forest school, outdoor play, and weekly excursions keep children rooted in the natural world.",
        icon: "leaf",
      },
    ],
  },
  differentiators: {
    eyebrow: "What makes us different",
    heading: "Not a typical childcare centre.",
    intro: "Why families across Abuja are choosing a different way to grow up.",
    items: [
      {
        title: "Days built around nature",
        description: "Forest school and weekly Waka Wednesday excursions put the outdoors at the centre of learning.",
        icon: "leaf",
      },
      {
        title: "Learning through play",
        description: "Child-led, play-based days that protect curiosity and let confidence grow at its own pace.",
        icon: "sprout",
      },
      {
        title: "A real community",
        description: "A warm hub for families and homeschoolers — enrichment clubs, shared support, and friendship.",
        icon: "compass",
      },
      {
        title: "Care for the whole family",
        description: "From stay-and-play to nanny training, we support the grown-ups who care for children too.",
        icon: "sun",
      },
    ],
  },
  environment: {
    eyebrow: "Our learning environment",
    heading: "A garden to grow in.",
    intro:
      "Tucked inside BMT Garden in Wuse 2, our spaces are calm, green, and made for exploring — indoors and out.",
    images: Array.from({ length: 5 }, (_, i) =>
      placeholderImage(`cfc-env-${i + 1}`, `The learning environment at Conscious Family Centre ${i + 1}`),
    ),
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
    image: placeholderImage("cfc-community", "Families gathered together at a Conscious Family Centre event"),
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "Come and feel the difference.",
    body: "Visit us in Wuse 2, explore our programs, or secure a place at Summer Camp.",
    ctas: [
      { label: "Book a Visit", href: "/contact", variant: "primary" },
      { label: "Explore Programs", href: "/programs", variant: "ghost" },
      { label: "Register for Summer Camp", href: "/camp-registration", variant: "secondary" },
    ],
  },
  seo: {
    title: "About Us — Our Story, Philosophy & Community",
    description:
      "Conscious Family Centre is a nature-connected family learning centre in Wuse 2, Abuja. Discover our story, our conscious-education philosophy, and the community children grow up in.",
    keywords: [
      "family learning centre Abuja",
      "conscious education Abuja",
      "nature-based learning Wuse 2",
      "forest school philosophy",
      "homeschool community Abuja",
    ],
  },
};

/* ── Collection fallbacks (real program names; placeholders elsewhere) ── */

export const featuredPrograms: ProgramPreview[] = [
  {
    slug: "stay-and-play",
    title: "Stay & Play",
    summary: "Relaxed drop-in play sessions for little ones and their grown-ups.",
    ageBands: ["little-ones", "explorers"],
    heroImage: placeholderImage("cfc-stayplay", "Toddlers at a stay-and-play session"),
  },
  {
    slug: "forest-school",
    title: "Forest School",
    summary: "Outdoor, nature-based learning that builds confidence and curiosity.",
    ageBands: ["explorers", "big-kids"],
    heroImage: placeholderImage("cfc-forest", "Children at forest school"),
  },
  {
    slug: "homeschool-hub",
    title: "Homeschool Hub",
    summary: "A warm learning community for homeschooling families.",
    ageBands: ["explorers", "big-kids"],
    heroImage: placeholderImage("cfc-homeschool", "Homeschool hub learning session"),
  },
  {
    slug: "creative-arts",
    title: "Creative Arts",
    summary: "Hands-on art, music, and making for curious minds.",
    ageBands: ["explorers", "big-kids"],
    heroImage: placeholderImage("cfc-arts", "Children making art"),
  },
];

/**
 * Full program records for the Programs index + detail pages. Only the four
 * programs confirmed on the live CFC site are included; their benefits and
 * activities are intrinsic to each program type (not invented specifics).
 * Schedules, pricing, ratios and a "day in the life" are left empty as CMS
 * placeholders — those are operational details we won't invent.
 */
const programGallery = (slug: string) =>
  Array.from({ length: 3 }, (_, i) =>
    placeholderImage(`${slug}-g${i + 1}`, `Conscious Family Centre — ${slug} ${i + 1}`),
  );

const emptyProgramLogistics = {
  body: [] as Program["body"],
  dayInTheLife: [] as Program["dayInTheLife"],
  pricing: [] as Program["pricing"],
  whatToBring: [] as string[],
  faqs: [] as FaqItem[],
};

export const programs: Program[] = [
  {
    slug: "stay-and-play",
    title: "Stay & Play",
    type: "stay-and-play",
    ageBands: ["little-ones", "explorers"],
    summary: "Relaxed, drop-in play sessions for little ones and their grown-ups.",
    heroImage: placeholderImage("cfc-stayplay", "Toddlers and carers at a stay-and-play session"),
    learningExperience:
      "Unhurried mornings of open-ended play, where babies and toddlers explore at their own pace alongside a trusted grown-up — and parents find a warm, welcoming community.",
    keyBenefits: [
      "Builds early confidence in a gentle setting",
      "Time for parents and carers to connect",
      "Sensory, open-ended play",
    ],
    typicalActivities: ["Free play and exploration", "Sensory and messy play", "Songs and story time", "Outdoor garden play"],
    gallery: programGallery("stayplay"),
    cta: { label: "Book a Visit", href: "/contact", variant: "primary" },
    seo: {
      title: "Stay & Play — Drop-in Play Sessions in Wuse 2",
      description: "Relaxed drop-in play sessions for babies and toddlers and their grown-ups at Conscious Family Centre, Wuse 2, Abuja.",
    },
    order: 1,
    ...emptyProgramLogistics,
  },
  {
    slug: "forest-school",
    title: "Forest School",
    type: "forest-school",
    ageBands: ["explorers", "big-kids"],
    summary: "Outdoor, nature-based learning that builds confidence and curiosity.",
    heroImage: placeholderImage("cfc-forest", "Children exploring at forest school"),
    learningExperience:
      "Child-led days in the open air, where children take safe risks, follow their curiosity, and build a deep connection with the natural world.",
    keyBenefits: [
      "Confidence through safe, real challenges",
      "A genuine connection with nature",
      "Independence and resilience",
    ],
    typicalActivities: ["Outdoor exploration", "Nature crafts", "Free play in the garden", "Seasonal discovery"],
    gallery: programGallery("forest"),
    cta: { label: "Book a Visit", href: "/contact", variant: "primary" },
    seo: {
      title: "Forest School — Nature-Based Learning in Abuja",
      description: "Outdoor, nature-based forest school for children in Wuse 2, Abuja — building confidence, curiosity and a love of the natural world.",
    },
    order: 2,
    ...emptyProgramLogistics,
  },
  {
    slug: "homeschool-hub",
    title: "Homeschool Hub",
    type: "homeschool-hub",
    ageBands: ["explorers", "big-kids"],
    summary: "A warm learning community for homeschooling families.",
    heroImage: placeholderImage("cfc-homeschool", "Children learning together at the homeschool hub"),
    learningExperience:
      "A supportive home base for homeschooling families — where children learn together, make friends, and grow within a community that shares the journey.",
    keyBenefits: [
      "Community and friendship for homeschoolers",
      "Shared, social learning",
      "Support for the whole family",
    ],
    typicalActivities: ["Group learning sessions", "Collaborative projects", "Enrichment activities", "Outdoor play"],
    gallery: programGallery("homeschool"),
    cta: { label: "Register Interest", href: "/contact", variant: "primary" },
    seo: {
      title: "Homeschool Hub — A Learning Community in Abuja",
      description: "A warm, supportive homeschool community in Wuse 2, Abuja, where children learn together and families find connection.",
    },
    order: 3,
    ...emptyProgramLogistics,
  },
  {
    slug: "creative-arts",
    title: "Creative Arts",
    type: "creative-arts",
    ageBands: ["explorers", "big-kids"],
    summary: "Hands-on art, music, and making for curious minds.",
    heroImage: placeholderImage("cfc-arts", "Children making art at Conscious Family Centre"),
    learningExperience:
      "Joyful, hands-on sessions where children express themselves through art, music and making — process over product, imagination over instruction.",
    keyBenefits: ["Creativity and self-expression", "Fine-motor and sensory development", "Joyful, process-led making"],
    typicalActivities: ["Painting and drawing", "Music and movement", "Crafts and making", "Imaginative play"],
    gallery: programGallery("arts"),
    cta: { label: "Book a Visit", href: "/contact", variant: "primary" },
    seo: {
      title: "Creative Arts — Art, Music & Making for Children",
      description: "Hands-on creative arts sessions — art, music and making — for children at Conscious Family Centre, Wuse 2, Abuja.",
    },
    order: 4,
    ...emptyProgramLogistics,
  },
];

// CMS placeholder — replace with the real camp + pricing/images in Studio.
export const featuredCamps: CampSession[] = [
  {
    slug: "summer-steam-camp-2026",
    title: "Summer STEAM Holiday Camp",
    season: "Summer 2026",
    theme: "STEAM & Nature",
    ageBand: "Ages 4–10",
    startDate: "2026-08-03",
    endDate: "2026-08-14",
    dailySchedule: "9:00 – 14:00, Monday to Friday",
    capacity: 30,
    spotsRemaining: 8,
    priceNGN: 0, // placeholder — set real pricing in CMS
    included: ["STEAM projects", "Forest-school sessions", "Creative arts", "Daily outdoor play"],
    packingList: [],
    status: "open",
    heroImage: placeholderImage("cfc-camp", "Children at summer holiday camp"),
    seo: { title: "Summer STEAM Holiday Camp", description: "STEAM and nature holiday camp for children 4–10 in Abuja." },
  },
];

// CMS placeholders — replace with real, consented testimonials in Studio.
export const testimonials: Testimonial[] = [
  {
    quote: "A short, heartfelt quote from a parent will appear here once added in the CMS.",
    authorName: "Parent name",
    childAge: "Parent of a 4-year-old",
  },
  {
    quote: "Add a second parent testimonial in Studio — names and consent on file.",
    authorName: "Parent name",
    childAge: "Parent of a 6-year-old",
  },
  {
    quote: "A third testimonial placeholder, ready to be replaced with real words.",
    authorName: "Parent name",
    childAge: "Parent of a 2-year-old",
  },
];

/* ── Gallery ───────────────────────────────────────────────────── */

// Category taxonomy grounded in CFC's identity (labels, not invented events).
export const galleryCategories: GalleryCategory[] = [
  { slug: "learning", title: "Learning", description: "Curiosity, discovery, and learning through play.", order: 1 },
  { slug: "nature", title: "Nature", description: "Forest school, garden play, and time outdoors.", order: 2 },
  { slug: "creativity", title: "Creativity", description: "Art, music, and making.", order: 3 },
  { slug: "community", title: "Community", description: "Families and friendships growing together.", order: 4 },
  { slug: "camps", title: "Camps", description: "Holiday camp adventures.", order: 5 },
];

/**
 * Placeholder gallery images for future uploads (per the content rule — no
 * stock or fake photography presented as real). Each is clearly labelled and
 * assigned a category so the filter/search/lightbox experience is fully
 * demonstrable; editors replace these with real CFC photos in Studio.
 */
export const galleryItems: GalleryItem[] = Array.from({ length: 12 }, (_, i) => {
  const category = galleryCategories[i % galleryCategories.length];
  return {
    image: placeholderImage(`cfc-gallery-${i + 1}`, `Conscious Family Centre — ${category.title.toLowerCase()} (placeholder ${i + 1})`),
    title: `${category.title} moment`,
    slug: `placeholder-${i + 1}`,
    caption: `A ${category.title.toLowerCase()} moment at Conscious Family Centre.`,
    category,
    tags: [category.slug, "placeholder"],
    featured: i < 3,
    order: i,
  };
});

// Immersive visual stories (evergreen, identity-based — not specific events).
export const featuredStories: FeaturedStory[] = [
  {
    slug: "a-day-in-nature",
    title: "A day rooted in nature.",
    description:
      "From muddy mornings in the garden to quiet moments under the trees, our days are shaped by the outdoors — where children explore, take safe risks, and grow in confidence.",
    images: [
      placeholderImage("cfc-story-nature-1", "Children exploring outdoors at Conscious Family Centre"),
      placeholderImage("cfc-story-nature-2", "A child discovering nature in the garden"),
    ],
    cta: { label: "Explore Programs", href: "/programs", variant: "ghost" },
  },
];

/* ── FAQ ───────────────────────────────────────────────────────── */

// CMS-managed category taxonomy (labels, not invented content).
export const faqCategories: FaqCategoryDoc[] = [
  { slug: "general", title: "General", description: "The essentials — ages, hours, and location.", displayOrder: 1 },
  { slug: "programs", title: "Programs", description: "About our programs and how to take part.", displayOrder: 2 },
  { slug: "philosophy", title: "Learning Philosophy", description: "How and why children learn here.", displayOrder: 3 },
  { slug: "participation", title: "Family Participation", description: "How families take part day to day.", displayOrder: 4 },
  { slug: "enrollment", title: "Enrollment", description: "Getting started at the centre.", displayOrder: 5 },
  { slug: "camps", title: "Camps", description: "Holiday camp and registration.", displayOrder: 6 },
  { slug: "safety", title: "Safety", description: "Looking after your child.", displayOrder: 7 },
];

// Factual general FAQs derived from the live site (ages, hours, location, booking).
export const generalFaqs: FaqItem[] = [
  { question: "What ages do you cater for?", answer: "We welcome children from birth to age 10 across our programs.", category: "general", featured: true, popular: true, order: 1 },
  { question: "What are your opening hours?", answer: "We're open Monday to Saturday, 10:00–15:00, and closed on Sundays.", category: "general", featured: true, order: 2 },
  { question: "Where are you located?", answer: "Inside BMT Garden, opposite Legacy Centre, Wuse 2, Abuja.", category: "general", featured: true, popular: true, order: 3 },
  { question: "Do I need to book in advance?", answer: "Yes — we recommend booking ahead, as places are limited.", category: "general", order: 4 },
];

// Program-specific FAQs (factual; admissions / ages / schedules / participation).
export const programFaqs: FaqItem[] = [
  { question: "Which programs are right for my child's age?", answer: "We welcome children from birth to age 10. Stay & Play suits our youngest, while Forest School, Homeschool Hub and Creative Arts are designed for older explorers and big kids.", category: "programs", popular: true, order: 1 },
  { question: "How do I join a program?", answer: "The best first step is to book a visit so you can see the centre and meet us. We'll help you find the right fit and explain how to get started.", category: "programs", featured: true, order: 2 },
  { question: "Do you offer drop-in or regular sessions?", answer: "Stay & Play runs as relaxed drop-in sessions. Our other programs run on a regular basis — get in touch for current schedules, as places are limited.", category: "programs", order: 3 },
  { question: "Where do the programs take place?", answer: "All programs run from our home inside BMT Garden, opposite Legacy Centre in Wuse 2, Abuja, with plenty of outdoor space.", category: "programs", order: 4 },
];

// Learning-philosophy FAQs (true to the centre's stated identity — not invented claims).
export const philosophyFaqs: FaqItem[] = [
  { question: "What is your learning philosophy?", answer: "We believe children learn best through play and time in nature, supported by a community that cares for the whole family. Our days are child-led and unhurried.", category: "philosophy", featured: true, popular: true, order: 1 },
  { question: "Do you follow a fixed curriculum?", answer: "Rather than a fixed curriculum, we follow each child's curiosity — creating the conditions for confidence, creativity, and connection to grow at their own pace.", category: "philosophy", order: 2 },
];

// Family-participation FAQs (factual — stay-and-play and homeschool support are real).
export const participationFaqs: FaqItem[] = [
  { question: "Can I stay with my child?", answer: "Yes — our Stay & Play sessions are relaxed, drop-in mornings where little ones explore alongside a trusted grown-up.", category: "participation", order: 1 },
  { question: "Do you support homeschooling families?", answer: "Yes. Our Homeschool Hub is a warm community where homeschooling families learn together and find connection and support.", category: "participation", popular: true, order: 2 },
];

// Enrollment FAQ — honest pointer, no invented requirements/fees.
export const enrollmentFaqs: FaqItem[] = [
  { question: "How do I get started?", answer: "The best first step is to book a visit. We'll show you around, answer your questions, and help you find the right fit for your family.", category: "enrollment", featured: true, order: 1 },
];

// Camp FAQs — CMS placeholders (no invented dates, fees, or policies).
export const campFaqs: FaqItem[] = [
  { question: "How does Summer Camp registration work?", answer: "Registration for our Summer Camp is open and places are limited. Full details will be confirmed here — please contact us for the latest information.", category: "camps", featured: true, order: 1 },
  { question: "What ages is camp for?", answer: "Camp details, including age groups and availability, are managed in our CMS and confirmed each season. Contact us for current details.", category: "camps", order: 2 },
];

// Safety FAQ — placeholder pointer (no invented policies/claims).
export const safetyFaqs: FaqItem[] = [
  { question: "How do you keep children safe?", answer: "Your child's wellbeing is our priority. We're happy to talk through our approach in person — please book a visit or contact us.", category: "safety", order: 1 },
];

/** Combined FAQ set used by the FAQ page (CMS replaces this wholesale). */
export const allFaqs: FaqItem[] = [
  ...generalFaqs,
  ...programFaqs,
  ...philosophyFaqs,
  ...participationFaqs,
  ...enrollmentFaqs,
  ...campFaqs,
  ...safetyFaqs,
];

/* ── FAQ page ──────────────────────────────────────────────────── */

export const faqPageContent: FaqPageContent = {
  hero: {
    eyebrow: "FAQ",
    title: "Questions, thoughtfully answered.",
    intro: "Everything you need to know about life at Conscious Family Centre — search, or browse by topic.",
    image: placeholderImage("cfc-faq-hero", "A warm moment at Conscious Family Centre"),
  },
  featured: {
    eyebrow: "Most asked",
    heading: "Popular questions.",
    intro: "The questions families ask us most.",
  },
  browse: {
    eyebrow: "Browse",
    heading: "Find your answer.",
    intro: "Filter by topic or search for a specific question.",
  },
  support: {
    eyebrow: "Still have questions?",
    heading: "We're here to help.",
    body: "Can't find what you're looking for? We'd love to hear from you — come and visit, or get in touch.",
    ctas: [
      { label: "Contact Us", href: "/contact", variant: "primary" },
      { label: "Book a Visit", href: "/contact", variant: "ghost" },
      { label: "Register for Camp", href: "/camp-registration", variant: "secondary" },
    ],
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "The best answer is a visit.",
    body: "Come and feel the atmosphere for yourself in Wuse 2, Abuja.",
    ctas: [
      { label: "Book a Visit", href: "/contact", variant: "primary" },
      { label: "Explore Programs", href: "/programs", variant: "ghost" },
      { label: "Contact Us", href: "/contact", variant: "secondary" },
    ],
  },
  seo: {
    title: "FAQ — Answers for Families",
    description:
      "Answers to common questions about Conscious Family Centre in Wuse 2, Abuja — programs, ages, philosophy, family participation, camps and more.",
    keywords: [
      "family learning centre FAQ Abuja",
      "conscious education questions",
      "forest school FAQ",
      "children's programs Wuse 2",
    ],
  },
};

/* ── Programs page ─────────────────────────────────────────────── */

export const programsPageContent: ProgramsPageContent = {
  hero: {
    eyebrow: "Our programs",
    title: "Learning that follows the child.",
    intro:
      "From relaxed stay-and-play mornings to forest-school adventures, every program is built around play, nature, and the whole family — for children from birth to age 10.",
    image: placeholderImage("cfc-programs-hero", "Children exploring across Conscious Family Centre's programs"),
    primaryCta: { label: "Book a Visit", href: "/contact", variant: "primary" },
    secondaryCta: { label: "Register Interest", href: "/contact", variant: "ghost" },
  },
  overview: {
    eyebrow: "Our approach",
    heading: "One philosophy, many ways to grow.",
    paragraphs: [
      "Every program at Conscious Family Centre shares the same roots: children learn best through play, through time in nature, and within a community that cares for the whole family.",
      "Rather than a fixed curriculum, we follow each child's curiosity — creating the conditions for confidence, creativity, and connection to grow at their own pace.",
    ],
    image: placeholderImage("cfc-programs-overview", "A child absorbed in play at Conscious Family Centre"),
  },
  outcomes: {
    eyebrow: "Why our programs matter",
    heading: "What children carry with them.",
    intro: "Across every program, we nurture the qualities that matter long after childhood.",
    cards: [
      { title: "Confidence", description: "Safe, real challenges that help children believe in themselves.", icon: "sprout" },
      { title: "Creativity", description: "Open-ended play and making that put imagination first.", icon: "sun" },
      { title: "Curiosity", description: "Child-led days that protect the instinct to wonder and explore.", icon: "compass" },
      { title: "Connection", description: "Friendship, family, and a real sense of belonging.", icon: "leaf" },
      { title: "Independence", description: "Room to try, to choose, and to grow at their own pace.", icon: "sprout" },
    ],
  },
  experience: {
    eyebrow: "Learning through experience",
    heading: "How learning happens here.",
    intro: "Less sitting still, more getting stuck in.",
    items: [
      { title: "Nature learning", description: "Forest school, garden play, and weekly excursions keep the outdoors central.", icon: "leaf" },
      { title: "Creative exploration", description: "Art, music, and making, led by each child's imagination.", icon: "sun" },
      { title: "Family engagement", description: "We support parents, carers, and homeschoolers — not just children.", icon: "compass" },
      { title: "Community connection", description: "A warm hub where families and friendships grow together.", icon: "sprout" },
    ],
  },
  gallery: {
    eyebrow: "In our programs",
    heading: "Moments from our days.",
    intro: "Muddy boots, big ideas, and plenty of joy.",
  },
  faq: {
    eyebrow: "Good to know",
    heading: "Program questions, answered.",
  },
  testimonials: {
    eyebrow: "Loved by our families",
    heading: "What parents say.",
  },
  finalCta: {
    eyebrow: "Take the next step",
    heading: "Find the right program for your child.",
    body: "Visit us in Wuse 2, ask us anything, or secure a place at Summer Camp.",
    ctas: [
      { label: "Book a Visit", href: "/contact", variant: "primary" },
      { label: "Contact Us", href: "/contact", variant: "ghost" },
      { label: "Register for Summer Camp", href: "/camp-registration", variant: "secondary" },
    ],
  },
  seo: {
    title: "Programs — Play, Nature & Learning for Children 0–10",
    description:
      "Explore Conscious Family Centre's programs in Wuse 2, Abuja: Stay & Play, Forest School, Homeschool Hub and Creative Arts — play-based, nature-connected learning for children from birth to age 10.",
    keywords: [
      "children's programs Abuja",
      "forest school Wuse 2",
      "stay and play Abuja",
      "homeschool hub Abuja",
      "creative arts for children Abuja",
    ],
  },
};

/* ── Contact page ──────────────────────────────────────────────── */

export const contactPageContent: ContactPageContent = {
  hero: {
    eyebrow: "Contact us",
    title: "Let's start a conversation.",
    intro:
      "Whether you have a question, want to book a visit, or are ready to get started — we'd love to hear from you. Reaching out is the first step into our community.",
    image: placeholderImage("cfc-contact-hero", "A warm welcome at Conscious Family Centre"),
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
    description:
      "The best way to feel whether Conscious Family Centre is right for your family is to spend a little time with us.",
    benefits: [
      "See our nature-connected spaces in Wuse 2",
      "Meet the people who'll care for your child",
      "Watch play-based learning in action",
      "Ask every question on your mind",
    ],
    cta: { label: "Book a Visit", href: "/contact", variant: "primary" },
  },
  journey: {
    eyebrow: "Getting started",
    heading: "Your journey with us.",
    intro: "Four simple steps from first hello to feeling at home.",
    steps: [
      { title: "Contact us", description: "Send a message or give us a call — tell us about your family." },
      { title: "Book a visit", description: "Come and experience the centre and meet our team." },
      { title: "Meet our team", description: "We'll help you find the right program for your child." },
      { title: "Join the community", description: "Welcome — your family becomes part of ours." },
    ],
  },
  camp: {
    eyebrow: "Holiday camp",
    heading: "Summer Camp registration is open.",
    description:
      "A holiday of STEAM projects, forest-school adventures, and creative play. Places are limited.",
    availabilityNote: "Places are limited — register early to secure your child's spot.",
    cta: { label: "Register for Summer Camp", href: "/camp-registration", variant: "secondary" },
  },
  faq: {
    eyebrow: "Quick answers",
    heading: "Before you ask.",
  },
  finalCta: {
    eyebrow: "We can't wait to meet you",
    heading: "Your family belongs here.",
    body: "Reach out, book a visit, or explore our programs — whatever feels right for you.",
    ctas: [
      { label: "Contact Us", href: "/contact", variant: "primary" },
      { label: "Book a Visit", href: "/contact", variant: "ghost" },
      { label: "Explore Programs", href: "/programs", variant: "secondary" },
    ],
  },
  seo: {
    title: "Contact Us — Visit Our Family Learning Centre in Abuja",
    description:
      "Get in touch with Conscious Family Centre in Wuse 2, Abuja. Ask a question, book a visit, or register interest — a nature-connected learning community for children 0–10.",
    keywords: [
      "contact family learning centre Abuja",
      "book a visit Wuse 2",
      "preschool contact Abuja",
      "nature-based learning enquiry",
    ],
  },
};

/* ── Gallery page ──────────────────────────────────────────────── */

export const galleryPageContent: GalleryPageContent = {
  hero: {
    eyebrow: "Gallery",
    title: "Life at Conscious Family Centre.",
    intro:
      "A visual story of learning, exploration, creativity, and connection — the everyday moments that make our community what it is.",
    image: placeholderImage("cfc-gallery-hero", "Children exploring and playing at Conscious Family Centre"),
  },
  intro: {
    eyebrow: "Our world, in pictures",
    heading: "What a day here looks like.",
    paragraphs: [
      "We believe children learn best through play and time in nature — and these moments tell that story better than words can.",
      "Browse our days: muddy boots and big ideas, art and music, friendships and family, and plenty of joy.",
    ],
  },
  gallery: {
    eyebrow: "Explore",
    heading: "Moments from our days.",
    intro: "Filter by what you'd like to see, or search for a moment.",
  },
  featuredMoments: {
    eyebrow: "Featured moments",
    heading: "A few of our favourites.",
    intro: "Small moments that capture the spirit of the centre.",
  },
  community: {
    eyebrow: "Our community",
    heading: "More than a centre — a family.",
    paragraphs: [
      "Belonging is at the heart of what we do. Families find each other here over shared mornings, and children grow up surrounded by friends of every age.",
      "There's always a reason to gather, explore, and grow together.",
    ],
    image: placeholderImage("cfc-gallery-community", "Families together at Conscious Family Centre"),
  },
  finalCta: {
    eyebrow: "Come and see",
    heading: "Picture your child here.",
    body: "The best way to feel the atmosphere is to visit. Come and see us in Wuse 2.",
    ctas: [
      { label: "Book a Visit", href: "/contact", variant: "primary" },
      { label: "Explore Programs", href: "/programs", variant: "ghost" },
      { label: "Register for Camp", href: "/camp-registration", variant: "secondary" },
    ],
  },
  seo: {
    title: "Gallery — Life at Our Family Learning Centre in Abuja",
    description:
      "A visual story of life at Conscious Family Centre, Wuse 2, Abuja — learning, nature, creativity and community for children from birth to age 10.",
    keywords: [
      "family learning centre Abuja gallery",
      "nature-based learning photos",
      "forest school Abuja",
      "children's learning environment Wuse 2",
    ],
  },
};
