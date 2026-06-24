import { FEE_GROUPS } from "@/lib/futureMakers";
import { formatNaira } from "@/lib/utils";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/** Programme fees by age group — 2- and 4-week rates (verbatim from the brief). */
export default function FeeTable() {
  return (
    <Stagger className="grid gap-5 md:grid-cols-3">
      {FEE_GROUPS.map((g) => (
        <StaggerItem
          key={g.group}
          className="flex flex-col rounded-card-lg border border-forest-700/10 bg-white p-6 shadow-soft"
        >
          <h3 className="text-xl font-semibold text-forest-900">{g.label}</h3>
          <p className="text-sm text-bark-700/60">{g.ageLabel}</p>
          <dl className="mt-5 space-y-2 border-t border-forest-700/10 pt-5">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-bark-700/70">2 weeks</dt>
              <dd className="text-lg font-semibold text-forest-900">{formatNaira(g.two)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-bark-700/70">4 weeks</dt>
              <dd className="text-lg font-semibold text-forest-900">{formatNaira(g.four)}</dd>
            </div>
          </dl>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
