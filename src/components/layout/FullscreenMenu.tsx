"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { site } from "@/content/site";
import { scrollToHash } from "@/lib/scrollTo";
import { useLenisContext } from "@/context/LenisContext";
import LiveClock from "@/components/ui/LiveClock";

const previewImages: Record<string, string> = {
  "#home": "/images/hero-poster.jpg",
  "#about": "/images/about-milford-sound.jpg",
  "#work": "/images/work-queenstown-wedding.jpg",
  "#contact": "/images/service-mice.jpg",
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
        <span className="font-display text-xl font-semibold text-ivory">P&amp;C</span>
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

      <div className="flex flex-1 flex-col gap-10 overflow-y-auto px-6 pb-8 sm:px-10 lg:flex-row lg:items-center lg:gap-6">
        <nav
          className="flex flex-1 flex-col justify-center gap-1"
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
              className={`group flex items-baseline gap-4 border-b border-deep-line py-3 transition-opacity duration-300 sm:py-4 ${
                hovered && hovered !== item.href ? "opacity-35" : "opacity-100"
              }`}
            >
              <span className="font-mono-label text-copper">{item.index}</span>
              <span
                className={`font-display text-[13vw] font-semibold leading-none tracking-tight transition-colors duration-300 sm:text-6xl lg:text-7xl ${
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

      <div className="flex flex-col gap-4 border-t border-deep-line px-6 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-ivory/80">
          <a href={`mailto:${site.contact.email}`} className="hover:text-copper">
            {site.contact.email}
          </a>
          <a href={site.contact.phoneHref} className="hover:text-copper">
            {site.contact.phone}
          </a>
          <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="hover:text-copper">
            WhatsApp
          </a>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-5">
            {site.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono-label text-mist hover:text-copper"
              >
                {s.label}
              </a>
            ))}
          </div>
          <LiveClock />
        </div>
      </div>
    </motion.div>
  );
}
