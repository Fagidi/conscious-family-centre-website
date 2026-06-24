import type { HomeContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";

/** About preview — editorial image + story split. */
export default function AboutPreview({ content }: { content: HomeContent["about"] }) {
  return (
    <Section tone="sage" spacing="lg">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal preset="scaleIn" className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lg">
          <SmartImage image={content.image} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </Reveal>

        <Reveal>
          <p className="eyebrow mb-4">{content.eyebrow}</p>
          <h2 className="text-display-lg mb-6">{content.heading}</h2>
          <div className="space-y-5 text-lg leading-relaxed text-bark-700/85">
            {content.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="mt-10">
            <Button href={content.cta.href} variant="primary">
              {content.cta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
