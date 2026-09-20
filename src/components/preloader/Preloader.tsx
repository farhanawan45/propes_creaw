"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { site } from "@/content/site";

const ENTER_UNLOCK_SECONDS = 30;

export default function Preloader() {
  const pathname = usePathname();
  const videoRef = useRef<HTMLVideoElement>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [muted, setMuted] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const canEnter = playedSeconds >= ENTER_UNLOCK_SECONDS;
  const remaining = Math.max(0, ENTER_UNLOCK_SECONDS - Math.floor(playedSeconds));

  useEffect(() => {
    if (pathname !== "/" || entered) document.documentElement.classList.remove("preload-lock");
    else document.documentElement.classList.add("preload-lock");
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [entered, pathname]);

  useEffect(() => {
    if (pathname !== "/" || entered) return;
    videoRef.current?.play().catch(() => setVideoError(true));
  }, [entered, pathname]);

  const enterWebsite = () => {
    if (!canEnter || exiting) return;
    setExiting(true);
    videoRef.current?.pause();
    exitTimerRef.current = setTimeout(() => {
      const lenis = (window as Window & { __lenis?: { scrollTo: (target: number, options?: { immediate?: boolean; force?: boolean }) => void; start: () => void } }).__lenis;
      lenis?.scrollTo(0, { immediate: true, force: true });
      lenis?.start();
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      setEntered(true);
      document.documentElement.classList.remove("preload-lock");
    }, 900);
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
    video.play().catch(() => {});
  };

  if (pathname !== "/" || entered) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden bg-black transition-[clip-path,opacity] duration-[900ms] ease-[cubic-bezier(.76,0,.24,1)] ${exiting ? "opacity-0 [clip-path:circle(0%_at_50%_50%)]" : "opacity-100 [clip-path:circle(150%_at_50%_50%)]"}`}
      role="dialog"
      aria-modal="true"
      aria-label="Client introduction video"
    >
      <video
        ref={videoRef}
        src={site.hero.video.mp4[0]}
        poster={site.hero.video.poster}
        autoPlay
        muted={muted}
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        onTimeUpdate={(event) => setPlayedSeconds(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => event.currentTarget.play().catch(() => setVideoError(true))}
        onError={() => setVideoError(true)}
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/35" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-8">
        <div className="rounded-[10px] border border-white/20 bg-black/30 px-3 py-2 font-mono-label text-[7px] tracking-[0.16em] text-white/75 backdrop-blur-md sm:px-4 sm:text-[8px] sm:tracking-[0.2em]">
          PROPS &amp; CREW PRESENTS
        </div>
        <button type="button" onClick={toggleSound} className="flex h-11 items-center justify-center gap-2 rounded-[10px] border border-white/20 bg-black/30 px-3 text-white backdrop-blur-md transition-colors hover:border-copper hover:text-copper focus-ring sm:px-4" aria-label={muted ? "Turn intro sound on" : "Turn intro sound off"}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          <span className="hidden font-mono-label text-[8px] tracking-[0.14em] sm:inline">{muted ? "SOUND ON" : "SOUND OFF"}</span>
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-[7svh] p-5 sm:bottom-[7svh] sm:p-8 lg:p-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl sm:-translate-y-14 lg:-translate-y-32">
            <div className="font-mono-label text-[8px] tracking-[0.2em] text-copper-light sm:text-[9px] sm:tracking-[0.24em]">WELCOME TO NEW ZEALAND</div>
            <h1 className="mt-2 max-w-[13ch] font-display text-[clamp(1.9rem,4.4vw,4.5rem)] font-semibold leading-[.94] tracking-[-0.05em] text-white sm:mt-3">
              Every experience starts with a story.
            </h1>
          </div>

          <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:min-w-[230px] sm:-translate-y-5 sm:items-end lg:-translate-y-10">
            {!canEnter ? (
              <div className="rounded-[10px] border border-white/15 bg-black/35 px-5 py-3 text-center font-mono-label text-[8px] tracking-[0.14em] text-white/70 backdrop-blur-md sm:text-[9px] sm:tracking-[0.16em]" aria-live="polite">
                ENTER UNLOCKS IN {remaining}s
              </div>
            ) : (
              <button type="button" onClick={enterWebsite} className="btn-gradient group flex items-center justify-center gap-3 rounded-[10px] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_45px_rgba(201,119,74,.35)] focus-ring">
                Enter Website
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
            <div className="h-[2px] w-full overflow-hidden bg-white/15 sm:w-[230px]">
              <div className="h-full bg-gradient-to-r from-copper-dark to-copper-light transition-[width] duration-300 ease-linear" style={{ width: `${Math.min(100, (playedSeconds / ENTER_UNLOCK_SECONDS) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {videoError && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-red-300/30 bg-black/70 px-5 py-4 text-center text-sm text-white backdrop-blur-md">
          The introduction video could not play. Please refresh and try again.
        </div>
      )}
    </div>
  );
}
