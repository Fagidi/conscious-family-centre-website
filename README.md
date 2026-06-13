# SARAI — Luxury Photo Booth & Event Experiences

A luxury digital experience for **Sarai Photo Booth**, Long Island, New York.
Built with Next.js 15, TypeScript, Tailwind CSS, GSAP, Three.js, and Sanity CMS.
Deploys to Netlify.

---

## Sitemap

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Home | Cinematic hero, brand manifesto, experience index, gallery film-strip, testimonials, closing invitation |
| `/about` | About | Brand story, standards, team philosophy |
| `/services` | Services | Five experiences in full editorial detail + booking process |
| `/faq` | FAQ | Grouped accordion: Booking, The Experience, Logistics, Customization |
| `/contact` | Contact | Booking inquiry form (Netlify Forms) + contact details |
| `/studio` | Sanity Studio | Embedded CMS for editors |

## Design System

- **Color** — `noir` blacks (~70%), `ivory` whites (~25%), `amethyst` purple (~5%, accent only: CTAs, hovers, links, hairlines). Tokens live in `tailwind.config.ts`.
- **Type** — Cormorant Garamond (editorial display serif) + Manrope (refined sans). Fluid display scales: `text-display-xl/lg/md/sm`, tracked uppercase `eyebrow` labels.
- **Motion** — GSAP + ScrollTrigger + Lenis smooth scroll. House primitives in `components/animation/`: `Reveal` (fade-rise), `TextReveal` (masked-line headlines), `ImageReveal` (clip-path curtain), `Parallax` (scrub drift). Three.js ambient particles (`components/three/AmbientParticles.tsx`) add quiet depth to the hero. All motion respects `prefers-reduced-motion`.

## Architecture

```
app/
  layout.tsx              Root: fonts, global SEO metadata
  (site)/                 Public site (header/footer/smooth scroll)
    page.tsx              Home
    about/  services/  faq/  contact/
  studio/[[...tool]]/     Embedded Sanity Studio
  sitemap.ts  robots.ts   SEO routes
components/
  animation/              GSAP primitives (Reveal, TextReveal, ImageReveal, Parallax)
  three/                  AmbientParticles
  layout/  ui/  shared/   Header, Footer, Button, SectionHeading, PageHero, CtaSection
  home/  faq/  contact/   Page-specific sections
lib/
  types.ts                Shared content types (Sanity ⇄ fallback contract)
  content.ts              Curated default content (full launch copy)
  data.ts                 Data access layer used by pages
  sanity/                 Client + GROQ queries
sanity/schemas/           CMS schemas
sanity.config.ts          Studio configuration
netlify.toml              Netlify build + headers
public/__forms.html       Netlify Forms detection file
```

## Content & CMS

Pages read everything through `lib/data.ts`. If Sanity is configured and a
document is published, **Sanity wins field-by-field**; missing documents and
missing fields both resolve to the curated defaults in `lib/content.ts`, so a
half-finished document can never blank out a section. Pages revalidate every
60 seconds — published edits go live without a redeploy.

Every piece of page content is editable in Studio:

| Studio section | Schema | Covers |
| --- | --- | --- |
| Pages → Home | `homePage` | manifesto, stats, section headings, page SEO |
| Pages → About | `aboutPage` | story, standards/pillars, closing, page SEO |
| Pages → Services | `servicesPage` | process steps + heading, page SEO |
| Pages → FAQ | `faqPage` | side note card, page SEO |
| Pages → Contact | `contactInfo` | headline, copy, image, event types, page SEO |
| Hero Content | `hero` | one hero per page (home / about / services / faq) |
| Services | `service` | the five experience articles |
| Testimonials | `testimonial` | quotes |
| Gallery | `galleryImage` | film-strip imagery |
| FAQ | `faqItem` | questions, grouped by category |
| Closing CTA | `ctaSection` | shared full-bleed invitation on every page |
| Site Settings | `siteSettings` | contact details, announcement, footer headline |
| SEO Settings | `seoSettings` | global meta defaults, OG image, keywords |

Layout, animation, components, and the design system stay in code.

### Connect Sanity

1. Create a project at [sanity.io/manage](https://sanity.io/manage).
2. Copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`.
3. Add `http://localhost:3000` (and your production domain) to the project's CORS origins.
4. Visit `/studio`, sign in, and publish content.

### Seed the launch content

To start editors from the live copy instead of empty documents, create a token
with **Editor** rights (sanity.io/manage → API → Tokens), add it to `.env.local`
as `SANITY_WRITE_TOKEN`, then run:

```bash
npm run seed
```

The script is idempotent (stable document IDs, create-or-replace) and uploads
the placeholder imagery to Sanity's CDN as real image assets.

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck  # strict TypeScript check
```

## Deploy to Netlify

1. Push to a Git repository and import it in Netlify — `netlify.toml` configures
   the build (`npm run build`) and the official Next.js runtime plugin.
2. Set environment variables from `.env.example` in **Site settings → Environment**.
3. The booking form posts to Netlify Forms automatically (registered via
   `public/__forms.html`). Enable notifications under **Forms → Notifications**.

## Credits

Photography placeholders served from Unsplash; replace via Sanity's gallery
and hero documents as real event imagery becomes available.
