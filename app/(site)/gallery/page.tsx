import type { Metadata } from "next";
import {
  getGalleryPageContent,
  getGallery,
  getGalleryCategories,
  getFeaturedStories,
} from "@/lib/data";
import GalleryHero from "@/components/gallery/GalleryHero";
import GalleryStoryIntro from "@/components/gallery/GalleryStoryIntro";
import FeaturedStory from "@/components/gallery/FeaturedStory";
import MasonryGallery from "@/components/gallery/MasonryGallery";
import FeaturedMoments from "@/components/gallery/FeaturedMoments";
import GalleryCommunity from "@/components/gallery/GalleryCommunity";
import GalleryCTA from "@/components/gallery/GalleryCTA";

// ISR so published CMS image/story edits appear without a redeploy.
export const revalidate = 60;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://consciousfamilycentre.com";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getGalleryPageContent();
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: "/gallery" },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${siteUrl}/gallery`,
      type: "website",
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function GalleryPage() {
  const [content, items, categories, stories] = await Promise.all([
    getGalleryPageContent(),
    getGallery(),
    getGalleryCategories(),
    getFeaturedStories(),
  ]);

  const featured = items.filter((i) => i.featured);
  const featuredStory = stories[0] ?? null;

  // JSON-LD ImageGallery — helps image SEO / rich results.
  const gallerySchema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: content.seo.title,
    description: content.seo.description,
    url: `${siteUrl}/gallery`,
    associatedMedia: items.slice(0, 24).map((item) => ({
      "@type": "ImageObject",
      contentUrl: item.image.src,
      name: item.title || item.caption || item.image.alt,
      caption: item.caption || item.image.alt,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(gallerySchema) }} />

      <GalleryHero hero={content.hero} />
      <GalleryStoryIntro intro={content.intro} />
      {featuredStory && <FeaturedStory story={featuredStory} />}
      <MasonryGallery content={content.gallery} items={items} categories={categories} />
      <FeaturedMoments content={content.featuredMoments} items={featured} />
      <GalleryCommunity community={content.community} />
      <GalleryCTA content={content.finalCta} />
    </>
  );
}
