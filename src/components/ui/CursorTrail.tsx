"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trail = trailRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!trail || !finePointer.matches || reducedMotion.matches) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    let started = false;

    const draw = () => {
      x += (targetX - x) * 0.58;
      y += (targetY - y) * 0.58;
      trail.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - x) > 0.2 || Math.abs(targetY - y) > 0.2) {
        frame = window.requestAnimationFrame(draw);
      } else {
        frame = 0;
      }
    };

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!started) {
        x = targetX;
        y = targetY;
        started = true;
      }
      trail.style.opacity = "1";
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const hide = () => { trail.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);

    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", hide);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={trailRef} className="cursor-trail" aria-hidden="true" />;
}
