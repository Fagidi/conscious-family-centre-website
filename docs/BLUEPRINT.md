# Conscious Family Centre — Website Blueprint

> Strategic & design blueprint for the CFC website rebuild.
> Stack target: Next.js 15 (App Router) · Sanity CMS · GSAP · Lenis · Tailwind · TypeScript.
> Status: **Awaiting final approval — no implementation code to be written until signed off.**

### Decisions locked (2026-06-23)
- **Payments:** gateway-agnostic. Build a `PaymentProvider` abstraction with **both Paystack and Flutterwave** adapters; flow code never imports a gateway directly.
- **Repo:** **repurpose this existing repo** (currently `sarai-photo-booth`) into CFC in place — reuse the Next 15 + Sanity + GSAP + Lenis stack; rename package/metadata, replace content model & components.
- **Phase 1 scope:** **Foundation** — design tokens, Tailwind theme, typography, layout primitives, Lenis/GSAP providers, Sanity schemas + Studio structure.

---

## 0. Context & Reference Audit

**Subject:** Conscious Family Centre (CFC) — a nature-connected alternative education & playgroup serving children ages 0–10 in Wuse 2, Abuja, Nigeria. Programs: Stay & Play, Homeschool Hub & Community, Nanny Intensive Training, Holiday Camps (STEAM), Forest School, Creative Arts, Enrichment Clubs, and "Waka Wednesday" excursions.

