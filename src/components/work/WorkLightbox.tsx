"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { WorkProject } from "@/content/site";

export default function WorkLightbox({ project, onClose }: { project: WorkProject; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-pounamu-night/95 p-5 sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-deep-line text-ivory focus-ring hover:border-copper hover:text-copper sm:right-8 sm:top-8"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <line x1="1" y1="1" x2="15" y2="15" />
          <line x1="15" y1="1" x2="1" y2="15" />
        </svg>
      </button>
      <div
        className="relative aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Image src={project.image} alt={project.title} fill sizes="90vw" className="object-cover" />
      </div>
      <div className="mt-6 text-center">
        <div className="font-mono-label text-copper">{project.location}, New Zealand</div>
        <h3 className="mt-2 font-display text-2xl font-semibold text-ivory">{project.title}</h3>
        <p className="mt-2 text-sm text-mist">Case study coming soon.</p>
      </div>
    </motion.div>
  );
}
