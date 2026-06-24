/**
 * CONSCIOUS FAMILY CENTRE — shared domain types.
 *
 * These are the contract between the Sanity schemas (sanity/schemas/*),
 * the GROQ projections (lib/sanity/queries.ts), and the components that
 * consume them via lib/data.ts. Images are resolved to a { src, alt }
 * shape in the query so fallback content and CMS content are identical.
 *
 * Server-action input/record shapes (registrations, enquiries) live in
 * the back half of this file under "Transactional".
 */

/* ───────────────────────── Primitives ───────────────────────── */

export interface ImageAsset {
  src: string;
  alt: string;
  /** Low-quality image placeholder (base64) for blur-up, when available. */
  lqip?: string;
  caption?: string;
}

/** Portable Text. Typed loosely to avoid a hard dep until render time. */
export type PortableText = unknown[];

export interface Cta {
  label: string;
  href: string;
  /** Visual intent; maps to Button variants. */
  variant?: "primary" | "secondary" | "ghost";
}

export interface Seo {
  title: string;
  description: string;
  ogImage?: string;
  keywords?: string[];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
  /** Group label used inside the Programs mega-menu. */
  group?: string;
}

/* ───────────────────────── Taxonomy ───────────────────────── */

export type AgeBandId = "little-ones" | "explorers" | "big-kids";

export interface AgeBand {
  id: AgeBandId;
  label: string; // "Little Ones"
  range: string; // "0–3 years"
}

export type ProgramType =
  | "stay-and-play"
  | "homeschool-hub"
  | "forest-school"
  | "enrichment-clubs"
  | "waka-wednesday"
  | "creative-arts"
  | "nanny-training";

export type PriceUnit = "session" | "day" | "week" | "term" | "month" | "course";

export interface PriceTier {
  label: string; // "Drop-in", "Per term", "Sibling"
  amount: number; // NGN
  unit: PriceUnit;
  note?: string;
}

/* ───────────────────────── Settings / Nav ───────────────────────── */

export interface SiteSettings {
  siteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: {
    line: string;
    area: string; // "Wuse 2"
    city: string; // "Abuja"
    mapUrl: string;
    lat?: number;
    lng?: number;
  };
  hours: string[]; // ["Mon–Sat: 10:00–15:00", "Sun: Closed"]
  socials: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  announcement?: {
    active: boolean;
    text: string;
    ctaLabel?: string;
    link?: string;
  };
  defaultSeo: Seo;
}

export interface Navigation {
  header: NavItem[];
  footer: { heading: string; links: NavItem[] }[];
}

/* ───────────────────────── Content documents ───────────────────────── */

/** Optional grouping for programs (e.g. "Early Years", "School Age"). */
export interface ProgramCategory {
  slug: string;
  title: string;
  description?: string;
  order: number;
}

export interface Program {
  slug: string;
  title: string;
  type: ProgramType;
  category?: ProgramCategory | null;
  ageBands: AgeBandId[];
  summary: string;
  heroImage: ImageAsset;
  /** Short narrative of what the learning experience feels like. */
  learningExperience?: string;
  /** Outcomes-focused bullets (confidence, creativity, …). */
  keyBenefits: string[];
  /** Representative activities (kept qualitative, not a fixed curriculum). */
  typicalActivities: string[];
  body: PortableText;
  dayInTheLife: { time: string; activity: string }[];
  ratio?: string; // "1 adult : 4 children"
  groupSize?: string;
  schedule?: string;
  pricing: PriceTier[];
  whatToBring: string[];
  gallery: ImageAsset[];
  faqs: FaqItem[];
  cta?: Cta;
  seo: Seo;
  order: number;
}

/**
 * Lean projection of a Program for the Programs index showcase blocks —
 * everything a feature block needs without the heavy body/pricing/SEO. A full
 * `Program` is structurally assignable to this (used for fallback content).
 */
