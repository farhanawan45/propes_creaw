"use client";

import { useRef, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import {
  AudioLines, Binoculars, BusFront, CalendarDays, Gift, Languages, MapPin,
  Mountain, Music, Palette, Plane, Ship, UtensilsCrossed, Users, type LucideProps,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import { useEnquiry } from "@/context/EnquiryContext";
import { scrollToHash } from "@/lib/scrollTo";

type ServiceIcon = ComponentType<LucideProps>;

const serviceIcons: ServiceIcon[] = [
  CalendarDays, Users, BusFront, MapPin, Binoculars, UtensilsCrossed, Mountain,
  Ship, Plane, AudioLines, Palette, Gift, Languages, Music,
];

// The slight asymmetry keeps the constellation organic without letting a
// label collide with the central brand hub.
const desktopNodes = [
  { x: 18, y: 10 }, { x: 12, y: 23 }, { x: 10, y: 39 }, { x: 10, y: 57 },
  { x: 12, y: 73 }, { x: 19, y: 86 }, { x: 34, y: 93 }, { x: 66, y: 93 },
  { x: 81, y: 86 }, { x: 88, y: 73 }, { x: 90, y: 57 }, { x: 90, y: 39 },
  { x: 88, y: 23 }, { x: 82, y: 10 },
] as const;

interface BubbleProps {
  index: number;
  active: boolean;
  compact?: boolean;
  onActivate: () => void;
}

function ServiceBubble({ index, active, compact = false, onActivate }: BubbleProps) {
  const service = site.services[index];
  const Icon = serviceIcons[index];

  return (
    <motion.button
      type="button"
      data-service-bubble
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      whileHover={{ y: -4, scale: 1.035 }}
      whileTap={{ scale: 0.98 }}
      aria-pressed={active}
      className={`group relative isolate flex w-full items-center rounded-full border text-left backdrop-blur-xl focus-ring ${
        compact ? "min-h-[72px] gap-2 px-2.5 py-2 sm:min-h-[82px] sm:gap-3 sm:px-3" : "h-[76px] max-w-[230px] gap-3 px-3"
      } ${
        active
          ? "border-copper-light bg-copper/15 shadow-[0_0_0_1px_rgba(240,176,122,0.15),0_14px_45px_rgba(201,119,74,0.27)]"
          : "border-copper/30 bg-pounamu-night/80 shadow-[0_12px_36px_rgba(0,0,0,0.2)] hover:border-copper/65 hover:bg-pounamu/75"
      }`}
    >
      <span
        className={`absolute inset-0 -z-10 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${active ? "opacity-100" : ""}`}
        style={{ background: "radial-gradient(circle at 18% 22%, rgba(240,176,122,.18), transparent 55%)" }}
      />
      <span
        className={`relative flex shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          compact ? "h-10 w-10 sm:h-12 sm:w-12" : "h-12 w-12"
        } ${
          active
            ? "border-copper-light text-ivory shadow-[0_0_24px_rgba(201,119,74,.48)]"
            : "border-copper/45 text-ivory shadow-[inset_0_0_18px_rgba(201,119,74,.12)]"
        }`}
        style={{
          background: active
            ? "linear-gradient(145deg, #de9166 0%, #b85f36 58%, #153a33 100%)"
            : "radial-gradient(circle at 30% 22%, rgba(240,176,122,.28), rgba(21,58,51,.92) 62%)",
        }}
      >
        <span className="absolute inset-1 rounded-full border border-ivory/10" />
        <Icon className={compact ? "h-[18px] w-[18px] sm:h-5 sm:w-5" : "h-5 w-5"} strokeWidth={1.65} />
      </span>

      <span className="min-w-0 flex-1 pr-1">
        <span className="font-mono-label block text-[8px] leading-none text-copper-light sm:text-[9px]">{service.index}</span>
        <span className={`mt-1 block font-medium text-ivory ${compact ? "text-[11px] leading-[1.15] sm:text-[13px]" : "text-[13px] leading-tight"}`}>
          {service.name}
        </span>
      </span>

      <span className={`absolute right-3 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-copper transition-all duration-300 ${active ? "scale-100 shadow-[0_0_12px_#f0b07a]" : "scale-0"}`} />
    </motion.button>
  );
}

function BrandHub({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="relative flex h-[250px] w-[250px] items-center justify-center rounded-full xl:h-[280px] xl:w-[280px]">
      <span className="absolute -inset-8 rounded-full bg-copper/10 blur-3xl" />
      <span className="absolute inset-0 animate-spin-slower rounded-full border border-copper/25" />
      <span className="absolute inset-4 animate-[spin_24s_linear_infinite_reverse] rounded-full border border-dashed border-copper/45" />
      <span className="absolute inset-8 rounded-full border border-ivory/10 bg-[radial-gradient(circle_at_30%_22%,rgba(240,176,122,.32),rgba(21,58,51,.92)_52%,rgba(12,31,28,1)_78%)] shadow-[inset_0_0_44px_rgba(201,119,74,.18),0_0_50px_rgba(201,119,74,.2)]" />
      <span className="absolute inset-[3.15rem] rounded-full border border-copper/30" />

      <div className="relative z-10 flex max-w-[170px] flex-col items-center text-center">
        <span className="font-display text-4xl font-semibold tracking-tight xl:text-5xl">
          <span className="text-ivory">P&amp;</span><span className="text-copper-light">C</span>
        </span>
        <span className="mt-2 font-mono-label text-[8px] text-mist/65">Props &amp; Crew</span>
        <span className="mt-4 h-px w-12 bg-gradient-to-r from-transparent via-copper to-transparent" />
        <span className="mt-3 text-xs font-medium leading-tight text-ivory/90">{site.services[activeIndex].name}</span>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { requestEnquiry } = useEnquiry();
  const activeService = site.services[activeIndex];
  const ActiveIcon = serviceIcons[activeIndex];

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const bubbles = sectionRef.current?.querySelectorAll("[data-service-bubble]");
      gsap.fromTo(
        bubbles ?? [],
        { opacity: 0, scale: 0.72 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: { each: 0.045, from: "center" },
          ease: "back.out(1.45)",
          scrollTrigger: { trigger: sectionRef.current, start: "top 68%", once: true },
        }
      );
    },
    { scope: sectionRef }
  );

  const enquire = () => {
    requestEnquiry(activeService.id);
    scrollToHash("#contact");
  };

  return (
    <section id="services" ref={sectionRef} className="section-pad relative overflow-hidden bg-pounamu-night">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[48%] h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper/[0.055] blur-[120px]" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-copper/15 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10 xl:px-12">
        <div className="mb-10 text-center lg:mb-12">
          <div className="flex items-center justify-center gap-3 font-mono-label text-copper">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-copper/70" />
            02 — WHAT WE DO
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-copper/70" />
          </div>
          <h2 className="mt-4 font-display font-semibold tracking-tight text-ivory" style={{ fontSize: "clamp(40px, 5.5vw, 82px)", letterSpacing: "-0.035em" }}>
            Our <span className="bg-gradient-to-r from-copper via-copper-light to-ivory bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-mist sm:text-lg">
            Fourteen specialist services, connected by one dedicated crew.
          </p>
        </div>

        <div className="relative mx-auto hidden h-[720px] max-w-[1360px] lg:block xl:h-[760px]">
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="networkLine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#c9774a" stopOpacity=".2" />
                <stop offset=".52" stopColor="#f0b07a" stopOpacity=".72" />
                <stop offset="1" stopColor="#c9774a" stopOpacity=".2" />
              </linearGradient>
              <filter id="lineGlow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <ellipse cx="500" cy="380" rx="340" ry="300" fill="none" stroke="rgba(201,119,74,.12)" strokeDasharray="4 12" />
            <ellipse cx="500" cy="380" rx="260" ry="220" fill="none" stroke="rgba(245,241,232,.07)" />
            {desktopNodes.map((node, index) => {
              const endX = node.x * 10;
              const endY = node.y * 7.6;
              const controlX = index < 7 ? 360 : 640;
              return (
                <g key={site.services[index].id}>
                  <path d={`M500 380 Q${controlX} 380 ${endX} ${endY}`} fill="none" stroke="url(#networkLine)" strokeWidth={activeIndex === index ? 2 : 1} opacity={activeIndex === index ? 1 : 0.62} filter={activeIndex === index ? "url(#lineGlow)" : undefined} />
                  <circle cx={endX} cy={endY} r={activeIndex === index ? 4 : 2.5} fill="#f0b07a" opacity={activeIndex === index ? 1 : 0.65} />
                </g>
              );
            })}
          </svg>

          <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <BrandHub activeIndex={activeIndex} />
          </div>

          {desktopNodes.map((node, index) => (
            <div key={site.services[index].id} className="absolute z-30 w-[clamp(170px,16vw,230px)] -translate-x-1/2 -translate-y-1/2" style={{ left: `${node.x}%`, top: `${node.y}%` }}>
              <ServiceBubble index={index} active={activeIndex === index} onActivate={() => setActiveIndex(index)} />
            </div>
          ))}
        </div>

        <div className="lg:hidden">
          <div className="relative mx-auto flex h-40 w-40 items-center justify-center rounded-full sm:h-48 sm:w-48">
            <span className="absolute inset-0 animate-spin-slower rounded-full border border-copper/30" />
            <span className="absolute inset-3 animate-[spin_22s_linear_infinite_reverse] rounded-full border border-dashed border-copper/40" />
            <span className="absolute inset-7 rounded-full border border-ivory/10 bg-[radial-gradient(circle_at_30%_22%,rgba(240,176,122,.32),rgba(21,58,51,.94)_62%)] shadow-[0_0_36px_rgba(201,119,74,.22)]" />
            <div className="relative text-center">
              <div className="font-display text-3xl font-semibold"><span className="text-ivory">P&amp;</span><span className="text-copper-light">C</span></div>
              <div className="mt-1 font-mono-label text-[7px] text-mist/65">14 connected services</div>
            </div>
          </div>

          <div className="relative mt-5">
            <div className="pointer-events-none absolute bottom-8 left-1/2 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-copper/70 via-copper/25 to-transparent" aria-hidden="true" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:gap-x-8 sm:gap-y-4">
              {site.services.map((service, index) => (
                <div key={service.id} className="relative">
                  <span className={`pointer-events-none absolute top-1/2 h-px w-4 bg-copper/35 sm:w-8 ${index % 2 === 0 ? "-right-4 sm:-right-8" : "-left-4 sm:-left-8"}`} aria-hidden="true" />
                  <ServiceBubble compact index={index} active={activeIndex === index} onActivate={() => setActiveIndex(index)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl items-center gap-5 rounded-[2rem] border border-copper/25 bg-pounamu/55 p-5 shadow-[0_24px_80px_rgba(0,0,0,.18)] backdrop-blur-xl sm:p-7 md:grid-cols-[auto_1fr_auto] md:gap-7">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-copper/55 bg-[linear-gradient(145deg,rgba(240,176,122,.28),rgba(21,58,51,.92))] text-ivory shadow-[0_0_30px_rgba(201,119,74,.2)]">
            <ActiveIcon className="h-7 w-7" strokeWidth={1.6} />
          </div>
          <div>
            <div className="font-mono-label text-[9px] text-copper">{activeService.index} / 14 — Selected service</div>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ivory sm:text-3xl">{activeService.name}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mist sm:text-base">{activeService.description}</p>
          </div>
          <button type="button" onClick={enquire} className="btn-gradient whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold text-ivory focus-ring">
            Enquire now
          </button>
        </div>
      </div>
    </section>
  );
}
