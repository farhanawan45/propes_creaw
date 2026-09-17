"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { WorkProject } from "@/content/site";

interface WorkPanelProps {
  project: WorkProject;
  index: number;
  active: boolean;
  progress: number; // 0-1, only meaningful while active
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
  onView: () => void;
}

export default function WorkPanel({ project, index, active, progress, onEnter, onLeave, onClick, onView }: WorkPanelProps) {
  return (
    <div
      data-work-panel
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      className="group relative h-full min-w-0 cursor-pointer overflow-hidden rounded-[24px] bg-pounamu-night"
      style={{
        flexGrow: active ? 6 : 1,
        flexShrink: 1,
        flexBasis: 0,
        transition: "flex-grow 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* key forces the image (and its Ken Burns animation) to restart
          cleanly every time this panel's active state flips. */}
      <div key={active ? "active" : "inactive"} className="absolute inset-0">
        <Image
          src={project.image}
          alt={`${project.title} — ${project.location}`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          priority={index === 0}
          className={active ? "object-cover work-kenburns" : "object-cover transition-[filter] duration-500"}
          style={!active ? { filter: "brightness(0.55) saturate(0.85)" } : undefined}
        />
      </div>

      {!active && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pounamu-night/50 via-transparent to-pounamu-night/80" />
          <div className="font-mono-label absolute left-4 top-5 text-ivory/80">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <span
              className="block whitespace-nowrap text-sm font-medium tracking-wide text-ivory"
              style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
            >
              {project.title}
            </span>
          </div>
        </>
      )}

      {active && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pounamu-night via-pounamu-night/20 to-transparent" />

          <div className="absolute left-0 right-0 top-0 h-[3px] bg-ivory/15">
            <div
              className="h-full bg-copper"
              style={{ width: `${progress * 100}%`, transition: "width 80ms linear" }}
            />
          </div>

          <div className="absolute left-6 top-6">
            <span className="font-mono-label rounded-full border border-ivory/30 bg-pounamu-night/40 px-3 py-1.5 text-ivory backdrop-blur-sm">
              {project.category}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <div className="font-mono-label text-copper">{project.location}, New Zealand</div>
            <div key={project.id} className="mt-2 overflow-hidden">
              <h3
                className="work-title-reveal font-display font-semibold leading-[1.05] text-ivory"
                style={{ fontSize: "clamp(32px, 3vw, 48px)", letterSpacing: "-0.02em" }}
              >
                {project.title}
              </h3>
            </div>
            <p className="mt-3 max-w-sm text-sm font-light text-ivory/80">{project.description}</p>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView();
              }}
              aria-label={`View ${project.title}`}
              data-cursor="View"
              className="mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-copper text-pounamu-night transition-transform duration-300 hover:scale-110 focus-ring"
            >
              <ArrowUpRight className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
