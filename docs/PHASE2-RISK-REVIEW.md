# Phase 2 — Architecture Risk Review & Refinements

> Pre-implementation critique of [PHASE2-ARCHITECTURE.md](PHASE2-ARCHITECTURE.md).
> Severity: 🔴 must fix before build · 🟠 fix during build · 🟡 monitor.
> Each risk names a concrete refinement. The §X refs point at the main doc.

---

## A. Scalability & data integrity

### A1 🔴 Capacity oversell (race condition) — *the biggest risk*
`availability = capacity − count(confirmed)` is **read-then-write with no lock**.
Two parents taking the last seat both pass the pre-check and both pay → oversell.
Re-counting in the webhook doesn't help: if both are already `paid`, the count is
already wrong. Sanity has no cross-document transaction.

**Refinement — reservation + optimistic concurrency:**
- Maintain a **counter on `campSession`** (`booked`, `_rev`). On registration,
  patch with `.ifRevisionId(rev).inc({ booked: n })`; on revision conflict, retry
  → re-read → re-validate. This serializes seat claims.
- Create a short-lived **hold** (e.g. `status:"reserved"`, `expiresAt` +10min) at
  *form submit / payment start*, not at payment success — so the seat is claimed
  before the gateway round-trip. A cron releases expired holds.
- Keep `count(confirmed)` only as a reconciliation/audit check, not the gate.
- Surface a small **buffer/waitlist** so the edge case degrades to "join waitlist".

### A2 🔴 Sanity as a transactional + PII store for `registration`
Sanity is a content lake, not an OLTP/PII database. Concerns: concurrency (A1),
launch-spike write throughput/rate limits, PII/medical data governance, and a
Studio "Registrations" list that becomes unwieldy at thousands of docs.

**Refinement — decide the registration datastore (see Decisions):**
- **Option 1 (recommended): dedicated DB** (Vercel Postgres / Neon) for
  registrations + PII, with the counter/locking in SQL (a real `UNIQUE`/`CHECK`
  or `SELECT … FOR UPDATE` solves A1 cleanly). Sanity stays content-only.
- **Option 2: private Sanity dataset** with the A1 pattern + field-level access.
  Faster to ship; weaker concurrency + compliance story.
Either way, **content and registrations are separate datasets/stores.**

### A3 🟠 `count()` subqueries on list pages
`campsQuery` runs a `count()` per session on every camps-page render. Fine now,
costly at scale and adds latency. **Refinement:** read the maintained `booked`
counter (A1) instead of `count()`; reserve `count()` for an admin reconciliation
view.

### A4 🟠 Cache invalidation fan-out
On-demand ISR "keyed by type/slug" is under-specified: a `testimonial` edit
affects Home *and* program pages; `siteSettings` affects every route.
**Refinement:** use **Next cache tags** (`sanity`, `program:{slug}`,
`settings`, `home`) on fetches; the `/api/revalidate` webhook maps document type →
tags → `revalidateTag`. Document the map explicitly.

---

## B. UX

### B1 🔴 6-step form drop-off (amplified by multi-child × medical)
Length is the enemy of completion, on mobile especially. **Refinements:**
- Collapse to **as few required fields as possible**; make medical/notes optional
  where lawful; ask child medical per-child only when >1 child.
- **Save & resume** (A return link + server-side draft keyed by `reference`, not
  just localStorage — see C-PII). Show progress + allow back-edit from Review.
- Consider a **single scrollable form on desktop**, stepped only on mobile.
- Inline validation on blur; never validate-and-wipe.

