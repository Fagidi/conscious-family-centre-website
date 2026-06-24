import Link from "next/link";
import type { TeamMember } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";

/**
 * Team profile card — portrait with a gentle hover lift, name + role. Links to
 * the member's profile page when a slug is present.
 */
export default function TeamCard({ member }: { member: TeamMember }) {
  const inner = (
    <>
      <div className="relative aspect-[4/5] overflow-hidden rounded-card-lg bg-sage-100">
        {member.photo?.src && (
          <SmartImage
            image={member.photo}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-forest-900">{member.name}</h3>
      <p className="text-sm text-bark-700/70">{member.role}</p>
    </>
  );

  if (member.slug) {
    return (
      <Link
        href={`/about/team/${member.slug}`}
        className="group block rounded-card-lg outline-none focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2 focus-visible:ring-offset-sage-100"
      >
        {inner}
      </Link>
    );
  }

  return <div className="group">{inner}</div>;
}
