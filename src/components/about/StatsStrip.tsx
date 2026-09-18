"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";

export default function StatsStrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        numberRefs.current.forEach((el, i) => {
          if (el) el.textContent = String(site.about.stats[i].value);
        });
        gsap.set(cardRefs.current, { opacity: 1, y: 0 });
        gsap.set(lineRefs.current, { scaleX: 1 });
        return;
      }

      gsap.fromTo(
        cardRefs.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 85%", once: true },
        }
      );

      gsap.to(lineRefs.current, {
        scaleX: 1,
        duration: 1,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 85%", once: true },
      });

      numberRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = site.about.stats[i].value;
        const counter = { value: 0 };
        gsap.to(counter, {
          value: target,
          duration: 2.8,
          ease: "power2.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = Math.round(counter.value).toString();
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === containerRef.current) t.kill();
        });
      };
    },
    { scope: containerRef }
  );

  const handleMouseMove = (i: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const card = cardRefs.current[i];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    rafRef.current = requestAnimationFrame(() => {
      card.style.setProperty("--mx", `${mx}px`);
      card.style.setProperty("--my", `${my}px`);
    });
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden rounded-[28px] border border-copper/20 bg-pounamu-night px-5 py-7 shadow-[0_35px_90px_-45px_rgba(12,31,28,.7)] sm:rounded-[38px] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-copper/15" />
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 animate-spin-slower rounded-full border border-dashed border-copper/20" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-copper-light to-transparent" />

      <div className="relative mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-deep-line pb-6 lg:mb-10">
        <div>
          <div className="font-mono-label text-copper-light">Measured in moments</div>
          <h3 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ivory sm:text-3xl">Experience, at a glance.</h3>
        </div>
        <div className="flex items-center gap-2 font-mono-label text-[9px] text-mist/60"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-copper" /> Live credentials</div>
      </div>

      <div className="relative grid grid-cols-2 lg:grid-cols-4">
        {site.about.stats.map((stat, i) => (
          <div
            key={stat.label}
            ref={(el) => { cardRefs.current[i] = el; }}
            onMouseMove={handleMouseMove(i)}
            className={`group relative min-w-0 px-3 py-5 sm:px-6 lg:px-8 ${i % 2 === 1 ? "border-l border-deep-line" : ""} ${i >= 2 ? "border-t border-deep-line lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-deep-line" : ""}`}
            style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
          >
            <span className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(220px circle at var(--mx) var(--my), rgba(201,119,74,.18), transparent 68%)" }} />
            <div className="relative flex items-center gap-3">
              <span className="font-mono-label text-[9px] text-copper-light">{String(i + 1).padStart(2, "0")}</span>
              <span className="h-px flex-1 bg-gradient-to-r from-copper/60 to-transparent" />
            </div>
            <div className="relative mt-5 font-display font-semibold leading-none tracking-[-.045em] text-ivory" style={{ fontSize: "clamp(42px, 6vw, 78px)" }}>
              <span ref={(el) => { numberRefs.current[i] = el; }}>0</span><span className="text-copper-light">{stat.suffix}</span>
            </div>
            <div className="relative mt-4 min-h-[2.4em] font-mono-label text-[8px] leading-relaxed text-mist sm:text-[10px]">{stat.label}</div>
            <div className="relative mt-5 h-px overflow-hidden bg-ivory/10"><div ref={(el) => { lineRefs.current[i] = el; }} className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-copper via-copper-light to-transparent" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
