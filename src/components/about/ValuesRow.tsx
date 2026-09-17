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

const MAX_TILT = 6;

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
        className="group relative h-full overflow-hidden rounded-2xl bg-pounamu-night p-4 transition-transform duration-300 ease-out will-change-transform sm:p-6 lg:rounded-3xl lg:p-8"
      >
        <span className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-copper transition-transform duration-500 ease-out group-hover:scale-x-100" />

        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-deep-line transition-colors duration-300 group-hover:border-copper group-hover:bg-copper sm:h-11 sm:w-11 lg:h-12 lg:w-12">
          <Icon
            className="h-5 w-5 text-copper transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 group-hover:text-pounamu-night"
            strokeWidth={1.5}
          />
        </div>

        <h3 className="mt-4 font-display text-base font-semibold text-ivory sm:text-lg lg:mt-6 lg:text-xl">{value.title}</h3>
        <p className="mt-2 text-xs font-light leading-relaxed text-mist sm:text-sm lg:text-base">{value.text}</p>
      </div>
    </motion.div>
  );
}

export default function ValuesRow() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
      {site.about.values.map((value, i) => (
        <ValueCard key={value.title} value={value} index={i} />
      ))}
    </div>
  );
}
