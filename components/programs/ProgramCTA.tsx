import type { Cta } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

interface ProgramCTAProps {
  eyebrow?: string;
  heading: string;
  body?: string;
  ctas: Cta[];
}

/**
 * Reusable conversion band for the Programs experience. The first CTA is solid;
 * the rest render as light outlines on the leaf background.
 */
export default function ProgramCTA({ eyebrow, heading, body, ctas }: ProgramCTAProps) {
  return (
    <section className="bg-leaf-600 py-20 text-cream md:py-28">
      <Container className="text-center">
        <Reveal>
          {eyebrow && <p className="eyebrow mb-4 text-cream/80">{eyebrow}</p>}
          <h2 className="mx-auto max-w-3xl text-display-md text-cream">{heading}</h2>
          {body && <p className="mx-auto mt-5 max-w-xl text-lg text-cream/85">{body}</p>}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {ctas.map((cta, i) => (
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
