# Conscious Family Centre

Website for **Conscious Family Centre** — nature-connected learning, playgroup,
forest school, homeschool community, and holiday camps for children 0–10 in
Wuse 2, Abuja.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, GSAP + Lenis, and
Sanity CMS. Deploys to Netlify.

> **Status:** architecture scaffolded; pages not yet built. See the planning &
> architecture docs before contributing.

## Docs

- [docs/BLUEPRINT.md](docs/BLUEPRINT.md) — strategy: UX/content audit, IA, sitemap, design system, camp registration & admissions strategy, CMS architecture, SEO, motion system.
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — folder & route structure, CMS integration strategy, server-action strategy.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # strict TypeScript (foundation passes clean)
npm run build      # production build (once pages exist)
```

## Configure

Copy `.env.example` → `.env.local` and fill in:

- **Sanity** — `NEXT_PUBLIC_SANITY_PROJECT_ID` + `SANITY_WRITE_TOKEN` (Editor; needed for registrations/enquiries).
- **Payments** — `PAYMENT_PROVIDER` and Paystack/Flutterwave keys (gateway-agnostic; both supported).
- **Notifications** — optional Resend keys; no-ops until set.

The site renders with curated fallback content (`lib/content.ts`) until Sanity
documents are published. Studio is at `/studio`.

## Architecture at a glance

- **Read:** pages → `lib/data.ts` (typed getters, fallback-first) → GROQ → Sanity, revalidated every 60s.
- **Write:** server actions in `lib/actions/*` return `ActionResult`; payments behind a `PaymentProvider` interface; camp seats enforced at webhook fulfilment.
- **Design system:** tokens in `tailwind.config.ts` (earth/foliage palette, Fraunces + Inter); motion tokens in `lib/motion.ts`.
