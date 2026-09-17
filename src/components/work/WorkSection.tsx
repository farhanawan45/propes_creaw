"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { site } from "@/content/site";
import WorkStackCard from "@/components/work/WorkStackCard";
import WorkLightbox from "@/components/work/WorkLightbox";

const projects = site.work.projects;

export default function WorkSection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="work" className="relative overflow-visible bg-ivory section-pad-top pb-[120px]">
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
            <p className="mt-4 max-w-md text-lg font-light text-stone">{site.work.intro}</p>
          </div>
          <div className="font-mono-label hidden text-stone lg:block">
            {String(projects.length).padStart(2, "0")} Projects
          </div>
        </div>

        <div
          className="relative [--stack-top-base:80px] [--stack-top-step:14px] sm:[--stack-top-base:100px] sm:[--stack-top-step:18px] lg:[--stack-top-base:110px] lg:[--stack-top-step:24px]"
        >
          {projects.map((project, i) => (
            <WorkStackCard
              key={project.id}
              project={project}
              index={i}
              total={projects.length}
              imageOnLeft={i % 2 === 1}
              isLast={i === projects.length - 1}
              onView={() => setLightboxIndex(i)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <WorkLightbox projects={projects} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
