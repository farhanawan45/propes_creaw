"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import StatsStrip from "@/components/about/StatsStrip";
import ValuesRow from "@/components/about/ValuesRow";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statementRef = useRef<HTMLParagraphElement>(null);
  const imageAref = useRef<HTMLDivElement>(null);
  const parallaxA = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useGSAP(
    () => {
      const words = statementRef.current?.querySelectorAll("[data-word]");

      if (prefersReducedMotion()) {
        gsap.set(words ?? [], { opacity: 1 });
        gsap.set(imageAref.current, {
          clipPath: "inset(0% 0% 0% 0%)",
        });
        return;
      }

      if (words?.length) {
        gsap.set(words, { opacity: 0.5 });
        gsap.to(words, {
          opacity: 1,
          stagger: 0.5,
          ease: "none",
          scrollTrigger: {
            trigger: statementRef.current,
            start: "top 80%",
            end: "bottom 55%",
            scrub: true,
          },
        });
      }

      gsap.fromTo(
        imageAref.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power4.inOut",
          scrollTrigger: { trigger: imageAref.current, start: "top 88%" },
        }
      );

      gsap.to(parallaxA.current, {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          const trigger = t.trigger as Element | null;
          if (
            trigger === statementRef.current ||
            trigger === imageAref.current ||
            trigger === sectionRef.current
          ) {
            t.kill();
          }
        });
      };
    },
    { scope: sectionRef }
  );

  const words = site.about.statement.split(" ");
  const slides = [
    { image: site.about.images[0], eyebrow: "Live Experiences", title: "Events that command attention" },
    { image: site.about.images[1], eyebrow: "Creative Production", title: "Details designed to be remembered" },
    { image: site.about.images[2], eyebrow: "Destination Management", title: "New Zealand, delivered seamlessly" },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  const moveSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length);
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="about-section section-pad-bottom relative overflow-hidden bg-ivory pt-8 text-ink sm:pt-10 lg:pt-12"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="border-t border-ink/20 pt-6 sm:pt-8">
          <div className="flex items-center justify-between font-mono-label text-[10px] text-stone">
            <span>{site.about.label}</span>
            <span>Auckland · New Zealand</span>
          </div>

          <div className="mt-10 grid items-stretch gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="flex flex-col justify-center lg:col-span-5 lg:py-8">
              <h2 className="font-display text-[clamp(52px,6vw,96px)] font-medium leading-[0.86] tracking-[-0.065em] text-ink">
                We turn
                <span className="block">ideas into</span>
                <span className="block font-serif italic font-normal text-copper">experiences.</span>
              </h2>

              <p ref={statementRef} className="mt-8 max-w-lg text-[15px] leading-7 text-stone sm:text-lg sm:leading-8 lg:mt-10">
                {words.map((word, i) => (
                  <span key={i} data-word className="mr-[0.28em] inline-block">{word}</span>
                ))}
              </p>

            </div>

            <div ref={imageAref} className="relative overflow-hidden rounded-[28px] bg-ink shadow-[0_28px_80px_rgba(4,22,63,0.2)] lg:col-span-7">
            <div className="relative h-[500px] sm:h-[620px] lg:h-[680px]">
              <div ref={parallaxA} className="absolute inset-0 -top-[4%] h-[108%]">
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide.image}
                    className={`absolute inset-0 ${index === activeSlide ? "z-10 cursor-grab active:cursor-grabbing" : "pointer-events-none z-0"}`}
                    initial={false}
                    animate={{ opacity: index === activeSlide ? 1 : 0, scale: index === activeSlide ? 1 : 1.025 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -55) moveSlide(1);
                      if (info.offset.x > 55) moveSlide(-1);
                    }}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      loading="lazy"
                      quality={72}
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      className="select-none object-cover"
                    />
                  </motion.div>
                ))}
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-ink/20" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(180deg,transparent,rgba(4,22,63,.9))]" />

              <div className="absolute inset-x-5 bottom-6 z-20 sm:inset-x-8 sm:bottom-8 lg:inset-x-12 lg:bottom-11">
                <div className="grid items-end gap-7 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="inline-flex items-center gap-2.5 rounded-[10px] border border-white/25 bg-pounamu-night/[0.18] px-3.5 py-2.5 font-mono-label text-[10px] font-bold tracking-[0.13em] text-copper-light shadow-[0_5px_16px_rgba(0,0,0,.12)] [text-shadow:0_1px_5px_rgba(0,0,0,.85)] backdrop-blur-[2px] sm:px-4 sm:text-[11px]">
                      <span className="size-1.5 shrink-0 rounded-full bg-copper shadow-[0_0_10px_rgba(255,122,89,.9)]" />
                      <span>0{activeSlide + 1}</span>
                      <span className="text-white/35">/</span>
                      <span className="text-ivory">{slides[activeSlide].eyebrow}</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.h3
                        key={slides[activeSlide].title}
                        initial={{ y: 24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -16, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-3 max-w-[620px] font-display text-[clamp(32px,4vw,58px)] font-medium leading-[0.95] tracking-[-0.045em] text-white"
                      >
                        {slides[activeSlide].title}
                      </motion.h3>
                    </AnimatePresence>
                  </div>

                  <div className="flex w-full items-center justify-between lg:w-auto lg:gap-3">
                    <button type="button" onClick={() => moveSlide(-1)} aria-label="Previous slide" className="flex size-11 items-center justify-center rounded-[10px] border border-copper/70 bg-copper text-white shadow-[0_8px_24px_rgba(251,83,44,.3)] transition duration-300 hover:bg-copper-light sm:size-12">
                      <ArrowLeft size={18} strokeWidth={1.6} />
                    </button>
                    <button type="button" onClick={() => moveSlide(1)} aria-label="Next slide" className="flex size-11 items-center justify-center rounded-[10px] border border-copper/70 bg-copper text-white shadow-[0_8px_24px_rgba(251,83,44,.3)] transition duration-300 hover:bg-copper-light sm:size-12">
                      <ArrowRight size={18} strokeWidth={1.6} />
                    </button>
                  </div>
                </div>

                <div className="mt-7 flex items-center gap-4 sm:mt-9">
                  <span className="shrink-0 font-mono-label text-[9px] text-white/65">
                    0{activeSlide + 1} / 0{slides.length}
                  </span>
                  <div className="grid flex-1 grid-cols-3 gap-2 sm:gap-3">
                  {slides.map((slide, index) => (
                    <button key={slide.title} type="button" onClick={() => setActiveSlide(index)} aria-label={`View slide ${index + 1}`} className="group py-2">
                      <span className="block h-[2px] overflow-hidden rounded-full bg-white/20">
                        <motion.span
                          className="block h-full origin-left rounded-full bg-copper"
                          initial={false}
                          animate={{ scaleX: index === activeSlide ? 1 : 0 }}
                          transition={{ duration: index === activeSlide ? 2 : 0.25, ease: "linear" }}
                        />
                      </span>
                    </button>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-20 lg:mt-24">
          <StatsStrip />
        </div>

        <div className="mt-10 sm:mt-12 lg:mt-14">
          <ValuesRow />
        </div>
      </div>
    </section>
  );
}
