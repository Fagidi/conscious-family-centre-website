"use client";

import { useRef } from "react";
import Image from "@/components/ui/CineImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Reveal from "@/components/animation/Reveal";
import type { GalleryImage, HomePageContent } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface GalleryStripProps {
  images: GalleryImage[];
  heading: HomePageContent["gallerySection"];
}

/**
 * A wide film-strip of event imagery that glides horizontally
 * against vertical scroll — the site's most cinematic moment.
 */
export default function GalleryStrip({ images, heading }: GalleryStripProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const track = el.querySelector("[data-track]") as HTMLElement | null;
      if (!track) return;

      gsap.to(track, {
        x: () => -(track.scrollWidth - el.clientWidth + 64),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <section ref={ref} className="overflow-hidden bg-noir py-28 md:py-40">
      <div className="container-site mb-14 flex items-end justify-between gap-8">
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-4">
            <span className="inline-block h-px w-10 bg-amethyst" aria-hidden />
            {heading.eyebrow}
          </p>
          <h2 className="font-display text-display-md font-light">{heading.title}</h2>
        </Reveal>
      </div>

      <div data-track className="flex w-max gap-5 pl-6 will-change-transform md:gap-8 md:pl-20">
        {images.map((img, i) => (
          <figure
            key={i}
            className={`group relative shrink-0 overflow-hidden ${
              i % 3 === 1 ? "aspect-[3/4] w-[260px] md:w-[360px]" : "aspect-[4/3] w-[320px] md:w-[480px]"
            } ${i % 2 === 1 ? "mt-10 md:mt-16" : ""}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 768px) 480px, 320px"
              className="object-cover transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.05]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-noir/85 to-transparent p-5 text-[0.62rem] uppercase tracking-[0.26em] text-ivory/0 transition-all duration-700 ease-luxe group-hover:translate-y-0 group-hover:text-ivory/85">
              {img.caption ?? img.alt}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
