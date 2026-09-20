"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { site } from "@/content/site";
import { useEnquiry } from "@/context/EnquiryContext";
import { scrollToHash } from "@/lib/scrollTo";

const cardThemes = ["#e4eee9", "#ead9c8", "#d5e4dc", "#efb487"] as const;
const imageBlur = "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 15'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Cpath fill='%23153a33' d='M0 0h12v15H0z'/%3E%3Cpath fill='%23c9774a' fill-opacity='.28' filter='url(%23b)' d='M-2 9l8-8 8 8-8 8z'/%3E%3C/svg%3E";

export default function ServicesSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const navRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { requestEnquiry } = useEnquiry();
  const service = site.services[active];

  const select = (next: number) => {
    const normalized = (next + site.services.length) % site.services.length;
    setDirection(next > active ? 1 : -1);
    setActive(normalized);
  };

  useEffect(() => {
    const nav = navRef.current;
    const button = nav?.querySelector<HTMLButtonElement>(`[data-service-index="${active}"]`);
    if (!nav || !button) return;

    // Centre the active tab inside the horizontal navigation only.
    // scrollIntoView() also moves the page vertically, which caused the site
    // to jump from the hero to this section when the carousel auto-advanced.
    const left = button.offsetLeft - (nav.clientWidth - button.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? "auto" : "smooth" });
  }, [active, reduceMotion]);

  useEffect(() => {
    const nearby = [
      active,
      (active + 1) % site.services.length,
      (active + 2) % site.services.length,
      (active - 1 + site.services.length) % site.services.length,
    ];

    nearby.forEach((index) => {
      const preload = new window.Image();
      preload.decoding = "async";
      preload.src = site.services[index].image;
    });
  }, [active]);

  const enquire = () => {
    requestEnquiry(service.id);
    scrollToHash("#contact");
  };

  return (
    <section id="services" className="relative overflow-hidden bg-pounamu-night py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-48 top-0 h-[520px] w-[520px] rounded-full bg-copper/[0.08] blur-[130px]" />
        <div className="absolute -right-48 bottom-0 h-[580px] w-[580px] rounded-full bg-pounamu/80 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
        <div className="mx-auto max-w-5xl text-center">
          <div>
            <div className="font-mono-label text-copper">02 WHAT WE DO</div>
            <h2 className="mt-4 font-display font-semibold tracking-[-0.045em] text-ivory" style={{ fontSize: "clamp(44px, 6vw, 88px)", lineHeight: ".94" }}>
              One crew. <span className="text-copper-light">Every detail.</span>
            </h2>
          </div>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">
            Fourteen specialist capabilities working as one, from first concept and guest arrival to production, travel and the final farewell.
          </p>
        </div>

        <div className="relative mt-10 border-y border-ivory/15 sm:mt-12">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-pounamu-night to-transparent sm:w-14" aria-hidden="true" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-pounamu-night to-transparent sm:w-14" aria-hidden="true" />
          <div ref={navRef} className="services-nav-scroll flex gap-2 overflow-x-auto py-3 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Choose a service">
            {site.services.map((item, index) => (
              <button
                key={item.id}
                type="button"
                data-service-index={index}
                onClick={() => select(index)}
                className={`shrink-0 rounded-[10px] px-4 py-2.5 text-left transition-colors duration-300 focus-ring ${active === index ? "bg-copper text-pounamu-night" : "bg-ivory/[0.06] text-mist hover:bg-ivory/10 hover:text-ivory"}`}
                aria-current={active === index ? "true" : undefined}
              >
                <span className="mr-2 font-mono-label text-[8px] opacity-70">{item.index}</span>
                <span className="text-xs font-medium sm:text-sm">{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-5">
          <button
            type="button"
            onClick={() => select(active - 1)}
            aria-label="Previous service"
            className="absolute left-2 top-[150px] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ivory/35 bg-pounamu-night/85 text-ivory shadow-[0_10px_30px_rgba(0,0,0,.28)] backdrop-blur-md transition-colors hover:border-copper hover:bg-copper hover:text-pounamu-night focus-ring sm:left-4 sm:top-1/2 sm:h-12 sm:w-12 lg:-left-6 xl:-left-16"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => select(active + 1)}
            aria-label="Next service"
            className="absolute right-2 top-[150px] z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-copper bg-copper text-pounamu-night shadow-[0_10px_30px_rgba(0,0,0,.28)] transition-colors hover:bg-copper-light focus-ring sm:right-4 sm:top-1/2 sm:h-12 sm:w-12 lg:-right-6 xl:-right-16"
          >
            <ArrowRight className="h-5 w-5" />
          </button>

          <div className="grid">
            <AnimatePresence custom={direction} initial={false}>
              <motion.article
              key={service.id}
              custom={direction}
              initial={reduceMotion ? false : { opacity: 0.94, scale: 0.995 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduceMotion ? { opacity: 1 } : { opacity: 0.94, scale: 0.995 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
              drag={reduceMotion ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (info.offset.x < -55) select(active + 1);
                if (info.offset.x > 55) select(active - 1);
              }}
              className="col-start-1 row-start-1 grid overflow-hidden rounded-[10px] border border-white/20 shadow-[0_30px_90px_rgba(0,0,0,.28)] lg:grid-cols-[1.08fr_.92fr]"
              style={{ backgroundColor: cardThemes[active % cardThemes.length] }}
            >
              <div className="relative min-h-[300px] overflow-hidden sm:min-h-[400px] lg:min-h-[590px]">
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  className="select-none object-cover"
                  quality={68}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={imageBlur}
                  draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pounamu-night/55 via-transparent to-pounamu-night/[0.08]" />
                <div className="absolute bottom-5 left-5 rounded-[10px] border border-white/30 bg-pounamu-night/55 px-4 py-2 font-mono-label text-[9px] text-ivory backdrop-blur-md sm:bottom-8 sm:left-8">
                  Curated in New Zealand
                </div>
              </div>

              <div className="flex flex-col justify-center p-6 text-pounamu-night sm:p-9 lg:p-12 xl:p-14">
                <div className="flex items-center gap-4 font-mono-label text-[9px] text-pounamu-night/55">
                  <span>Specialist capability</span><span className="h-px flex-1 bg-pounamu-night/20" />
                </div>
                <h3 className="mt-6 max-w-[13ch] font-display text-[clamp(2.5rem,4.6vw,5rem)] font-semibold leading-[.92] tracking-[-0.05em]">{service.name}</h3>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-pounamu-night/70 sm:text-lg">{service.description}</p>
                <ul className="mt-7 space-y-3 border-y border-pounamu-night/15 py-6">
                  {service.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-3 text-sm font-medium text-pounamu-night/85 sm:text-base">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-pounamu-night text-ivory"><Check className="h-3.5 w-3.5" strokeWidth={2} /></span>
                      {highlight}
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={enquire} className="mt-7 flex w-fit items-center gap-3 rounded-[10px] bg-pounamu-night px-5 py-3.5 text-sm font-semibold text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-pounamu focus-ring">
                  Enquire about this service <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
