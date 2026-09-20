"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function Preloader() {
  const pathname = usePathname();
  const firstPath = useRef(pathname);
  const played = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const interfaceRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef(0);
  const rendererActiveRef = useRef(true);

  useLayoutEffect(() => {
    if (pathname !== "/") document.documentElement.classList.remove("preload-lock");
  }, [pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = containerRef.current;
    if (!canvas || !host || pathname !== "/") return;
    const context = canvas.getContext("2d");
    if (!context) return;
    rendererActiveRef.current = true;
    let frame = 0;
    let width = 0;
    let height = 0;
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; phase: number }> = [];

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.min(150, Math.max(70, Math.floor(width / 10))) }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.32,
        vy: (Math.random() - 0.5) * 0.32,
        size: 1.2 + Math.random() * 2.1,
        phase: index * 0.37,
      }));
    };

    const draw = (time: number) => {
      if (!rendererActiveRef.current) return;
      context.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const burst = burstRef.current;
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const dx = cx - particle.x;
        const dy = cy - particle.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const orbit = Math.sin(time * 0.0007 + particle.phase) * 0.018;
        particle.vx += (dx / distance) * 0.002 + (-dy / distance) * orbit;
        particle.vy += (dy / distance) * 0.002 + (dx / distance) * orbit;
        if (burst > 0) {
          particle.vx -= (dx / distance) * burst * 0.18;
          particle.vy -= (dy / distance) * burst * 0.18;
        }
        particle.vx *= 0.985;
        particle.vy *= 0.985;
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < -30 || particle.x > width + 30 || particle.y < -30 || particle.y > height + 30) {
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
          particle.vx = 0;
          particle.vy = 0;
        }
        context.beginPath();
        context.shadowBlur = i % 5 === 0 ? 12 : 7;
        context.shadowColor = i % 5 === 0 ? "rgba(233,154,105,.9)" : "rgba(127,210,184,.7)";
        context.fillStyle = i % 5 === 0 ? "rgba(233,154,105,.95)" : "rgba(193,229,217,.78)";
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        context.fill();
        for (let j = i + 1; j < Math.min(i + 6, particles.length); j += 1) {
          const other = particles[j];
          const gap = Math.hypot(particle.x - other.x, particle.y - other.y);
          if (gap < 105) {
            context.beginPath();
            context.shadowBlur = 0;
            context.strokeStyle = `rgba(127,210,184,${(1 - gap / 105) * 0.25})`;
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      }
      frame = window.requestAnimationFrame(draw);
    };
    resize();
    window.addEventListener("resize", resize);
    frame = window.requestAnimationFrame(draw);
    return () => {
      rendererActiveRef.current = false;
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const finish = () => {
      played.current = true;
      rendererActiveRef.current = false;
      document.documentElement.classList.remove("preload-lock");
      container.style.display = "none";
    };
    if (played.current || firstPath.current !== "/" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    const animations: Animation[] = [];
    if (coreRef.current) {
      animations.push(coreRef.current.animate(
        [{ opacity: 0, transform: "scale(.45) rotate(-18deg)" }, { opacity: 1, transform: "scale(1) rotate(0deg)" }],
        { duration: 750, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
      ));
      animations.push(coreRef.current.animate(
        [{ transform: "scale(1)", opacity: 1, filter: "blur(0) brightness(1)" }, { transform: "scale(5.5)", opacity: 0, filter: "blur(8px) brightness(1.8)" }],
        { delay: 1720, duration: 580, easing: "cubic-bezier(.7,0,.84,0)", fill: "forwards" }
      ));
    }
    if (interfaceRef.current) animations.push(interfaceRef.current.animate(
      [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0)" }, { opacity: 1, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(-12px)" }],
      { duration: 1830, easing: "cubic-bezier(.16,1,.3,1)", fill: "forwards" }
    ));
    if (barRef.current) animations.push(barRef.current.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      { delay: 120, duration: 1500, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" }
    ));
    animations.push(container.animate(
      [{ clipPath: "circle(150% at 50% 50%)" }, { clipPath: "circle(150% at 50% 50%)" }, { clipPath: "circle(0% at 50% 50%)" }],
      { duration: 2480, easing: "cubic-bezier(.76,0,.24,1)", fill: "forwards" }
    ));

    const start = performance.now();
    let frame = 0;
    const update = (now: number) => {
      const elapsed = now - start;
      const value = Math.round(Math.min(1, Math.max(0, (elapsed - 120) / 1500)) * 100);
      if (counterRef.current) counterRef.current.textContent = String(value).padStart(2, "0");
      burstRef.current = Math.min(1, Math.max(0, (elapsed - 1520) / 380));
      if (elapsed >= 2520) {
        finish();
        return;
      }
      frame = window.requestAnimationFrame(update);
    };
    frame = window.requestAnimationFrame(update);
    return () => {
      window.cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  if (pathname !== "/") return null;
  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] overflow-hidden bg-[#03110f]" role="status" aria-label="Initialising experience" style={{ clipPath: "circle(150% at 50% 50%)" }}>
      <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,119,74,.10),transparent_28%),radial-gradient(circle_at_center,transparent_42%,rgba(1,10,9,.88)_88%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:40px_40px]" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div ref={coreRef} className="relative flex h-36 w-36 items-center justify-center sm:h-44 sm:w-44">
          <div className="absolute inset-0 rounded-[38%] border border-copper/50 bg-copper/[0.055] shadow-[0_0_90px_rgba(201,119,74,.32)] rotate-45" />
          <div className="absolute inset-3 rounded-[38%] border border-dashed border-mist/20 animate-spin-slower" />
          <div className="absolute inset-8 rounded-full border border-copper/40 bg-[#061b17]/80 backdrop-blur-xl" />
          <span className="relative font-display text-2xl font-semibold tracking-[-0.06em] text-copper-light sm:text-3xl">P&amp;C</span>
          <span className="absolute -inset-10 rounded-full border border-copper/[0.09]" />
          <span className="absolute -inset-20 rounded-full border border-mist/[0.05]" />
        </div>
      </div>

      <div ref={interfaceRef} className="absolute inset-0 flex flex-col justify-between px-5 py-6 sm:px-10 sm:py-9">
        <div className="flex justify-between font-mono-label text-[8px] tracking-[0.24em] text-mist/40">
          <span>PC_OS / EXPERIENCE ENGINE</span><span>AKL 36.8509 S</span>
        </div>
        <div className="mx-auto mb-[18vh] w-full max-w-[560px] sm:mb-[13vh]">
          <div className="mb-3 flex items-end justify-between font-mono-label tracking-[0.22em]">
            <span className="text-[8px] text-mist/45">SYNTHESISING YOUR ARRIVAL</span>
            <span className="text-copper-light"><span ref={counterRef} data-loader-counter className="text-2xl tracking-[-0.04em]">--</span><span className="ml-1 text-[8px]">%</span></span>
          </div>
          <div className="h-px overflow-hidden bg-mist/10 animate-pulse"><div ref={barRef} data-loader-bar className="h-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-copper to-copper-light shadow-[0_0_16px_rgba(201,119,74,.9)]" /></div>
          <div className="mt-3 flex justify-between font-mono-label text-[7px] tracking-[0.18em] text-mist/25"><span>CONNECT</span><span>COMPOSE</span><span>REVEAL</span></div>
        </div>
      </div>
    </div>
  );
}
