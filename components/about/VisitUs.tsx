import type { ImageAsset, SiteSettings } from "@/lib/types";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";

/** Visit Us — opening hours + address + a strong CTA, paired with an image. */
export default function VisitUs({ settings, image }: { settings: SiteSettings; image: ImageAsset }) {
  return (
    <Section tone="forest" spacing="xl">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow mb-3 text-sun-400">Visit us</p>
          <h2 className="text-display-lg text-cream">Come and feel the difference.</h2>

          <dl className="mt-8 space-y-6">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-cream/55">Opening hours</dt>
              {settings.hours.map((h) => (
                <dd key={h} className="mt-1 text-lg text-cream">{h}</dd>
              ))}
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-cream/55">Where to find us</dt>
              <dd className="mt-1 text-lg text-cream">{settings.address.line}</dd>
              <dd className="text-cream/80">{settings.address.area}, {settings.address.city}</dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="/contact" variant="secondary">Book a Visit</Button>
            <Button href={settings.address.mapUrl} variant="ghost" className="border-cream/40 text-cream hover:bg-cream/10">
              Get directions
            </Button>
          </div>
        </Reveal>

        <Reveal preset="scaleIn" className="relative aspect-[4/3] overflow-hidden rounded-card-lg shadow-lift">
          <SmartImage image={image} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </Reveal>
      </div>
    </Section>
  );
}
