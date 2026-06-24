"use client";

import { useState } from "react";
import type { TeamMember } from "@/lib/types";
import SmartImage from "@/components/ui/SmartImage";
import TeamModal from "./TeamModal";

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="group rounded-2xl border border-forest-700/10 bg-cream overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative aspect-square bg-forest-700/10 overflow-hidden">
          {member.photo?.src ? (
            <SmartImage
              image={member.photo}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-organic group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-leaf-600/20 to-leaf-700/20">
              <span className="text-5xl font-bold text-leaf-600 opacity-30">
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
          )}
          {member.founder && (
            <span className="absolute top-3 left-3 bg-leaf-600 text-cream text-xs font-semibold px-3 py-1 rounded-full">
              Founder
            </span>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-forest-900 mb-1">
            {member.name}
          </h3>

          <p className="text-sm font-semibold text-leaf-600 mb-4">
            {member.role}
          </p>

          {member.shortBio && (
            <p className="text-sm text-bark-700/70 mb-4 line-clamp-3">
              {member.shortBio}
            </p>
          )}

          {member.qualifications && member.qualifications.length > 0 && (
            <div className="mb-4 space-y-1">
              {member.qualifications.slice(0, 2).map((qual, i) => (
                <p key={i} className="text-xs text-bark-700/60 flex items-center gap-2">
                  <span className="text-leaf-600">&#10003;</span> {qual}
                </p>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
          >
            View Profile &rarr;
          </button>
        </div>
      </div>

      <TeamModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        member={member}
      />
    </>
  );
}