export interface ProgramShowcase {
  slug: string;
  title: string;
  type: ProgramType;
  category?: ProgramCategory | null;
  ageBands: AgeBandId[];
  summary: string;
  heroImage: ImageAsset;
  learningExperience?: string;
  keyBenefits: string[];
  typicalActivities: string[];
  gallery: ImageAsset[];
  cta?: Cta;
  order: number;
}

/**
 * The spec's ProgramGallery / ProgramFAQ / ProgramTestimonial map onto the
 * existing GalleryItem / FaqItem / Testimonial shapes (each already carries a
 * `program` link), so they are exposed as aliases rather than duplicated.
 */
export type ProgramGalleryItem = GalleryItem;
export type ProgramFaq = FaqItem;
export type ProgramTestimonial = Testimonial;

export type CampStatus = "upcoming" | "open" | "full" | "closed" | "past";

export interface CampSession {
  slug: string;
  title: string;
  season: string; // "Summer 2026"
  theme: string; // "STEAM & Nature"
  ageBand: string; // human-readable, e.g. "Ages 4–10"
  startDate: string; // ISO
  endDate: string; // ISO
  dailySchedule: string;
  capacity: number;
  /** Derived server-side: capacity − confirmed paid registrations. */
  spotsRemaining: number;
  priceNGN: number;
  earlyBirdPriceNGN?: number;
  earlyBirdUntil?: string; // ISO
  siblingDiscountPct?: number;
  included: string[];
  packingList: string[];
  status: CampStatus;
  heroImage: ImageAsset;
  seo: Seo;
}

export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  photo: ImageAsset;
  bio: string;
  qualifications: string[];
  order: number;
}

export interface Testimonial {
  quote: string;
  authorName: string;
  childAge?: string;
  photo?: ImageAsset;
  program?: string; // program title
  videoUrl?: string;
}

export interface GalleryCategory {
  slug: string;
  title: string;
  description?: string;
  order?: number;
}

export interface GalleryItem {
  image: ImageAsset;
  title?: string;
  slug?: string;
  caption?: string;
  description?: string;
  category?: GalleryCategory | null;
  tags: string[];
  program?: string;
  featured?: boolean;
  date?: string;
  order?: number;
}

/** A curated visual story: an editorial cluster of images with a CTA. */
export interface FeaturedStory {
  slug?: string;
  title: string;
  description?: string;
  images: ImageAsset[];
  cta?: Cta;
}

/** Known FAQ category slugs (CMS may add more — items carry the slug string). */
export type FaqCategory = "general" | "programs" | "philosophy" | "participation" | "enrollment" | "camps" | "safety";

/** CMS-managed FAQ category document. */
export interface FaqCategoryDoc {
  slug: string;
  title: string;
  description?: string;
  displayOrder?: number;
}

export interface FaqItem {
  question: string;
  answer: PortableText | string;
  /** Category slug (resolved from the category reference). */
  category: string;
  featured?: boolean;
  popular?: boolean;
  order?: number;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  cover: ImageAsset;
  author: { name: string; photo?: ImageAsset };
  body: PortableText;
  categories: string[];
  publishedAt: string;
  seo: Seo;
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  body?: PortableText;
  fileUrl?: string;
}

export type CalendarEventType = "term" | "holiday" | "camp" | "event";

