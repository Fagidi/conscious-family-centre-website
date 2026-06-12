import Image from "@/components/ui/CineImage";
import Parallax from "@/components/animation/Parallax";
import Reveal from "@/components/animation/Reveal";
import TextReveal from "@/components/animation/TextReveal";
import Button from "@/components/ui/Button";
import { ctaSection } from "@/lib/content";

/**
 * Full-bleed closing invitation, shared across pages.
 */
export default function CtaSection() {
  return (
    <section className="grain relative overflow-hidden">
      <Parallax className="absolute inset-0" amount={16}>
        <Image
          src={ctaSection.image}
          alt={ctaSection.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </Parallax>
      <div className="absolute inset-0 bg-noir/72" />

      <div className="container-site relative z-10 flex min-h-[80svh] flex-col items-center justify-center py-32 text-center">
        <Reveal y={24}>
          <p className="eyebrow mb-8">{ctaSection.eyebrow}</p>
        </Reveal>
        <TextReveal
          as="h2"
          lines={ctaSection.titleLines}
          className="font-display text-display-lg font-light"
        />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-md text-sm font-light leading-relaxed text-ivory/80">
            {ctaSection.body}
          </p>
        </Reveal>
        <Reveal delay={0.35} className="mt-12">
          <Button href={ctaSection.ctaHref}>{ctaSection.ctaLabel}</Button>
        </Reveal>
      </div>
    </section>
  );
}
