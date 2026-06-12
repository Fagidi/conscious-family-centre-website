import type {
  SiteSettings,
  SeoSettings,
  HeroContent,
  Service,
  Testimonial,
  GalleryImage,
  FaqItem,
  ProcessStep,
  ValuePillar,
  Stat,
} from "./types";

/**
 * Curated default content.
 *
 * This is the launch copy for the entire site. Every field here can be
 * overridden from Sanity Studio — when a matching document is published,
 * Sanity wins; otherwise this content renders. The site is therefore
 * fully deployable before the CMS is ever touched.
 */

const u = (id: string, w = 2400) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

/* ────────────────────────── Site settings ────────────────────────── */

export const siteSettings: SiteSettings = {
  siteName: "Sarai Photo Booth",
  tagline: "Luxury photo booth & event experiences",
  phone: "(516) 555-0184",
  email: "hello@saraiphotobooth.com",
  location: "Long Island, New York",
  serviceArea: "Serving Long Island, the Hamptons & the New York metro area",
  instagram: "https://instagram.com/saraiphotobooth",
  bookingCtaLabel: "Reserve Your Date",
  announcement: "Now booking 2026 & 2027 weddings",
};

export const seoSettings: SeoSettings = {
  metaTitle: "Sarai Photo Booth — Luxury Photo Booth & Event Experiences | Long Island, NY",
  metaDescription:
    "Sarai is Long Island's luxury photo booth and event experience house. Signature booths, 360 experiences, and editorial-grade keepsakes for weddings, corporate events, and private celebrations.",
  keywords: [
    "luxury photo booth Long Island",
    "wedding photo booth New York",
    "360 photo booth Hamptons",
    "corporate event photo booth NYC",
    "luxury event experiences Long Island",
  ],
};

/* ────────────────────────── Home ────────────────────────── */

export const homeHero: HeroContent = {
  eyebrow: "Luxury Photo Booth & Event Experiences — Long Island, New York",
  titleLines: ["Some moments", "deserve forever."],
  subtitle:
    "Sarai designs photographic experiences for weddings, corporate events, and celebrations where every detail matters — including this one.",
  ctaLabel: "Reserve Your Date",
  ctaHref: "/contact",
  secondaryCtaLabel: "Explore the Experience",
  secondaryCtaHref: "/services",
  image: u("photo-1519741497674-611481863552"),
  imageAlt: "Bride and groom in cinematic evening light at a luxury wedding",
};

export const homeManifesto = {
  eyebrow: "The Sarai Standard",
  lines: [
    "A photo booth is equipment.",
    "An experience is a memory.",
    "We only build the second kind.",
  ],
  body: "Every Sarai installation is designed like a moment of the event itself — considered lighting, curated backdrops, attendants in black tie, and prints your guests will keep for decades. Nothing inflatable. Nothing ordinary.",
};

export const homeStats: Stat[] = [
  { value: "350+", label: "Events captured" },
  { value: "120K", label: "Moments delivered" },
  { value: "5.0", label: "Average client rating" },
  { value: "48hrs", label: "Gallery turnaround" },
];

export const galleryImages: GalleryImage[] = [
  { src: u("photo-1519225421980-715cb0215aed", 1600), alt: "First dance under string lights at an estate wedding" },
  { src: u("photo-1469371670807-013ccf25f16a", 1600), alt: "Candlelit reception tables in a grand ballroom" },
  { src: u("photo-1511795409834-ef04bbd61622", 1600), alt: "Guests toasting at an elegant dinner celebration" },
  { src: u("photo-1492684223066-81342ee5ff30", 1600), alt: "Sparklers raised during an evening celebration" },
  { src: u("photo-1529636798458-92182e662485", 1600), alt: "Couple dancing surrounded by guests and warm light" },
  { src: u("photo-1519167758481-83f550bb49b3", 1600), alt: "Grand ballroom dressed in white florals and candlelight" },
  { src: u("photo-1465495976277-4387d4b0b4c6", 1600), alt: "Bride holding a bouquet in soft window light" },
  { src: u("photo-1464366400600-7168b8af9bc3", 1600), alt: "Black-tie guests mingling at a gala reception" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "The booth was the most photographed corner of our wedding after the altar. Sarai understood the assignment — it looked like it belonged in the room.",
    author: "Alexandra & James",
    event: "Wedding — Oheka Castle, Huntington",
  },
  {
    quote:
      "Our guests are still talking about the 360 experience. Flawless setup, attendants in black tie, and the gallery arrived before our flight home.",
    author: "Priya Raman",
    event: "Private Estate Celebration — Southampton",
  },
  {
    quote:
      "We've used every activation vendor in the city. Sarai is the only one I'd put in front of our C-suite without a second thought.",
    author: "Daniel Okafor",
    event: "Corporate Gala — Manhattan",
  },
  {
    quote:
      "From the first call to the final print, everything felt considered. It elevated the entire evening — our planner now books them for every event.",
    author: "The Castellano Family",
    event: "50th Anniversary — Garden City",
  },
];

