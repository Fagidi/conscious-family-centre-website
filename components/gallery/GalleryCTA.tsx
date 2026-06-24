import type { GalleryPageContent } from "@/lib/types";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/motion/Reveal";

/** Closing conversion band for the Gallery — emotional lead-in before the CTAs. */
export default function GalleryCTA({ content }: { content: GalleryPageContent["finalCta"] }) {
  return (
    <section className="bg-leaf-600 py-20 text-cream md:py-28">
      <Container className="text-center">
        <Reveal>
          {content.eyebrow && <p className="eyebrow mb-4 text-cream/80">{content.eyebrow}</p>}
          <h2 className="mx-auto max-w-3xl text-display-md text-cream">{content.heading}</h2>
          {content.body && <p className="mx-auto mt-5 max-w-xl text-lg text-cream/85">{content.body}</p>}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
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
