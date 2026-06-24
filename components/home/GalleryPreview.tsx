import type { HomeContent, GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

interface GalleryPreviewProps {
  content: HomeContent["gallery"];
  items: GalleryItem[];
}

/** Immersive gallery teaser — first tile is featured; rest fill the mosaic. */
export default function GalleryPreview({ content, items }: GalleryPreviewProps) {
  const tiles = items.slice(0, 5);
  if (tiles.length === 0) return null;

  return (
    <Section tone="cream" spacing="lg">
      <div className="flex flex-col gap-12 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={content.eyebrow} title={content.heading} intro={content.intro} className="max-w-2xl" />
        <div className="hidden sm:block flex-shrink-0">
          <Button href={content.cta.href} variant="primary">
            {content.cta.label}
          </Button>
        </div>
      </div>

      <Stagger className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:grid-rows-2 md:gap-5" gap={0.06}>
        {tiles.map((item, i) => (
          <StaggerItem
            key={item.image.src + i}
            className={cn(
              "group relative overflow-hidden rounded-card",
              i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square",
            )}
          >
            <SmartImage
              image={item.image}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
            />
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 sm:hidden">
        <Button href={content.cta.href} variant="ghost" className="w-full">
          {content.cta.label}
        </Button>
      </div>
    </Section>
  );
}
