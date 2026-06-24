import Section from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

const LINES = ["Families are seen.", "Families are supported.", "Families belong."];

/**
 * Emotional community statement — large, staggered three-line headline
 * (Monkton-inspired restraint). Sets up the community split that follows.
 */
export default function CommunityStatement() {
  return (
    <Section tone="cream" spacing="xl">
      <Stagger className="max-w-4xl">
        {LINES.map((line, i) => (
          <StaggerItem key={line}>
            <p className={`font-display text-display-lg leading-tight ${i === LINES.length - 1 ? "text-leaf-600" : "text-forest-900"}`}>
              {line}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