**Reference sites analysed:**
- **Monkton Combe School (Bath, UK)** — premium independent prep + senior school. IA model: "Monkton Approach" (ethos) → "Prep 2–13" → "Senior 13–18" → Admissions → Community hubs (Parents/Staff/Pupils/Alumni). Strengths to borrow: values-led storytelling, age-stage navigation, distinct community/portal areas, "Wild Monkton" outdoor-learning sub-brand (directly analogous to CFC's forest school).
- **Trinity Anglican School (Cairns, QLD)** — IA: Our School / Student Experience / Enrolment / Key Information + "My TAS" portals. Strengths to borrow: **values-first homepage** ("Inspiring the curious"), stage-based learning ladder (Early Learning → Primary → Secondary), **persistent "Enrol Today" CTA**, layered conversion CTAs ("Book a Tour" → "Apply Now"), experiential framing ("the best way to understand TAS is to experience it").

**The core transformation:** CFC today is a brochure site (contact = phone + Instagram only, placeholder "0" stat counters, no forms, no pricing, no registration). The rebuild must convert it into a **conversion-driven platform** with two transactional spines: **Camp Registration** and **Membership Admissions (Enrolment)** — wrapped in the aspirational, narrative-driven polish of a premium independent school.

---

## 1. UX Audit (current site)

Heuristic review (Nielsen + conversion lens). Severity: 🔴 Critical · 🟠 Major · 🟡 Minor.

| # | Finding | Severity | Impact |
|---|---------|----------|--------|
| 1 | **No registration or booking system.** "Booking recommended" but the only path is phone/DM. Every conversion leaks to an off-site, high-friction channel. | 🔴 | Lost revenue; no funnel; no data capture. |
| 2 | **No pricing/fees anywhere.** Parents cannot self-qualify. | 🔴 | Drop-off; only motivated callers convert. |
| 3 | **Placeholder stat counters show "0"** ("Families Served", "Core Programs"). Actively erodes trust. | 🔴 | Looks broken/unfinished. |
| 4 | **No admissions/enrolment journey.** Homeschool Hub has no "how to join", age criteria, term dates, or intake steps. | 🔴 | High-value membership has no path. |
| 5 | **Thin program detail.** No session length, group size, ratios, curriculum framework, or what a day looks like. | 🟠 | Parents can't evaluate fit. |
| 6 | **No staff/credentials/safeguarding info.** For under-10s childcare this is a primary trust driver. | 🟠 | Trust gap vs. premium peers. |
| 7 | **Gallery is teased, not integrated;** lives on a separate static `gallery.html`. | 🟠 | Weak emotional proof; the product *is* the experience. |
| 8 | **Single contact channel, no form, no map embed, no directions.** Address is text-only. | 🟠 | Friction for a physical-location business. |
| 9 | **Only 3 testimonials, no names/photos/context;** no case studies or video. | 🟡 | Limited social proof depth. |
| 10 | **No events/term calendar** despite varying holiday hours and seasonal camps. | 🟠 | Camps are time-critical; no urgency surfaced. |
| 11 | **Emoji used as program iconography.** Reads informal vs. the premium positioning we're targeting. | 🟡 | Brand maturity. |
| 12 | **No SEO foundation** (likely thin meta, no structured data, no local SEO for "Abuja"/"Wuse 2"). | 🟠 | Invisible to high-intent local search. |
| 13 | **No accessibility considerations** evident (contrast, focus states, alt text, semantic landmarks). | 🟠 | Excludes users; legal/ethical. |
| 14 | **Mobile-first reality ignored** — Nigerian audience is overwhelmingly mobile + data-conscious; heavy/untuned assets hurt. | 🟠 | Performance = bounce. |

**Top 5 to fix first:** registration system, transparent pricing, real stats/credibility, admissions journey, integrated visual storytelling.

---

## 2. Content Audit

### What exists (keep / rewrite)
| Content | Verdict | Action |
|---|---|---|
| Mission/Vision | Keep | Tighten into a values-led "Our Philosophy" narrative. |
| 6 program blurbs | Rewrite | Expand each into a full program page (see schema). |
| 3 testimonials | Augment | Re-collect with name, child age, photo/consent; add video. |
| FAQ (6 items) | Expand | Split into Camps FAQ, Membership FAQ, General FAQ. |
| Contact details | Keep | Add form, map, WhatsApp deep link, directions. |
| Gallery | Replatform | Move into Sanity, tag by program, embed across site. |

### What's missing (create)
- **Pricing & fees** (per program: drop-in, term, camp week, sibling discount).
- **A "Day in the Life"** narrative per program (the experiential framing TAS/Monkton use).
- **Staff & founder profiles** + qualifications + safeguarding statement.
- **Ratios, group sizes, age bands, term dates.**
- **Admissions/enrolment process** (Homeschool Hub).
- **Camp landing pages** (per season) with dated sessions + register CTA.
- **Real outcome stats** (families served, years running, excursions run).
- **Blog/Resources** (conscious parenting, play-based learning) — SEO + authority.
- **Policies:** safeguarding, refund/cancellation, privacy, health & medical.
- **Trust assets:** accreditations/affiliations, press, partnerships.

### Voice & tone
Warm, intentional, confident — "conscious parenting" without preachiness. Borrow the premium-school cadence ("Every child has more in them than they know") but keep it Nigerian, grounded, and parent-to-parent. Replace emoji with a custom icon set.

---

## 3. Information Architecture

Hybrid of the two references: **values-led top nav** + **age/program ladder** + **transactional CTAs always visible** + **community/portal split**.

**Primary navigation (desktop):**
1. **About** — Our Story · Philosophy & Approach · Our Team · Safeguarding · Gallery
2. **Programs** — (mega-menu, grouped by age & type)
   - *By age:* Little Ones (0–3) · Explorers (3–6) · Big Kids (6–10)
   - *Core:* Stay & Play · Homeschool Hub · Forest School · Enrichment Clubs · Waka Wednesday · Creative Arts
   - *For caregivers:* Nanny Intensive Training
3. **Camps** — Upcoming Camps · How Camps Work · Camp FAQ
4. **Admissions** — Why CFC · The Enrolment Journey · Fees · Term Dates · Apply / Enquire
5. **Resources** — Blog · Parent Guides · FAQ
6. **Contact** — Visit Us (map/directions) · Book a Tour · WhatsApp

**Persistent CTAs (top-right, sticky header):** `Book a Tour` (secondary) + `Register / Enrol` (primary). On camp pages the primary swaps to `Register for Camp`.

**Utility/footer zone:** Parent area (future portal), term dates, fees, policies, socials, newsletter.

**Mobile:** full-screen overlay menu (GSAP staggered reveal), accordion groups, sticky bottom action bar with `WhatsApp` + `Register`.

---

## 4. Sitemap

```
/                                   Home (values-first, stage ladder, camp banner)
/about
  /about/story
  /about/philosophy
  /about/team
  /about/safeguarding
  /gallery
/programs                           Overview (filter by age/type)
  /programs/stay-and-play
  /programs/homeschool-hub
  /programs/forest-school
  /programs/enrichment-clubs
  /programs/waka-wednesday
  /programs/creative-arts
  /programs/nanny-training
/camps                              Camps hub (lists active CampSession docs)
  /camps/[slug]                     Individual camp (e.g. summer-steam-2026)
  /camps/how-it-works
  /camps/[slug]/register            Camp registration flow
  /camps/confirmation               Post-payment success
/admissions
  /admissions/why-cfc
  /admissions/journey
  /admissions/fees
  /admissions/term-dates
  /admissions/apply                 Membership enquiry/application flow
/resources
  /resources/blog
  /resources/blog/[slug]
  /resources/guides
  /faq
/contact
  /contact/book-a-tour
/legal/privacy  /legal/safeguarding  /legal/refund-policy  /legal/terms
/studio                             Sanity Studio (embedded)
404 / not-found
```

---

## 5. Design Strategy

**Positioning statement:** *"The premium feel of a top independent school, rooted in Nigerian soil and the freedom of nature-based play."* We're elevating a beloved local centre to look as trustworthy and aspirational as Monkton/TAS — while staying warm, human, and unmistakably Abuja.

**Strategic pillars**
1. **Trust through transparency** — pricing, ratios, credentials, safeguarding up front (fixes the #1–#6 audit gaps).
2. **Experiential storytelling** — show the day, the dirt, the joy. Photography + motion carry conviction the way galleries don't on the current site.
3. **Frictionless conversion** — every program ends in one obvious action; camps/admissions are real, payable flows.
4. **Nature as the design language** — organic shapes, earth palette, generous space, natural motion (sway/grow, not snap).
5. **Mobile-first & data-light** — the audience is on phones, often on metered data. Performance is a feature.

**Design principles:** Calm, not busy · Confident, not corporate · Tactile & organic · Child-joy with grown-up polish · Accessible by default (WCAG AA).

---

## 6. Design System

### Color
Earth-and-foliage palette (extends the current green direction, adds warmth and depth).

| Token | Hex | Use |
|---|---|---|
| `--forest-900` | `#1F3A2E` | Headlines, footer, deep backgrounds |
| `--forest-700` | `#2F5D45` | Primary brand green |
| `--leaf-500` | `#5C8A4A` | Primary buttons, accents |
| `--sage-200` | `#CDE0C4` | Soft section backgrounds |
| `--clay-500` | `#C97B4A` | Secondary/warm CTA, camp accent |
| `--sun-400` | `#E8B23A` | Highlights, badges, "limited spots" |
| `--cream-50` | `#FBF7EF` | Page background (off-white, warm) |
| `--bark-700` | `#4A3B2E` | Body text on light |
| `--ink-900` | `#1A1A17` | Max-contrast text |
| `--mist-100` | `#FFFFFF` | Cards/surfaces |

Semantic: success=leaf, warning=sun, error=`#B4452F`, info=forest. All pairings verified ≥ 4.5:1 for body, ≥ 3:1 for large/UI.

### Typography
- **Display/Headings:** a warm humanist serif (e.g. *Fraunces* or *Source Serif*) — premium-school gravitas with personality.
- **Body/UI:** a clean geometric-humanist sans (e.g. *Inter* or *General Sans*) — legible at small sizes on mobile.
- **Scale (fluid, clamp-based):** Display 3rem→4.5rem · H1 2.25→3rem · H2 1.75→2.25 · H3 1.375→1.625 · Body 1rem/1.0625 · Small 0.875. Line-height 1.5 body / 1.15 display.

### Spacing & layout
- 4px base; scale 4/8/12/16/24/32/48/64/96/128.
- Container max 1200px content / 1440px full; gutters 20px mobile → 48px desktop.
- 12-col grid desktop, 4-col mobile.
- **Radius:** organic — cards 16–24px, pills full, "blob" masks for hero/feature imagery.
- **Elevation:** soft, low-spread, warm-tinted shadows (no harsh black).

### Other tokens
- **Borders:** 1px `--sage-200` hairlines; 2px focus ring `--leaf-500` w/ offset.
- **Imagery treatment:** rounded/blob masks, subtle grain overlay, warm color grade.
- **Iconography:** custom line-icon set (replaces emoji) — leaf, sprout, sun, paint, compass (Waka), tent (camp).
- **Breakpoints:** 360 / 640 / 768 / 1024 / 1280 / 1536.

---

## 7. Component Inventory

**Global / layout**
- `Header` (sticky, transparent-over-hero → solid on scroll, GSAP) with dual CTA
- `MegaMenu` (Programs, grouped) · `MobileNav` (full-screen overlay)
- `Footer` (sitemap, newsletter, socials, term dates, policies)
- `StickyMobileActionBar` (WhatsApp + Register)
- `AnnouncementBanner` (camp/intake — Sanity-driven, dismissible)
- `Breadcrumbs` · `SkipLink` · `SmoothScrollProvider` (Lenis)

**Hero / section**
- `HeroVideoOrImage` (blob mask, parallax) · `PageHero` (inner pages)
- `ValuePillars` (3-up, TAS-style) · `StageLadder` (age-band cards 0–3/3–6/6–10)
- `StatCounter` (real animated numbers) · `SplitFeature` (image + copy, alternating)
- `PhilosophyNarrative` (scroll-reveal prose)

**Program / content**
- `ProgramCard` · `ProgramGrid` (filter by age/type) · `ProgramDetailLayout`
- `DayInTheLife` (timeline) · `RatioAgeBadge` · `WhatToBringList`
- `PricingTable` / `PriceCard` (drop-in / term / camp) · `FeesTable`

**Camps & admissions**
- `CampCard` (date, age, spots-left, price) · `CampGrid`
- `SpotsRemaining` (urgency, Sun accent) · `SessionPicker`
- `RegistrationForm` (multi-step: child → guardian → sessions → review → pay)
- `AdmissionsTimeline` (enrolment journey steps) · `EnquiryForm` · `TourBookingForm`
- `PaystackButton` / `PaymentStep` · `ConfirmationPanel`

**Social proof / media**
- `TestimonialCarousel` (name, child age, photo) · `VideoTestimonial`
- `GalleryMasonry` (tag-filtered) · `Lightbox`
- `TeamCard` / `TeamGrid` · `LogoStrip` (affiliations)

**Engagement / utility**
- `FAQAccordion` (category-scoped) · `EventCalendar` / `TermDates`
- `BlogCard` / `BlogGrid` / `ArticleLayout` · `NewsletterSignup`
- `MapEmbed` + `Directions` · `WhatsAppCTA` · `CTASection` (reusable band)
- `Toast` · `FormField` set · `Button` (primary/secondary/ghost/clay) · `Tag/Badge`

---

## 8. User Journeys

**Personas**
- **Amara — Working mum (0–3):** wants safe, enriching Stay & Play near Wuse 2; values ratios, hygiene, hours, ease of drop-in.
- **Tunde & Zainab — Homeschooling family (6–10):** evaluating Homeschool Hub membership; need curriculum, community, term dates, fees, fit.
- **Chioma — Camp seeker (parent of 6yo):** holiday looming; wants dates, price, what's included, and to **register + pay in one sitting on her phone**.
- **Ngozi — Nanny/employer:** seeking Nanny Intensive Training cohort dates and certification.

**Key flows**

1. **Camp registration (Chioma) — primary conversion**
   `Instagram/Search → /camps → CampCard (sees dates, spots-left, price) → /camps/summer-steam-2026 → "Register" → multi-step form (child details → guardian/emergency/medical → pick session(s) → review + consent → Paystack pay) → confirmation page + email/WhatsApp receipt → Sanity registration record created.`
   Design goals: ≤ 5 minutes, mobile-first, autosave, visible progress, spots decrement on success.

2. **Membership admission (Tunde & Zainab)**
   `/programs/homeschool-hub → /admissions/journey (timeline) → /admissions/fees → "Apply/Enquire" → enquiry form → confirmation + "we'll contact you" → CFC follow-up + optional tour booking → enrolment.`
   Design goals: build trust before the ask; tour as the experiential close (TAS pattern).

3. **Stay & Play discovery (Amara)**
   `Home → Programs (age filter: 0–3) → Stay & Play detail (ratios, hours, day-in-life, price) → "Book a visit" or WhatsApp → drop-in.`

4. **Trust/validation (any persona)**
   `Any page → About/Team/Safeguarding + Gallery + Testimonials → reassured → CTA.`

Every journey: max 2 clicks to a CTA, persistent header actions, WhatsApp as low-friction fallback.

---

## 9. Camp Registration Strategy

**Goal:** turn camps into a self-serve, paid, capacity-managed product (today: zero online path).

**Model**
- Each camp = a Sanity `campSession` (title, season, theme, age band, daily schedule, dates, **capacity**, price, sibling discount, what's-included, packing list, status).
- Capacity managed server-side; `SpotsRemaining = capacity − confirmedRegistrations`. Show "Only N spots left" (Sun accent) for urgency.

**Registration flow (multi-step, mobile-first)**
1. **Select** session(s)/week(s) + number of children.
2. **Child details** — name, age/DOB, allergies, medical notes, photo consent.
3. **Guardian** — name, phone, email, emergency contact, pickup authorization.
4. **Review & consent** — summary, policies, refund terms, code of conduct checkbox.
5. **Pay** — via a **gateway-agnostic `PaymentProvider`** with **Paystack + Flutterwave** adapters (cards, bank transfer, USSD — local-first); price reflects sibling/early-bird discounts. Flow code calls the provider interface, never a specific SDK.
6. **Confirm** — success page + email + WhatsApp confirmation; record written to Sanity with `paid` status.

**Capacity & integrity**
- Validate availability server-side at payment time (Next.js Route Handler) to prevent oversell.
- Webhook from Paystack → verify → create `campRegistration` (status `paid`) → decrement availability → trigger emails.
- Waitlist when full (capture + notify on cancellation).

**Pricing levers:** early-bird, sibling discount, multi-week bundle, member discount.
**Admin:** registrations visible in Sanity Studio (filter by camp, paid/waitlist, export CSV for attendance).
**Comms:** confirmation, reminder (T-3 days w/ packing list), post-camp thank-you + photo-gallery link + review request.

---

## 10. Admissions Strategy (Homeschool Hub & ongoing programs)

Borrow the premium-school enrolment funnel (TAS "Enrol Today" + Monkton "Admissions Journey"), adapted to membership not annual enrolment.

**Funnel**
`Awareness (program pages, blog, social) → Consideration (Why CFC, philosophy, fees, term dates, testimonials) → Enquiry (form) → Connection (CFC reply + tour) → Enrolment (place offered, deposit) → Onboarding (welcome pack, first day).`

**On-site components**
- **`/admissions/why-cfc`** — values-first case (TAS-style pillars + outcomes + ratios + safeguarding).
- **`/admissions/journey`** — visual `AdmissionsTimeline` (5 clear steps; "made as simple as possible").
- **`/admissions/fees`** — transparent term fees, what's included, payment plans, sibling discounts.
- **`/admissions/term-dates`** — Sanity-driven calendar.
- **`/admissions/apply`** — enquiry/application form (child, age, program interest, preferred start, message) → Sanity `admissionEnquiry` + email alert to CFC.
- **`Book a Tour`** — experiential close ("the best way to understand CFC is to experience it"); date/time request form.

**Tour as conversion engine:** the tour is the equivalent of the school open day — primary mid-funnel CTA, repeated with decreasing prominence down the page (TAS pattern).

**Nanny Intensive Training** runs a parallel lighter funnel: cohort dates → curriculum/certification → apply + pay deposit (reuse registration components).

---

## 11. Sanity CMS Architecture

**Project:** reuse existing Sanity project; new content model. Studio embedded at `/studio`. Typed GROQ via `next-sanity`.

**Document types**
```
siteSettings (singleton)   logo, contact, address, geo, hours, socials, WhatsApp,
                           default SEO, announcement banner (active/text/link)
navigation (singleton)     header groups, mega-menu structure, footer columns

program                    title, slug, ageBand[], type, summary, hero, body (PT),
                           dayInTheLife[], ratio, groupSize, schedule, pricing[],
                           whatToBring[], gallery[], faqs[ref], cta, seo
campSession                title, slug, season, theme, ageBand, startDate, endDate,
                           dailySchedule, capacity, priceNGN, earlyBirdPrice,
                           siblingDiscount, included[], packingList[], status, seo
campRegistration           camp[ref], children[{name,dob,allergies,medical,consent}],
                           guardian{name,phone,email,emergency}, sessions[],
                           amountPaid, paystackRef, status(pending|paid|waitlist|cancelled),
                           createdAt
admissionEnquiry           childName, age, programInterest[ref], preferredStart,
                           guardian{...}, message, status(new|contacted|enrolled|closed)
tourBooking                guardian{...}, preferredDates[], partySize, status
teamMember                 name, role, photo, bio, qualifications[], order
testimonial                quote, authorName, childAge, photo, program[ref], video, consent
galleryItem                image, caption, tags[], program[ref], date
post (blog)                title, slug, excerpt, cover, author[ref], body(PT), categories[], seo
guide                      title, slug, summary, file/body, topic
faq                        question, answer(PT), category(camps|membership|general)
termDate / event           title, type, startDate, endDate, description
page (flexible)            slug, sections[] (page-builder: hero, pillars, splitFeature,
                           ctaBand, gallery, testimonials, faq, stats…) for marketing pages
policy                     title, slug, body(PT)   // privacy, safeguarding, refund, terms
```

**Reusable objects:** `seo`, `cta`, `priceTier`, `ageBand`, `portableTextBody`, `imageWithAlt`, `link`.
**Page-builder pattern:** `page.sections[]` array of section objects → editors compose marketing pages without dev. Programs/camps are structured docs (not freeform) so transactional data stays clean.
**Studio structure:** custom desk — Settings · Programs · Camps (Sessions / Registrations) · Admissions (Enquiries / Tours / Term Dates) · People & Proof (Team / Testimonials / Gallery) · Content (Pages / Blog / Guides / FAQ) · Policies.
**Stock-image note (per project memory):** use `imageWithAlt` + `@sanity/image-url`; respect the existing Unsplash optimizer-bypass pattern for any placeholder imagery.

---

## 12. SEO Strategy

**Foundations**
- Next 15 Metadata API per route; dynamic OG images for camps/programs.
- `sitemap.ts` + `robots.ts`; canonical URLs; clean slugs.
- **Structured data (JSON-LD):** `Organization` + `LocalBusiness`/`ChildCare` (NAP, geo, hours), `Event` for each `campSession`, `Course` for training, `FAQPage`, `BreadcrumbList`, `Article` for blog.

**Local SEO (high priority — physical Abuja business)**
- Optimize for "playgroup Abuja", "forest school Abuja", "homeschool community Wuse 2", "holiday camp for kids Abuja", "nanny training Abuja".
- Consistent NAP everywhere; Google Business Profile alignment; embedded map + directions.

**Content SEO**
- Blog/Guides target conscious-parenting & play-based-learning queries (authority + long-tail).
- Each program/camp page = a landing page for its intent; FAQ schema for rich results.

**Technical/perf (ranking + UX)**
- next/image (AVIF/WebP, responsive, lazy), font preloading, route-level code-split.
- Core Web Vitals budget: LCP < 2.5s on 4G mobile, CLS < 0.1, INP < 200ms.
- Lenis/GSAP must not block input or cause layout shift; respect `prefers-reduced-motion`.
- Semantic HTML, alt text from Sanity, proper headings — accessibility = SEO.

**Measurement:** GA4 + event tracking on CTAs (register start/complete, enquiry, tour, WhatsApp); funnel drop-off dashboards.

---

## 13. Motion Design System

Powered by **GSAP + ScrollTrigger** and **Lenis** smooth scroll (both already in stack). Theme: *natural motion* — things grow, sway, and settle; nothing snaps or bounces aggressively.

**Principles**
- Purposeful (guides attention, never decoration-only) · Organic easing · Calm pace · Performance-safe (transform/opacity only) · **`prefers-reduced-motion` fully honored** (disable transforms, keep instant states).

**Easing & timing**
- Standard: `power2.out` ~0.6s · Entrances: `power3.out` 0.7–0.9s · Playful (child-joy accents): gentle `back.out(1.4)`, used sparingly.
- Stagger: 0.06–0.1s for lists/cards.

**Pattern library**
| Pattern | Where | Behavior |
|---|---|---|
| Smooth scroll | Global | Lenis, tuned for mobile (lower lerp on touch). |
| Header transform | Global | Transparent-over-hero → solid + shrink on scroll. |
| Hero parallax | Home/page heroes | Blob-masked image drifts slower than text; subtle. |
| Section reveal | All sections | Fade-up + clip-reveal as they enter viewport. |
| Stat count-up | Stats band | Numbers tick to real values on enter (replaces "0" bug). |
| Card stagger | Program/camp grids | Staggered fade-up on scroll. |
| Stage-ladder draw | Age ladder | Connecting line draws + cards reveal in sequence. |
| Mega-menu / mobile nav | Nav | Staggered item reveal, eased height/overlay. |
| Timeline progress | Admissions journey | Steps illuminate as you scroll. |
| Gallery hover/lightbox | Gallery | Scale + soft shadow; eased lightbox open. |
| Multi-step form | Registration | Eased step transitions + progress bar fill. |
| Spots-left pulse | Camp cards | Gentle attention pulse when low. |
| Button micro-interactions | Global | Subtle lift/press; focus-visible ring. |
| Optional ambient | Hero | Lightweight floating leaves/particles (Three.js or SVG) — capped, paused off-screen & on reduced-motion. |

**Governance:** centralized motion tokens (durations/eases), a `useGsapContext` cleanup pattern, ScrollTrigger refresh on route change, and a hard budget — no animation may regress the CWV targets in §12.

---

## Implementation Phasing (proposed, for after approval)

1. **Foundation** — design tokens, Tailwind theme, typography, layout primitives, Lenis/GSAP providers, Sanity schemas + Studio structure.
2. **Marketing spine** — Home, About/Team/Safeguarding, Programs (overview + details), Gallery, Contact, SEO/metadata.
3. **Conversion spine** — Camps hub + detail + registration + Paystack + webhook + confirmation; Admissions journey + enquiry + tour booking.
4. **Content & polish** — Blog/Guides, FAQ, term dates/calendar, testimonials/video, motion pass, accessibility + CWV hardening, analytics.

---

*End of blueprint. Awaiting approval before any implementation.*
