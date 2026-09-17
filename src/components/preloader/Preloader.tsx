"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";

const SESSION_KEY = "pc-preloader-shown";
const QUICK_DURATION_S = 1.5;
const HOLD_CAP_MS = 3000;
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
    v.preload = "auto";
    v.oncanplaythrough = () => resolve();
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
      // after it. By the time the 7s (or 1.5s) timeline completes, this
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
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-pounamu-night" role="status" aria-label="Site loading">
      <div ref={panelLeftRef} className="absolute inset-y-0 left-0 w-1/2 bg-pounamu-night" />
      <div ref={panelRightRef} className="absolute inset-y-0 right-0 w-1/2 bg-pounamu-night" />

      <div data-track className="absolute inset-x-[8%] top-1/2 -translate-y-1/2">
        <div className="relative h-px w-full bg-deep-line">
          <div ref={fillRef} className="absolute inset-y-0 left-0 bg-copper" style={{ width: "0%" }} />
        </div>

        <div
          ref={logoRef}
          className="absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-copper/50 bg-pounamu-night"
          style={{ left: "0%", boxShadow: "0 0 22px rgba(201,119,74,0.55)" }}
        >
          <span className="font-display text-xs font-semibold text-copper">P&amp;C</span>
        </div>
      </div>

      <div ref={centerRef} className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <div ref={wordmarkRef} className="flex gap-[0.15em] overflow-hidden">
          {site.name.toUpperCase().split("").map((char, i) => (
            <span key={i} data-letter className="font-mono-label inline-block text-mist">
              {char === " " ? " " : char}
            </span>
          ))}
        </div>
        <div className="font-mono-label tabular-nums text-copper" style={{ fontSize: "20px" }}>
          <span ref={counterRef}>000</span>
        </div>
        <div className="relative h-4 w-full text-center">
          {STATUS_MESSAGES.map((msg, i) => (
            <span
              key={msg}
              ref={(el) => {
                statusRefs.current[i] = el;
              }}
              className="font-mono-label absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-mist opacity-0"
              style={{ fontSize: "11px" }}
            >
              {msg}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        data-skip
        className="absolute bottom-8 right-8 font-mono-label text-ivory transition-colors hover:text-copper focus-ring"
      >
        Skip
      </button>
    </div>
  );
}
