"use client";

import { useEffect, useRef, useState } from "react";

interface VideoBackgroundProps {
  sources: readonly string[];
  poster: string;
  muted: boolean;
  playing: boolean;
  onError: () => void;
  className?: string;
}

export default function VideoBackground({ sources, poster, muted, playing, onError, className = "" }: VideoBackgroundProps) {
  const videosRef = useRef<(HTMLVideoElement | null)[]>([]);
  const failedRef = useRef(new Set<number>());
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!playing || sources.length < 2) return;
    const timer = window.setInterval(() => {
      setActive((current) => {
        const next = (current + 1) % sources.length;
        const nextVideo = videosRef.current[next];
        // Never fade toward an unloaded frame. On slower mobile networks the
        // current scene simply stays visible until the next one is ready.
        return nextVideo && nextVideo.readyState >= 3 ? next : current;
      });
    }, 4800);
    return () => window.clearInterval(timer);
  }, [playing, sources.length]);

  useEffect(() => {
    if (sources.length < 2) return;
    const timers = sources.slice(1).map((_, offset) =>
      window.setTimeout(() => {
        const video = videosRef.current[offset + 1];
        if (!video || video.readyState >= 3) return;
        video.preload = "auto";
        video.load();
      }, 6000 + offset * 1500)
    );
    return () => timers.forEach(window.clearTimeout);
  }, [sources]);

  useEffect(() => {
    videosRef.current.forEach((video, index) => {
      if (!video) return;
      video.muted = muted;
      if (playing && index === active) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, muted, playing]);

  return (
    <div
      className={className}
      style={{ backgroundImage: `url(${poster})`, backgroundPosition: "center", backgroundSize: "cover" }}
    >
      {sources.map((src, index) => (
        <video
          key={src}
          ref={(element) => { videosRef.current[index] = element; }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ease-in-out ${
            active === index ? "opacity-100 duration-300" : "opacity-0 duration-[1400ms]"
          }`}
          autoPlay={index === 0}
          loop
          muted={muted}
          playsInline
          preload={index === 0 ? "auto" : "none"}
          poster={index === 0 ? poster : undefined}
          onError={() => {
            failedRef.current.add(index);
            if (failedRef.current.size === sources.length) onError();
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
      {sources.length > 1 && (
        <div
          key={active}
          className="hero-cinematic-flash pointer-events-none absolute inset-0"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
