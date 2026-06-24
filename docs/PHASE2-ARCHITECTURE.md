# Conscious Family Centre — Phase 2: System Architecture & CMS Planning

> Technical blueprint to guide development. **No pages, UI components, or
> implementation code** — architecture, data modeling, and planning only.
> Builds on [BLUEPRINT.md](BLUEPRINT.md) (strategy) and [ARCHITECTURE.md](ARCHITECTURE.md)
> (Phase-1 scaffold).
>
> ⚠️ **Read alongside [PHASE2-RISK-REVIEW.md](PHASE2-RISK-REVIEW.md)** — it refines
> several decisions here (capacity/oversell, registration datastore, button
> contrast, robots granularity, Three.js, draft preview). Where they differ, the
> risk review wins.

---

## 0. Stack reconciliation (read first)

The Phase-2 stack differs from what Phase-1 scaffolded. This blueprint targets
the **Phase-2 stack**; the table is the migration contract.

| Concern | Phase-2 spec (target) | Phase-1 repo state | Resolution |
|---|---|---|---|
| Styling | **Tailwind CSS 4** | Tailwind 3.4 (`tailwind.config.ts`) | Migrate to v4 **CSS-first**: tokens move into `@theme` in `globals.css`; delete `tailwind.config.ts`. Palette/scale already defined — port values. |
| UI primitives | **Shadcn UI** (Radix) | hand-rolled `components/ui/*` | Adopt Shadcn as the **primitive base** (Dialog, Accordion, Select, Form, Tabs, Toast); restyle to CFC tokens. Keep bespoke `Button`/`Tag`/`SmartImage` as thin wrappers. |
| Motion | **Framer Motion + GSAP** | GSAP + Lenis only | Framer Motion for **component/page-level** (enter/exit, layout, presence); GSAP+ScrollTrigger for **scroll-scrubbed/pinned**; Lenis for smooth scroll. Split documented in §9. |
| Forms/validation | **React Hook Form + Zod** | dependency-free validators | Replace `lib/validation` with **Zod schemas** (shared client+server); RHF on the client. `ActionResult` contract stays. |
| Email | **Resend** | `lib/notify.ts` seam | Already Resend-shaped — implement the transport. |
| Hosting | **Vercel** | `netlify.toml` | Switch to Vercel (native ISR, Image, Edge, cron). Remove Netlify config. |
| CMS | **Sanity v3** | Sanity v4 (Studio + libs) | Keep **v4** — its authoring model is a superset of v3 and our schemas are `defineType`-based (forward-compatible). Flag only if a v3 hosting constraint exists. |
| Runtime | Next 15 · React 19 · TS | same | unchanged |

**Net new dependencies:** `framer-motion`, `react-hook-form`, `@hookform/resolvers`,
`zod`, `resend`, Shadcn UI generator + `@radix-ui/*`, `tailwindcss@4` + `@tailwindcss/postcss`.

---

## 1. Information Architecture (Task 1)

### 1.1 Page hierarchy

Authoritative scope = the Phase-2 page list. Programs gains dynamic detail
pages; Camp Registration is a focused multi-step flow.

```
Home  (/)
├─ About Us  (/about)
├─ Programs  (/programs)
│   └─ [program]  (/programs/[slug])          ← dynamic, CMS-driven
├─ Gallery  (/gallery)
├─ FAQ  (/faq)
├─ Contact  (/contact)
├─ Camp Registration  (/camp-registration)    ← multi-step conversion flow
│   └─ Confirmation  (/camp-registration/confirmation)
├─ Privacy Policy  (/privacy-policy)
└─ Terms & Conditions  (/terms)
```

**Reasoning.** A flat, shallow tree (max depth 2) matches a small-org site where
every page is ≤2 clicks from home — critical for the mobile-first, data-conscious
Abuja audience. Programs is the only branch that deepens, because each program is
a genuine landing page with its own SEO intent ("forest school Abuja"). Legal
pages sit at root (not nested) so they're linkable from forms and the footer
without a contrived parent.

### 1.2 Navigation structure

**Primary header** (persistent, sticky):
`Logo · About · Programs · Gallery · FAQ · Contact · [Register] (primary CTA)`

- **Reasoning:** mirrors Monkton/TAS — a short values/offer nav plus one
  unmissable conversion CTA ("Enrol Today" → here "Register"). The CTA is
  visually distinct (filled leaf) and never scrolls away.
- **Programs** uses a lightweight dropdown/mega-panel listing programs grouped by
  age band (Little Ones 0–3 / Explorers 3–6 / Big Kids 6–10) — the age-stage
  ladder pattern from both reference schools.
- **Mobile:** full-screen overlay (Framer Motion presence + stagger); a sticky
  bottom bar exposes **WhatsApp** (low-friction) + **Register** at all times.

