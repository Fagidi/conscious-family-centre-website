import Link from "next/link";
import type { ProgramPreview } from "@/lib/types";
import { AGE_BANDS } from "@/lib/constants";
import SmartImage from "@/components/ui/SmartImage";
import Tag from "@/components/ui/Tag";

/** Program preview card — image, age tags, title, summary. */
export default function ProgramCard({ program }: { program: ProgramPreview }) {
  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group block overflow-hidden rounded-card-lg bg-white shadow-soft transition-shadow duration-500 ease-organic hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          image={program.heroImage}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(program.ageBands ?? []).map((band) => (
            <Tag key={band} tone="sage">
              {AGE_BANDS[band]?.label ?? band}
            </Tag>
          ))}
        </div>
        <h3 className="text-xl font-semibold text-forest-900 group-hover:text-leaf-600">{program.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-bark-700/80">{program.summary}</p>
      </div>
    </Link>
  );
}
