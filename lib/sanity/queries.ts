import { groq } from "next-sanity";

/**
 * GROQ queries. Each projection maps exactly onto a type in lib/types.ts
 * so CMS and fallback content are interchangeable. Images resolve to a
 * { src, alt, lqip } object inline; capacity-aware fields (spotsRemaining)
 * are computed in the query against paid registrations.
 */

/* ── Reusable fragments ────────────────────────────────────────── */

const image = `{ "src": asset->url, "alt": coalesce(alt, ""), "lqip": asset->metadata.lqip, caption }`;
const seo = `seo{ title, description, "ogImage": ogImage.asset->url, keywords }`;
const cta = `{ label, href, variant }`;

/* ── Settings & navigation ─────────────────────────────────────── */

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]{
    siteName, tagline, phone, whatsapp, email,
    address{ line, area, city, mapUrl, lat, lng },
    hours, socials,
    announcement{ active, text, ctaLabel, link },
    defaultSeo{ title, description, "ogImage": ogImage.asset->url, keywords }
  }
`;

export const navigationQuery = groq`
  *[_type == "navigation"][0]{
    header[]{ label, href, group, children[]{ label, href, group } },
    footer[]{ heading, links[]{ label, href } }
  }
`;

/* ── Homepage ──────────────────────────────────────────────────── */

export const homePageQuery = groq`
  *[_type == "homePage"][0]{
    hero{ eyebrow, headline, subhead, "image": image${image}, primaryCta${cta}, secondaryCta${cta}, tertiaryCta${cta} },
    why{ eyebrow, heading, intro, pillars[]{ title, description, icon } },
    about{ eyebrow, heading, paragraphs, "image": image${image}, cta${cta} },
    programs{ eyebrow, heading, intro, cta${cta} },
    camp{ eyebrow, heading, intro },
    gallery{ eyebrow, heading, intro, cta${cta} },
    testimonials{ eyebrow, heading },
    faq{ eyebrow, heading, cta${cta} },
    finalCta{ eyebrow, heading, body, ctas[]${cta} },
    ${seo}
  }
`;

/* ── About page ────────────────────────────────────────────────── */

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0]{
    hero{ eyebrow, title, mission, "image": image${image} },
    story{ eyebrow, heading, paragraphs, "image": image${image}, pullQuote },
    philosophy{ eyebrow, heading, intro, cards[]{ title, description, icon } },
    differentiators{ eyebrow, heading, intro, items[]{ title, description, icon } },
    environment{ eyebrow, heading, intro, "images": images[]${image} },
    team{ eyebrow, heading, intro },
    testimonials{ eyebrow, heading },
    community{ eyebrow, heading, paragraphs, "image": image${image} },
    finalCta{ eyebrow, heading, body, ctas[]${cta} },
    ${seo}
  }
`;

/* ── Contact page (singleton) ──────────────────────────────────── */

export const contactPageQuery = groq`
  *[_type == "contactPage"][0]{
    hero{ eyebrow, title, intro, "image": image${image} },
    welcome{ eyebrow, heading, paragraphs },
    form{ eyebrow, heading, intro },
    visit{ eyebrow, heading, description, benefits, cta${cta} },
    journey{ eyebrow, heading, intro, steps[]{ title, description } },
    camp{ eyebrow, heading, description, availabilityNote, cta${cta} },
    faq{ eyebrow, heading },
    finalCta{ eyebrow, heading, body, ctas[]${cta} },
    ${seo}
  }
`;

/* ── Programs page (index singleton) ───────────────────────────── */

export const programsPageQuery = groq`
  *[_type == "programsPage"][0]{
    hero{ eyebrow, title, intro, "image": image${image}, primaryCta${cta}, secondaryCta${cta} },
    overview{ eyebrow, heading, paragraphs, "image": image${image} },
    outcomes{ eyebrow, heading, intro, cards[]{ title, description, icon } },
    experience{ eyebrow, heading, intro, items[]{ title, description, icon } },
    gallery{ eyebrow, heading, intro },
    faq{ eyebrow, heading },
    testimonials{ eyebrow, heading },
    finalCta{ eyebrow, heading, body, ctas[]${cta} },
    ${seo}
  }
`;

