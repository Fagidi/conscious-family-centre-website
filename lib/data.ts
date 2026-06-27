import "server-only";
import { fetchWithFallback, fetchList, fetchOne, mergeWithFallback } from "./sanity/client";
import * as q from "./sanity/queries";
import {
  siteSettings as siteSettingsFallback,
  navigation as navigationFallback,
  homeContent as homeContentFallback,
  aboutContent as aboutContentFallback,
  programsPageContent as programsPageFallback,
  programs as programsFallback,
  featuredPrograms as featuredProgramsFallback,
  featuredCamps as featuredCampsFallback,
  testimonials as testimonialsFallback,
  galleryItems as galleryFallback,
  galleryCategories as galleryCategoriesFallback,
  featuredStories as featuredStoriesFallback,
  galleryPageContent as galleryPageFallback,
  contactPageContent as contactPageFallback,
  generalFaqs as generalFaqsFallback,
  programFaqs as programFaqsFallback,
  philosophyFaqs as philosophyFaqsFallback,
  participationFaqs as participationFaqsFallback,
  enrollmentFaqs as enrollmentFaqsFallback,
  campFaqs as campFaqsFallback,
  safetyFaqs as safetyFaqsFallback,
  allFaqs as allFaqsFallback,
  faqCategories as faqCategoriesFallback,
  faqPageContent as faqPageFallback,
} from "./content";
import type {
  SiteSettings,
  Navigation,
  Seo,
  HomeContent,
  AboutContent,
  ProgramsPageContent,
  Program,
  ProgramShowcase,
  ProgramCategory,
  ProgramPreview,
  CampSession,
  TeamMember,
  Testimonial,
  GalleryItem,
  GalleryCategory,
  GalleryPageContent,
  ContactPageContent,
  FeaturedStory,
  Post,
  Guide,
  FaqItem,
  FaqCategoryDoc,
  FaqPageContent,
  CalendarEvent,
  Policy,
  Page,
} from "./types";

/**
 * DATA ACCESS LAYER — the only surface pages and components read from.
 * Each getter resolves CMS-or-fallback so callers never branch on source.
 * Singletons/objects use field-merge fallback; collections fall back to []
 * (they are CMS-driven). `server-only` keeps the write token off the client.
 */

/* ── Settings ──────────────────────────────────────────────────── */
export const getSiteSettings = (): Promise<SiteSettings> =>
  fetchWithFallback(q.siteSettingsQuery, siteSettingsFallback);

export const getNavigation = (): Promise<Navigation> =>
  fetchWithFallback(q.navigationQuery, navigationFallback);

/** Default SEO for the root metadata, derived from site settings. */
export async function getDefaultSeo(): Promise<Seo> {
  return (await getSiteSettings()).defaultSeo;
}

/* ── Homepage ──────────────────────────────────────────────────── */
export const getHomeContent = (): Promise<HomeContent> =>
  fetchWithFallback(q.homePageQuery, homeContentFallback);

/* ── About page ────────────────────────────────────────────────── */
export const getAboutContent = (): Promise<AboutContent> =>
  fetchWithFallback(q.aboutPageQuery, aboutContentFallback);

/* ── Programs ──────────────────────────────────────────────────── */
export const getProgramsPageContent = (): Promise<ProgramsPageContent> =>
  fetchWithFallback(q.programsPageQuery, programsPageFallback);

export const getProgramShowcase = (): Promise<ProgramShowcase[]> =>
  fetchList(q.programsShowcaseQuery, programsFallback);

export const getProgramCategories = (): Promise<ProgramCategory[]> =>
  fetchList(q.programCategoriesQuery, []);

export const getPrograms = (): Promise<Program[]> => fetchList(q.programsQuery, programsFallback);
export const getFeaturedPrograms = (limit = 4): Promise<ProgramPreview[]> =>
  fetchList(q.featuredProgramsQuery, featuredProgramsFallback.slice(0, limit), { limit });