**Announcement bar** (above header, CMS-toggled): time-sensitive camp/intake
messaging — the "Pre-Kindy 2027" banner pattern from TAS.

### 1.3 Footer structure

Four zones:
1. **Brand** — logo, one-line mission, social icons.
2. **Explore** — About, Programs, Gallery, FAQ.
3. **Get started** — Register, Contact, Book a visit (WhatsApp).
4. **Visit & legal** — address + map link, hours, phone/email; Privacy, Terms.
Plus a slim newsletter capture (Resend audience) and a copyright row.

- **Reasoning:** the footer is the secondary nav + the trust/NAP block (local SEO).
  Separating "Explore" (discovery) from "Get started" (conversion) repeats the
  funnel logic so a user who scrolls to the bottom still has the conversion path.

### 1.4 Internal linking strategy

- **Hub-and-spoke:** `/programs` (hub) ⇄ each `/programs/[slug]` (spoke); spokes
  cross-link to **related programs** (same age band) and to **Camp Registration**.
- **Contextual conversion links:** every program & gallery page ends in a CTA band
  → Register or Contact. FAQ answers deep-link to the relevant program/registration.
- **Breadcrumbs** on program detail (`Programs / Forest School`) for orientation +
  `BreadcrumbList` schema.
- **Editorial control:** Portable Text supports internal-reference links so editors
  link program→program in body copy without hardcoding URLs.
- **Reasoning:** distributes link equity to money pages (programs, registration),
  keeps crawl depth shallow, and gives every page a forward path.

### 1.5 CTA strategy

| Tier | CTA | Placement | Intent |
|---|---|---|---|
| Primary | **Register** | Header, hero, program pages, footer | Camp registration — the revenue conversion |
| Secondary | **Contact / Enquire** | Header-adjacent, program pages, footer | Lead capture for membership/questions |
| Tertiary | **WhatsApp** | Sticky mobile bar, contact, footer | Lowest-friction fallback (local norm) |
| Soft | "Explore programs", "View gallery" | Home, cross-page | Mid-funnel discovery |

Rule: **one primary CTA per viewport**; layered CTAs decrease in prominence down
the page (TAS pattern). Color encodes intent (leaf=primary, clay=secondary/camp).

### 1.6 Conversion paths

```
A. Camp (primary)
   Home/Search → Programs or Camp banner → /camp-registration
   → 6-step form → submit (server action) → confirmation + emails
B. Enquiry (secondary)
   Program page → Contact → message (server action) → team email + autoreply
C. Trust loop (supports A & B)
   Any page → Gallery / About (team, safeguarding) / FAQ → reassured → CTA
D. Low-friction (mobile)
   Sticky bar → WhatsApp → human handoff
```
Each path is ≤3 steps to a conversion surface; WhatsApp is always one tap away.

---

## 2. Route Architecture (Task 2)

### 2.1 App Router tree

```
app/
  layout.tsx                       Root: fonts, <html>, providers, global metadata
  globals.css                      Tailwind v4 @theme tokens + base
  manifest.ts  robots.ts  sitemap.ts
  not-found.tsx                    Global 404

  (marketing)/                     ── route group: header + footer + smooth scroll
    layout.tsx                     Marketing shell (Header, Footer, AnnouncementBar, Lenis)
    page.tsx                       Home
    about/
      page.tsx                     loading.tsx
    programs/
      page.tsx                     Program index (hub)   loading.tsx
      [slug]/
        page.tsx                   Program detail (dynamic)   loading.tsx   not-found.tsx
    gallery/
      page.tsx                     loading.tsx
    faq/
      page.tsx
    contact/
      page.tsx

  (legal)/                         ── route group: minimal reading layout
    layout.tsx
    privacy-policy/page.tsx
    terms/page.tsx

  (registration)/                  ── route group: focused, distraction-reduced flow
    layout.tsx                     Slim header (logo + progress + exit), no full nav
    camp-registration/
      page.tsx                     Multi-step form (client island, RHF state machine)
      confirmation/page.tsx        Success (reads ?ref=)   loading.tsx
      error.tsx                    Recoverable submit/payment error boundary

  api/
    revalidate/route.ts            Sanity webhook → on-demand ISR
    og/route.tsx                   Dynamic OG image generation
    webhooks/payment/route.ts      (future) gateway webhook → registration fulfilment
    contact/route.ts               (optional) non-JS form fallback

  studio/[[...tool]]/page.tsx      Embedded Sanity Studio
```

### 2.2 Layouts & route groups

