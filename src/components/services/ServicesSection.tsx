"use client";

import { useRef, useState, type ComponentType } from "react";
import { motion } from "framer-motion";
import { AudioLines, Binoculars, BusFront, CalendarDays, Gift, Languages, MapPin, Mountain, Music, Palette, Plane, Ship, UtensilsCrossed, Users, type LucideProps } from "lucide-react";
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

const leftOffsets = ["lg:translate-x-16", "lg:translate-x-7", "", "lg:-translate-x-3", "", "lg:translate-x-7", "lg:translate-x-16"];
const rightOffsets = ["lg:-translate-x-16", "lg:-translate-x-7", "", "lg:translate-x-3", "", "lg:-translate-x-7", "lg:-translate-x-16"];

interface ServiceNodeProps {
  index: number;
  side: "left" | "right";
  active: boolean;
  onActivate: () => void;
}

function ServiceNode({ index, side, active, onActivate }: ServiceNodeProps) {
  const service = site.services[index];
  const Icon = serviceIcons[index];
  const offset = side === "left" ? leftOffsets[index] : rightOffsets[index - 7];

  return (
    <motion.button
      type="button"
      data-service-node
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      whileHover={{ x: side === "left" ? 7 : -7, scale: 1.018 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative flex min-h-16 w-full items-center gap-3 rounded-[1.15rem] border px-3 py-2 text-left backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 focus-ring lg:max-w-[330px] ${side === "right" ? "lg:flex-row-reverse lg:text-right" : ""} ${offset} ${active ? "border-copper/80 bg-copper/10 shadow-[0_0_30px_rgba(201,119,74,0.2)]" : "border-deep-line bg-pounamu-night/65 hover:border-copper/45 hover:bg-pounamu/55"}`}
      aria-pressed={active}
    >
      <span
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-300 sm:h-12 sm:w-12 ${active ? "border-copper-light text-pounamu-night shadow-[0_0_24px_rgba(201,119,74,0.55)]" : "border-copper/40 text-ivory shadow-[0_0_16px_rgba(201,119,74,0.16)]"}`}
        style={{ background: active ? "linear-gradient(135deg, #f0b07a, #c9774a 55%, #8f3d28)" : "linear-gradient(145deg, rgba(240,176,122,0.22), rgba(201,119,74,0.12) 48%, rgba(12,48,42,0.85))" }}
      >
        <span className="absolute inset-1 rounded-full border border-ivory/10" />
        <Icon className="relative h-5 w-5" strokeWidth={1.7} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-mono-label block text-[9px] text-copper">{service.index}</span>
        <span className="mt-0.5 block text-sm font-medium leading-tight text-ivory sm:text-[15px]">{service.name}</span>
        <span className="mt-1 hidden truncate text-[10px] text-mist/70 xl:block">{service.highlights[0]}</span>
      </span>
    </motion.button>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { requestEnquiry } = useEnquiry();
  const activeService = site.services[activeIndex];

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const nodes = sectionRef.current?.querySelectorAll("[data-service-node]");
    gsap.fromTo(nodes ?? [], { opacity: 0, y: 24, scale: 0.96 }, {
      opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.045, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%", once: true },
    });
  }, { scope: sectionRef });

  const enquire = () => {
    requestEnquiry(activeService.id);
    scrollToHash("#contact");
  };

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden bg-pounamu-night section-pad">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-[46%] h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper/[0.06] blur-[110px]" />
        <svg viewBox="0 0 1600 420" className="absolute inset-x-0 bottom-0 h-auto w-full opacity-25">
          <path d="M-80 310C180 100 360 430 650 270S1100 80 1680 300" fill="none" stroke="rgba(201,119,74,.26)" />
          <path d="M-90 340C210 130 390 460 680 300S1140 110 1690 330" fill="none" stroke="rgba(245,241,232,.12)" />
          <path d="M-100 370C230 170 430 480 710 330S1180 150 1700 360" fill="none" stroke="rgba(201,119,74,.18)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-12 text-center lg:mb-14">
          <div className="flex items-center justify-center gap-3 font-mono-label text-copper">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-copper/70" />02 — WHAT WE DO<span className="h-px w-8 bg-gradient-to-l from-transparent to-copper/70" />
          </div>
          <h2 className="mt-4 font-display font-semibold tracking-tight text-ivory" style={{ fontSize: "clamp(40px, 5.5vw, 82px)", letterSpacing: "-0.035em" }}>
            Our <span className="bg-gradient-to-r from-copper via-copper-light to-ivory bg-clip-text text-transparent">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light leading-relaxed text-mist sm:text-lg">Fourteen specialist services, one dedicated crew — everything you need for an extraordinary New Zealand experience.</p>
        </div>

        <div className="relative hidden min-h-[690px] grid-cols-[1fr_340px_1fr] items-center gap-10 lg:grid">
          <svg viewBox="0 0 1200 690" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <defs><linearGradient id="serviceLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#c9774a" stopOpacity=".18" /><stop offset=".5" stopColor="#f0b07a" stopOpacity=".7" /><stop offset="1" stopColor="#c9774a" stopOpacity=".18" /></linearGradient></defs>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const y = 64 + i * 94;
              return <g key={i}><path d={`M600 345 C500 345 430 ${y} 295 ${y}`} fill="none" stroke="url(#serviceLine)" strokeWidth="1" /><path d={`M600 345 C700 345 770 ${y} 905 ${y}`} fill="none" stroke="url(#serviceLine)" strokeWidth="1" /><circle cx="295" cy={y} r="3" fill="#f0b07a" opacity=".75" /><circle cx="905" cy={y} r="3" fill="#f0b07a" opacity=".75" /></g>;
            })}
          </svg>

          <div className="relative z-10 flex flex-col gap-3">
            {site.services.slice(0, 7).map((service, index) => <ServiceNode key={service.id} index={index} side="left" active={activeIndex === index} onActivate={() => setActiveIndex(index)} />)}
          </div>

          <div className="relative z-20 flex flex-col items-center text-center">
            <div className="relative flex h-72 w-72 items-center justify-center rounded-full sm:h-80 sm:w-80">
              <span className="absolute inset-0 animate-spin-slower rounded-full border border-copper/25 shadow-[0_0_55px_rgba(201,119,74,0.16)]" />
              <span className="absolute inset-5 animate-[spin_18s_linear_infinite_reverse] rounded-full border border-dashed border-copper/45" />
              <span className="absolute inset-10 rounded-full border border-ivory/10 bg-[radial-gradient(circle_at_32%_25%,rgba(240,176,122,0.34),rgba(201,119,74,0.12)_34%,rgba(12,48,42,0.96)_72%)] shadow-[inset_0_0_45px_rgba(201,119,74,0.2),0_0_45px_rgba(201,119,74,0.28)]" />
              <span className="absolute inset-[4.5rem] rounded-full border border-copper/50 bg-pounamu-night/80 shadow-[0_0_28px_rgba(201,119,74,0.35)]" />
              <span className="relative font-display text-5xl font-semibold"><span className="text-ivory">P&amp;</span><span className="text-copper">C</span></span>
            </div>
            <div className="-mt-4 w-[330px] rounded-2xl border border-copper/25 bg-pounamu-night/85 p-5 backdrop-blur-xl">
              <div className="font-mono-label text-copper">{activeService.index} / 14</div>
              <h3 className="mt-2 font-display text-xl font-semibold text-ivory">{activeService.name}</h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-mist">{activeService.description}</p>
              <button type="button" onClick={enquire} className="btn-gradient mt-4 rounded-full px-5 py-2 text-xs font-semibold text-pounamu-night focus-ring">Enquire now</button>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-end gap-3">
            {site.services.slice(7).map((service, offset) => { const index = offset + 7; return <ServiceNode key={service.id} index={index} side="right" active={activeIndex === index} onActivate={() => setActiveIndex(index)} />; })}
          </div>
        </div>

        <div className="lg:hidden">
          <div className="relative mx-auto mb-10 flex h-44 w-44 items-center justify-center rounded-full border border-copper/30 shadow-[0_0_40px_rgba(201,119,74,0.18)]">
            <span className="absolute inset-3 animate-spin-slower rounded-full border border-dashed border-copper/45" />
            <span className="absolute inset-7 rounded-full bg-[radial-gradient(circle_at_32%_25%,rgba(240,176,122,0.3),rgba(12,48,42,0.96)_70%)]" />
            <span className="relative font-display text-3xl font-semibold"><span className="text-ivory">P&amp;</span><span className="text-copper">C</span></span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {site.services.map((service, index) => <ServiceNode key={service.id} index={index} side={index < 7 ? "left" : "right"} active={activeIndex === index} onActivate={() => setActiveIndex(index)} />)}
          </div>
          <div className="mt-6 rounded-2xl border border-copper/25 bg-pounamu/60 p-5 text-center backdrop-blur-md">
            <div className="font-mono-label text-copper">{activeService.index} / 14</div>
            <h3 className="mt-2 font-display text-2xl font-semibold text-ivory">{activeService.name}</h3>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-mist">{activeService.description}</p>
            <button type="button" onClick={enquire} className="btn-gradient mt-5 w-full rounded-full px-6 py-3 text-sm font-semibold text-pounamu-night focus-ring sm:w-auto">Enquire about this service</button>
          </div>
        </div>
      </div>
    </section>
  );
}
