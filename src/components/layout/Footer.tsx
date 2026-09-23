"use client";

import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import { scrollToHash } from "@/lib/scrollTo";
import MagneticButton from "@/components/ui/MagneticButton";
import BrandLogo from "@/components/ui/BrandLogo";
import LiveClock from "@/components/ui/LiveClock";

const year = new Date().getFullYear();

function SocialIcon({ label }: { label: string }) {
  if (label === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (label === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-8h2.8l.42-3H13.5V8.08c0-.87.24-1.46 1.62-1.46h1.73V3.94a23.2 23.2 0 0 0-2.52-.13c-2.5 0-4.2 1.52-4.2 4.31V10H7.3v3h2.83v8h3.37Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M6.48 8.18H3.26V20h3.22V8.18ZM4.87 3A1.88 1.88 0 1 0 4.87 6.76 1.88 1.88 0 0 0 4.87 3ZM20.74 13.22c0-3.56-1.9-5.22-4.44-5.22a3.84 3.84 0 0 0-3.48 1.91V8.18H9.6V20h3.22v-5.86c0-1.54.3-3.04 2.21-3.04 1.89 0 1.91 1.76 1.91 3.14V20h3.22l.58-6.78Z" />
    </svg>
  );
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${spotX}% ${spotY}%, rgba(251,83,44,0.32), transparent 70%)`;

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const marqueeTween = gsap.to(marqueeRef.current, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1,
      });

      marqueeRef.current?.addEventListener("mouseenter", () => marqueeTween.timeScale(0.25));
      marqueeRef.current?.addEventListener("mouseleave", () => marqueeTween.timeScale(1));

      const words = wordmarkRef.current?.querySelectorAll("[data-letter]");
      if (words?.length) {
        gsap.fromTo(
          words,
          { yPercent: 100, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.02,
            ease: "power4.out",
            scrollTrigger: { trigger: wordmarkRef.current, start: "top 90%" },
          }
        );
      }

      return () => {
        ScrollTrigger.getAll().forEach((t) => {
          if (t.trigger === wordmarkRef.current) t.kill();
        });
      };
    },
    { scope: footerRef }
  );

  const handleWordmarkMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <footer ref={footerRef} className="relative z-0 overflow-hidden bg-pounamu-night">
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Marquee */}
        <div className="overflow-hidden border-y border-deep-line py-8">
          <div ref={marqueeRef} className="flex w-max items-center gap-8 whitespace-nowrap">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-8">
                {site.services.map((s) => (
                  <span key={s.id} className="flex items-center gap-8">
                    <span
                      className="font-display font-semibold text-ivory/85 drop-shadow-[0_2px_16px_rgba(255,253,248,.08)]"
                      style={{
                        fontSize: "clamp(28px, 4vw, 56px)",
                        WebkitTextStroke: "0.4px rgba(255,253,248,0.35)",
                      }}
                    >
                      {s.name}
                    </span>
                    <span className="text-copper" style={{ fontSize: "clamp(16px, 2vw, 28px)" }}>
                      ✦
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <BrandLogo size="md" />
            <p className="mt-4 max-w-xs text-base font-light leading-relaxed text-mist">{site.footer.brandLine}</p>
            <div className="mt-6 flex gap-3">
              {site.social.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -4, scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 420, damping: 16 }}
                  className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-deep-line text-ivory/80 transition-[border-color,color,box-shadow] duration-500 hover:border-copper hover:text-copper hover:shadow-[0_0_24px_rgba(251,83,44,0.45)]"
                >
                  <span className="absolute inset-1 rounded-full border border-copper opacity-0 transition-all duration-700 group-hover:scale-[1.7] group-hover:opacity-40" />
                  <span className="relative transition-transform duration-700 ease-out group-hover:rotate-[360deg] group-hover:scale-110">
                    <SocialIcon label={s.label} />
                  </span>
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-mono-label text-copper">Navigate</div>
            <ul className="mt-5 space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHash(item.href);
                    }}
                    className="text-sm text-ivory/80 transition-colors hover:text-copper"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono-label text-copper">Services</div>
            <ul className="mt-5 grid grid-cols-1 gap-2.5">
              {site.services.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToHash("#services");
                    }}
                    className="group inline-flex items-center gap-2 text-sm text-ivory/70 transition-all duration-300 hover:translate-x-1 hover:text-copper"
                  >
                    <span className="h-px w-0 bg-copper transition-all duration-300 group-hover:w-3" />
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono-label text-copper">Contact</div>
            <ul className="mt-5 space-y-4 text-sm text-ivory/80">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-copper" strokeWidth={1.6} aria-hidden="true" />
                <a href={site.contact.phoneHref} className="hover:text-copper">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-copper" strokeWidth={1.6} aria-hidden="true" />
                <a href={`mailto:${site.contact.email}`} className="hover:text-copper">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex max-w-[250px] items-start gap-3 text-mist">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-copper" strokeWidth={1.6} aria-hidden="true" />
                <span>{site.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock3 className="h-4 w-4 shrink-0 text-copper" strokeWidth={1.6} aria-hidden="true" />
                <LiveClock />
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Giant wordmark */}
      <div
        ref={wordmarkRef}
        onMouseMove={handleWordmarkMove}
        className="relative select-none overflow-hidden border-t border-deep-line py-4"
      >
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: spotlight }}
        />
        <div
          className="whitespace-nowrap px-4 text-center font-display font-semibold leading-none text-ivory"
          style={{ fontSize: "clamp(3.25rem, 12.5vw, 10.5rem)" }}
        >
          {"PROPS & CREW".split("").map((char, i) => (
            <span key={i} data-letter className="inline-block overflow-hidden">
              <span className="inline-block">{char === " " ? " " : char}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-5 py-6 text-xs text-mist sm:flex-row sm:px-8 sm:pr-24 lg:px-12 lg:pr-28">
        <p>
          &copy; {year} {site.name}. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="/privacy" className="hover:text-copper">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-copper">
            Terms of Service
          </a>
          <MagneticButton
            as="button"
            onClick={() => scrollToHash("#home")}
            cursorLabel="Top"
            aria-label="Back to top"
            className="btn-gradient-icon flex h-10 w-10 items-center justify-center rounded-full text-copper focus-ring"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 19V5M6 11l6-6 6 6" />
            </svg>
          </MagneticButton>
        </div>
      </div>
    </footer>
  );
}
