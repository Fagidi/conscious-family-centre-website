import type { ProgramShowcase } from "@/lib/types";
import { AGE_BANDS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";

interface ProgramFeatureBlockProps {
  program: ProgramShowcase;
  /** Index in the list — drives the alternating image side + tone. */
  index: number;
  id: string;
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="mt-1 h-4 w-4 shrink-0 text-leaf-600">
      <path
        d="M4 10.5 8 14.5 16 6"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Premium, alternating image/content block for a single program. Includes the
 * overview, age group, learning experience, key benefits, typical activities,
 * a gallery preview, and a CTA — the full storytelling unit (CMS-driven).
 */
export default function ProgramFeatureBlock({ program, index, id }: ProgramFeatureBlockProps) {
  const flip = index % 2 === 1;
  const tone = flip ? "bg-sage-100" : "bg-cream";

  return (
    <section id={id} className={cn("scroll-mt-24 py-16 md:py-24", tone)}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Media */}
          <Reveal
            preset="scaleIn"
            className={cn("relative aspect-[4/3] overflow-hidden rounded-card-lg shadow-lift", flip && "lg:order-last")}
          >
            <SmartImage
              image={program.heroImage}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </Reveal>

          {/* Content */}
          <Reveal>
            <div className="mb-3 flex flex-wrap gap-1.5">
              {program.ageBands.map((band) => (
                <Tag key={band} tone="sage">
                  {AGE_BANDS[band]?.label ?? band}
                  {AGE_BANDS[band] ? ` · ${AGE_BANDS[band].range}` : ""}
                </Tag>
              ))}
            </div>

            <h3 className="text-display-sm text-forest-900">{program.title}</h3>
            <p className="mt-4 text-lg leading-relaxed text-bark-700/85">
              {program.learningExperience || program.summary}
            </p>

            {program.keyBenefits.length > 0 && (
              <ul className="mt-6 space-y-2">
                {program.keyBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3 text-bark-700/85">
                    <Check />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            )}

            {program.typicalActivities.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-bark-700/55">Typical activities</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {program.typicalActivities.map((activity) => (
                    <Tag key={activity} tone="leaf">
                      {activity}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`/programs/${program.slug}`} variant="ghost">
                Explore {program.title}
              </Button>
              {program.cta && (
                <Button href={program.cta.href} variant="primary">
                  {program.cta.label}
                </Button>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