/** Single program — CMS merged over curated fallback by slug. */
export async function getProgram(slug: string): Promise<Program | null> {
  const fallback = programsFallback.find((p) => p.slug === slug);
  const cms = await fetchOne<Program>(q.programBySlugQuery, { slug });
  if (!cms && !fallback) return null;
  if (!cms) return fallback ?? null;
  if (!fallback) return cms;
  return mergeWithFallback(fallback, cms);
}

export const getProgramSlugs = (): Promise<string[]> =>
  fetchList(q.programSlugsQuery, programsFallback.map((p) => p.slug));

/* ── Camps ─────────────────────────────────────────────────────── */
export const getCamps = (): Promise<CampSession[]> => fetchList(q.campsQuery, featuredCampsFallback);
export const getCamp = (slug: string): Promise<CampSession | null> =>
  fetchOne(q.campBySlugQuery, { slug });
export const getCampSlugs = (): Promise<string[]> => fetchList(q.campSlugsQuery, []);

/* ── People & proof ────────────────────────────────────────────── */
export const getTeam = (): Promise<TeamMember[]> => fetchList(q.teamQuery, []);
export const getTeamMember = (slug: string): Promise<TeamMember | null> =>
  fetchOne(q.teamMemberBySlugQuery, { slug });
export const getFounder = (): Promise<TeamMember | null> =>
  fetchOne(q.founderQuery, {});
export const getTeamSlugs = (): Promise<string[]> => fetchList(q.teamSlugsQuery, []);
export const getTestimonials = (): Promise<Testimonial[]> =>
  fetchList(q.testimonialsQuery, testimonialsFallback);
export const getTestimonialsByProgram = (slug: string): Promise<Testimonial[]> =>
  fetchList(q.testimonialsByProgramQuery, [], { slug });
export const getGallery = (): Promise<GalleryItem[]> => fetchList(q.galleryQuery, galleryFallback);
export const getGalleryCategories = (): Promise<GalleryCategory[]> =>
  fetchList(q.galleryCategoriesQuery, galleryCategoriesFallback);
export const getFeaturedStories = (): Promise<FeaturedStory[]> =>
  fetchList(q.featuredStoriesQuery, featuredStoriesFallback);
export const getGalleryPageContent = (): Promise<GalleryPageContent> =>
  fetchWithFallback(q.galleryPageQuery, galleryPageFallback);

/* ── Contact page ──────────────────────────────────────────────── */
export const getContactPageContent = (): Promise<ContactPageContent> =>
  fetchWithFallback(q.contactPageQuery, contactPageFallback);

/* ── Editorial ─────────────────────────────────────────────────── */
export const getPosts = (): Promise<Post[]> => fetchList(q.postsQuery, []);
export const getPost = (slug: string): Promise<Post | null> => fetchOne(q.postBySlugQuery, { slug });
export const getGuides = (): Promise<Guide[]> => fetchList(q.guidesQuery, []);
const faqFallbacks: Record<string, FaqItem[]> = {
  general: generalFaqsFallback,
  programs: programFaqsFallback,
  philosophy: philosophyFaqsFallback,
  participation: participationFaqsFallback,
  enrollment: enrollmentFaqsFallback,
  camps: campFaqsFallback,
  safety: safetyFaqsFallback,
};
export const getFaqs = (category: string): Promise<FaqItem[]> =>
  fetchList(q.faqsByCategoryQuery, faqFallbacks[category] ?? [], { category });

export const getAllFaqs = (): Promise<FaqItem[]> => fetchList(q.faqsAllQuery, allFaqsFallback);
export const getFaqCategories = (): Promise<FaqCategoryDoc[]> =>
  fetchList(q.faqCategoriesQuery, faqCategoriesFallback);
export const getFaqPageContent = (): Promise<FaqPageContent> =>
  fetchWithFallback(q.faqPageQuery, faqPageFallback);
export const getEvents = (): Promise<CalendarEvent[]> => fetchList(q.eventsQuery, []);
export const getPolicy = (slug: string): Promise<Policy | null> =>
  fetchOne(q.policyBySlugQuery, { slug });

/* ── Flexible pages ────────────────────────────────────────────── */
export const getPage = (slug: string): Promise<Page | null> => fetchOne(q.pageBySlugQuery, { slug });
