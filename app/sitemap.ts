import type { MetadataRoute } from "next";
import { getProgramSlugs, getCampSlugs, getPosts, getTeamSlugs } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

/** Static + CMS-driven routes. Mirrors the sitemap in docs/BLUEPRINT.md §4. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/gallery",
    "/programs",
    "/camps",
    "/camps/how-it-works",
    "/admissions/why-cfc",
    "/admissions/journey",
    "/admissions/fees",
    "/admissions/term-dates",
    "/admissions/apply",
    "/resources/blog",
    "/resources/guides",
    "/faq",
    "/contact",
    "/contact/book-a-tour",
  ];

  const [programSlugs, campSlugs, posts, teamSlugs] = await Promise.all([
    getProgramSlugs(),
    getCampSlugs(),
    getPosts(),
    getTeamSlugs(),
  ]);

  const dynamic = [
    ...programSlugs.map((s) => `/programs/${s}`),
    ...campSlugs.map((s) => `/camps/${s}`),
    ...posts.map((p) => `/resources/blog/${p.slug}`),
    ...teamSlugs.map((s) => `/about/team/${s}`),
  ];

  return [...staticRoutes, ...dynamic].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
