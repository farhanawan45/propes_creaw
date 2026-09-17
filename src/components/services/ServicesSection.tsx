"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { site, type Service } from "@/content/site";
import OrbitNode from "@/components/services/OrbitNode";
import OrbitLabel from "@/components/services/OrbitLabel";
import ServiceDetailPanel from "@/components/services/ServiceDetailPanel";
import ServicesAccordion from "@/components/services/ServicesAccordion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// Everything — rings, connector lines, nodes AND the P&C core — lives in
// ONE <svg viewBox="0 0 1000 1000">, centered at (500,500). No mixing of
// SVG coordinates with CSS-percentage-positioned HTML elements for the
// core/rings/nodes: that mismatch (plus rotating a <g> via a CSS-style
// transformOrigin instead of true SVG-space svgOrigin) was the root
// cause of the lines/core drifting apart. Only the text LABELS are HTML
// (for crisp wrapping), positioned in an overlay that shares the exact
// same 1:1 box as the SVG.
const VIEW = 1000;
const CENTER = 500;
const CORE_R = 110;
const OUTER_RING_R = 330;
const INNER_RING_R = 250;
const NODE_R = 330;
const LABEL_R = 380;
const AUTOPLAY_MS = 4000;
const DEBUG_CROSSHAIR = false;

function round(v: number) {
  // Rounded to a fixed precision so the server-rendered string and the
  // client's re-computed string are byte-identical — Math.cos/sin aren't
  // guaranteed bit-identical across JS engines, and full-precision floats
  // occasionally differ in the last digit, which React treats as a
  // hydration mismatch.
  return Math.round(v * 1000) / 1000;
}

