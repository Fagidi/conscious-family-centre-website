import Image from "@/components/ui/CineImage";
import Link from "next/link";
import Reveal from "@/components/animation/Reveal";
import ImageReveal from "@/components/animation/ImageReveal";
import Parallax from "@/components/animation/Parallax";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import type { SectionHeadingContent, Service } from "@/lib/types";

interface ServicesPreviewProps {
  services: Service[];
  heading: SectionHeadingContent;
}

/**
 * Editorial index of the five experiences — alternating image/text
 * rows with cinematic image reveals and quiet parallax.
 */
export default function ServicesPreview({ services, heading }: ServicesPreviewProps) {
  return (
    <section className="bg-noir-soft py-28 md:py-40">
      <div className="container-site">
        <div className="mb-20 flex flex-col justify-between gap-10 md:mb-28 md:flex-row md:items-end">
          <SectionHeading
            eyebrow={heading.eyebrow}
            lines={heading.titleLines}
            headingClassName="font-display text-display-md font-light max-w-2xl"
          />
          <Reveal delay={0.2}>
            <Button href="/services" variant="ghost">
              View All Services
            </Button>
          </Reveal>
        </div>

        <div className="space-y-24 md:space-y-36">
          {services.map((service, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={service.slug}
                className="grid grid-cols-1 items-center gap-10 md:grid-cols-12 md:gap-0"
              >
                {/* Image */}
                <Link
                  href={`/services#${service.slug}`}
                  className={`group relative md:col-span-7 ${reversed ? "md:order-2 md:col-start-6" : ""}`}
                  aria-label={`Explore ${service.title}`}
                >
                  <ImageReveal className="aspect-[4/3] w-full md:aspect-[16/10]">
                    <Parallax className="h-full" amount={10}>
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        sizes="(min-width: 768px) 58vw, 100vw"
                        className="object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.04]"
                      />
                    </Parallax>
                  </ImageReveal>
                </Link>

                {/* Copy */}
                <div
                  className={`md:col-span-4 ${
                    reversed ? "md:order-1 md:col-start-1" : "md:col-start-9 md:pl-12"
                  }`}
                >
                  <Reveal stagger={0.12}>
                    <p className="eyebrow mb-5 text-amethyst-bright">{service.eyebrow}</p>
                    <h3 className="font-display text-display-sm font-light">{service.title}</h3>
                    <p className="mt-5 text-sm font-light leading-relaxed text-ivory-dim">
                      {service.shortDescription}
                    </p>
                    <Link
                      href={`/services#${service.slug}`}
                      className="group/link mt-8 inline-flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-ivory transition-colors duration-400 hover:text-amethyst-bright"
                    >
                      Discover
                      <span aria-hidden className="transition-transform duration-500 ease-luxe group-hover/link:translate-x-2">
                        →
                      </span>
                    </Link>
                  </Reveal>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
