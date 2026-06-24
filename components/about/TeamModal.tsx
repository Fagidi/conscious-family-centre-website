"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  qualifications?: string[];
}

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
            {/* Header */}
            <div className="mb-8">
              <h2 className="font-display text-4xl font-semibold text-forest-900 mb-2">
                {member.name}
              </h2>
              <p className="text-lg font-semibold text-leaf-600">
                {member.role}
              </p>
            </div>

            {/* Bio */}
            {member.bio && (
              <div className="mb-8">
                <p className="text-lg leading-relaxed text-bark-700/85">
                  {member.bio}
                </p>
              </div>
            )}

            {/* Qualifications */}
            {member.qualifications && member.qualifications.length > 0 && (
              <div className="mb-8">
                <h3 className="font-display text-xl font-semibold text-forest-900 mb-4">
                  Qualifications
                </h3>
                <ul className="space-y-3">
                  {member.qualifications.map((qual, i) => (
                    <li key={i} className="flex gap-3 text-bark-700/80">
                      <span className="text-leaf-600 font-semibold flex-shrink-0">✓</span>
                      <span>{qual}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Close Button */}
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
