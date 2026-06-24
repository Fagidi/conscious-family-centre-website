# Conscious Family Centre — Project Architecture

Companion to [BLUEPRINT.md](BLUEPRINT.md). This documents the **scaffolded
architecture** (now in the repo). Pages are intentionally **not built yet** —
this is the foundation they slot into.

Stack: Next.js 15 (App Router) · Sanity CMS · GSAP + Lenis · Tailwind · TypeScript.
Repo repurposed from `sarai-photo-booth`; stack-level pieces (smooth scroll,
animation primitives, Studio mount, Netlify config) were kept.

---

## 1. Folder structure (current)

```
app/
  layout.tsx                      Root: Fraunces+Inter fonts, global metadata (from CMS)
  globals.css                     Tailwind layers + base/canvas/focus/reduced-motion
  not-found.tsx  robots.ts  sitemap.ts
  (site)/layout.tsx               Public shell: SmoothScroll → Banner → Header → main → Footer → MobileBar
  api/webhooks/paystack/route.ts        Payment webhook (HMAC verify → fulfil)
  api/webhooks/flutterwave/route.ts     Payment webhook (hash verify → fulfil)
  studio/[[...tool]]/page.tsx     Embedded Sanity Studio (kept)

components/
  ui/            Primitives: Button, Container, Section, SectionHeading, Tag, Field, SmartImage
  layout/        Header, MobileNav, Footer, AnnouncementBanner, StickyMobileActionBar
  shared/        CtaSection, PageHero, WhatsAppCTA
  animation/     Reveal, TextReveal, ImageReveal, Parallax   (kept — GSAP primitives)
  providers/     SmoothScroll (Lenis + GSAP ticker)          (kept)
  three/         AmbientParticles                            (kept)

lib/
  types.ts        All domain + transactional + page-builder types (the contract)
  constants.ts    Taxonomy: age bands, program labels/slugs
  utils.ts        cn, formatNaira, formatDate(Range), slugify, generateReference, whatsappLink
  motion.ts       Motion tokens (duration/ease/stagger), Lenis opts, reduced-motion
  content.ts      Curated fallback content (site settings + navigation)
  data.ts         DATA ACCESS LAYER — the only read surface (server-only)
  notify.ts       Team/customer notifications (Resend seam; no-ops until keyed)
  sanity/         env · client (read+write+fallback) · image (urlFor) · queries (GROQ)
  payments/       types (PaymentProvider) · paystack · flutterwave · index (factory) · fulfil
  actions/        registerForCamp · submitEnquiry · bookTour · sendContactMessage · subscribeNewsletter
  validation/     Dependency-free field validators (swap for zod later)

sanity/
  schemas/objects/      shared (image/seo/cta/priceTier/scheduleItem) · people · sections (page builder)
  schemas/documents/    learning (program, campSession) · forms · proof · editorial
  schemas/singletons/   settings (siteSettings, navigation)
  schemas/index.ts      Schema registry
  structure.ts          Studio desk layout
```

---

## 2. Route structure (to be built)

Route groups & dynamic segments are defined; page files come in later phases.
Full tree in [BLUEPRINT §4](BLUEPRINT.md). App Router mapping:

| Route | Source | Notes |
|---|---|---|
| `/` | `app/(site)/page.tsx` | Home (page-builder driven) |
| `/about/*`, `/gallery` | `app/(site)/about/...` | Static + CMS |
| `/programs` · `/programs/[slug]` | `app/(site)/programs/[slug]/page.tsx` | `generateStaticParams` from `getProgramSlugs()` |
| `/camps` · `/camps/[slug]` | `app/(site)/camps/[slug]/page.tsx` | params from `getCampSlugs()` |
| `/camps/[slug]/register` | `.../register/page.tsx` | Multi-step form → `registerForCamp` |
| `/camps/confirmation` | `.../confirmation/page.tsx` | Reads `?ref=` after gateway redirect |
| `/admissions/*` | `app/(site)/admissions/...` | `apply` → `submitEnquiry` |
| `/resources/blog` · `/blog/[slug]` · `/guides` · `/faq` | editorial | params from `getPosts()` |
| `/contact` · `/contact/book-a-tour` | contact | `sendContactMessage` / `bookTour` |
| `/legal/[slug]` | `app/(site)/legal/[slug]/page.tsx` | `getPolicy(slug)` |
| `/api/webhooks/{paystack,flutterwave}` | route handlers | **built now** (infra, not pages) |
| `/studio/[[...tool]]` | Studio | built |

