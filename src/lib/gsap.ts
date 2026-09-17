"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function registerGsap() {
  if (registered) return;
  if (typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Register immediately on module evaluation (client-side only) rather
// than inside a component effect. React runs child effects before
// parent effects, so a provider-level effect would register the plugin
// too late for child components' own useGSAP calls that reference
// scrollTrigger on mount.
registerGsap();

export { gsap, ScrollTrigger };
