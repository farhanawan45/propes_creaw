"use client";

import { useRef } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import { scrollToHash } from "@/lib/scrollTo";
import MagneticButton from "@/components/ui/MagneticButton";
import LiveClock from "@/components/ui/LiveClock";

const year = new Date().getFullYear();

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const spotX = useMotionValue(50);
  const spotY = useMotionValue(50);
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${spotX}% ${spotY}%, rgba(201,119,74,0.32), transparent 70%)`;

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
    <footer ref={footerRef} className="section-pad-top relative z-0 overflow-hidden bg-pounamu-night">
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* CTA block */}
        <div className="relative flex flex-col items-center gap-10 border-b border-deep-line pb-16 text-center sm:pb-20 lg:flex-row lg:justify-between lg:text-left">
          <div className="copper-glow" style={{ inset: "-60%" }} aria-hidden="true" />
          <div className="relative">
            <div className="font-mono-label text-copper">HAVE AN EVENT IN MIND?</div>
            <h2
              className="mt-4 font-display font-semibold tracking-tight text-ivory"
              style={{ fontSize: "clamp(32px, 4.5vw, 76px)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
            >
              Let&rsquo;s make it <span className="text-copper">unforgettable.</span>
            </h2>
          </div>

          <MagneticButton
            as="a"
            href="#contact"
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              scrollToHash("#contact");
            }}
            strength={0.3}
            className="group relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-copper text-pounamu-night transition-colors hover:bg-copper-light sm:h-40 sm:w-40"
          >
            <svg className="absolute inset-0 h-full w-full animate-spin-slower" viewBox="0 0 200 200">
              <defs>
                <path id="circlePath" d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" />
              </defs>
              <text className="font-mono-label fill-pounamu-night" style={{ fontSize: "10.5px", letterSpacing: "2px" }}>
                <textPath href="#circlePath">
                  PROPS &amp; CREW • NEW ZEALAND • PROPS &amp; CREW • NEW ZEALAND •
                </textPath>
              </text>
            </svg>
            <span className="relative z-10 font-display text-sm font-semibold">Get a Quote</span>
          </MagneticButton>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden border-b border-deep-line py-8">
          <div ref={marqueeRef} className="flex w-max items-center gap-8 whitespace-nowrap">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex items-center gap-8">
                {site.services.map((s) => (
                  <span key={s.id} className="flex items-center gap-8">
                    <span
                      className="font-display font-semibold text-transparent"
                      style={{
                        fontSize: "clamp(28px, 4vw, 56px)",
                        WebkitTextStroke: "1px rgba(245,241,232,0.28)",
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
            <div className="font-display text-2xl font-semibold text-ivory">{site.shortName}</div>
            <p className="mt-4 max-w-xs text-base font-light leading-relaxed text-mist">{site.footer.brandLine}</p>
            <div className="mt-6 flex gap-3">
              {site.social.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-deep-line text-xs text-ivory/80 transition-colors hover:border-copper hover:text-copper"
                >
                  {s.label.slice(0, 2)}
                </a>
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
                <li key={s.id} className="text-sm text-ivory/70">
                  {s.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono-label text-copper">Contact</div>
            <ul className="mt-5 space-y-3 text-sm text-ivory/80">
              <li>
                <a href={site.contact.phoneHref} className="hover:text-copper">
                  {site.contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="hover:text-copper">
                  {site.contact.email}
                </a>
              </li>
              <li className="max-w-[220px] text-mist">{site.contact.address}</li>
              <li>
                <LiveClock />
              </li>
            </ul>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex items-center gap-2 border-b border-deep-line pb-2 focus-within:border-copper">
              <input
                type="email"
                required
                placeholder="Your email address"
                aria-label="Newsletter email"
                className="w-full bg-transparent text-sm text-ivory placeholder:text-mist outline-none"
              />
              <button type="submit" aria-label="Subscribe" className="text-copper focus-ring">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
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
          <a href="#privacy" className="hover:text-copper">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-copper">
            Terms of Service
          </a>
          <MagneticButton
            as="button"
            onClick={() => scrollToHash("#home")}
            cursorLabel="Top"
            aria-label="Back to top"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-copper/60 text-copper transition-colors hover:bg-copper hover:text-pounamu-night focus-ring"
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