/* ────────────────────────── Services ────────────────────────── */

export const services: Service[] = [
  {
    slug: "photo-booth-rentals",
    eyebrow: "01 — The Signature Booth",
    title: "Photo Booth Rentals",
    shortDescription:
      "An open-air studio with editorial lighting, museum-grade prints, and a presence that belongs in the room.",
    description:
      "Our signature booth is closer to a portrait studio than a party rental. Glass-and-brass styling, professional strobe lighting, and backdrops curated to your event's palette. Guests leave with archival prints designed like gallery cards — your monogram, your typography, your evening.",
    features: [
      "Open-air studio with professional strobe lighting",
      "Curated backdrop library or fully custom set design",
      "Archival matte prints with bespoke design",
      "Black-tie attendants for the full engagement",
      "Instant text & email delivery, full online gallery in 48 hours",
    ],
    image: u("photo-1492684223066-81342ee5ff30"),
    imageAlt: "Guests celebrating with sparklers in dramatic evening light",
  },
  {
    slug: "360-booth-experiences",
    eyebrow: "02 — The 360 Experience",
    title: "360 Booth Experiences",
    shortDescription:
      "Slow-motion, cinematic video captured in the round — the moment your dance floor becomes a film set.",
    description:
      "A platform, a revolving cinema camera, and lighting designed for motion. The 360 experience turns thirty seconds into a cinematic keepsake — slowed, graded, scored, and delivered to each guest's phone before the night ends. It is, reliably, where the line forms.",
    features: [
      "Cinematic 120fps capture with professional motion lighting",
      "Custom motion graphics, color grade & licensed audio",
      "Instant delivery to guests via text or QR",
      "LED ambient staging matched to your design",
      "Dedicated experience director on site",
    ],
    image: u("photo-1470229722913-7c0e2dbbafd3"),
    imageAlt: "Hands raised under dramatic stage lighting at an event",
  },
  {
    slug: "weddings",
    eyebrow: "03 — Weddings",
    title: "Weddings",
    shortDescription:
      "Designed alongside your planner and florist, so the experience feels like part of the wedding — not parked at it.",
    description:
      "We treat your wedding like the once-in-a-lifetime production it is. In the months before, we work with your planner on placement, palette, florals, and print design. On the day, our team arrives early, dresses formally, and disappears into the rhythm of your celebration — leaving behind a guest book of real moments.",
    features: [
      "Design consultation with your planner & stationer",
      "Print suites matched to your invitation typography",
      "Velvet guest book service with handwritten notes",
      "Ceremony-to-last-dance coverage options",
      "Heirloom gallery box with archival prints",
    ],
    image: u("photo-1583939003579-730e3918a45a"),
    imageAlt: "Bride and groom sharing a kiss at golden hour",
  },
  {
    slug: "corporate-events",
    eyebrow: "04 — Corporate Events",
    title: "Corporate Events",
    shortDescription:
      "Brand activations with the polish of your identity — galas, launches, summits, and holiday celebrations.",
    description:
      "Your brand has guidelines; we read them. Sarai corporate experiences are built to spec — branded sets, on-palette lighting, data capture that your marketing team will actually use, and a presence polished enough for clients, press, and leadership in the same frame.",
    features: [
      "Fully branded set design & print collateral",
      "Custom overlays, microsites & instant social sharing",
      "Lead capture & post-event analytics reporting",
      "COI, vendor compliance & venue coordination handled",
      "National multi-city activation capability",
    ],
    image: u("photo-1511578314322-379afb476865"),
    imageAlt: "Elegant corporate gala with ambient lighting and formal tables",
  },
  {
    slug: "private-celebrations",
    eyebrow: "05 — Private Celebrations",
    title: "Private Celebrations",
    shortDescription:
      "Milestone birthdays, anniversaries, galas at home — intimate events with full production values.",
    description:
      "Some of our favorite evenings happen in living rooms, gardens, and private clubs. For milestone celebrations we scale the full Sarai experience to intimate settings — discreet footprints, refined styling, and keepsakes that feel personal because they are.",
    features: [
      "Site visits for private residences & clubs",
      "Discreet, low-footprint installations",
      "Personalized print design around the guest of honor",
      "Same-night digital gallery for hosts",
      "White-glove setup & breakdown, invisible to guests",
    ],
    image: u("photo-1530103862676-de8c9debad1d"),
    imageAlt: "Confetti falling over a joyful private celebration",
  },
];

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "The Conversation",
    description:
      "A short call about your event, your venue, and what you want guests to feel. We hold your date for seven days while we design.",
  },
  {
    number: "02",
    title: "The Design",
    description:
      "We compose the experience — booth styling, backdrop, lighting, and print suite — and present it as a visual proposal alongside your planner.",
  },
  {
    number: "03",
    title: "The Evening",
    description:
      "Our team arrives hours early, builds quietly, and runs the experience in black tie. You never think about us once. That's the point.",
  },
  {
    number: "04",
    title: "The Keepsake",
    description:
      "Within 48 hours, your complete gallery arrives — retouched, organized, and ready to relive. Heirloom print boxes follow by courier.",
  },
];

