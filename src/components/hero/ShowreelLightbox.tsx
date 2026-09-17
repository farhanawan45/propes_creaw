"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { site } from "@/content/site";

export default function ShowreelLightbox({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    videoRef.current?.play().catch(() => {});
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Showreel"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-pounamu-night/95 p-3 sm:p-8"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close showreel"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-deep-line text-ivory focus-ring hover:border-copper hover:text-copper sm:right-8 sm:top-8"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <line x1="1" y1="1" x2="15" y2="15" />
          <line x1="15" y1="1" x2="1" y2="15" />
        </svg>
      </button>
      <div className="w-[96vw] max-w-[1280px] overflow-hidden rounded-2xl border border-copper/25 bg-black shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={site.hero.video.showreelMp4}
          poster={site.hero.video.poster}
          controls
          playsInline
          preload="metadata"
          className="aspect-video max-h-[82svh] w-full bg-black object-cover"
        />
      </div>
    </motion.div>
  );
}
