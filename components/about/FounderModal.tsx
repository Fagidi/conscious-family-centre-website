"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FounderModalProps {
  founderName: string;
  founderBio: string;
}

export default function FounderModal({ founderName, founderBio }: FounderModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex px-6 py-3 rounded-full bg-leaf-600 text-cream font-semibold hover:bg-leaf-700 transition-colors"
      >
        Read Full Story →
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-cream rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 md:p-12"
            >
              <h3 className="font-display text-3xl font-semibold text-forest-900 mb-6">
                {founderName}'s Story
              </h3>

              <p className="text-lg leading-relaxed text-bark-700/85 mb-8">
                {founderBio}
              </p>

              <button
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 rounded-full bg-leaf-600 text-cream font-semibold hover:bg-leaf-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