Routing conventions: each `[slug]` page exports `generateStaticParams` +
`generateMetadata` (from the doc's `seo`), with ISR via the 60s revalidate in
the data layer.

---

## 3. CMS integration strategy

**Read path (the only surface pages touch):** components/pages call typed
getters in `lib/data.ts` → GROQ in `lib/sanity/queries.ts` → `lib/sanity/client`.

- **Fallback-first.** `fetchWithFallback` merges a published document over
  curated fallback **field-by-field** (a half-finished doc never blanks a
  section). `fetchList` returns `[]` for absent collections; `fetchOne` returns
  `null`. The site renders whole before any document exists.
- **Images resolve in-query** to `{ src, alt, lqip }` so CMS and fallback are
  interchangeable; `urlFor` is available for on-the-fly transforms. Stock
  imagery uses `next/image` remotePatterns (Unsplash optimizer-bypass pattern).
- **Revalidation:** all reads use `next: { revalidate: 60 }` — published edits
  go live without redeploy.
- **`server-only`** on `data.ts` and the write client keeps the token off the
  client bundle.

**Write path:** server actions & webhooks use a separate **write client**
(`writeClient`, no CDN, Editor token). Capacity for camps is computed in GROQ
(`capacity − count(paid registrations)`), so seats are enforced at fulfilment.

**Content model split:** transactional data (programs, camps, registrations)
are **structured documents**; marketing pages use the **page-builder** (`page.sections[]`
union) so editors compose layouts without dev. Studio desk (`sanity/structure.ts`)
groups: Settings · Programs · Camps (Sessions/Registrations) · Admissions
(Enquiries/Tours/Term Dates) · People & Proof · Content · Policies.

---

## 4. Server action strategy

All mutations are **server actions** returning a discriminated
`ActionResult<T>` (`{ ok:true, data } | { ok:false, error, fieldErrors }`),
so forms render inline errors and a top-level message uniformly.

Pipeline (every action): **validate** (`lib/validation`) → **guard** (write
client present, else WhatsApp fallback message) → **persist** to Sanity →
**notify** (`lib/notify`) → return result.

| Action | Persists | Side effects |
|---|---|---|
| `registerForCamp` | `campRegistration` (`pending`) | re-checks live availability, prices (early-bird + sibling), inits gateway, returns checkout URL |
| `submitEnquiry` | `admissionEnquiry` (`new`) | team email |
| `bookTour` | `tourBooking` (`new`) | team email |
| `sendContactMessage` | `contactMessage` | team email |
| `subscribeNewsletter` | `subscriber` (idempotent) | (ESP later) |

**Payments are gateway-agnostic.** Actions/webhooks depend only on the
`PaymentProvider` interface (`lib/payments/types.ts`); `getPaymentProvider()`
returns the Paystack or Flutterwave adapter (default via `PAYMENT_PROVIDER`).
Only `lib/payments/*` imports vendor APIs.

**Camp fulfilment (source of truth = the gateway, not the webhook):**
1. `registerForCamp` writes a `pending` record + a stable `reference`, returns the hosted checkout URL.
2. User pays; gateway redirects to `/camps/confirmation?ref=…`.
3. Gateway webhook → `route.ts` verifies the **signature** → `fulfilRegistration`
   **re-verifies** with the gateway API → flips record to `paid` (idempotent) →
   sends confirmations. The paid count is what decrements availability.

This keeps capacity correct under races (verify-at-fulfilment), survives missed
redirects (webhook is authoritative), and never double-charges or double-books
(idempotent on `reference` + `status`).

---

## 5. Status & next phase

- ✅ Tokens, types, CMS layer, payments, server actions, schemas, Studio desk, shared primitives, app shell — **typecheck passes (0 errors)**.
- ⏭️ **Phase 2 (pages):** build `app/(site)/*` pages against this foundation, starting with the page-builder Home and the Programs/Camps routes.
- 🔌 **Before camps go live:** install/connect Sanity project + write token; add Paystack/Flutterwave keys; register webhook URLs; choose an email/ESP transport for `notify.ts`. (`@portabletext/react` to render Portable Text bodies.)