- **Three route groups, three chrome modes:** `(marketing)` = full nav + footer +
  smooth scroll; `(legal)` = narrow prose, no distractions; `(registration)` =
  **focused flow** (progress indicator, exit link, no nav) to maximize completion.
  Route groups give distinct layouts **without affecting URLs**.
- **Root layout** holds providers that must wrap everything (font variables,
  `ThemeProvider` if used, Toast/Tooltip providers, analytics) and the default
  metadata.

### 2.3 Loading & error states

- `loading.tsx` on every data-fetching segment → instant skeletons via Suspense
  (program index/detail, gallery, confirmation).
- `error.tsx` on the registration flow (recoverable) + a root `error.tsx`.
- `not-found.tsx` global + per-segment for invalid program slugs (`notFound()` when
  `getProgram(slug)` is null).

### 2.4 Metadata strategy

- **Root:** `metadata` defaults + `metadataBase`, title template `"%s | Conscious
  Family Centre"`, OG/Twitter defaults from Site Settings (CMS).
- **Static pages:** export a typed `metadata` object.
- **Dynamic pages:** `generateMetadata({ params })` reads the document's `seo`
  object (title/description/ogImage) with fallback to a computed default.
- **`generateStaticParams`** on `programs/[slug]` from `getProgramSlugs()` →
  pre-rendered at build, revalidated by ISR.
- **OG images:** `app/api/og/route.tsx` (Satori/`ImageResponse`) renders branded
  cards per program/camp; referenced from `generateMetadata`.

### 2.5 Dynamic routes

| Route | Params source | Render |
|---|---|---|
| `/programs/[slug]` | `generateStaticParams` + ISR | SSG + revalidate |
| `/camp-registration/confirmation?ref=` | search param | dynamic (per-submission) |
| `/api/og?type=&slug=` | query | edge image |

---

## 3. Sanity CMS Architecture (Task 3)

### 3.1 Modeling principles

1. **Singletons** for once-only config (settings, nav, footer, SEO, announcement).
2. **Structured documents** for transactional/relational data (programs, camps,
   sessions, registrations) — never freeform.
3. **Page-builder** (`page.sections[]`) only for marketing narrative (Home, About).
4. **References over duplication** — categories, activities, programs referenced,
   not copied; availability is **derived**, never hand-entered.
5. **Objects** (reusable field clusters) for `seo`, `cta`, `image`, `priceTier`,
   `address`, `link`, person sub-objects.

### 3.2 Schema groups & fields (specification)

#### Global
| Schema | Kind | Key fields | Relationships |
|---|---|---|---|
| `siteSettings` | singleton | siteName, tagline, logo, phone, whatsapp, email, `address`(obj), hours[], socials(obj) | → embeds `seo` default |
| `navigation` | singleton | header[] (label, href/ref, children[]), grouping | → optional refs to `program` |
| `footer` | singleton | columns[] (heading, links[]), newsletterCopy, legalLinks[] | — |
| `seoSettings` | singleton | defaultTitle, titleTemplate, defaultDescription, defaultOg, keywords[], orgJsonLd fields | — |
| `announcementBar` | singleton | active(bool), message, link, tone, startAt/endAt | — |

#### Homepage (page-builder sections — objects in `page.sections[]`)
| Section object | Key fields |
|---|---|
| `heroSection` | eyebrow, headline, subhead, media(image/video), ctas[] (max 2) |
| `featureSection` | heading, layout(split/grid), features[] (title, body, icon, image, link) |
| `pillarsSection` | heading, pillars[] (title, description, icon) |
| `statsSection` | stats[] (value, suffix, label) |
| `testimonialsSection` | heading, testimonials[] → ref `testimonial` |
| `ctaBlock` | heading, body, cta, background image |
| `galleryTeaser` | heading, collection → ref `galleryCollection` |

#### About
| Schema | Kind | Key fields |
|---|---|---|
| `aboutPage` | singleton | story (PT), philosophy[] (principle, description, icon), milestones[] |
| `teamMember` | document | name, role, photo, bio(PT), qualifications[], order |

#### Programs
| Schema | Kind | Key fields | Relationships |
|---|---|---|---|
| `programCategory` | document | title, slug, description, ageBand, icon, order | grouping for `program` |
| `program` | document | title, slug, summary, hero, body(PT), dayInTheLife[], ratio, groupSize, schedule, pricing[] `priceTier`, whatToBring[], gallery[], cta, seo, order | → `category` (ref), → `faqs` (refs), → related `program` (refs) |
| program "details" | (fields on `program`) | the structured detail above lives on `program`; no separate doc needed |

#### Gallery
| Schema | Kind | Key fields | Relationships |
|---|---|---|---|
| `galleryCollection` | document | title, slug, description, cover, tags[], order | → `program` (ref, optional) |
| `galleryImage` | document | image(+alt), caption, tags[], date | → `collection` (ref) |

