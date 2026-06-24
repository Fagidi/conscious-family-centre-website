import type { HomeContent, CampSession } from "@/lib/types";
import { formatDateRange, formatNaira } from "@/lib/utils";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/motion/Reveal";
import AvailabilityIndicator from "@/components/camp/AvailabilityIndicator";

interface CampFeatureProps {
  content: HomeContent["camp"];
  camp: CampSession | null;
}

/** High-converting featured-camp section: imagery, details, availability, urgency, CTA. */
export default function CampFeature({ content, camp }: CampFeatureProps) {
  if (!camp) return null;

  return (
    <section className="bg-forest-900 py-24 text-cream md:py-32">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal preset="scaleIn" className="relative order-last aspect-[4/3] overflow-hidden rounded-2xl shadow-lg lg:order-first">
            <SmartImage image={camp.heroImage} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </Reveal>

          <Reveal>
            <p className="eyebrow mb-4 text-sun-400">{content.eyebrow}</p>
            <h2 className="text-display-lg text-cream">{content.heading}</h2>
            {content.intro && <p className="mt-5 text-lg text-cream/85">{content.intro}</p>}

            <ul className="mt-8 space-y-3 text-cream/85">
              <li className="flex items-center gap-3">
                <Icon name="sun" className="h-5 w-5 text-sun-400 flex-shrink-0" />
                <span>{formatDateRange(camp.startDate, camp.endDate)} · {camp.ageBand}</span>
              </li>
              {camp.included.slice(0, 4).map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <Icon name="leaf" className="h-5 w-5 text-leaf-500 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <AvailabilityIndicator camp={camp} />
              {camp.priceNGN > 0 && <span className="text-xl font-semibold">{formatNaira(camp.priceNGN)}</span>}
            </div>

            <div className="mt-10">
              <Button href="/camp-registration" variant="primary">
                Register for Camp
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
