"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { site } from "@/content/site";
import WorkStackCard from "@/components/work/WorkStackCard";
import WorkLightbox from "@/components/work/WorkLightbox";

const projects = site.work.projects;
const filters = ["All", "Celebrations", "Corporate", "Journeys"] as const;
type WorkFilter = (typeof filters)[number];

function matchesFilter(project: (typeof projects)[number], filter: WorkFilter) {
  if (filter === "All") return true;
  if (filter === "Corporate") return project.id === "auckland-mice" || project.id === "wellington-gala";
  if (filter === "Celebrations") return project.id === "queenstown-wedding" || project.id === "bayofislands-cruise" || project.id === "wellington-gala";
  return project.id === "rotorua-incentive" || project.id === "wanaka-heli";
}

export default function WorkSection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<WorkFilter>("All");
  const filteredProjects = projects.filter((project) => matchesFilter(project, activeFilter));

  return (
    <section id="work" className="relative overflow-visible bg-ivory pb-[120px] pt-10 sm:pt-12 lg:pt-14">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono-label text-stone">{site.work.label}</div>
            <h2
              className="mt-4 max-w-xl font-display font-semibold tracking-tight text-ink"
              style={{ fontSize: "clamp(40px, 5.5vw, 88px)", letterSpacing: "-0.035em" }}
            >
              Our <span className="text-copper-deep">Work</span>
            </h2>
            <p className="mt-4 max-w-3xl text-lg font-light leading-relaxed text-stone">{site.work.intro}</p>
          </div>
          <div className="font-mono-label hidden text-stone lg:block">
            {String(filteredProjects.length).padStart(2, "0")} Projects
          </div>
        </div>

        <div className="mb-10 flex max-w-full gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => { setActiveFilter(filter); setLightboxIndex(null); }}
              aria-pressed={activeFilter === filter}
              className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-all focus-ring ${activeFilter === filter ? "border-pounamu-night bg-pounamu-night text-ivory shadow-[0_8px_24px_rgba(4,22,63,.18)]" : "border-linen-border bg-white text-stone hover:border-copper hover:text-copper-deep"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div
          key={activeFilter}
          className="relative [--stack-top-base:80px] sm:[--stack-top-base:100px] lg:[--stack-top-base:110px]"
        >
          {filteredProjects.map((project, i) => (
            <WorkStackCard
              key={project.id}
              project={project}
              index={i}
              total={filteredProjects.length}
              imageOnLeft={i % 2 === 1}
              onView={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <WorkLightbox projects={filteredProjects} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
