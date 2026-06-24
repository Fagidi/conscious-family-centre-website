"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PortableText } from "@portabletext/react";
import type { TeamMember } from "@/lib/types";

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
}

export default function TeamModal({ isOpen, onClose, member }: TeamModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-cream rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 md:p-12"
          >
            <div className="mb-8">
              <h2 className="font-display text-4xl font-semibold text-forest-900 mb-2">
                {member.name}
              </h2>
              <p className="text-lg font-semibold text-leaf-600">
                {member.role}
              </p>
              {member.department && (
                <p className="text-sm text-bark-700/60 mt-1 capitalize">
                  {member.department}
                </p>
              )}
            </div>

            {member.fullBio && Array.isArray(member.fullBio) && member.fullBio.length > 0 ? (
              <div className="mb-8 prose prose-lg prose-forest max-w-none text-bark-700/85">
                <PortableText value={member.fullBio} />
              </div>
            ) : member.shortBio ? (
              <div className="mb-8">
                <p className="text-lg leading-relaxed text-bark-700/85">
                  {member.shortBio}
                </p>
              </div>
            ) : null}

            {member.qualifications && member.qualifications.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-xl font-semibold text-forest-900 mb-4">
                  Qualifications
                </h3>
                <ul className="space-y-3">
                  {member.qualifications.map((qual, i) => (
                    <li key={i} className="flex gap-3 text-bark-700/80">
                      <span className="text-leaf-600 font-semibold flex-shrink-0">&#10003;</span>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {(member.email || member.socialLinks) && (
              <div className="mb-8 flex flex-wrap gap-4">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email
                  </a>
                )}
                {member.socialLinks?.linkedin && (
                  <a
                    href={member.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
                {member.socialLinks?.instagram && (
                  <a
                    href={member.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {member.socialLinks?.twitter && (
                  <a
                    href={member.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-leaf-600 hover:text-leaf-700 transition-colors"
                  >
                    Twitter
                  </a>
                )}
              </div>
            )}

            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-leaf-600 text-cream font-semibold hover:bg-leaf-700 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