#### FAQ
| Schema | Kind | Key fields | Relationships |
|---|---|---|---|
| `faqCategory` | document | title, slug, order | groups `faqItem` |
| `faqItem` | document | question, answer(PT), order | → `category` (ref); referenced by `program`/`faqSection` |

#### Contact
| Schema | Kind | Key fields |
|---|---|---|
| `contactInfo` | singleton | intro, address(obj), phone, whatsapp, email, hours[], mapEmbed/coords, departments[] |
| `formDefinition` (optional) | document | name, fields[] (label, type, required), recipientEmail, successMessage |

> `formDefinition` is optional future-proofing for editor-configurable forms; the
> camp + contact forms ship as typed code-defined forms first.

#### Camp System (relational core)
| Schema | Kind | Key fields | Relationships |
|---|---|---|---|
| `camp` | document | title, slug, season, theme, summary, hero, body(PT), ageRange, basePrice, included[], packingList[], seo, status | → `activities` (refs), has many `campSession` |
| `campSession` | document | label, camp→ref, startDate, endDate, dailyStart/End, capacity, priceOverride, status(draft/open/full/closed) | → `camp` (ref) |
| `activity` | document | title, description, ageBand, icon | referenced by `camp` |
| `availability` | **derived (not a doc)** | `capacity − count(paid/confirmed registrations)` | computed in GROQ per `campSession` |
| `registration` | document (write-only by server) | reference, session→ref, parent(obj), children[](obj), medical(obj), emergencyContacts[](obj), consents(obj), status, amount, gateway, createdAt | → `campSession` (ref) |

### 3.3 Relationship diagram

```
                    siteSettings ─┐
 navigation ─ footer ─ seoSettings ─ announcementBar      (singletons / global)
                                  │
        page(sections[]) ─────────┘            aboutPage ── teamMember
            │  (references)
            ├── testimonial
            └── galleryCollection ──< galleryImage

 programCategory ──< program >── faqItem >── faqCategory
                        │  └──< related program (self-ref)
                        └── priceTier (obj), dayInTheLife (obj)

 activity >──── camp ──< campSession ──< registration
                                  │
                          availability = capacity − count(registration where paid/confirmed)
```
Legend: `A ──< B` one-to-many · `A >── B` B references A · derived shown inline.

### 3.4 Studio structure (desk)

Settings (singletons) · Programs (Categories / Programs) · Camps (Camps /
Sessions / Activities / **Registrations** inbox) · Gallery (Collections / Images)
· People & Proof (Team / Testimonials) · FAQ (Categories / Items) · Pages
(Home/About builder) · Contact · Legal. Registrations are read-mostly with a
status workflow; capacity surfaces as a computed badge.

### 3.5 Content lifecycle

- **Read:** typed getters → GROQ (images + derived availability resolved in-query)
  → **field-level fallback** so partial docs never blank a section.
- **Write:** server-only write client (camp/contact submissions only).
- **Revalidate:** ISR (default 60s) + **on-demand** via `/api/revalidate` Sanity
  webhook keyed by document type/slug (publish → instant refresh of that route).

---

## 4. TypeScript Domain Models (Task 4)

Designed for scalability: a generic Sanity base, resolved-image shape, reference
helper, and discriminated unions for the page builder. (Definitions, not UI code.)

