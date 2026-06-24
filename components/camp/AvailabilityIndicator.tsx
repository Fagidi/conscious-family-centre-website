import type { CampSession } from "@/lib/types";
import Tag from "@/components/ui/Tag";

/**
 * Capacity signal. NOTE: `spotsRemaining` is derived and may be ~60s stale
 * via ISR — the registration flow re-checks live at submit (risk review B2).
 */
export default function AvailabilityIndicator({ camp }: { camp: Pick<CampSession, "capacity" | "spotsRemaining" | "status"> }) {
  if (camp.status === "full" || camp.spotsRemaining <= 0) {
    return <Tag tone="clay">Fully booked — join the waitlist</Tag>;
  }

  const low = camp.spotsRemaining <= Math.max(5, Math.round(camp.capacity * 0.2));
  return (
    <Tag tone={low ? "sun" : "leaf"}>
      {low ? `Only ${camp.spotsRemaining} spots left` : `${camp.spotsRemaining} spots available`}
    </Tag>
  );
}
