"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
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
          duration: 1.6,
          ease: "power3.out",
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
    <div
      ref={containerRef}
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
    >
      {site.about.stats.map((stat, i) => (
        <div
          key={stat.label}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          onMouseMove={handleMouseMove(i)}
          className="group relative overflow-hidden rounded-2xl border bg-linen p-4 transition-[transform,border-color] duration-300 hover:-translate-y-1.5 sm:p-6 lg:rounded-3xl lg:p-8"
          style={
            {
              borderColor: "var(--color-linen-border)",
              "--mx": "50%",
              "--my": "50%",
            } as React.CSSProperties
          }
        >
          <span
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(180px circle at var(--mx) var(--my), rgba(201,119,74,0.14), transparent 70%)",
            }}
          />
          <span className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-transparent transition-colors duration-300 group-hover:border-copper" />

          <div className="relative flex items-center justify-between">
            <span className="font-mono-label text-stone">{String(i + 1).padStart(2, "0")}</span>
            <ArrowUpRight className="h-4 w-4 text-copper opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <div
            className="relative mt-4 font-display font-semibold text-ink"
            style={{ fontSize: "clamp(32px, 8vw, 72px)", letterSpacing: "-0.02em", lineHeight: 1 }}
          >
            <span
              ref={(el) => {
                numberRefs.current[i] = el;
              }}
            >
              0
            </span>
            <span className="text-copper">{stat.suffix}</span>
          </div>
          <div className="relative mt-3 font-mono-label leading-relaxed text-stone" style={{ fontSize: "clamp(8px, 2.4vw, 12px)" }}>{stat.label}</div>

          <div className="relative mt-4 h-px w-full overflow-hidden bg-linen-border sm:mt-5 lg:mt-6">
            <div
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="h-full w-full origin-left scale-x-0 bg-copper"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