### B2 🟠 Stale "spots left" (ISR 60s) misleads
A user can see "2 left" that's actually full → failed submit after effort.
**Refinement:** treat the badge as *approximate*; do a **live availability check
on form load and again on submit** (uncached), and message clearly ("Checking
availability…"). The A1 hold makes the submit-time check authoritative.

### B3 🟠 Registration flow has no nav → mid-flow info needs
Parents often want to re-check dates/price. **Refinement:** persistent **order
summary** (session, dates, price, child count) in the flow + a non-destructive
"view program details" (modal/new tab) that preserves form state.

### B4 🟡 WhatsApp prominence vs form conversion
WhatsApp is right for the audience but can cannibalize structured registration.
**Refinement:** WhatsApp = support/enquiry CTA; for *camp registration* keep the
form primary, WhatsApp as "questions?" secondary.

---

## C. Accessibility

### C1 🔴 Primary button contrast FAILS AA
Measured: cream `#FBF7EF` on **leaf-500 `#5C8A4A` ≈ 3.8:1** — fails AA for normal
text (needs 4.5:1). **Refinement:** use **leaf-600 `#4E7740` (≈ 4.9:1)** as the
primary button background with cream text; keep leaf-500 for large text/decoration
only. Restrict **sun-400** and **clay** to large text/badges/icons (verify each
pairing). Run a full token-pair contrast audit before locking the palette.

### C2 🔴 Hover-only Programs mega-menu
A `group-hover` dropdown is invisible to keyboard and unreliable on touch.
**Refinement:** build on **Radix NavigationMenu** (focus, Esc, arrow keys, touch,
`aria-expanded`). This is already implied by adopting Shadcn — make it explicit.

### C3 🟠 Route/page transitions break screen-reader focus
Framer page transitions + client nav don't move SR focus or announce the new page.
**Refinement:** on navigation, move focus to the `<h1>`/main and announce via an
`aria-live` route-announcer; ensure exit animations don't trap focus.

### C4 🟠 Multi-step form a11y
Needs: `fieldset/legend` per group, label↔input, errors via `aria-describedby`,
focus to first error on failed "Next", step changes announced (`aria-live`),
`aria-current` on the stepper. **Refinement:** bake these into the form components
spec (Radix Form + RHF helps but isn't automatic).

### C5 🟠 Reveal animations can hide content
`initial:{opacity:0}` reveals make content invisible if JS fails/slows and can
delay LCP. **Refinement:** never animate above-the-fold LCP content; ensure DOM
content is present and CSS-visible by default (animate via class added after mount,
or `@media (prefers-reduced-motion)`/no-JS fallback to visible).

---

## D. SEO

### D1 🔴 `robots` disallowing all of `/camp-registration` kills intent traffic
Blocking the whole path also blocks the camp **landing/listing** ("holiday camp
Abuja registration" is high-intent). **Refinement:** index the camp landing &
listing; **noindex only the multi-step form + confirmation** (per-page `robots`
meta / `noIndex` in `seo`), not via a path-wide `Disallow`.

### D2 🟠 `sitemap.lastModified = new Date()` always
Always-now timestamps cause needless re-crawl churn and signal nothing.
**Refinement:** use each document's **`_updatedAt`** in the sitemap.

### D3 🟠 `Event` JSON-LD validity for camps
Rich results require valid `location`, `startDate`, `offers`. Incomplete camp data
→ GSC errors. **Refinement:** make location/date/price **required** on
`campSession` before publish; validate JSON-LD output in CI/preview.

### D4 🟡 Thin program/category duplication & canonicals
Sparse program pages or near-duplicate category vs program content hurt quality.
**Refinement:** enforce a minimum content shape on `program`; set explicit
canonicals; keep category pages as indexes (distinct intent), not content clones.

---

## E. CMS / editorial

### E1 🟠 Page-builder with no guardrails → incoherent pages
Total freedom lets editors build broken layouts. **Refinement:** required fields +
`validation` per section, sensible `initialValue`, max-section limits, section
`preview` with media, and a constrained set of section types per page (e.g. Home
allows hero once).

### E2 🟠 No draft preview workflow
Editors can't see changes before publish; current reads are `published` only.
**Refinement:** add **Next `draftMode` + Sanity `previewDrafts` perspective** +
Presentation tool live preview. Define the preview route/secret now.

### E3 🟠 Reference integrity / singleton enforcement
Deleting a referenced `program`/`testimonial` leaves dangling refs; duplicate
singletons can be created. **Refinement:** strong refs where integrity matters,
GROQ that tolerates null refs (`coalesce`), and singleton **creation locks**
(structure + `__experimental_actions`/initial-value templates).

### E4 🟡 Alt-text & image discipline at scale
Required `alt` is good but bulk gallery uploads tempt skipping. **Refinement:**
keep `alt` required; add a Studio reminder/validation and an admin "missing alt"
query.

---

## F. Performance (Lighthouse 95+ mobile is the hard target)

### F1 🔴 Animation-library + Three.js weight on a data-constrained audience
Lenis **+** Framer Motion **+** GSAP/ScrollTrigger **+** Three.js is a lot of JS
for mobile Abuja users on metered data — directly threatens the 95+/INP/LCP goal,
and Lenis↔ScrollTrigger↔Framer scroll can conflict/jank.
**Refinements:**
- **Drop Three.js** for ambient (or make it desktop-only, lazy, behind
  reduced-data/`prefers-reduced-motion`). Prefer lightweight CSS/SVG/Canvas.
- **Pick one primary motion engine.** Default to **Framer Motion + Lenis**; add
  **GSAP only** for the few genuinely scroll-scrubbed/pinned moments, lazy-loaded
  on those routes. Avoid loading both everywhere.
- Establish a **per-route JS budget** and enforce in CI (bundle analyzer).

### F2 🟠 Variable-font weight
Fraunces (variable, optical-size axis) + Inter can be heavy. **Refinement:**
subset to Latin, limit axes/weights actually used, `font-display: swap`, preload
only the hero weight.

### F3 🟠 Gallery image volume
Many full-res images → LCP/transfer risk. **Refinement:** paginate/lazy-load,
responsive `sizes`, Sanity transforms with capped widths, blur-up LQIP, and
defer below-fold collections.

### F4 🟡 Sanity CDN transform cold-start & projection bloat
First-hit transforms are slow; wide projections waste bytes. **Refinement:**
consistent transform params (cache hits), `ProgramSummary`-style narrow
projections for lists, and `Promise.all` per route (already planned).

---

## G. Security / compliance (cross-cutting)

### G1 🔴 PII in `localStorage` autosave
The Phase-2 draft-autosave would put **medical/consent data in localStorage**
(XSS-readable, persists on shared devices). **Refinement:** never persist
medical/consent client-side; autosave only non-sensitive steps, or move
save-&-resume server-side keyed by `reference` (ties to A2/B1).

### G2 🟠 Server-action hardening
Public server actions need **rate limiting / spam protection** (honeypot or
Turnstile), strict server-side Zod (already planned), and idempotency on
`reference`. Webhooks must verify signatures (already planned) and be idempotent.

### G3 🟠 Consent + data-retention policy
Collecting child medical data implies retention/erasure obligations. **Refinement:**
define retention window + deletion process; reflect in the Privacy Policy; gate
real collection on the restricted dataset/DB decision (A2, already chosen
"restricted").

---

## Refinements to apply to the architecture (checklist)

1. **Capacity:** reservation + optimistic counter (`booked`/`_rev` or SQL lock); holds at submit; waitlist fallback. *(A1)*
2. **Registration store:** choose dedicated DB vs private Sanity dataset; separate from content. *(A2 — decision)*
3. **Availability reads** from counter, not `count()`. *(A3)*
4. **Cache tags** + a type→tag revalidation map. *(A4)*
5. **Form:** minimize required fields, server-side save & resume, live availability at load/submit, persistent order summary. *(B1–B3)*
6. **Contrast:** primary button → **leaf-600**; restrict sun/clay to large/badges; full pair audit. *(C1)*
7. **Mega-menu:** Radix NavigationMenu (keyboard/touch). *(C2)*
8. **A11y:** route focus/announce, full multi-step form a11y, LCP content never animation-hidden. *(C3–C5)*
9. **SEO:** index camp landing, noindex only form/confirmation; sitemap `_updatedAt`; required camp fields for valid `Event`; canonicals. *(D1–D4)*
10. **CMS:** page-builder guardrails, draft preview (`draftMode` + Presentation), reference/singleton integrity, alt discipline. *(E1–E4)*
11. **Performance:** drop/defer Three.js, consolidate to Framer+Lenis (+GSAP only where needed, lazy), font subsetting, gallery lazy/responsive, per-route JS budget in CI. *(F1–F4)*
12. **Security:** no PII in localStorage, rate-limit/anti-spam on actions, retention policy. *(G1–G3)*

---

## Decisions locked (2026-06-23)

1. **Registration datastore → dedicated DB** (Vercel Postgres/Neon). Registrations
   + PII live in SQL; oversell solved with a real transaction/lock (`SELECT … FOR
   UPDATE` or a `UNIQUE`/capacity `CHECK`). **Sanity stays content-only.** Remove
   the Phase-1/Phase-2 `registration` *document* from Sanity (keep only a minimal,
   non-PII reference if a Studio view is needed). `lib/payments` gateway-agnostic
   layer stays; payment status lives in SQL.
2. **Three.js → dropped.** No ambient WebGL. Use lightweight CSS/SVG ambient only.
   Remove `components/three/AmbientParticles.tsx` and the `three` deps.
3. **Motion → Framer Motion + Lenis as default; GSAP lazy-loaded only on the few
   scroll-scrubbed/pinned routes.** Don't bundle GSAP globally.
```