export const programCategoriesQuery = groq`
  *[_type == "programCategory"] | order(order asc){
    "slug": slug.current, title, description, order
  }
`;

/* ── Programs ──────────────────────────────────────────────────── */

const programCategoryRef = `"category": category->{ "slug": slug.current, title, description, order }`;

export const programsQuery = groq`
  *[_type == "program"] | order(order asc){
    "slug": slug.current, title, type, ageBands, summary,
    "heroImage": heroImage${image}, order
  }
`;

/** Lean projection powering the Programs index showcase blocks. */
export const programsShowcaseQuery = groq`
  *[_type == "program"] | order(order asc){
    "slug": slug.current, title, type, ageBands, summary,
    "heroImage": heroImage${image},
    learningExperience, keyBenefits, typicalActivities,
    gallery[]${image}, cta${cta}, order, ${programCategoryRef}
  }
`;

export const featuredProgramsQuery = groq`
  *[_type == "program"] | order(order asc)[0...$limit]{
    "slug": slug.current, title, summary, ageBands, "heroImage": heroImage${image}
  }
`;

export const programBySlugQuery = groq`
  *[_type == "program" && slug.current == $slug][0]{
    "slug": slug.current, title, type, ageBands, summary,
    "heroImage": heroImage${image},
    learningExperience, keyBenefits, typicalActivities,
    body, dayInTheLife[]{ time, activity },
    ratio, groupSize, schedule,
    pricing[]{ label, amount, unit, note },
    whatToBring,
    gallery[]${image},
    "faqs": faqs[]->{ question, answer, category },
    cta${cta}, ${seo}, order, ${programCategoryRef}
  }
`;

export const programSlugsQuery = groq`*[_type == "program" && defined(slug.current)].slug.current`;

/* ── Camps ─────────────────────────────────────────────────────── */

const campSpots = `"spotsRemaining": capacity - count(*[_type == "campRegistration" && references(^._id) && status == "paid"])`;

export const campsQuery = groq`
  *[_type == "campSession" && status in ["upcoming","open","full"]] | order(startDate asc){
    "slug": slug.current, title, season, theme, ageBand,
    startDate, endDate, capacity, ${campSpots},
    priceNGN, earlyBirdPriceNGN, earlyBirdUntil, siblingDiscountPct,
    status, "heroImage": heroImage${image}
  }
`;

export const campBySlugQuery = groq`
  *[_type == "campSession" && slug.current == $slug][0]{
    "slug": slug.current, title, season, theme, ageBand,
    startDate, endDate, dailySchedule, capacity, ${campSpots},
    priceNGN, earlyBirdPriceNGN, earlyBirdUntil, siblingDiscountPct,
    included, packingList, status,
    "heroImage": heroImage${image}, ${seo}
  }
`;

export const campSlugsQuery = groq`*[_type == "campSession" && defined(slug.current)].slug.current`;

/** Server-action helper: live availability check before charging. */
export const campAvailabilityQuery = groq`
  *[_type == "campSession" && slug.current == $slug][0]{
    "_id": _id, capacity, status, priceNGN, earlyBirdPriceNGN, earlyBirdUntil, siblingDiscountPct,
    ${campSpots}
  }
`;

/* ── People & proof ────────────────────────────────────────────── */

const teamProjection = `
  "slug": slug.current, name, role, department,
  "photo": photo${image}, shortBio, fullBio,
  qualifications, email, socialLinks,
  featured, founder, founderPhilosophy, founderVision,
  displayOrder
`;

export const teamQuery = groq`
  *[_type == "teamMember"] | order(displayOrder asc){
    ${teamProjection}
  }
`;

export const teamMemberBySlugQuery = groq`
  *[_type == "teamMember" && slug.current == $slug][0]{
    ${teamProjection}
  }
`;

export const founderQuery = groq`
  *[_type == "teamMember" && founder == true][0]{
    ${teamProjection}
  }
`;

export const teamSlugsQuery = groq`*[_type == "teamMember" && defined(slug.current)].slug.current`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(order asc){
    quote, authorName, childAge, "photo": photo${image},
    "program": program->title, videoUrl
  }
`;

export const testimonialsByProgramQuery = groq`
  *[_type == "testimonial" && program->slug.current == $slug] | order(order asc){
    quote, authorName, childAge, "photo": photo${image},
    "program": program->title, videoUrl
  }
