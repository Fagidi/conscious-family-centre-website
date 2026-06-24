import type { CampSession, ContactPageContent } from "@/lib/types";
import { formatDateRange } from "@/lib/utils";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

interface CampPromotionProps {
  content: ContactPageContent["camp"];
  camp: CampSession | null;
}

/** Camp registration promo — striking dark band with live camp facts + CTA. */
export default function CampPromotion({ content, camp }: CampPromotionProps) {
  const facts: string[] = camp
    ? [camp.theme, formatDateRange(camp.startDate, camp.endDate), camp.ageBand].filter(Boolean)
    : [];

  return (
    <section className="bg-forest-900 py-20 text-cream md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-3 text-sun-400">{content.eyebrow}</p>
          <h2 className="text-display-md text-cream">{content.heading}</h2>
          {content.description && (
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-cream/80">{content.description}</p>
          )}

          {facts.length > 0 && (
            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-cream/70">
              {facts.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sun-400" />
                  {f}
                </li>
              ))}
            </ul>
          )}

          {content.availabilityNote && <p className="mt-5 text-sun-400">{content.availabilityNote}</p>}

          <div className="mt-9">
            <Button href={content.cta.href} variant="secondary">
              {content.cta.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