```ts
// ── Base & primitives ──────────────────────────────────────────
interface SanityDoc { _id: string; _type: string; _createdAt: string; _updatedAt: string; }
interface Ref<_T> { _ref: string; _type: "reference"; }          // typed reference marker
interface ResolvedImage { src: string; alt: string; lqip?: string; width?: number; height?: number; caption?: string; }
type PortableText = unknown[];                                    // rendered via @portabletext/react
type ID<Brand extends string> = string & { readonly __brand: Brand };

interface Cta { label: string; href: string; variant?: "primary" | "secondary" | "ghost"; }
interface Address { line: string; area: string; city: string; mapUrl?: string; lat?: number; lng?: number; }
interface SeoData {
  title: string; description: string;
  ogImage?: string; keywords?: string[];
  noIndex?: boolean; canonical?: string;
}

// ── Site settings / global ─────────────────────────────────────
interface SiteSettings {
  siteName: string; tagline: string; logo?: ResolvedImage;
  phone: string; whatsapp: string; email: string;
  address: Address; hours: string[];
  socials: Partial<Record<"instagram" | "facebook" | "tiktok" | "youtube", string>>;
  defaultSeo: SeoData;
}
interface AnnouncementBar { active: boolean; message: string; link?: Cta; tone?: "forest" | "clay" | "sun"; startAt?: string; endAt?: string; }

// ── Programs ───────────────────────────────────────────────────
type AgeBandId = "little-ones" | "explorers" | "big-kids";
interface AgeBand { id: AgeBandId; label: string; range: string; }
interface PriceTier { label: string; amount: number; unit: "session" | "day" | "week" | "term" | "month" | "course"; note?: string; }
interface ProgramCategory { _id: string; title: string; slug: string; ageBand: AgeBandId; icon?: string; order: number; }
interface Program {
  _id: string; title: string; slug: string;
  category: Pick<ProgramCategory, "title" | "slug" | "ageBand">;
  ageBands: AgeBandId[]; summary: string; heroImage: ResolvedImage; body: PortableText;
  dayInTheLife: { time: string; activity: string }[];
  ratio?: string; groupSize?: string; schedule?: string;
  pricing: PriceTier[]; whatToBring: string[];
  gallery: ResolvedImage[]; faqs: FaqItem[]; related: ProgramSummary[];
  cta?: Cta; seo: SeoData; order: number;
}
type ProgramSummary = Pick<Program, "title" | "slug" | "summary" | "heroImage" | "ageBands">;

// ── Proof ──────────────────────────────────────────────────────
interface Testimonial { _id: string; quote: string; authorName: string; childAge?: string; photo?: ResolvedImage; program?: string; videoUrl?: string; }
interface TeamMember { _id: string; name: string; role: string; photo: ResolvedImage; bio: PortableText; qualifications: string[]; order: number; }

// ── Gallery ────────────────────────────────────────────────────
interface GalleryCollection { _id: string; title: string; slug: string; description?: string; cover: ResolvedImage; tags: string[]; imageCount: number; }
interface GalleryImage { _id: string; image: ResolvedImage; caption?: string; tags: string[]; collection?: string; date?: string; }

// ── FAQ ────────────────────────────────────────────────────────
interface FaqCategory { _id: string; title: string; slug: string; order: number; }
interface FaqItem { _id: string; question: string; answer: PortableText; category: string; order: number; }

// ── Camp system ────────────────────────────────────────────────
type CampStatus = "upcoming" | "open" | "full" | "closed" | "past";
type SessionStatus = "draft" | "open" | "full" | "closed";
interface Activity { _id: string; title: string; description: string; ageBand?: AgeBandId; icon?: string; }
interface Camp {
  _id: string; title: string; slug: string; season: string; theme: string;
  summary: string; heroImage: ResolvedImage; body: PortableText;
  ageRange: string; basePrice: number; included: string[]; packingList: string[];
  activities: Activity[]; sessions: CampSession[]; status: CampStatus; seo: SeoData;
}
interface CampSession {
  _id: string; label: string; campSlug: string;
  startDate: string; endDate: string; dailyStart: string; dailyEnd: string;
  capacity: number; price: number; status: SessionStatus;
  availability: Availability;                 // derived
}
interface Availability { capacity: number; booked: number; remaining: number; isFull: boolean; }

// ── Registration (form input ⇄ stored record) ──────────────────
interface ParentInfo { fullName: string; relationship: string; phone: string; email: string; address?: string; }
interface ChildInfo { fullName: string; dateOfBirth: string; gender?: string; allergies?: string; notes?: string; }
interface MedicalInfo { conditions?: string; medications?: string; doctorName?: string; doctorPhone?: string; insurer?: string; }
interface EmergencyContact { name: string; relationship: string; phone: string; }
interface Consents { photoConsent: boolean; medicalTreatmentConsent: boolean; termsAccepted: boolean; pickupAuthorization?: string; }
type RegistrationStatus = "pending" | "submitted" | "paid" | "waitlist" | "cancelled";
type PaymentGateway = "paystack" | "flutterwave" | "none";

interface CampRegistrationInput {       // collected by RHF, validated by Zod
  sessionId: string;
  parent: ParentInfo; children: ChildInfo[];
  medical: MedicalInfo; emergencyContacts: EmergencyContact[];
  consents: Consents;
}
interface CampRegistrationRecord extends CampRegistrationInput {  // persisted to Sanity
  _id: string; reference: string; status: RegistrationStatus;
  amount: number; gateway: PaymentGateway; createdAt: string; paidAt?: string;
}

// ── Action result (every server action) ────────────────────────
type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };
```

Scalability notes: `ProgramSummary`/`Pick` keep list queries lean; `Ref<T>` and
branded `ID` document intent without runtime cost; the registration **input vs
record** split lets the same Zod schema validate the form and the server action,
while the record adds server-owned fields (reference, status, payment).

---

## 5. Component Architecture (Task 5)

Inventory only — purpose of each, no implementation. Built on Shadcn primitives,
themed to CFC tokens.

