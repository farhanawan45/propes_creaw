"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";

const SESSION_KEY = "pc-preloader-shown";
const QUICK_DURATION_S = 5;
const HOLD_CAP_MS = 800;
const STATUS_MESSAGES = ["Preparing your experience…", "Loading New Zealand…", "Almost ready…"];

// Preloads in parallel with the timeline below — never shortens it, only
// (rarely) extends the hold at 100%, capped at HOLD_CAP_MS.
function waitForAssets(): Promise<void> {
  const poster = new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = site.hero.video.poster;
  });
  const video = new Promise<void>((resolve) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.onloadedmetadata = () => resolve();
    v.onerror = () => resolve();
    v.src = site.hero.video.mp4;
    v.load();
  });
  const fonts =
    typeof document !== "undefined" && "fonts" in document ? document.fonts.ready.then(() => {}) : Promise.resolve();
  return Promise.all([poster, video, fonts]).then(() => {});
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function Preloader() {
  // Read (never write) synchronously during the initial render via a lazy
  // initializer — this is what actually matters. Reading twice (React
  // Strict Mode replays initializers in dev) is safe because it's a pure
  // read; correcting `mode` a tick later via a layout-effect + setState
  // was the previous approach, and it doesn't work: useGSAP defers/skips
  // cleanup between dependency-array changes by design (see its source —
  // `deferCleanup` only reverts on true unmount once `mounted` is true),
  // so switching `mode` after mount left the old 7s timeline running
  // forever alongside the new one, both fighting over the same DOM. With
  // `mode` correct from the very first render, useGSAP only ever runs
  // once and its normal mount/unmount cleanup applies.
  const [mode] = useState<"full" | "quick">(() => {
    if (typeof window === "undefined") return "full";
    return sessionStorage.getItem(SESSION_KEY) ? "quick" : "full";
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef = useRef<HTMLDivElement>(null);
  const skippedRef = useRef(false);

  useLayoutEffect(() => {
    // Idempotent — safe to run more than once (Strict Mode), and doesn't
    // affect this visit's own `mode`, only future ones this session.
    sessionStorage.setItem(SESSION_KEY, "1");
  }, []);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      const finish = () => {
        document.documentElement.classList.remove("preload-lock");
        gsap.set(container, { display: "none" });
      };

      if (prefersReducedMotion()) {
        finish();
        return;
      }

      const quick = mode === "quick";
      const duration = quick ? QUICK_DURATION_S : site.preloader.durationSeconds;

      // Started immediately, in parallel with the timeline — not chained
      // after it. By the time the 5s timeline completes, this
      // has almost always already resolved.
      const assetsReadyRef = { current: false };
      const assetsPromise = waitForAssets().then(() => {
        assetsReadyRef.current = true;
      });

      const setCounter = (v: number) => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, "0");
      };
      // The logo's position is never a separate value — it's always
      // exactly the tweened progress percentage, so it can never drift
      // out of sync with the counter.
      const setLogoPosition = (v: number) => {
        const pct = Math.min(100, Math.max(0, v));
        if (logoRef.current) logoRef.current.style.left = `${pct}%`;
        if (fillRef.current) fillRef.current.style.width = `${pct}%`;
      };

      const runExit = () => {
        const exitDuration = quick ? 0.35 : 0.7;
        const splitDuration = quick ? 0.6 : 1.2;
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(logoRef.current, {
          x: () => -(logoRef.current!.getBoundingClientRect().left) + 28,
          y: () => -(logoRef.current!.getBoundingClientRect().top) + 24,
          scale: 0.42,
          duration: exitDuration,
          ease: "power3.inOut",
        })
          .to(centerRef.current, { opacity: 0, duration: 0.25 }, "<")
          .to(
            panelLeftRef.current,
            { clipPath: "inset(0 100% 0 0)", duration: splitDuration, ease: "power4.inOut" },
            quick ? "-=0.1" : "-=0.3"
          )
          .to(panelRightRef.current, { clipPath: "inset(0 0 0 100%)", duration: splitDuration, ease: "power4.inOut" }, "<");
      };

      const masterTl = gsap.timeline();
      const statusTl = gsap.timeline();

      const skip = () => {
        if (skippedRef.current) return;
        skippedRef.current = true;
        masterTl.kill();
        statusTl.kill();
        gsap.killTweensOf([logoRef.current, counterRef.current]);
        gsap.set([logoRef.current, counterRef.current], { opacity: 1 });
        setCounter(100);
        setLogoPosition(100);
        runExit();
      };
      const skipBtn = container.querySelector<HTMLButtonElement>("[data-skip]");
      skipBtn?.addEventListener("click", skip);

      // Letters reveal one-by-one across the first 40% of the run.
      const letters = wordmarkRef.current?.querySelectorAll("[data-letter]");
      const letterWindow = duration * 0.4;
      masterTl.fromTo(
        letters ?? [],
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, duration: 0.35, stagger: letterWindow / (letters?.length || 1) },
        0
      );

      // The counter — a plain tweened object updated every frame, never
      // jumping. The logo position and the line fill read the exact same
      // value, so everything stays perfectly in sync.
      const progress = { value: 0 };
      masterTl.to(
        progress,
        {
          value: 100,
          duration,
          ease: "power2.inOut",
          onUpdate: () => {
            setCounter(progress.value);
            setLogoPosition(progress.value);
          },
        },
        0
      );

      // Status text — cross-fades through the three lines across the run.
      const segment = duration / STATUS_MESSAGES.length;
      statusRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === 0) statusTl.set(el, { opacity: 1 }, 0);
        else statusTl.to(el, { opacity: 1, duration: 0.4 }, i * segment);
        if (i < STATUS_MESSAGES.length - 1) statusTl.to(el, { opacity: 0, duration: 0.4 }, (i + 1) * segment - 0.4);
      });

      masterTl.eventCallback("onComplete", async () => {
        if (skippedRef.current) return;

        if (!assetsReadyRef.current) {
          // Hold at 100 with a subtle pulse until assets are ready,
          // capped so a slow asset can never stall the reveal for long.
          const pulse = gsap.to([logoRef.current, counterRef.current], {
            opacity: 0.55,
            duration: 0.6,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
          });
          await Promise.race([assetsPromise, delay(HOLD_CAP_MS)]);
          pulse.kill();
          if (skippedRef.current) return;
          gsap.set([logoRef.current, counterRef.current], { opacity: 1 });
        }

        statusTl.kill();
        await delay(400);
        if (!skippedRef.current) runExit();
      });

      return () => {
        skipBtn?.removeEventListener("click", skip);
        statusTl.kill();
        masterTl.kill();
      };
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] overflow-hidden bg-pounamu-night" role="status" aria-label="Site loading">
      <div ref={panelLeftRef} className="absolute inset-y-0 left-0 w-1/2 bg-pounamu-night" />
      <div ref={panelRightRef} className="absolute inset-y-0 right-0 w-1/2 bg-pounamu-night" />

      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,119,74,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,119,74,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(circle at center, black, transparent 72%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(201,119,74,0.16), transparent 67%)" }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px animate-[scanLine_3.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-copper/80 to-transparent shadow-[0_0_18px_rgba(201,119,74,0.8)]" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="preloader-bubble left-[7%] top-[18%] h-16 w-16 sm:h-20 sm:w-20" style={{ animationDelay: "-1.2s", animationDuration: "7s" }} />
        <span className="preloader-bubble left-[20%] top-[70%] h-10 w-10 sm:h-12 sm:w-12" style={{ animationDelay: "-4.1s", animationDuration: "9s" }} />
        <span className="preloader-bubble left-[36%] top-[13%] h-8 w-8 sm:h-10 sm:w-10" style={{ animationDelay: "-2.6s", animationDuration: "6s" }} />
        <span className="preloader-bubble left-[56%] top-[76%] h-14 w-14 sm:h-16 sm:w-16" style={{ animationDelay: "-5.2s", animationDuration: "8s" }} />
        <span className="preloader-bubble left-[72%] top-[20%] h-12 w-12 sm:h-14 sm:w-14" style={{ animationDelay: "-3.4s", animationDuration: "7.5s" }} />
        <span className="preloader-bubble left-[86%] top-[65%] h-16 w-16 sm:h-24 sm:w-24" style={{ animationDelay: "-6s", animationDuration: "10s" }} />
        <span className="preloader-bubble left-[82%] top-[39%] h-7 w-7 sm:h-9 sm:w-9" style={{ animationDelay: "-0.8s", animationDuration: "5.5s" }} />
      </div>

      <div data-track className="absolute inset-x-[11%] top-1/2 -translate-y-1/2 sm:inset-x-[8%]">
        <div className="absolute -top-5 left-0 font-mono-label text-[8px] text-mist/50">00 / INIT</div>
        <div className="absolute -top-5 right-0 font-mono-label text-[8px] text-mist/50">100 / ENTER</div>
        <div
          className="relative h-[3px] w-full overflow-visible bg-deep-line"
          style={{
            backgroundImage: "repeating-linear-gradient(90deg, rgba(245,241,232,0.14) 0 1px, transparent 1px 32px)",
          }}
        >
          <div
            ref={fillRef}
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#8f3d28] via-copper to-[#f0b07a] shadow-[0_0_18px_rgba(201,119,74,0.75)]"
            style={{ width: "0%" }}
          />
        </div>

        <div
          ref={logoRef}
          className="absolute top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-copper/70 bg-pounamu-night sm:h-14 sm:w-14"
          style={{ left: "0%", boxShadow: "0 0 0 6px rgba(201,119,74,0.06), 0 0 32px rgba(201,119,74,0.58)" }}
        >
          <span className="absolute inset-1 animate-spin-slower rounded-full border border-dashed border-copper/45" />
          <span className="absolute -inset-2 rounded-full border border-copper/15" />
          <span className="font-display text-xs font-semibold text-copper sm:text-sm">P&amp;C</span>
        </div>
      </div>

      <div ref={centerRef} className="absolute inset-0 flex flex-col items-center justify-center px-5">
        <div className="mb-5 flex items-center gap-3 font-mono-label text-[9px] text-copper/80">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-copper/70" />
          IMMERSIVE SYSTEM
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-copper/70" />
        </div>
        <div
          ref={wordmarkRef}
          className="flex max-w-full gap-[0.08em] overflow-hidden whitespace-nowrap font-display font-semibold leading-none tracking-[0.08em] text-ivory sm:gap-[0.12em] sm:tracking-[0.12em]"
          style={{ fontSize: "clamp(29px, 8vw, 50px)" }}
        >
          {site.name.toUpperCase().split("").map((char, i) => (
            <span key={i} data-letter className="inline-block drop-shadow-[0_0_18px_rgba(245,241,232,0.16)]">
              {char === " " ? " " : char}
            </span>
          ))}
        </div>
        <div className="mt-7 flex items-baseline gap-2 font-mono-label tabular-nums text-copper">
          <span ref={counterRef} className="text-[28px] tracking-[0.16em] sm:text-[32px]">000</span>
          <span className="text-[10px] text-mist/50">%</span>
        </div>
        <div className="relative mt-3 h-5 w-full text-center">
          {STATUS_MESSAGES.map((msg, i) => (
            <span
              key={msg}
              ref={(el) => {
                statusRefs.current[i] = el;
              }}
              className="font-mono-label absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-mist/70 opacity-0"
              style={{ fontSize: "10px", letterSpacing: "0.16em" }}
            >
              {msg}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        data-skip
        className="btn-gradient-outline absolute bottom-8 right-8 rounded-full px-5 py-2 font-mono-label text-[10px] text-ivory focus-ring"
      >
        Skip intro
      </button>

    </div>
  );
}
