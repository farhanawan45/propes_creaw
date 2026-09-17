"use client";

import type Lenis from "lenis";

export function scrollToHash(hash: string, offset = -88) {
  const target = document.querySelector(hash);
  if (!target) return;

  const lenis = (window as Window & { __lenis?: Lenis }).__lenis;
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { offset, duration: 1.4 });
  } else {
    const y = (target as HTMLElement).getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}