### Layout
| Component | Purpose |
|---|---|
| `Header` | Sticky top nav; transparent-over-hero → solid on scroll; hosts primary CTA. |
| `Navigation` / `ProgramsMegaMenu` | Desktop nav + age-band-grouped Programs panel. |
| `MobileNav` | Full-screen overlay menu (Framer presence + stagger). |
| `Footer` | Sitemap columns, NAP/trust block, newsletter, legal. |
| `AnnouncementBar` | CMS-toggled, dismissible, scheduled banner. |
| `StickyMobileActionBar` | Persistent WhatsApp + Register on mobile. |
| `SmoothScrollProvider` | Lenis wiring + GSAP ticker sync. |

### CMS rendering
| Component | Purpose |
|---|---|
| `PortableText` | Typed serializers: headings, lists, marks, internal-ref links, embedded images, callouts. |
| `SectionRenderer` | Maps `page.sections[]` discriminated union → the right marketing block. |
| `RichImage` (`SmartImage`) | next/image wrapper with LQIP blur + art direction. |
| `BlockMedia` | Image/video block used inside Portable Text & sections. |

### Marketing
| Component | Purpose |
|---|---|
| `Hero` | Home/page hero — media, headline, layered CTAs, ambient motion. |
| `FeatureGrid` / `SplitFeature` | Program/value features (alternating image+copy). |
| `Pillars` | 3-up values (TAS pattern). |
| `Stats` | Animated count-up of real metrics. |
| `Testimonials` | Carousel/grid with author + child age + photo. |
| `CtaSection` | Reusable closing conversion band. |
| `GalleryTeaser` | Home → gallery bridge. |

### Camp
| Component | Purpose |
|---|---|
| `CampCard` | Session summary: dates, age, price, **availability**. |
| `CampGrid` | Filterable list of open sessions. |
| `AvailabilityIndicator` | "N spots left" / "Full" / waitlist — color-encoded urgency. |
| `SessionPicker` | Select a session inside the registration flow. |
| `RegistrationStepper` | Progress UI for the 6-step flow. |
| `RegistrationForm` | RHF orchestrator: step islands, per-step Zod validation, review, submit. |
| `RegistrationStep.*` | Parent / Child / Medical / Emergency / Consent / Review panels. |
| `ConfirmationPanel` | Post-submit success + next steps. |

### Shared / primitives (Shadcn-based)
| Component | Purpose |
|---|---|
| `Button` | Variants (primary/secondary/ghost) mapped to intent tokens. |
| `Card` | Surface primitive for programs/camps/gallery. |
| `Dialog`/`Modal`, `Sheet` | Lightbox, mobile nav, confirmations. |
| `Accordion` | FAQ. |
| `Tabs` | Program detail / gallery filters. |
| `Form` field set | Input/Select/Textarea/Checkbox/RadioGroup/DatePicker bound to RHF. |
| `Toast` | Submit success/error feedback. |
| `Tag`/`Badge` | Age bands, categories, spots-left. |
| `Skeleton` | Loading states. |
| `Breadcrumbs` | Program detail orientation. |

---

## 6. Camp Registration System (Task 6)

### 6.1 Flow (state machine)

```
Select Session → 1 Parent → 2 Child(ren) → 3 Medical → 4 Emergency
              → 5 Consent → 6 Review → Submit → Confirmation
```
- Single client island (RHF) holding the full form object; steps are views over
  one state. **Per-step validation** gates "Next"; "Back" never loses data.
- **Persistence:** autosave draft to `localStorage` (keyed by session) so a
  refresh/return resumes — important on flaky mobile connections.
- Multi-child supported (field array); pricing recomputes live.

### 6.2 Validation strategy (Zod + RHF)

- **One Zod schema per step** + a master `campRegistrationSchema` = composition of
  all steps. `@hookform/resolvers/zod` drives inline errors.
- The **same master schema runs server-side** in the action — the client can't be
  trusted; the action re-validates and re-checks availability.
- Field rules: DOB → age within camp `ageRange`; phone (NG format); email; at least
  one emergency contact; required consents must be `true`.

### 6.3 Database (Sanity) structure

`registration` document (write-only by server action) referencing `campSession`;
embeds parent/medical/consents objects + `children[]`. `reference` (stable id) is
the idempotency key. Sensitive medical data stored as plain fields now; flag for
encryption-at-rest / access-controlled dataset before go-live (see §6.7).

### 6.4 Sanity integration

1. Action validates input (Zod) → **re-checks availability** via GROQ
   (`capacity − count(confirmed)`); rejects if full → offer waitlist.
2. Generates `reference`; writes `registration` with `status: "submitted"` (or
   `"pending"` if payment will precede confirmation).
3. Availability is **always derived** from registration count — never mutated
   directly, so it can't drift.

