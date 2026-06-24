import type { GalleryItem, GalleryPageContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SmartImage from "@/components/ui/SmartImage";
import Tag from "@/components/ui/Tag";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface FeaturedMomentsProps {
  content: GalleryPageContent["featuredMoments"];
  items: GalleryItem[];
}

/** Featured Moments — a curated, captioned strip of meaningful images. */
export default function FeaturedMoments({ content, items }: FeaturedMomentsProps) {
  const moments = items.slice(0, 3);
  if (moments.length === 0) return null;

  return (
    <Section tone="sage" spacing="lg">
      <SectionHeading eyebrow={content.eyebrow} title={content.heading} intro={content.intro} className="max-w-2xl" />

      <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
        {moments.map((item, i) => (
          <StaggerItem key={item.slug || item.image.src + i}>
            <figure className="group overflow-hidden rounded-card-lg bg-white shadow-soft transition-shadow duration-500 ease-organic hover:shadow-lift">
              <div className="relative aspect-[4/3] overflow-hidden">
                <SmartImage
                  image={item.image}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
                />
              </div>
              <figcaption className="p-6">
                {item.category && (
                  <Tag tone="leaf" className="mb-3">
                    {item.category.title}
                  </Tag>
                )}
                <p className="text-lg font-semibold text-forest-900">{item.title || item.caption}</p>
                {item.description && <p className="mt-2 text-sm text-bark-700/80">{item.description}</p>}
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
