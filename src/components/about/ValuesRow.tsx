"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Compass, HeartHandshake, Award, type LucideIcon } from "lucide-react";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/gsap";

const icons: Record<string, LucideIcon> = {
  ShieldCheck,
  Compass,
  HeartHandshake,
  Award,
};

const MAX_TILT = 2.5;

function ValueCard({ value, index }: { value: (typeof site.about.values)[number]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const Icon = icons[value.icon];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rafRef.current = requestAnimationFrame(() => {
      card.style.transform = `perspective(1000px) rotateY(${px * MAX_TILT * 2}deg) rotateX(${-py * MAX_TILT * 2}deg) translateY(-6px)`;
    });
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0px)";
  };

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative h-full overflow-hidden px-4 py-6 transition-transform duration-300 ease-out will-change-transform sm:px-6 sm:py-8 lg:px-8 lg:py-10"
      >
        <span className="absolute inset-0 bg-gradient-to-b from-copper/[0.08] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <span className="absolute inset-x-8 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-copper to-transparent transition-transform duration-500 ease-out group-hover:scale-x-100" />

        <div className="relative flex items-center justify-between">
          <span className="font-mono-label text-[9px] text-stone">0{index + 1}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-copper/50 to-transparent mx-3" />
        </div>
        <div className="relative mt-5 flex h-12 w-12 items-center justify-center rounded-full border border-copper/30 bg-ivory shadow-[0_10px_35px_rgba(251,83,44,.1)] transition-all duration-500 group-hover:border-copper group-hover:shadow-[0_0_30px_rgba(251,83,44,.24)] lg:h-14 lg:w-14">
          <span className="absolute inset-1.5 rounded-full border border-copper/10" />
          <Icon
            className="h-5 w-5 text-copper transition-all duration-500 group-hover:rotate-12 group-hover:scale-110"
            strokeWidth={1.5}
          />
        </div>

        <h3 className="relative mt-5 font-display text-lg font-semibold text-ink sm:text-xl lg:mt-6 lg:text-2xl">{value.title}</h3>
        <p className="relative mt-2 text-xs font-light leading-relaxed text-stone sm:text-sm lg:text-base">{value.text}</p>
      </div>
    </motion.div>
  );
}

export default function ValuesRow() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-linen-border bg-linen shadow-[0_25px_70px_-50px_rgba(4,22,63,.35)] sm:rounded-[38px]">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {site.about.values.map((value, i) => (
          <div key={value.title} className={`${i % 2 === 1 ? "border-l border-linen-border" : ""} ${i >= 2 ? "border-t border-linen-border lg:border-t-0" : ""} ${i > 0 ? "lg:border-l lg:border-linen-border" : ""}`}>
            <ValueCard value={value} index={i} />
          </div>
        ))}
      </div>
    </div>
  );
}