### 6.5 Email workflow (Resend)

| Trigger | To | Content |
|---|---|---|
| On submit | Parent | Confirmation + summary + reference + what's next |
| On submit | Admin (`CONTACT_NOTIFY_EMAIL`) | New registration alert + Studio link |
| T-3 days (cron) | Parent | Reminder + packing list |
| On waitlist seat opens | Parent | Invitation to confirm |
React Email templates rendered via Resend; failures logged, never block the
user's success response (fire-and-forget with retry queue later).

### 6.6 Confirmation & admin

- User → `/camp-registration/confirmation?ref=…` (server-rendered summary).
- Admin → email alert + Studio "Registrations" inbox with status workflow
  (`submitted → paid → confirmed/cancelled`) and capacity badge per session.

### 6.7 Future-proofing for payment

- `registration` already carries `amount`, `gateway`, `status`, `paidAt`.
- Designed for the gateway-agnostic provider (Phase-1 `lib/payments`): on submit,
  create `pending` → redirect to gateway → **webhook** (`/api/webhooks/payment`)
  verifies & flips to `paid` → capacity counts paid. Adding payment = enabling the
  branch; the flow/schema don't change.
- Compliance hook: move medical/consent data to an access-restricted dataset or
  encrypt before collecting real data.

---

## 7. SEO Architecture (Task 7)

- **Metadata:** root defaults (Site Settings) + `generateMetadata` per dynamic
  route from each doc's `seo`; title template; canonical + `noIndex` per page.
- **Dynamic OG:** `/api/og` (`ImageResponse`) — branded per program/camp.
- **JSON-LD (per route):**
  - Global: `Organization` + `LocalBusiness`/`ChildCare` (NAP, geo, hours, sameAs).
  - Programs: `Course` / `Service`.
  - Camps: `Event` (per session: dates, location, offers/price).
  - FAQ: `FAQPage`. Programs/detail: `BreadcrumbList`. Blog (future): `Article`.
- **Sitemap:** `app/sitemap.ts` — static routes + `getProgramSlugs()` +
  `getCampSlugs()` (+ gallery collections); priorities/changefreq tuned.
- **Robots:** `app/robots.ts` — allow all, disallow `/studio`, `/camp-registration`
  (thin/transactional) & `/api`; point to sitemap.
- **Local SEO:** consistent NAP everywhere, embedded map, GBP alignment; target
  "playgroup/forest school/holiday camp Abuja", "homeschool Wuse 2".
- **Hygiene:** semantic headings, CMS-enforced `alt`, clean slugs, breadcrumb +
  internal linking (§1.4).

---

## 8. Performance Strategy (Task 8) — target Lighthouse 95+

- **Images:** next/image (AVIF/WebP), Sanity CDN transforms + LQIP blur, explicit
  sizes (no CLS), `priority` only on hero, lazy elsewhere. Unsplash placeholders
  keep the optimizer-bypass pattern (project memory).
- **ISR:** SSG + `revalidate` (60s default) + **on-demand** revalidation via Sanity
  webhook → fresh content without full redeploys or per-request CMS hits.
- **Caching:** Next Data Cache for GROQ; long-cache immutable assets; Vercel edge
  cache for static routes; tag-based invalidation aligned to doc types.
- **Sanity fetching:** narrow GROQ projections (only needed fields), `ProgramSummary`
  for lists, parallel `Promise.all` in layouts, single round-trip per route, CDN
  read client for published content.
- **Bundle:** Server Components by default; client islands only where interactive
  (nav, registration, carousels). Dynamic-import heavy/below-fold (GSAP timelines,
  Three.js ambient, lightbox). Tree-shake icons; route-level code-split (groups).
- **Animation:** transform/opacity only (GPU); `will-change` sparingly; GSAP
  `ScrollTrigger` cleanup per route; pause off-screen/ambient; **respect
  `prefers-reduced-motion`**; motion must not block INP or shift layout.
- **Fonts:** `next/font` (Fraunces + Inter), `display: swap`, subset, preconnect.
- **Budgets:** LCP < 2.5s (mobile 4G), CLS < 0.1, INP < 200ms, JS < ~170KB/route.

---

## 9. Motion System (Task 9)

Premium and **subtle** — Monkton/TAS restraint: things reveal, settle, and guide;
nothing bounces or shouts. Centralized tokens; three engines with clear ownership.

### 9.1 Engine split
| Engine | Owns |
|---|---|
| **Lenis** | Global smooth scroll (tuned lower on touch). |
| **Framer Motion** | Component & page-level: enter/exit (`AnimatePresence`), layout transitions, nav overlays, carousels, micro-interactions, list stagger. |
| **GSAP + ScrollTrigger** | Scroll-scrubbed/pinned: hero parallax, stat count-up, timeline draws, gallery scrub. |

