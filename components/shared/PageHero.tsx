import Image from "@/components/ui/CineImage";
import Reveal from "@/components/animation/Reveal";
import TextReveal from "@/components/animation/TextReveal";
import ImageReveal from "@/components/animation/ImageReveal";
import Parallax from "@/components/animation/Parallax";

interface PageHeroProps {
  eyebrow: string;
  titleLines: string[];
  intro?: string;
  image?: string;
  imageAlt?: string;
}

/**
 * Editorial opener for inner pages: oversized typography first,
 * then a wide cinematic image unveiling beneath it.
 */
export default function PageHero({ eyebrow, titleLines, intro, image, imageAlt }: PageHeroProps) {
  return (
    <section className="bg-noir pt-40 md:pt-52">
      <div className="container-site">
        <Reveal y={24}>
          <p className="eyebrow mb-8 flex items-center gap-4">
            <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
            {eyebrow}
          </p>
        </Reveal>

        <TextReveal
          as="h1"
          immediate
          delay={0.25}
          lines={titleLines}
          className="max-w-5xl font-display text-display-lg font-light"
        />

        {intro && (
          <Reveal delay={0.45} className="mt-10 grid grid-cols-1 md:grid-cols-12">
            <p className="text-base font-light leading-relaxed text-ivory-dim md:col-span-5 md:col-start-8">
              {intro}
            </p>
          </Reveal>
        )}

        {image && (
          <ImageReveal className="mt-16 aspect-[16/10] w-full md:mt-24 md:aspect-[21/9]">
            <Parallax className="h-full" amount={10}>
              <Image
                src={image}
                alt={imageAlt ?? ""}
                fill
                priority
                sizes="(min-width: 1440px) 1376px, 92vw"
                className="object-cover"
              />
            </Parallax>
          </ImageReveal>
        )}
      </div>
    </section>
  );
}
