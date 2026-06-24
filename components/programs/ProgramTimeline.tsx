import Reveal from "@/components/motion/Reveal";

interface TimelineItem {
  time: string;
  activity: string;
}

/**
 * "A day in the life" — a calm vertical timeline of schedule items. Renders
 * only when the program has a day-in-the-life set in the CMS.
 */
export default function ProgramTimeline({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) return null;

  return (
    <ol className="relative ml-3 border-l border-forest-700/15">
      {items.map((item, i) => (
        <Reveal as="li" key={i} delay={i * 0.04} className="mb-8 ml-6 last:mb-0">
          <span
            aria-hidden
            className="absolute -left-[7px] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-cream bg-leaf-600"
          />
          <p className="text-sm font-semibold uppercase tracking-wide text-leaf-600">{item.time}</p>
          <p className="mt-1 text-lg text-bark-700/90">{item.activity}</p>
        </Reveal>
      ))}
    </ol>
  );
}
