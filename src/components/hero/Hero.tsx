"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site } from "@/content/site";
import { scrollToHash } from "@/lib/scrollTo";
import MagneticButton from "@/components/ui/MagneticButton";
import VideoBackground from "@/components/hero/VideoBackground";
import KenBurnsFallback from "@/components/hero/KenBurnsFallback";
import ServiceTicker from "@/components/hero/ServiceTicker";
import ShowreelLightbox from "@/components/hero/ShowreelLightbox";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoFailed, setVideoFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [showreelOpen, setShowreelOpen] = useState(false);
  // Server has no `window`, so it always renders the video branch. Reading
  // prefersReducedMotion() directly during render would make the client's
  // very first render diverge from that server markup (hydration
  // mismatch) whenever the OS preference is set. Default to matching the
  // server, then correct after mount.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(prefersReducedMotion());
  }, []);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: reduced ? 0 : 0.25 });

      tl.fromTo(
        labelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      )
        .fromTo(
          wordRefs.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, stagger: 0.035, ease: "power4.out" },
          "-=0.3"
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.5"
        )
        .fromTo(
          ctaRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          bottomBarRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.45 },
          "-=0.2"
        );

    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      if (videoRef.current) videoRef.current.muted = next;
      return next;
    });
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
    setPlaying((p) => !p);
  };

  const headline = site.hero.headline;
  const flatWords = headline.flatMap((part) =>
    part.text
      .split(" ")
      .filter(Boolean)
      .map((word) => ({ word, emphasis: "emphasis" in part && !!part.emphasis }))
  );

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] w-full items-end overflow-hidden bg-pounamu-night"
    >
      <div ref={mediaRef} className="absolute inset-0 origin-bottom overflow-hidden">
        {!videoFailed && !reduced ? (
          <VideoBackground
            ref={videoRef}
            src={site.hero.video.mp4}
            poster={site.hero.video.poster}
            muted={muted}
            onError={() => setVideoFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <KenBurnsFallback />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-pounamu-night via-pounamu-night/50 to-pounamu-night/15" />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, rgba(12,31,28,0.85), rgba(12,31,28,0.2))" }}
        />
      </div>

      <div className="relative z-10 w-full px-5 pb-20 pt-36 sm:px-8 sm:pb-24 sm:pt-40 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[1440px]">
          <div
            ref={labelRef}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-pounamu-night/70 px-4 py-2 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />
            <span
              className="font-mono-label text-ivory"
              style={{ fontSize: "13px" }}
            >
              {site.hero.label}
            </span>
          </div>

          <h1
            className="font-display font-semibold tracking-tight text-ivory"
            style={{
              // vh-capped too: at 150px on a short/wide 1080p viewport, three
              // stacked lines overflow the bottom-anchored hero and get cut
              // off by the header — clamp on whichever axis is tighter.
              fontSize: "clamp(44px, min(7.5vw, 9vh), 136px)",
              lineHeight: 0.98,
              letterSpacing: "-0.03em",
            }}
          >
            {flatWords.map(({ word, emphasis }, i) => (
              <Fragment key={i}>
                {word === "across" && <br className="hidden lg:block" />}
                <span className="mr-[0.22em] inline-block overflow-hidden align-top">
                  <span
                    ref={(el) => {
                      wordRefs.current[i] = el;
                    }}
                    className={`inline-block ${emphasis ? "text-copper italic" : ""}`}
                  >
                    {word}
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>

          <p
            ref={subRef}
            className="mt-6 max-w-[560px] font-light text-ivory/90"
            style={{ fontSize: "20px", lineHeight: 1.5 }}
          >
            {site.hero.lead}
          </p>

          <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
            <MagneticButton
              as="a"
              href={site.hero.ctaPrimary.href}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                scrollToHash(site.hero.ctaPrimary.href);
              }}
              cursorLabel="View"
              className="btn-gradient rounded-full px-8 py-3.5 text-sm font-semibold tracking-wide text-pounamu-night focus-ring"
            >
              {site.hero.ctaPrimary.label}
            </MagneticButton>
            <MagneticButton
              as="a"
              href={site.hero.ctaSecondary.href}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                scrollToHash(site.hero.ctaSecondary.href);
              }}
              className="btn-gradient-outline rounded-full px-8 py-3.5 text-sm font-medium tracking-wide text-ivory backdrop-blur-sm focus-ring"
            >
              {site.hero.ctaSecondary.label}
            </MagneticButton>
          </div>

          <div
            ref={bottomBarRef}
            className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-deep-line pt-6 sm:mt-20"
          >
            <ServiceTicker />

            <div className="flex flex-1 flex-col items-center gap-2 sm:flex-none">
              <span className="font-mono-label text-mist">Scroll</span>
              <span className="relative h-9 w-px overflow-hidden bg-ivory/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollLine_1.8s_ease-in-out_infinite] bg-copper" />
              </span>
            </div>

            <div className="flex items-center gap-3">
              {!videoFailed && !reduced && (
                <>
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={playing ? "Pause background video" : "Play background video"}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-deep-line text-ivory transition-colors hover:border-copper hover:text-copper focus-ring"
                  >
                    {playing ? (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
                        <rect x="1" y="0" width="3.5" height="12" />
                        <rect x="7" y="0" width="3.5" height="12" />
                      </svg>
                    ) : (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor">
                        <polygon points="1,0 11,6 1,12" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={muted ? "Unmute background video" : "Mute background video"}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-deep-line text-ivory transition-colors hover:border-copper hover:text-copper focus-ring"
                  >
                    {muted ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M4 9v6h4l5 5V4L8 9H4z" />
                        <line x1="16" y1="9" x2="22" y2="15" />
                        <line x1="22" y1="9" x2="16" y2="15" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M4 9v6h4l5 5V4L8 9H4z" />
                        <path d="M16 8a5 5 0 010 8" />
                      </svg>
                    )}
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setShowreelOpen(true)}
                data-cursor="Play"
                aria-label="Play showreel with sound"
                className="btn-gradient-icon flex h-14 w-14 items-center justify-center rounded-full text-copper focus-ring"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                  <polygon points="1,0 14,7 1,14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showreelOpen && <ShowreelLightbox onClose={() => setShowreelOpen(false)} />}
    </section>
  );
}
