import Container from "@/components/ui/Container";
import SmartImage from "@/components/ui/SmartImage";
import type { ImageAsset } from "@/lib/types";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: ImageAsset;
}

/** Inner-page hero (non-home). Scaffold. */
export default function PageHero({ eyebrow, title, intro, image }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-sage-100">
      {image && (
        <div className="absolute inset-0 opacity-30">
          <SmartImage image={image} fill className="object-cover" priority />
        </div>
      )}
      <Container className="relative py-20 md:py-28">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-display-lg">{title}</h1>
        {intro && <p className="mt-4 max-w-prose text-lg text-bark-700/80">{intro}</p>}
      </Container>
    </section>
  );
}