function orbitPositions() {
  const count = site.services.length;
  return site.services.map((service, i) => {
    const angleDeg = -90 + i * (360 / count);
    const angleRad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
      service,
      angleDeg,
      nodeX: round(CENTER + NODE_R * cos),
      nodeY: round(CENTER + NODE_R * sin),
      labelX: round(CENTER + LABEL_R * cos),
      labelY: round(CENTER + LABEL_R * sin),
    };
  });
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const coreGroupRef = useRef<SVGGElement>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>(site.services[0].id);
  const [interacting, setInteracting] = useState(false);
  const [progress, setProgress] = useState(0);

  const isDesktop = useMediaQuery("(min-width: 1024px)", true);
  const positions = useMemo(() => orbitPositions(), []);
  const activeService: Service = site.services.find((s) => s.id === activeId) ?? site.services[0];

  // Refs mirroring the latest state — read inside the rAF loop instead of
  // the closure's captured values. Without this, a frame already in
  // flight when a hover fires can still land afterwards and clobber the
  // activeId a hover just set (a real, observed race: the interaction
  // state changes mid-frame, but the in-flight tick's closure doesn't
  // know that yet).
  const interactingRef = useRef(interacting);
  const hoveredIdRef = useRef(hoveredId);
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    interactingRef.current = interacting;
  }, [interacting]);
  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  // Autoplay cycling through services when the user isn't interacting.
  useEffect(() => {
    if (!isDesktop || interacting) return;

    let raf: number;
    let start: number | null = null;

    const tick = (t: number) => {
      if (interactingRef.current) return;
      if (start === null) start = t;
      const elapsed = t - start;
      const p = Math.min(1, elapsed / AUTOPLAY_MS);
      setProgress(p);
      if (p >= 1) {
        const shown = hoveredIdRef.current ?? activeIdRef.current;
        const idx = site.services.findIndex((s) => s.id === shown);
        const next = site.services[(idx + 1) % site.services.length];
        setActiveId(next.id);
        start = t;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDesktop, interacting]);

  const handleEnter = (id: string) => {
    setHoveredId(id);
    setActiveId(id);
    setInteracting(true);
    setProgress(0);
  };
  const handleLeave = () => {
    setHoveredId(null);
    setInteracting(false);
    setProgress(0);
  };

  useGSAP(
    () => {
      if (!isDesktop) return;
      const reduced = prefersReducedMotion();
      const lines = svgRef.current?.querySelectorAll<SVGLineElement>("[data-line]");
      const nodes = svgRef.current?.querySelectorAll<SVGGElement>("[data-orbit-node]");
      const labels = orbitRef.current?.querySelectorAll<HTMLDivElement>("[data-orbit-label]");

      if (reduced) {
        gsap.set(coreGroupRef.current, { scale: 1, opacity: 1 });
        gsap.set(lines ?? [], { opacity: 1, strokeDashoffset: 0 });
        gsap.set(nodes ?? [], { scale: 1, opacity: 1 });
        gsap.set(labels ?? [], { opacity: 1 });
        return;
      }

      // svgOrigin (not CSS transformOrigin) pins the pivot to an exact
      // point in the SVG's own coordinate space, immune to any bounding-
      // box recalculation — this is what keeps the scale-in centered on
      // the true middle of the orbit no matter what.
      gsap.set(coreGroupRef.current, { svgOrigin: `${CENTER} ${CENTER}`, transformOrigin: "50% 50%" });
      (nodes ?? []).forEach((el, i) => {
        const { nodeX, nodeY } = positions[i];
        gsap.set(el, { svgOrigin: `${nodeX} ${nodeY}` });
      });

      // Entrance only — plays once when scrolled into view. No pin, no
      // scrub, and critically: no continuous/infinite rotation of any
      // group. The core never moves again after this.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: orbitRef.current, start: "top 75%", once: true },
      });

      tl.fromTo(
        coreGroupRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }
      )
        .fromTo(
          lines ?? [],
          { strokeDashoffset: NODE_R },
          { strokeDashoffset: 0, duration: 0.6, stagger: 0.04, ease: "power2.out" },
          "-=0.2"
        )
        .fromTo(
          nodes ?? [],
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.35, stagger: 0.03, ease: "back.out(2)" },
          "-=0.35"
        )
        .fromTo(labels ?? [], { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.03 }, "-=0.3");
    },
    { scope: sectionRef, dependencies: [isDesktop] }
  );

  return (
    <section id="services" ref={sectionRef} className="relative overflow-hidden bg-pounamu-night section-pad">
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="mb-16 text-center lg:mb-20">
          <div className="font-mono-label text-copper">02 — WHAT WE DO</div>
          <h2
            className="mt-4 font-display font-semibold tracking-tight text-ivory"
            style={{ fontSize: "clamp(40px, 5.5vw, 88px)", letterSpacing: "-0.035em" }}
          >
            Our <span className="text-copper">Services</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg font-light text-mist">
            Fourteen specialist services, one dedicated crew — everything you need for an
            extraordinary New Zealand experience.
          </p>
        </div>

        {isDesktop ? (
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-5 lg:gap-10">
            <div ref={orbitRef} className="relative mx-auto aspect-square w-full max-w-[640px] lg:col-span-3">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEW} ${VIEW}`}
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 h-full w-full overflow-visible"
              >
                <defs>
                  <linearGradient id="services-active-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C9774A" />
                    <stop offset="100%" stopColor="#DE9166" />
                  </linearGradient>
                </defs>

                {/* Guide rings — same SVG, same center, can never drift. */}
                <circle
                  cx={CENTER}
                  cy={CENTER}
                  r={INNER_RING_R}
                  fill="none"
                  stroke="var(--color-deep-line)"
                  strokeWidth={1.5}
                  strokeDasharray="6 8"
                />
                <circle cx={CENTER} cy={CENTER} r={OUTER_RING_R} fill="none" stroke="var(--color-deep-line)" strokeWidth={1.5} />

                {/* Connector lines — behind the core (drawn before it),
                    every one running exactly from (500,500) to its node. */}
                <g>
                  {positions.map(({ service, nodeX, nodeY }) => {
                    const isActive = hoveredId === service.id || activeId === service.id;
                    return (
                      <line
                        key={service.id}
                        data-line
                        x1={CENTER}
                        y1={CENTER}
                        x2={nodeX}
                        y2={nodeY}
                        strokeDasharray={NODE_R}
                        stroke={isActive ? "url(#services-active-gradient)" : "rgba(245,241,232,0.14)"}
                        strokeWidth={isActive ? 4 : 1.5}
                        style={{ transition: "stroke-width 0.3s ease-out" }}
                      />
                    );
                  })}
                </g>

                {/* Nodes — on top of the lines, below the core. */}
                {positions.map(({ service, nodeX, nodeY }) => (
                  <OrbitNode
                    key={service.id}
                    service={service}
                    x={nodeX}
                    y={nodeY}
                    active={hoveredId === service.id || (!hoveredId && activeId === service.id)}
                    onEnter={() => handleEnter(service.id)}
                    onLeave={handleLeave}
                    onSelect={() => handleEnter(service.id)}
                  />
                ))}

                {/* The P&C core — drawn LAST so it always sits on top of
                    every line. Dead center of the same coordinate space. */}
                <g ref={coreGroupRef}>
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={CORE_R}
                    fill="var(--color-pounamu-night)"
                    stroke="var(--color-copper)"
                    strokeWidth={2}
                  />
                  <text
                    x={CENTER}
                    y={CENTER}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="52"
                    fontWeight={600}
                    style={{ fontFamily: "var(--font-display), sans-serif" }}
                  >
                    <tspan fill="var(--color-ivory)">P&amp;</tspan>
                    <tspan fill="var(--color-copper)">C</tspan>
                  </text>
                </g>

                {DEBUG_CROSSHAIR && (
                  <g stroke="#ff00ff" strokeWidth={2}>
                    <line x1={CENTER - 60} y1={CENTER} x2={CENTER + 60} y2={CENTER} />
                    <line x1={CENTER} y1={CENTER - 60} x2={CENTER} y2={CENTER + 60} />
                    <circle cx={CENTER} cy={CENTER} r={6} fill="#ff00ff" />
                  </g>
                )}
              </svg>

              {/* Copper glow behind the core, same center, non-interactive. */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: `${(CORE_R * 2 * 100) / VIEW}%`, aspectRatio: "1 / 1" }}
              >
                <div className="copper-glow" aria-hidden="true" />
              </div>

              {/* HTML label overlay — same 1:1 box as the SVG above. */}
              <div className="pointer-events-none absolute inset-0">
                {positions.map(({ service, labelX, labelY, angleDeg }) => (
                  <OrbitLabel
                    key={service.id}
                    service={service}
                    x={labelX}
                    y={labelY}
                    angleDeg={angleDeg}
                    active={hoveredId === service.id || (!hoveredId && activeId === service.id)}
                    dimmed={hoveredId !== null && hoveredId !== service.id}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <ServiceDetailPanel service={activeService} progress={interacting ? 0 : progress} />
            </div>
          </div>
        ) : (
          <ServicesAccordion />
        )}
      </div>
    </section>
  );
}
