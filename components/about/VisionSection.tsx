import type { ImageAsset } from "@/lib/types";
import Container from "@/components/ui/Container";
import SmartImage from "@/components/ui/SmartImage";
import Reveal from "@/components/motion/Reveal";

/**
 * Vision — a full-bleed, immersive statement. A large aspirational line over a
 * darkened image. Reuses an existing belief statement + image.
 */
export default function VisionSection({ statement, image }: { statement: string; image: ImageAsset }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <SmartImage image={image} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-forest-900/80" />
      </div>
      <Container className="relative py-28 text-center md:py-40">
        <Reveal>
          <p className="eyebrow mb-5 text-sun-400">Our vision</p>
          <p className="mx-auto max-w-4xl font-display text-display-lg italic text-cream">“{statement}”</p>
        </Reveal>
      </Container>
    </section>
  );
}
