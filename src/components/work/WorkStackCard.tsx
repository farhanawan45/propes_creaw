"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import type { WorkProject } from "@/content/site";

interface WorkStackCardProps {
  project: WorkProject;
  index: number;
  total: number;
  imageOnLeft: boolean;
  onView: () => void;
}

export default function WorkStackCard({ project, index, total, imageOnLeft, onView }: WorkStackCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const revealScopeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      // One-time reveal of the text content as the card enters view.
      const items = revealScopeRef.current?.querySelectorAll<HTMLElement>("[data-reveal]");
      if (reduced) {
        gsap.set(items ?? [], { opacity: 1, yPercent: 0 });
      } else if (items?.length) {
        gsap.fromTo(
          items,
          { opacity: 0, yPercent: 100 },
          {
            opacity: 1,
            yPercent: 0,
            duration: 0.7,
            stagger: 0.07,
            ease: "power4.out",
            scrollTrigger: { trigger: wrapperRef.current, start: "top 80%", once: true },
          }
        );

        gsap.fromTo(
          imagePanelRef.current,
          { clipPath: "inset(0 0 100% 0 round 24px)" },
          {
            clipPath: "inset(0 0 0% 0 round 24px)",
            duration: 1.15,
            ease: "power4.inOut",
            scrollTrigger: { trigger: wrapperRef.current, start: "top 82%", once: true },
          }
        );
      }

      if (reduced) return;

      // Subtle parallax on the image — desktop only, transform/opacity-only.
      if (imageWrapRef.current && window.matchMedia("(min-width: 1024px)").matches) {
        gsap.fromTo(
          imageWrapRef.current,
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === wrapperRef.current) t.kill();
        });
      };
    },
    { scope: wrapperRef }
  );

  return (
    <div
      ref={wrapperRef}
      className="sticky z-[var(--stack-z)] h-[85svh] lg:h-[560px] xl:h-[580px]"
      style={
        {
          top: `calc(var(--stack-top-base) + ${index} * var(--stack-top-step))`,
          "--stack-z": index + 1,
        } as React.CSSProperties
      }
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-[24px] border border-[rgba(17,24,20,0.08)] bg-pounamu-night shadow-[0_30px_80px_-40px_rgba(17,24,20,0.45)] lg:rounded-[28px]"
        style={{ filter: "none", transform: "none" }}
      >
        <div ref={revealScopeRef} className={`flex h-full flex-col lg:flex-row ${imageOnLeft ? "lg:flex-row-reverse" : ""}`}>
          {/* TEXT PANEL */}
          <div className="relative order-2 flex flex-1 flex-col justify-between bg-pounamu-night p-6 sm:p-8 lg:order-none lg:w-[42%] lg:flex-none lg:p-12">
            <div className="overflow-hidden">
              <div data-reveal className="flex items-center gap-3">
                <span className="font-display text-2xl font-semibold text-copper sm:text-3xl">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono-label rounded-[10px] border border-ivory/25 px-3 py-1 text-ivory">
                  {project.category}
                </span>
              </div>
            </div>

            <div className="mt-6 flex-1 lg:mt-8">
              <div className="overflow-hidden">
                <h3
                  data-reveal
                  className="font-display font-semibold leading-[1.05] text-ivory"
                  style={{ fontSize: "clamp(28px, 3.4vw, 44px)", letterSpacing: "-0.02em" }}
                >
                  {project.title}
                </h3>
              </div>
              <div className="mt-3 overflow-hidden">
                <div data-reveal className="flex items-center gap-2 text-copper">
                  <MapPin className="h-4 w-4" strokeWidth={1.5} />
                  <span className="font-mono-label">{project.location}, New Zealand</span>
                </div>
              </div>
              <div className="mt-4 overflow-hidden">
                <p data-reveal className="max-w-md text-base font-light leading-relaxed text-mist">
                  {project.description}
                </p>
              </div>

              <div className="mt-5 overflow-hidden">
                <div data-reveal className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={onView} className="btn-gradient flex h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-ivory focus-ring">
                    Gallery
                  </button>
                  <Link href={`/work/${project.id}`} prefetch className="btn-gradient-outline flex h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold text-ivory focus-ring">
                    Case study <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>

              <div className="mt-6 overflow-hidden">
                <div data-reveal className="grid grid-cols-3 gap-3 border-t border-deep-line pt-5">
                  {project.keyFacts.map((fact) => (
                    <div key={fact.label} className="min-w-0">
                      <div className="truncate text-base font-semibold text-ivory sm:text-lg lg:text-xl">
                        {fact.value}
                      </div>
                      <div className="font-mono-label mt-1 text-[10px] text-mist">{fact.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* IMAGE PANEL */}
          <div ref={imagePanelRef} className="relative order-1 aspect-[4/3] w-full shrink-0 overflow-hidden sm:aspect-[16/9] lg:order-none lg:aspect-auto lg:h-full lg:w-[58%]">
            <div ref={imageWrapRef} className="absolute inset-0 lg:-inset-y-[8%]">
              <Image
                src={project.image}
                alt={`${project.title} — ${project.location}`}
                fill
                quality={72}
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105 hover:scale-105"
              />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-pounamu-night/40 via-transparent to-transparent lg:hidden" />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-4 right-5 font-mono-label text-ivory/50 lg:bottom-6 lg:right-8">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
