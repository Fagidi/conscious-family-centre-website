import type { FeaturedStory as FeaturedStoryType } from "@/lib/types";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";

/**
 * Immersive featured visual story — a full-width lead image with an editorial
 * caption card, plus a secondary image when available. Magazine-style.
 */
export default function FeaturedStory({ story }: { story: FeaturedStoryType }) {
  const [lead, secondary] = story.images;
  if (!lead) return null;

  return (
    <section className="bg-forest-900">
      <div className="grid lg:grid-cols-[1.5fr_1fr]">
        {/* Lead image with overlaid editorial caption */}
        <Reveal preset="fadeIn" className="relative min-h-[60svh] overflow-hidden lg:min-h-[80svh]">
          <SmartImage image={lead} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-forest-900/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-content px-gutter pb-12 text-cream lg:max-w-none lg:px-12">
            <p className="eyebrow mb-3 text-sun-400">Featured story</p>
            <h2 className="max-w-2xl text-display-md text-cream">{story.title}</h2>
            {story.description && (
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-cream/85">{story.description}</p>
            )}
            {story.cta && (
              <div className="mt-7">
                <Button
                  href={story.cta.href}
                  variant="ghost"
                  className="border-cream/40 text-cream hover:bg-cream/10"
                >
                  {story.cta.label}
                </Button>
              </div>
            )}
          </div>
        </Reveal>

        {/* Secondary image (collapses below the lead on small screens) */}
        {secondary && (
          <Reveal preset="fadeIn" className="relative min-h-[40svh] overflow-hidden lg:min-h-[80svh]">
            <SmartImage image={secondary} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