export interface CalendarEvent {
  title: string;
  type: CalendarEventType;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface Policy {
  slug: string;
  title: string;
  body: PortableText;
}

/* ───────────────────────── Page builder ─────────────────────────
 * Flexible marketing pages (Home, Why CFC, etc.) are composed from a
 * typed union of sections so editors arrange them without dev work.
 */

export interface PageSectionBase {
  _key: string;
  _type: string;
}

export interface HeroSection extends PageSectionBase {
  _type: "heroSection";
  eyebrow?: string;
  headline: string;
  subhead?: string;
  image?: ImageAsset;
  ctas?: Cta[];
}

export interface PillarsSection extends PageSectionBase {
  _type: "pillarsSection";
  eyebrow?: string;
  heading?: string;
  pillars: { title: string; description: string; icon?: string }[];
}

export interface StatsSection extends PageSectionBase {
  _type: "statsSection";
  stats: { value: number; suffix?: string; label: string }[];
}

export interface SplitFeatureSection extends PageSectionBase {
  _type: "splitFeature";
  eyebrow?: string;
  heading: string;
  body: PortableText;
  image: ImageAsset;
  imageSide: "left" | "right";
  cta?: Cta;
}

export interface CtaBandSection extends PageSectionBase {
  _type: "ctaBand";
  heading: string;
  body?: string;
  cta: Cta;
  image?: ImageAsset;
}

export interface GallerySection extends PageSectionBase {
  _type: "gallerySection";
  heading?: string;
  items: ImageAsset[];
}

export interface TestimonialsSection extends PageSectionBase {
  _type: "testimonialsSection";
  heading?: string;
  testimonials: Testimonial[];
}

export interface FaqSection extends PageSectionBase {
  _type: "faqSection";
  heading?: string;
  category?: FaqCategory;
  faqs: FaqItem[];
}

export type PageSection =
  | HeroSection
  | PillarsSection
  | StatsSection
  | SplitFeatureSection
  | CtaBandSection
  | GallerySection
  | TestimonialsSection
  | FaqSection;

export interface Page {
  slug: string;
  title: string;
  sections: PageSection[];
  seo: Seo;
}

/* ───────────────────────── Transactional ─────────────────────────
 * Inputs collected by forms/server actions and the records persisted
 * back to Sanity. See lib/actions/* and lib/validation/*.
 */

export interface ChildDetail {
  name: string;
  dateOfBirth: string; // ISO
  allergies?: string;
  medicalNotes?: string;
  photoConsent: boolean;
}

export interface GuardianDetail {
  name: string;
  phone: string;
  email: string;
  emergencyName: string;
  emergencyPhone: string;
  pickupAuthorization?: string;
}

export type PaymentGateway = "paystack" | "flutterwave";
export type RegistrationStatus = "pending" | "paid" | "waitlist" | "cancelled";

/** Raw form input for a camp registration (pre-payment). */
export interface CampRegistrationInput {
  campSlug: string;
  sessionKeys: string[];
  children: ChildDetail[];
  guardian: GuardianDetail;
  consentAccepted: boolean;
}

/** Persisted registration record (Sanity document shape). */
export interface CampRegistrationRecord extends CampRegistrationInput {
  reference: string;
  amountNGN: number;
  gateway: PaymentGateway;
  status: RegistrationStatus;
  createdAt: string;
}

export type EnquiryStatus = "new" | "contacted" | "enrolled" | "closed";

export interface AdmissionEnquiryInput {
  childName: string;
  childAge: string;
  programInterest: string[];
  preferredStart?: string;
  guardian: Pick<GuardianDetail, "name" | "phone" | "email">;
  message?: string;
}

export interface TourBookingInput {
  guardian: Pick<GuardianDetail, "name" | "phone" | "email">;
  preferredDates: string[];
  partySize: number;
  message?: string;
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export type PreferredContact = "email" | "phone" | "whatsapp";
export type InquiryStatus = "new" | "contacted" | "enrolled" | "closed";

/** Contact-page inquiry (RHF + Zod). Persisted as an `inquiry` document. */
export interface InquiryInput {
  parentName: string;
  email: string;
  phone: string;
  childAge?: string;
  programInterest: string;
  message: string;
  preferredContact: PreferredContact;
}

export interface InquiryRecord extends InquiryInput {
  createdAt: string;
  status: InquiryStatus;
}

export interface NewsletterInput {
  email: string;
}

/* ───────────────────────── Homepage ─────────────────────────
 * The homepage is a CMS-managed singleton (`homePage`). Collections it
 * showcases (programs, camps, testimonials, gallery, faqs) are fetched
 * separately and composed in app/(site)/page.tsx.
 */

/** Lightweight program shape for cards/previews (lists stay lean). */
export interface ProgramPreview {
  slug: string;
  title: string;
  summary: string;
  ageBands: AgeBandId[];
  heroImage: ImageAsset;
}

export interface HomeHero {
  eyebrow: string;
  headline: string;
  subhead: string;
  image: ImageAsset;
  primaryCta: Cta;
  secondaryCta: Cta;
  tertiaryCta?: Cta;
}

export interface HomePillar {
  title: string;
  description: string;
  icon?: string;
}

export interface HomeContent {
  hero: HomeHero;
  why: { eyebrow: string; heading: string; intro?: string; pillars: HomePillar[] };
  about: { eyebrow: string; heading: string; paragraphs: string[]; image: ImageAsset; cta: Cta };
  programs: { eyebrow: string; heading: string; intro?: string; cta: Cta };
  camp: { eyebrow: string; heading: string; intro?: string };
  gallery: { eyebrow: string; heading: string; intro?: string; cta: Cta };
  testimonials: { eyebrow: string; heading: string };
  faq: { eyebrow: string; heading: string; cta: Cta };
  finalCta: { eyebrow: string; heading: string; body?: string; ctas: Cta[] };
  seo: Seo;
}

/* ───────────────────────── About page ─────────────────────────
 * The About page is a CMS-managed singleton (`aboutPage`). It frames the
 * centre's story, philosophy and differentiators; the Team section pulls
 * from the `teamMember` collection and Testimonials from `testimonial`.
 * Section shapes deliberately mirror HomeContent so components/motion are
 * reusable across both pages.
 */

export interface AboutCard {
  title: string;
  description: string;
  icon?: string;
}

export interface AboutContent {
  hero: { eyebrow: string; title: string; mission: string; image: ImageAsset };
  story: {
    eyebrow: string;
    heading: string;
    paragraphs: string[];
    image: ImageAsset;
    /** Large editorial pull-quote that breaks up the prose. */
    pullQuote?: string;
  };
  philosophy: { eyebrow: string; heading: string; intro?: string; cards: AboutCard[] };
  differentiators: { eyebrow: string; heading: string; intro?: string; items: AboutCard[] };
  environment: { eyebrow: string; heading: string; intro?: string; images: ImageAsset[] };
  team: { eyebrow: string; heading: string; intro?: string };
  testimonials: { eyebrow: string; heading: string };
  community: { eyebrow: string; heading: string; paragraphs: string[]; image: ImageAsset };
  finalCta: { eyebrow: string; heading: string; body?: string; ctas: Cta[] };
  seo: Seo;
}

/* ───────────────────────── Programs page ─────────────────────────
 * The Programs index is a CMS-managed singleton (`programsPage`) holding the
 * framing copy + media. The programs themselves come from the `program`
 * collection; gallery/faqs/testimonials are fetched separately. Section
 * shapes mirror HomeContent/AboutContent so motion + components are reusable.
 */

export interface ProgramsPageContent {
  hero: {
    eyebrow: string;
    title: string;
    intro: string;
    image: ImageAsset;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  overview: { eyebrow: string; heading: string; paragraphs: string[]; image: ImageAsset };
  outcomes: { eyebrow: string; heading: string; intro?: string; cards: AboutCard[] };
  experience: { eyebrow: string; heading: string; intro?: string; items: AboutCard[] };
  gallery: { eyebrow: string; heading: string; intro?: string };
  faq: { eyebrow: string; heading: string };
  testimonials: { eyebrow: string; heading: string };
  finalCta: { eyebrow: string; heading: string; body?: string; ctas: Cta[] };
  seo: Seo;
}

/* ───────────────────────── Gallery page ─────────────────────────
 * The Gallery is a CMS-managed singleton (`galleryPage`) holding the framing
 * copy + hero media. Images come from the `galleryItem` collection, categories
 * from `galleryCategory`, and immersive stories from `featuredStory`.
 */

export interface GalleryPageContent {
  hero: { eyebrow: string; title: string; intro: string; image: ImageAsset };
  intro: { eyebrow: string; heading: string; paragraphs: string[] };
  gallery: { eyebrow: string; heading: string; intro?: string };
  featuredMoments: { eyebrow: string; heading: string; intro?: string };
  community: { eyebrow: string; heading: string; paragraphs: string[]; image: ImageAsset };
  finalCta: { eyebrow: string; heading: string; body?: string; ctas: Cta[] };
  seo: Seo;
}

/* ───────────────────────── FAQ page ─────────────────────────
 * The FAQ is a CMS-managed singleton (`faqPage`) holding the framing copy.
 * FAQ items come from `faq` documents (each linked to a `faqCategory`).
 */

export interface FaqPageContent {
  hero: { eyebrow: string; title: string; intro: string; image: ImageAsset };
  featured: { eyebrow: string; heading: string; intro?: string };
  browse: { eyebrow: string; heading: string; intro?: string };
  support: { eyebrow: string; heading: string; body?: string; ctas: Cta[] };
  finalCta: { eyebrow: string; heading: string; body?: string; ctas: Cta[] };
  seo: Seo;
}

/* ───────────────────────── Contact page ─────────────────────────
 * The Contact page is a CMS-managed singleton (`contactPage`). Contact details
 * (phone/email/address/hours/map) come from `siteSettings`; the featured camp
 * promo from the `campSession` collection; the FAQ preview from `faq`.
 */

export interface ContactPageContent {
  hero: { eyebrow: string; title: string; intro: string; image: ImageAsset };
  welcome: { eyebrow: string; heading: string; paragraphs: string[] };
  form: { eyebrow: string; heading: string; intro?: string };
  visit: { eyebrow: string; heading: string; description?: string; benefits: string[]; cta: Cta };
  journey: { eyebrow: string; heading: string; intro?: string; steps: { title: string; description: string }[] };
  camp: { eyebrow: string; heading: string; description?: string; availabilityNote?: string; cta: Cta };
  faq: { eyebrow: string; heading: string };
  finalCta: { eyebrow: string; heading: string; body?: string; ctas: Cta[] };
  seo: Seo;
}

/* ───────────────────────── Future Makers registration ─────────────
 * The Summer Experience 2026 registration platform. Bank-transfer + proof
 * upload model (distinct from the gateway scaffold in lib/payments). Persisted
 * as a `futureMakersRegistration` document; see lib/futureMakers.ts for the
 * authoritative programme data and lib/validation/registration.ts for the
 * shared Zod schema.
 */

export type CampAttendanceHistory = "yes" | "other-events" | "no";
export type CampGender = "male" | "female";
export type CampMonths = "july-august" | "july" | "august";
export type CampWeeks = "2" | "4" | "6" | "8" | "other";
export type CampAgeOption = "0-18m" | "18m-2" | "2-3" | "3-4" | "4-6" | "6-8" | "8-10" | "10+";
export type CampFeeGroup = "babies" | "toddlers" | "early-explorers";
export type CampPaymentOption = "full" | "deposit";

export type FmRegistrationStatus = "pending-review" | "payment-received" | "confirmed" | "waitlisted" | "cancelled";
export type FmPaymentStatus = "awaiting-review" | "deposit-paid" | "fully-paid" | "payment-issue";

/** Validated registration values (mirrors the Zod schema). */
export interface RegistrationInput {
  email: string;
  parentFullName: string;
  parentPhone: string;
  cfcAttendanceHistory: CampAttendanceHistory;
  childrenFullNames: string;
  childrenAges: CampAgeOption;
  childOneGender: CampGender;
  childTwoGender?: CampGender;
  tshirtSize: string;
  nannyName?: string;
  nannyPhone?: string;
  selectedMonths: CampMonths;
  selectedWeeks: CampWeeks;
  selectedWeeksOther?: string;
  paymentOption: CampPaymentOption;
  emergencyContact: string;
  electronicSignature: string;
  policyAgreement: boolean;
}

/* ───────────────────────── Action results ───────────────────────── */

/** Discriminated result returned by every server action. */
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
