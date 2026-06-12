import type { Metadata } from "next";
import Image from "@/components/ui/CineImage";
import { getContactContent, getSiteSettings } from "@/lib/data";
import { pageSeo } from "@/lib/content";
import ContactForm from "@/components/contact/ContactForm";
import Reveal from "@/components/animation/Reveal";
import TextReveal from "@/components/animation/TextReveal";
import ImageReveal from "@/components/animation/ImageReveal";
import Parallax from "@/components/animation/Parallax";

export const metadata: Metadata = {
  title: pageSeo.contact.title,
  description: pageSeo.contact.description,
};

export default async function ContactPage() {
  const [content, settings] = await Promise.all([getContactContent(), getSiteSettings()]);

  return (
    <>
      <section className="bg-noir pt-40 md:pt-52">
        <div className="container-site grid grid-cols-1 gap-16 pb-28 md:pb-40 lg:grid-cols-12">
          {/* Left — invitation + details */}
          <div className="lg:col-span-5">
            <Reveal y={24}>
              <p className="eyebrow mb-8 flex items-center gap-4">
                <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
                {content.eyebrow}
              </p>
            </Reveal>

            <TextReveal
              as="h1"
              immediate
              delay={0.25}
              lines={content.titleLines}
              className="font-display text-display-lg font-light"
            />

            <Reveal delay={0.45}>
              <p className="mt-8 max-w-md text-base font-light leading-relaxed text-ivory-dim">
                {content.body}
              </p>
            </Reveal>

            <Reveal delay={0.55} className="mt-14 space-y-7">
              <div>
                <p className="eyebrow mb-2">Email</p>
                <a
                  href={`mailto:${settings.email}`}
                  className="link-underline font-display text-xl font-light text-ivory hover:text-amethyst-bright"
                >
                  {settings.email}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Phone</p>
                <a
                  href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}
                  className="link-underline font-display text-xl font-light text-ivory hover:text-amethyst-bright"
                >
                  {settings.phone}
                </a>
              </div>
              <div>
                <p className="eyebrow mb-2">Based In</p>
                <p className="font-display text-xl font-light text-ivory">{settings.location}</p>
                <p className="mt-2 text-xs font-light uppercase tracking-[0.2em] text-ivory-faint">
                  {settings.serviceArea}
                </p>
              </div>
            </Reveal>

            <ImageReveal className="mt-16 hidden aspect-[4/5] max-w-sm lg:block" delay={0.3}>
              <Parallax className="h-full" amount={12}>
                <Image
                  src={content.image}
                  alt={content.imageAlt}
                  fill
                  sizes="384px"
                  className="object-cover"
                />
              </Parallax>
            </ImageReveal>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.4}>
              <div className="border border-noir-line p-8 md:p-14">
                <p className="eyebrow mb-10">Booking Inquiry</p>
                <ContactForm eventTypes={content.eventTypes} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