### 9.2 Tokens (single source)
- **Duration:** fast 0.4s · base 0.6s · slow 0.9s.
- **Ease:** standard `[0.16,1,0.3,1]` (organic), entrance `power3.out`, gentle
  overshoot `back.out(1.4)` (sparing).
- **Stagger:** 0.06–0.1s.
- **Distance:** reveals rise 16–48px; never large jumps.

### 9.3 Patterns
| Pattern | Engine | Behavior |
|---|---|---|
| Page transitions | Framer | Subtle fade/slide between routes via `AnimatePresence` + template. |
| Scroll reveals | Framer `whileInView` / GSAP | Fade-up + clip on enter; once. |
| Stagger | Framer | Cards/lists cascade (0.08s). |
| Hero | GSAP | Parallax media drift + ambient (capped, paused off-screen). |
| Stat count-up | GSAP | Numbers tick on enter (fixes the old "0" bug). |
| Header | Framer/JS | Transparent→solid + shrink on scroll. |
| Nav overlay | Framer | Presence + staggered items. |
| Gallery | Framer + GSAP | Hover lift, eased lightbox (`layoutId`), optional scroll scrub. |
| Registration steps | Framer | Eased step transitions + progress fill. |
| Availability low | Framer | Gentle attention pulse. |

### 9.4 Governance
Centralized `motion.ts` tokens + Framer `variants` library; `useGSAP`/context
cleanup; `ScrollTrigger.refresh()` on route change; **global reduced-motion guard**
(disable transforms, keep instant states); motion changes must hold the §8 budgets.

---

## Deliverable index

1. **Architecture diagram** — §10 below.
2. **CMS architecture** — §3 (groups, fields, relationships, desk, lifecycle).
3. **Route structure** — §2.
4. **Type definitions** — §4.
5. **Component inventory** — §5.
6. **Registration system design** — §6.
7. **SEO plan** — §7.
8. **Performance plan** — §8.
9. **Motion system** — §9.

---

## 10. System architecture diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                              CLIENT (browser)                         │
│   RSC HTML + hydrated islands · Lenis · Framer Motion · GSAP          │
│   RHF + Zod (registration)                                            │
└───────────────▲───────────────────────────────────────▲─────────────┘
                │ HTML/ISR                                │ Server Actions (POST)
                │                                         │
┌───────────────┴─────────────────────────────────────────┴────────────┐
│                        NEXT.JS 15 (App Router) · Vercel                │
│  Route groups: (marketing) (legal) (registration)                     │
│  RSC pages ── lib/data (typed getters, fallback-first)                │
│  Server Actions ── Zod validate → write client → Resend               │
│  Route handlers: /api/revalidate  /api/og  /api/webhooks/payment      │
│  Metadata · sitemap · robots · JSON-LD                                │
└───────▲────────────────▲───────────────────▲───────────────▲─────────┘
        │ GROQ (CDN read) │ write (token)     │ email         │ (future) pay
        │                 │                   │               │
┌───────┴───────┐ ┌───────┴────────┐  ┌───────┴──────┐ ┌──────┴─────────┐
│  SANITY v4    │ │ SANITY write   │  │   RESEND     │ │ Paystack /     │
│  content lake │ │ (registrations)│  │  (txn email) │ │ Flutterwave    │
│  + Studio     │ │                │  │              │ │ (gateway-agnos)│
│  + webhook ───┼─┘                │  └──────────────┘ └────────────────┘
│  → /api/revalidate (on-demand ISR)                                     │
└────────────────────────────────────────────────────────────────────────┘

Data flow:  Publish in Studio → webhook → on-demand ISR → CDN-cached RSC.
Register:   Form (RHF/Zod) → action (re-validate + availability) → write doc
            → Resend (parent + admin) → confirmation. Payment slots in pre-confirm.
Availability is ALWAYS derived: capacity − count(confirmed registrations).
```

---

## Decisions locked (2026-06-23)

1. **Hosting → Vercel.** Remove `netlify.toml`; use native ISR, Image optimization, Edge, and cron (camp T-3 reminders).
2. **Tailwind → migrate to v4 now.** Move tokens into `@theme` in `globals.css`; delete `tailwind.config.ts`. Do this before any pages exist.
3. **Sanity → stay on v4** (no hard v3 requirement; schemas are `defineType`, forward-compatible).
4. **Sanity project → fresh CFC project.** New project + dataset; new project ID + Editor write token in `.env.local` (stop reusing Phase-1 `ez2hs7su`).
5. **Medical data → restricted dataset from the start.** Store `registration` docs in an access-controlled/private dataset; plan encryption-at-rest before collecting real data.
```
