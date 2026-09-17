"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { site } from "@/content/site";
import { prefersReducedMotion } from "@/lib/gsap";

export default function KenBurnsFallback() {
  const images = site.hero.kenBurnsFallback;
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(prefersReducedMotion());
    if (prefersReducedMotion()) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-pounamu-night">
      {images.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1800ms] ease-in-out"
          style={{ opacity: reduced ? (i === 0 ? 1 : 0) : i === index ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={reduced ? "object-cover" : "object-cover animate-[kenburns_6s_ease-in-out_infinite_alternate]"}
          />
        </div>
      ))}
    </div>
  );
}
