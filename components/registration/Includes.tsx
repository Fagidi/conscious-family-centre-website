import { INCLUDES } from "@/lib/futureMakers";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

function Check() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className="h-4 w-4 shrink-0 text-leaf-600">
      <path d="M4 10.5 8 14.5 16 6" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** "What's included" — the programme highlights grid (verbatim from the brief). */
export default function Includes() {
  return (
    <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" gap={0.04}>
      {INCLUDES.map((item) => (
        <StaggerItem
          key={item}
          className="flex items-center gap-3 rounded-card border border-forest-700/10 bg-white px-4 py-3 shadow-soft"
        >
          <Check />
          <span className="text-bark-700/90">{item}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
