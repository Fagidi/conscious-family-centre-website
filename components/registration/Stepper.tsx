"use client";

import { cn } from "@/lib/utils";

interface StepperProps {
  steps: { key: string; title: string }[];
  current: number;
}

/** Horizontal progress indicator for the registration flow. */
export default function Stepper({ steps, current }: StepperProps) {
  const pct = Math.round((current / (steps.length - 1)) * 100);

  return (
    <div>
      {/* Mobile: compact "Step X of Y" + bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-forest-900">{steps[current]?.title}</span>
          <span className="text-bark-700/60">
            Step {current + 1} of {steps.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-forest-700/10">
          <div className="h-full rounded-full bg-leaf-600 transition-all duration-500 ease-organic" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Desktop: numbered steps */}
      <ol className="hidden items-center gap-1 sm:flex" aria-label="Registration progress">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={step.key} className="flex flex-1 items-center gap-2">
              <span
                aria-current={active ? "step" : undefined}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                  done && "bg-leaf-600 text-cream",
                  active && "bg-leaf-600 text-cream ring-4 ring-leaf-600/20",
                  !done && !active && "bg-forest-700/10 text-bark-700/60",
                )}
              >
                {done ? "✓" : i + 1}
              </span>
              <span className={cn("hidden text-xs font-medium lg:block", active ? "text-forest-900" : "text-bark-700/55")}>
                {step.title}
              </span>
              {i < steps.length - 1 && <span aria-hidden className={cn("h-px flex-1", done ? "bg-leaf-600" : "bg-forest-700/15")} />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
