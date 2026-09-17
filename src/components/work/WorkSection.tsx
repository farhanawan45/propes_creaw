"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { site, type WorkProject } from "@/content/site";
import MagneticButton from "@/components/ui/MagneticButton";
import WorkPanel from "@/components/work/WorkPanel";
import WorkMobileGallery from "@/components/work/WorkMobileGallery";
import WorkLightbox from "@/components/work/WorkLightbox";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const projects = site.work.projects;
const AUTOPLAY_MS = 5000;
const HOVER_INTENT_MS = 150;

export default function WorkSection() {
  const isDesktop = useMediaQuery("(min-width: 1024px)", true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryHovered, setGalleryHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lightboxProject, setLightboxProject] = useState<WorkProject | null>(null);

  const hoverTimeoutRef = useRef<number | null>(null);
  const galleryHoveredRef = useRef(false);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    galleryHoveredRef.current = galleryHovered;
  }, [galleryHovered]);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Autoplay — advances every 5s while the pointer isn't over the gallery.
  useEffect(() => {
    if (!isDesktop || galleryHovered) return;

    let raf: number;
    let start: number | null = null;

    const tick = (t: number) => {
      if (galleryHoveredRef.current) return;
      if (start === null) start = t;
      const elapsed = t - start;
      const p = Math.min(1, elapsed / AUTOPLAY_MS);
      setProgress(p);
      if (p >= 1) {
        setActiveIndex((activeIndexRef.current + 1) % projects.length);
        start = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDesktop, galleryHovered]);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handlePanelEnter = (i: number) => {
    setGalleryHovered(true);
    clearHoverTimeout();
    hoverTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(i);
      setProgress(0);
    }, HOVER_INTENT_MS);
  };

  const handlePanelLeave = () => {
    clearHoverTimeout();
  };

  const handleGalleryLeave = () => {
    setGalleryHovered(false);
    clearHoverTimeout();
    setProgress(0);
  };

  const handlePanelClick = (i: number) => {
    clearHoverTimeout();
    setGalleryHovered(true);
    setActiveIndex(i);
    setProgress(0);
  };

  const goPrev = () => setActiveIndex((activeIndex - 1 + projects.length) % projects.length);
  const goNext = () => setActiveIndex((activeIndex + 1) % projects.length);

  return (
    <section id="work" className="relative overflow-hidden bg-ivory section-pad">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14">
          <div className="font-mono-label text-stone">{site.work.label}</div>
          <h2
            className="mt-4 max-w-xl font-display font-semibold tracking-tight text-ink"
            style={{ fontSize: "clamp(40px, 5.5vw, 88px)", letterSpacing: "-0.035em" }}
          >
            Our <span className="text-copper-deep">Work</span>
          </h2>
          <p className="mt-4 max-w-md text-lg font-light text-stone">{site.work.intro}</p>
        </div>

        {isDesktop ? (
          <>
            <div
              onMouseLeave={handleGalleryLeave}
              className="flex w-full gap-3"
              style={{ height: "clamp(560px, 72vh, 760px)" }}
            >
              {projects.map((project, i) => (
                <WorkPanel
                  key={project.id}
                  project={project}
                  index={i}
                  active={i === activeIndex}
                  progress={i === activeIndex ? progress : 0}
                  onEnter={() => handlePanelEnter(i)}
                  onLeave={handlePanelLeave}
                  onClick={() => handlePanelClick(i)}
                  onView={() => setLightboxProject(project)}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-6">
              <div className="font-mono-label tabular-nums text-ink">
                <span className="text-copper-ink">{String(activeIndex + 1).padStart(2, "0")}</span>
                {" / "}
                {String(projects.length).padStart(2, "0")}
              </div>
              <div className="flex gap-3">
                <MagneticButton
                  as="button"
                  onClick={goPrev}
                  aria-label="Previous project"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-copper hover:border-copper hover:text-ivory focus-ring"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </MagneticButton>
                <MagneticButton
                  as="button"
                  onClick={goNext}
                  aria-label="Next project"
                  className="flex h-14 w-14 items-center justify-center rounded-full border border-ink text-ink transition-colors hover:bg-copper hover:border-copper hover:text-ivory focus-ring"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </MagneticButton>
              </div>
            </div>
          </>
        ) : (
          <WorkMobileGallery projects={projects} onView={setLightboxProject} />
        )}
      </div>

      <AnimatePresence>
        {lightboxProject && <WorkLightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />}
      </AnimatePresence>
    </section>
  );
}
