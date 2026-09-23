"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { WorkProject } from "@/content/site";

const SWIPE_THRESHOLD = 80;

export default function WorkLightbox({
  projects,
  initialIndex,
  onClose,
}: {
  projects: WorkProject[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(1);
  const project = projects[index];
  const previousProject = projects[(index - 1 + projects.length) % projects.length];
  const nextProject = projects[(index + 1) % projects.length];

  const goPrev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + projects.length) % projects.length);
  };
  const goNext = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % projects.length);
  };

  useEffect(() => {
    [project, previousProject, nextProject].forEach((item) => {
      const image = new window.Image();
      image.src = item.image;
    });
  }, [project, previousProject, nextProject]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") {
        setDirection(-1);
        setIndex((i) => (i - 1 + projects.length) % projects.length);
      }
      if (e.key === "ArrowRight") {
        setDirection(1);
        setIndex((i) => (i + 1) % projects.length);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, projects.length]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) goPrev();
    else if (info.offset.x < -SWIPE_THRESHOLD) goNext();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-pounamu-night/95 p-5 sm:p-10"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-deep-line text-ivory focus-ring hover:border-copper hover:text-copper sm:right-8 sm:top-8"
      >
        <X className="h-4 w-4" strokeWidth={1.8} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        aria-label="Previous project"
        className="absolute left-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-deep-line text-ivory focus-ring hover:border-copper hover:text-copper sm:left-6 sm:flex"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        aria-label="Next project"
        className="absolute right-3 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-deep-line text-ivory focus-ring hover:border-copper hover:text-copper sm:right-6 sm:flex"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
      </button>

      <div className="grid w-full max-w-5xl">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={project.id}
            initial={{ opacity: 0, x: direction > 0 ? 80 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -80 : 80 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={handleDragEnd}
            className="relative col-start-1 row-start-1 flex w-full flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              role="img"
              aria-label={project.title}
              className="relative aspect-[16/10] w-full touch-pan-y overflow-hidden rounded-2xl bg-pounamu bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url("${project.image}")` }}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pounamu-night/20 to-transparent" />
            </div>
            <div className="mt-6 text-center">
              <div className="font-mono-label text-copper">{project.location}, New Zealand</div>
              <h3 className="mt-2 font-display text-2xl font-semibold text-ivory">{project.title}</h3>
              <p className="mt-2 text-sm text-mist">Case study coming soon.</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 font-mono-label tabular-nums text-mist sm:hidden">
        <span className="text-copper">{String(index + 1).padStart(2, "0")}</span>
        {" / "}
        {String(projects.length).padStart(2, "0")}
      </div>
    </motion.div>
  );
}
