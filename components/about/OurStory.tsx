import type { AboutContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";

/**
 * Our Story — editorial split: a tall image paired with short, readable
 * paragraphs and a large pull-quote that breaks up the prose (no walls of
 * text). The image sticks on large screens for a calm, magazine feel.
 */
export default function OurStory({ story }: { story: AboutContent["story"] }) {
  return (
    <Section tone="cream" spacing="lg">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal
            preset="scaleIn"
            className="relative aspect-[4/5] overflow-hidden rounded-card-lg shadow-lift lg:sticky lg:top-28"
          >
            <SmartImage image={story.image} fill sizes="(max-width: 1024px) 100vw, 42vw" className="object-cover" />
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow mb-3">{story.eyebrow}</p>
            <h2 className="text-display-md">{story.heading}</h2>
          </Reveal>

          <div className="mt-6 space-y-5 text-lg leading-relaxed text-bark-700/85">
            {story.paragraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>

          {story.pullQuote && (
            <Reveal className="mt-10 border-l-2 border-leaf-600/50 pl-6">
              <p className="font-display text-2xl italic leading-snug text-forest-900 md:text-3xl">
                “{story.pullQuote}”
              </p>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
