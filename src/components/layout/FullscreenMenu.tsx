"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { site } from "@/content/site";
import { scrollToHash } from "@/lib/scrollTo";
import { useLenisContext } from "@/context/LenisContext";
import BrandLogo from "@/components/ui/BrandLogo";
import LiveClock from "@/components/ui/LiveClock";

const previewImages: Record<string, string> = {
  "#home": "/images/client/client-event-04.webp",
  "#about": "/images/client/client-event-05.webp",
  "#services": "/images/client/client-event-08.webp",
  "#contact": "/images/client/client-event-10.webp",
};

export default function FullscreenMenu({
  onClose,
  active,
}: {
  onClose: () => void;
  active: string;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { pause, resume } = useLenisContext();

  useEffect(() => {
    pause();
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const focusable = containerRef.current?.querySelectorAll<HTMLElement>(
          "a, button, [tabindex]:not([tabindex='-1'])"
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      resume();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigate = (href: string) => {
    // Lenis stays paused and body scroll stays locked (both set above)
    // until this component actually unmounts, which happens only after
    // the exit animation finishes — well after the scroll call below
    // would fire. Undo both immediately so the scroll-to actually
    // animates instead of silently no-op'ing.
    resume();
    document.body.style.overflow = "";
    onClose();
    setTimeout(() => scrollToHash(href), 350);
  };

  const previewHref = hovered ?? active;

  return (
    <motion.div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.65, ease: [0.83, 0, 0.17, 1] }}
      className="fixed inset-0 z-[90] flex flex-col bg-pounamu-night"
    >
      <div className="flex items-center justify-between px-6 py-5 sm:px-10 sm:py-6">
        <BrandLogo size="md" />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-deep-line text-ivory focus-ring hover:border-copper hover:text-copper"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
            <line x1="1" y1="1" x2="15" y2="15" />
            <line x1="15" y1="1" x2="1" y2="15" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-7 overflow-y-auto px-6 pb-6 sm:px-10 lg:flex-row lg:items-center lg:gap-8">
        <nav
          className="flex flex-1 flex-col justify-center gap-1.5 sm:gap-2"
          onMouseLeave={() => setHovered(null)}
        >
          {site.nav.map((item, i) => (
            <motion.a
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHovered(item.href)}
              onClick={(e) => {
                e.preventDefault();
                handleNavigate(item.href);
              }}
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              className={`group flex items-baseline gap-3 rounded-sm border-b border-deep-line px-1 py-3 transition-[opacity,background-color,padding] duration-300 hover:bg-ivory/[0.025] sm:gap-4 sm:px-2 sm:py-3.5 ${
                hovered && hovered !== item.href ? "opacity-35" : "opacity-100"
              }`}
            >
              <span className="w-5 shrink-0 font-mono-label text-[8px] text-copper sm:w-6 sm:text-[9px]">{item.index}</span>
              <span
                className={`font-display text-[clamp(1.65rem,7.4vw,2rem)] font-semibold leading-[1.08] tracking-tight transition-colors duration-300 sm:text-[2.25rem] lg:text-[clamp(2.25rem,3.4vw,3rem)] xl:text-[3.25rem] ${
                  active === item.href || hovered === item.href ? "text-copper" : "text-ivory"
                }`}
              >
                {item.label}
              </span>
            </motion.a>
          ))}
        </nav>

        <div className="relative hidden h-[60vh] w-[30vw] shrink-0 overflow-hidden rounded-3xl lg:block">
          {Object.entries(previewImages).map(([href, src]) => (
            <Image
              key={href}
              src={src}
              alt=""
              fill
              sizes="30vw"
              className={`object-cover transition-opacity duration-500 ${
                previewHref === href ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-pounamu-night/60 to-transparent" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-deep-line bg-pounamu-night/95 px-5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:bg-transparent sm:px-10 sm:py-6 sm:text-sm">
        <div className="grid grid-cols-2 gap-2 text-ivory/80 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
          <a href={`mailto:${site.contact.email}`} className="col-span-2 rounded-xl border border-deep-line bg-ivory/[0.025] px-3 py-2.5 text-center transition-colors hover:border-copper/50 hover:text-copper sm:col-auto sm:border-0 sm:bg-transparent sm:p-0 sm:text-left">
            {site.contact.email}
          </a>
          <a href={site.contact.phoneHref} className="rounded-xl border border-deep-line bg-ivory/[0.025] px-2 py-2.5 text-center transition-colors hover:border-copper/50 hover:text-copper sm:border-0 sm:bg-transparent sm:p-0 sm:text-left">
            {site.contact.phone}
          </a>
          <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="rounded-xl border border-deep-line bg-ivory/[0.025] px-2 py-2.5 text-center transition-colors hover:border-copper/50 hover:text-copper sm:border-0 sm:bg-transparent sm:p-0 sm:text-left">
            WhatsApp
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-deep-line/70 pt-3 sm:flex-nowrap sm:justify-start sm:gap-6 sm:border-0 sm:pt-0">
          <div className="flex items-center gap-3 sm:gap-5">
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-label text-[8px] text-mist transition-colors hover:text-copper sm:text-[10px]"
              >
                {s.label}
              </a>
            ))}
          </div>
          <LiveClock className="inline-flex rounded-full border border-copper/25 bg-copper/[0.05] px-2.5 py-2 text-[8px] sm:border-0 sm:bg-transparent sm:p-0 sm:text-[10px]" />
        </div>
      </div>
    </motion.div>
  );
}
