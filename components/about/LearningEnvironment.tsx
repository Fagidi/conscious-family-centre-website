import type { AboutContent } from "@/lib/types";
import { cn } from "@/lib/utils";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import SmartImage from "@/components/ui/SmartImage";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/**
 * Learning Environment — an immersive, gallery-style mosaic of the spaces and
 * atmosphere. The first tile leads; the rest fill an editorial grid. Images
 * are CMS-managed (aboutPage.environment.images).
 */
export default function LearningEnvironment({ environment }: { environment: AboutContent["environment"] }) {
  const tiles = (environment.images ?? []).slice(0, 5);
  if (tiles.length === 0) return null;

  return (
    <Section tone="cream" spacing="lg">
      <SectionHeading
        eyebrow={environment.eyebrow}
        title={environment.heading}
        intro={environment.intro}
        className="max-w-2xl"
      />

      <Stagger className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2" gap={0.06}>
        {tiles.map((image, i) => (
          <StaggerItem
            key={image.src + i}
            className={cn(
              "group relative overflow-hidden rounded-card",
              i === 0 ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-square",
            )}
          >
            <SmartImage
              image={image}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
            />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