/* ────────────────────────── About ────────────────────────── */

export const aboutContent = {
  hero: {
    eyebrow: "About Sarai",
    titleLines: ["Built on a simple belief:", "memory is a luxury."],
    image: u("photo-1511795409834-ef04bbd61622"),
    imageAlt: "Guests gathered around an elegant candlelit dinner table",
  },
  story: {
    eyebrow: "Our Story",
    title: "From one Long Island wedding to three hundred and fifty.",
    paragraphs: [
      "Sarai began the way the best things do — at a wedding. Watching guests crowd around a tired, fluorescent-lit booth in the corner of an otherwise breathtaking room, our founder asked a question no one in the industry seemed to be asking: why is the most-visited corner of the event the least designed?",
      "We spent a year answering it. Studio lighting instead of ring lights. Archival prints instead of glossy strips. Attendants who dress like guests, not staff. Backdrops composed with the florist, not shipped from a warehouse. The result was a photographic experience that belonged in the rooms it stood in — and Long Island's planners noticed.",
      "Today Sarai serves the weddings, brands, and families of Long Island, the Hamptons, and New York City. We remain deliberately small, deliberately obsessive, and deliberately booked by people who care about the details no one else sees.",
    ],
    image: u("photo-1522673607200-164d1b6ce486"),
    imageAlt: "Champagne toast between guests at a refined celebration",
    secondImage: u("photo-1519167758481-83f550bb49b3"),
    secondImageAlt: "A grand ballroom dressed for a luxury wedding",
  },
  pillars: [
    {
      title: "Design before equipment",
      description:
        "We start with how the experience should look in your room and build backward. The hardware is invisible; the moment is everything.",
    },
    {
      title: "Hospitality, not staffing",
      description:
        "Our attendants are trained hosts. They welcome, style, and direct like portrait photographers — because they are.",
    },
    {
      title: "Keepsakes, not output",
      description:
        "Prints on archival stock, galleries graded like editorials, boxes designed to be opened on anniversaries. We make heirlooms.",
    },
    {
      title: "Precision, always",
      description:
        "Load-in schedules to the minute, COIs before they're requested, backups for the backups. Luxury is reliability.",
    },
  ] as ValuePillar[],
  closing: {
    eyebrow: "The People",
    title: "A small team with impossible standards.",
    body: "Sarai is run by a tight ensemble of photographers, designers, and event professionals who have worked the most demanding rooms in New York. We take a limited number of events each season — when we're at your event, we are entirely at your event.",
  },
};

/* ────────────────────────── FAQ ────────────────────────── */

