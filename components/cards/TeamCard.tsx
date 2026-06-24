"use client";

import { useState } from "react";
import type { TeamMember } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import TeamModal from "@/components/about/TeamModal";

export default function TeamCard({ member }: { member: TeamMember }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group block w-full text-left rounded-card-lg outline-none focus-visible:ring-2 focus-visible:ring-leaf-600 focus-visible:ring-offset-2 focus-visible:ring-offset-sage-100"
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-card-lg bg-sage-100">
          {member.photo?.src && (
            <SmartImage
              image={member.photo}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
            />
          )}
          {member.founder && (
            <span className="absolute top-3 left-3 bg-leaf-600 text-cream text-xs font-semibold px-3 py-1 rounded-full">
              Founder
            </span>
          )}
        </div>
        <h3 className="mt-4 text-lg font-semibold text-forest-900">{member.name}</h3>
        <p className="text-sm text-bark-700/70">{member.role}</p>
      </button>

      <TeamModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        member={member}
      />
    </>
  );
}
