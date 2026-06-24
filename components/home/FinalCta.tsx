import type { HomeContent } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

/** Emotionally compelling closing conversion band with the three key CTAs. */
export default function FinalCta({ content }: { content: HomeContent["finalCta"] }) {
  return (
    <section className="bg-leaf-600 py-24 text-cream md:py-32">
      <Container className="text-center">
        <Reveal>
          {content.eyebrow && <p className="eyebrow mb-4 text-cream/80">{content.eyebrow}</p>}
          <h2 className="mx-auto max-w-3xl text-display-lg text-cream">{content.heading}</h2>
          {content.body && <p className="mx-auto mt-5 max-w-xl text-lg text-cream/85">{content.body}</p>}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {content.ctas.map((cta, i) => (
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
