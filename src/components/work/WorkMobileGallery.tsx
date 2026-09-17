"use client";

import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import type { WorkProject } from "@/content/site";

export default function WorkMobileGallery({
  projects,
  onView,
}: {
  projects: WorkProject[];
  onView: (project: WorkProject) => void;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="mx-auto aspect-[4/5] w-full max-w-[360px]">
        <Swiper
          modules={[EffectCards]}
          effect="cards"
          grabCursor
          cardsEffect={{ perSlideOffset: 8, perSlideRotate: 3, slideShadows: false }}
          onSlideChange={(swiper: SwiperType) => setActive(swiper.activeIndex)}
          className="work-cards-swiper h-full w-full"
        >
          {projects.map((project, i) => (
            <SwiperSlide key={project.id}>
              <button
                type="button"
                onClick={() => onView(project)}
                className="relative block aspect-[4/5] h-full w-full overflow-hidden rounded-[24px] text-left"
                aria-label={`View ${project.title}`}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} — ${project.location}`}
                  fill
                  priority={i === 0}
                  sizes="360px"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pounamu-night via-pounamu-night/20 to-transparent" />
                <div className="absolute left-5 top-5">
                  <span className="font-mono-label rounded-full border border-ivory/30 bg-pounamu-night/40 px-3 py-1.5 text-ivory backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="font-mono-label text-copper">{project.location}, New Zealand</div>
                  <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-ivory">
                    {project.title}
                  </h3>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="font-mono-label tabular-nums text-mist">
          <span className="text-copper">{String(active + 1).padStart(2, "0")}</span>
          {" / "}
          {String(projects.length).padStart(2, "0")}
        </div>
        <div className="flex gap-2">
          {projects.map((project, i) => (
            <span
              key={project.id}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-5 bg-copper" : "w-1.5 bg-linen-border"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
