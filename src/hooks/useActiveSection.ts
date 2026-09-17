"use client";

import { useEffect, useState } from "react";
import { registerGsap, ScrollTrigger } from "@/lib/gsap";
import { site } from "@/content/site";

export function useActiveSection() {
  const [active, setActive] = useState("#home");

  useEffect(() => {
    registerGsap();
    const triggers = site.nav.map((item) => {
      const el = document.querySelector(item.href);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) setActive(item.href);
        },
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, []);

  return active;
}
