import type { Cta } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

interface FAQCTAProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  ctas: Cta[];
  /** "support" = lighter sage card; "final" = solid leaf band. */
  variant?: "support" | "final";
}

/**
 * Conversion block for the FAQ page. Used twice: a "Still have questions?"
 * support card and the closing leaf-green final CTA.
 */
export default function FAQCTA({ eyebrow, heading, body, ctas, variant = "final" }: FAQCTAProps) {
  const final = variant === "final";

  if (final) {
    return (
      <section className="bg-leaf-600 py-20 text-cream md:py-28">
        <Container className="text-center">
          <Reveal>
            {eyebrow && <p className="eyebrow mb-4 text-cream/80">{eyebrow}</p>}
            <h2 className="mx-auto max-w-3xl text-display-md text-cream">{heading}</h2>
            {body && <p className="mx-auto mt-5 max-w-xl text-lg text-cream/85">{body}</p>}
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              {(ctas ?? []).map((cta, i) => (
                <Button
                  key={cta.label}
                  href={cta.href}
                  variant={i === 0 ? "secondary" : "ghost"}
                  className={i === 0 ? undefined : "border-cream/40 text-cream hover:bg-cream/10"}
                >
                  {cta.label}
                </Button>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-cream py-16 md:py-24">
      <Container>
        <Reveal className="rounded-card-lg bg-sage-100 px-6 py-12 text-center md:px-12">
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="mx-auto max-w-2xl text-display-sm text-forest-900">{heading}</h2>
          {body && <p className="mx-auto mt-4 max-w-xl text-bark-700/80">{body}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {ctas.map((cta, i) => (
              <Button key={cta.label} href={cta.href} variant={cta.variant ?? (i === 0 ? "primary" : "ghost")}>
                {cta.label}
              </Button>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
