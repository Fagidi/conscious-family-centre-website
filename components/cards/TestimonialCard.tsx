import type { Testimonial } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";

/** Editorial testimonial card. */
export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-card-lg border border-forest-700/10 bg-white p-7 shadow-soft">
      <span aria-hidden className="font-display text-5xl leading-none text-leaf-600/40">“</span>
      <blockquote className="mt-2 flex-1 text-lg leading-relaxed text-bark-700/90">{testimonial.quote}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        {testimonial.photo && (
          <span className="relative h-11 w-11 overflow-hidden rounded-full">
            <SmartImage image={testimonial.photo} fill sizes="44px" className="object-cover" />
          </span>
        )}
        <span>
          <span className="block font-semibold text-forest-900">{testimonial.authorName}</span>
          {testimonial.childAge && <span className="block text-sm text-bark-700/70">{testimonial.childAge}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