export const faqItems: FaqItem[] = [
  {
    category: "Booking",
    question: "How far in advance should we book?",
    answer:
      "For peak wedding season (May through October) we recommend reserving 9–12 months ahead — we accept a limited number of events per weekend. Corporate events and private celebrations can often be accommodated with 4–8 weeks' notice, and we keep a short list for last-minute requests.",
  },
  {
    category: "Booking",
    question: "What is required to reserve our date?",
    answer:
      "A signed agreement and a 50% retainer secure your date exclusively. The balance is due 14 days before your event. We accept all major cards, ACH, and checks, and we'll hold a tentative date for seven days while you decide.",
  },
  {
    category: "Booking",
    question: "Do you travel beyond Long Island?",
    answer:
      "Yes. We're based on Long Island and regularly serve the Hamptons, New York City, Westchester, and northern New Jersey. Travel within 50 miles of Garden City is included; beyond that, a transparent travel fee is quoted up front. Multi-city corporate activations are available nationally.",
  },
  {
    category: "The Experience",
    question: "What makes Sarai different from a typical photo booth rental?",
    answer:
      "Design and hospitality. Our installations are styled to your event — lighting, backdrop, and print design composed with your planner — and run by formally dressed attendants trained as portrait hosts. The result photographs like part of your event, not a vendor parked at it.",
  },
  {
    category: "The Experience",
    question: "How does the 360 booth work?",
    answer:
      "Guests step onto a low platform while a cinema camera revolves around them, capturing slow-motion video at 120 frames per second. Each clip is automatically graded, set to licensed music, branded to your event, and delivered to the guest's phone within seconds.",
  },
  {
    category: "The Experience",
    question: "Can we customize the prints and digital templates?",
    answer:
      "Always — it's our favorite part. Every event receives a bespoke print suite designed around your invitation typography, monogram, or brand guidelines. You'll approve the design in a proof round before the event; nothing goes to print without your sign-off.",
  },
  {
    category: "The Experience",
    question: "How quickly do guests receive their photos?",
    answer:
      "Instantly. Prints emerge in under ten seconds, and digital copies are texted or emailed to guests in real time. Your complete retouched gallery is delivered within 48 hours of the event.",
  },
  {
    category: "Logistics",
    question: "How much space and power do you need?",
    answer:
      "The signature booth needs roughly 10×10 feet; the 360 experience is best with 12×12 feet for comfortable guest flow. Each requires one standard 120V outlet within 25 feet. We carry professional cable management, so the installation stays clean and safe.",
  },
  {
    category: "Logistics",
    question: "Are you insured? Our venue requires a COI.",
    answer:
      "Fully. We carry $2M in general liability coverage and issue certificates of insurance directly to your venue, usually the same business day. We've worked with most major Long Island, Hamptons, and Manhattan venues and know their requirements well.",
  },
  {
    category: "Logistics",
    question: "When do you set up and break down?",
    answer:
      "We arrive 2–3 hours before guest arrival and complete a full lighting and print test before doors open. Breakdown happens after your event concludes or during a moment your planner designates — quietly, and never during speeches or the last dance.",
  },
  {
    category: "Logistics",
    question: "Can the booth operate outdoors?",
    answer:
      "Yes, with conditions we'll confirm in advance: level ground, overhead cover (tent or structure), and access to power. For tented estate weddings and garden parties, we conduct a site visit to plan placement and lighting precisely.",
  },
  {
    category: "Customization",
    question: "Do you offer branded experiences for corporate events?",
    answer:
      "It's one of our specialties. We build fully branded activations — custom set design, on-palette lighting, branded overlays and microsites, lead capture, and post-event analytics. Send us your brand guidelines and we'll return a visual proposal.",
  },
];

/* ────────────────────────── Page-level SEO ────────────────────────── */

export const pageSeo = {
  home: {
    title: "Sarai Photo Booth — Luxury Photo Booth & Event Experiences | Long Island, NY",
    description: seoSettings.metaDescription,
  },
  about: {
    title: "About — Sarai Photo Booth",
    description:
      "The story and standards behind Long Island's luxury photo booth house. Design before equipment, hospitality before staffing, heirlooms before output.",
  },
  services: {
    title: "Services — Luxury Photo Booth Rentals, 360 Experiences & More",
    description:
      "Signature photo booth rentals, cinematic 360 experiences, weddings, corporate activations, and private celebrations across Long Island, the Hamptons, and NYC.",
  },
  faq: {
    title: "FAQ — Sarai Photo Booth",
    description:
      "Booking timelines, logistics, customization, insurance, and everything else you'd like to know before reserving your date with Sarai.",
  },
  contact: {
    title: "Reserve Your Date — Sarai Photo Booth",
    description:
      "Tell us about your wedding, corporate event, or private celebration. We respond within one business day with availability and a tailored proposal.",
  },
};

/* ────────────────────────── Contact ────────────────────────── */

export const contactContent = {
  eyebrow: "Reserve Your Date",
  titleLines: ["Let's design", "your evening."],
  body: "Tell us about your event — the date, the venue, the feeling you're after. We respond within one business day with availability and a tailored proposal.",
  image: u("photo-1465495976277-4387d4b0b4c6"),
  imageAlt: "Bride holding a bouquet in soft natural light",
  eventTypes: [
    "Wedding",
    "Corporate Event",
    "Private Celebration",
    "Gala / Fundraiser",
    "Brand Activation",
    "Other",
  ],
};

/* ────────────────────────── Shared CTA ────────────────────────── */

export const ctaSection = {
  eyebrow: "Limited dates each season",
  titleLines: ["Your guests will remember", "how it felt."],
  body: "We accept a limited number of events each season to keep every installation at our standard. If your date matters, let's hold it.",
  ctaLabel: "Reserve Your Date",
  ctaHref: "/contact",
  image: u("photo-1527529482837-4698179dc6ce"),
  imageAlt: "Moody ambient lighting washing over an evening event",
};