`;

const galleryCategoryRef = `"category": category->{ "slug": slug.current, title, description, order }`;

export const galleryQuery = groq`
  *[_type == "galleryItem"] | order(coalesce(order, 0) asc, date desc){
    "image": image${image}, title, "slug": slug.current, caption, description,
    ${galleryCategoryRef}, tags, "program": program->title, featured, date, order
  }
`;

export const galleryCategoriesQuery = groq`
  *[_type == "galleryCategory"] | order(coalesce(order, 0) asc){
    "slug": slug.current, title, description, order
  }
`;

export const featuredStoriesQuery = groq`
  *[_type == "featuredStory"] | order(coalesce(order, 0) asc){
    "slug": slug.current, title, description, images[]${image}, cta${cta}
  }
`;

/* ── Gallery page (singleton) ──────────────────────────────────── */

export const galleryPageQuery = groq`
  *[_type == "galleryPage"][0]{
    hero{ eyebrow, title, intro, "image": image${image} },
    intro{ eyebrow, heading, paragraphs },
    gallery{ eyebrow, heading, intro },
    featuredMoments{ eyebrow, heading, intro },
    community{ eyebrow, heading, paragraphs, "image": image${image} },
    finalCta{ eyebrow, heading, body, ctas[]${cta} },
    ${seo}
  }
`;

/* ── Editorial ─────────────────────────────────────────────────── */

export const postsQuery = groq`
  *[_type == "post"] | order(publishedAt desc){
    "slug": slug.current, title, excerpt, "cover": cover${image},
    author->{ name, "photo": photo${image} }, categories, publishedAt
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    "slug": slug.current, title, excerpt, "cover": cover${image},
    author->{ name, "photo": photo${image} }, body, categories, publishedAt, ${seo}
  }
`;

export const guidesQuery = groq`
  *[_type == "guide"] | order(title asc){
    "slug": slug.current, title, summary, topic, body, "fileUrl": file.asset->url
  }
`;

const faqProjection = `question, answer, "category": category->slug.current, featured, popular, order`;

export const faqsByCategoryQuery = groq`
  *[_type == "faq" && category->slug.current == $category] | order(coalesce(order, 0) asc){
    ${faqProjection}
  }
`;

export const faqsAllQuery = groq`
  *[_type == "faq"] | order(coalesce(order, 0) asc){
    ${faqProjection}
  }
`;

export const faqCategoriesQuery = groq`
  *[_type == "faqCategory"] | order(coalesce(displayOrder, 0) asc){
    "slug": slug.current, title, description, displayOrder
  }
`;

export const faqPageQuery = groq`
  *[_type == "faqPage"][0]{
    hero{ eyebrow, title, intro, "image": image${image} },
    featured{ eyebrow, heading, intro },
    browse{ eyebrow, heading, intro },
    support{ eyebrow, heading, body, ctas[]${cta} },
    finalCta{ eyebrow, heading, body, ctas[]${cta} },
    ${seo}
  }
`;

export const eventsQuery = groq`
  *[_type == "event"] | order(startDate asc){
    title, type, startDate, endDate, description
  }
`;

export const policyBySlugQuery = groq`
  *[_type == "policy" && slug.current == $slug][0]{ "slug": slug.current, title, body }
`;

/* ── Flexible pages (page builder) ─────────────────────────────── */

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0]{
    "slug": slug.current, title,
    sections[]{
      _key, _type,
      _type == "heroSection" => { eyebrow, headline, subhead, "image": image${image}, ctas[]${cta} },
      _type == "pillarsSection" => { eyebrow, heading, pillars[]{ title, description, icon } },
      _type == "statsSection" => { stats[]{ value, suffix, label } },
      _type == "splitFeature" => { eyebrow, heading, body, "image": image${image}, imageSide, cta${cta} },
      _type == "ctaBand" => { heading, body, cta${cta}, "image": image${image} },
      _type == "gallerySection" => { heading, items[]${image} },
      _type == "testimonialsSection" => { heading, "testimonials": testimonials[]->{ quote, authorName, childAge, "photo": photo${image} } },
      _type == "faqSection" => { heading, category, "faqs": faqs[]->{ question, answer, category } }
    },
    ${seo}
  }
`;
