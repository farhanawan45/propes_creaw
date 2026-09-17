"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap, prefersReducedMotion } from "@/lib/gsap";

interface LenisContextValue {
  lenis: Lenis | null;
  pause: () => void;
  resume: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  pause: () => {},
  resume: () => {},
});

export function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pauseRef = useRef(() => {});
  const resumeRef = useRef(() => {});

  useEffect(() => {
    registerGsap();

    if (prefersReducedMotion()) {
      return;
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });

    pauseRef.current = () => instance.stop();
    resumeRef.current = () => instance.start();

    instance.on("scroll", ScrollTrigger.update);

    const rafCallback = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    (window as Window & { __lenis?: Lenis }).__lenis = instance;
    // Lenis can only be instantiated client-side after mount, so the
    // instance can't be produced during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    return () => {
      gsap.ticker.remove(rafCallback);
      instance.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return (
    <LenisContext.Provider
      value={{ lenis, pause: () => pauseRef.current(), resume: () => resumeRef.current() }}
    >
      {children}
    </LenisContext.Provider>
  );
}

export function useLenisContext() {
  return useContext(LenisContext);
}
