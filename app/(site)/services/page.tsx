import type { Metadata } from "next";
import Image from "@/components/ui/CineImage";
import { getServices } from "@/lib/data";
import { pageSeo, processSteps } from "@/lib/content";
import PageHero from "@/components/shared/PageHero";
import CtaSection from "@/components/shared/CtaSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/animation/Reveal";
import ImageReveal from "@/components/animation/ImageReveal";
import Parallax from "@/components/animation/Parallax";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: pageSeo.services.title,
  description: pageSeo.services.description,
};

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <PageHero
        eyebrow="The Experiences"
        titleLines={["Designed for rooms", "where details matter."]}
        intro="Five experiences, one standard. Each is designed to your event — its palette, its light, its people — and run by a team that treats hospitality as part of the photograph."
      />

      {/* Index */}
      <section className="bg-noir pb-10 pt-20 md:pt-28">
        <div className="container-site">
          <Reveal stagger={0.07} className="flex flex-wrap gap-x-10 gap-y-4 border-y border-noir-line py-8">
            {services.map((s, i) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="link-underline text-[0.7rem] font-medium uppercase tracking-[0.26em] text-ivory-dim transition-colors duration-400 hover:text-amethyst-bright"
              >
                <span className="mr-2 text-ivory-faint">0{i + 1}</span>
                {s.title}
              </a>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Full editorial sections */}
      <section className="bg-noir">
        {services.map((service, i) => {
          const reversed = i % 2 === 1;
          return (
            <article
              key={service.slug}
              id={service.slug}
              className={`scroll-mt-28 py-24 md:py-36 ${i % 2 === 1 ? "bg-noir-soft" : "bg-noir"}`}
            >
              <div className="container-site grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
                {/* Image */}
                <div className={`lg:col-span-6 ${reversed ? "lg:order-2 lg:col-start-7" : ""}`}>
                  <ImageReveal className="aspect-[4/5] w-full md:aspect-[4/3] lg:aspect-[4/5]">
                    <Parallax className="h-full" amount={12}>
                      <Image
                        src={service.image}
                        alt={service.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 48vw, 100vw"
                        className="object-cover"
                      />
                    </Parallax>
                  </ImageReveal>
                </div>

                {/* Copy */}
                <div className={`lg:col-span-5 ${reversed ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
                  <Reveal stagger={0.1}>
                    <p className="eyebrow mb-6 text-amethyst-bright">{service.eyebrow}</p>
                    <h2 className="font-display text-display-md font-light">{service.title}</h2>
                    <p className="mt-7 text-base font-light leading-loose text-ivory-dim">
                      {service.description}
                    </p>

                    <div className="mt-10">
                      <p className="eyebrow mb-6">What&rsquo;s Included</p>
                      <ul className="space-y-4">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-4 border-b border-noir-line pb-4 text-sm font-light text-ivory/85"
                          >
                            <span className="mt-[0.55em] inline-block h-1 w-1 shrink-0 rounded-full bg-amethyst" aria-hidden />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-10">
                      <Button href="/contact" variant="ghost">
                        Inquire About This Experience
                      </Button>
                    </div>
                  </Reveal>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {/* Process */}
      <section className="bg-noir py-28 md:py-40">
        <div className="container-site">
          <SectionHeading
            eyebrow="How It Works"
            lines={["From first call", "to final keepsake."]}
            className="mb-20"
          />
          <div className="grid grid-cols-1 gap-px bg-noir-line md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => (
              <Reveal key={step.number} delay={i * 0.1} className="bg-noir">
                <div className="group h-full p-9 transition-colors duration-700 ease-luxe hover:bg-noir-raise md:p-10">
                  <p className="font-display text-5xl font-light text-noir-line transition-colors duration-700 group-hover:text-amethyst">
                    {step.number}
                  </p>
                  <h3 className="mt-8 font-display text-2xl font-light">{step.title}</h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-ivory-dim">
                    {step.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
