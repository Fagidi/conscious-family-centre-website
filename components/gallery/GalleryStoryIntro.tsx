import type { GalleryPageContent } from "@/lib/types";
import Section from "@/components/ui/Section";
import Reveal from "@/components/motion/Reveal";

/** Visual Story Introduction — a short, centered storytelling lead-in. */
export default function GalleryStoryIntro({ intro }: { intro: GalleryPageContent["intro"] }) {
  return (
    <Section tone="cream" spacing="lg" width="prose">
      <Reveal className="text-center">
        {intro.eyebrow && <p className="eyebrow mb-3">{intro.eyebrow}</p>}
        <h2 className="text-display-md">{intro.heading}</h2>
        <div className="mt-6 space-y-4 text-lg leading-relaxed text-bark-700/85">
          {intro.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
