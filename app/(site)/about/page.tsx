import type { Metadata } from "next";
import Image from "@/components/ui/CineImage";
import { getHero, getAboutPage } from "@/lib/data";
import PageHero from "@/components/shared/PageHero";
import CtaSection from "@/components/shared/CtaSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/animation/Reveal";
import ImageReveal from "@/components/animation/ImageReveal";
import Parallax from "@/components/animation/Parallax";
import TextReveal from "@/components/animation/TextReveal";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getAboutPage();
  return { title: { absolute: seo.title }, description: seo.description };
}

export default async function AboutPage() {
  const [hero, page] = await Promise.all([getHero("about"), getAboutPage()]);
  const { story, pillarsSection, pillars, closing } = page;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        titleLines={hero.titleLines}
        image={hero.image}
        imageAlt={hero.imageAlt}
      />

      {/* The story — editorial two-column with offset imagery */}
      <section className="bg-noir py-28 md:py-40">
        <div className="container-site">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <SectionHeading eyebrow={story.eyebrow} lines={story.titleLines} />
            </div>
            <div className="space-y-8 md:col-span-5 md:col-start-8">
              <Reveal stagger={0.15}>
                {story.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    className={`text-base font-light leading-loose ${
                      i === 0 ? "text-ivory" : "text-ivory-dim"
                    } ${i > 0 ? "mt-8" : ""}`}
                  >
                    {p}
                  </p>
                ))}
              </Reveal>
            </div>
          </div>

          {/* Offset image pairing */}
          <div className="mt-24 grid grid-cols-1 gap-6 md:mt-36 md:grid-cols-12 md:gap-8">
            <ImageReveal className="aspect-[4/3] md:col-span-7">
              <Parallax className="h-full" amount={10}>
                <Image
                  src={story.image}
                  alt={story.imageAlt}
                  fill
                  sizes="(min-width: 768px) 58vw, 100vw"
                  className="object-cover"
                />
              </Parallax>
            </ImageReveal>
            <ImageReveal className="aspect-[3/4] md:col-span-4 md:col-start-9 md:mt-28" delay={0.15}>
              <Parallax className="h-full" amount={14}>
                <Image
                  src={story.secondImage}
                  alt={story.secondImageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </Parallax>
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="bg-noir-soft py-28 md:py-40">
        <div className="container-site">
          <SectionHeading
            eyebrow={pillarsSection.eyebrow}
            lines={pillarsSection.titleLines}
            className="mb-20"
          />
          <div className="grid grid-cols-1 gap-px bg-noir-line sm:grid-cols-2">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.08} className="bg-noir-soft">
                <div className="group h-full p-10 transition-colors duration-700 ease-luxe hover:bg-noir-raise md:p-14">
                  <p className="font-display text-sm italic text-amethyst-bright">
                    0{i + 1}
                  </p>
                  <h3 className="mt-6 font-display text-2xl font-light md:text-3xl">
                    {pillar.title}
                  </h3>
                  <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-ivory-dim">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* The people */}
      <section className="bg-noir py-32 md:py-44">
        <div className="container-site text-center">
          <Reveal>
            <p className="eyebrow mb-10 flex items-center justify-center gap-4">
              <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
              {closing.eyebrow}
              <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
            </p>
          </Reveal>
          <TextReveal
            as="h2"
            lines={closing.titleLines}
            className="font-display text-display-md font-light"
          />
          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-xl text-base font-light leading-relaxed text-ivory-dim">
              {closing.body}
            </p>
          </Reveal>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
