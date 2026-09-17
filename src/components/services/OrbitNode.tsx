"use client";

import type { Service } from "@/content/site";

interface OrbitNodeProps {
  service: Service;
  x: number; // SVG user-space coords, 0-1000, world position (already translated)
  y: number;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onSelect: () => void;
}

// Pure-SVG node: a <g> translated to its world position, containing an
// invisible larger hit circle (for an easy hover/click/tap target) and
// the visible dot. Lives inside the SAME <svg viewBox="0 0 1000 1000">
// as the rings, lines and core — nothing here is positioned via CSS
// percentages, so it can never drift out of alignment with the lines
// that terminate on it.
export default function OrbitNode({ service, x, y, active, onEnter, onLeave, onSelect }: OrbitNodeProps) {
  const handleKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <g
      data-orbit-node
      transform={`translate(${x} ${y})`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View ${service.name}`}
      className="cursor-pointer outline-none"
      style={{ pointerEvents: "auto" }}
    >
      <circle r={34} fill="transparent" />
      <circle
        r={active ? 20 : 7}
        fill={active ? "var(--color-pounamu)" : "var(--color-pounamu-night)"}
        stroke={active ? "var(--color-copper)" : "var(--color-deep-line)"}
        strokeWidth={active ? 2.5 : 1.5}
        style={{ transition: "r 0.3s ease-out, stroke 0.3s ease-out" }}
      />
      {active && (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="11"
          fontWeight={600}
          fill="var(--color-copper)"
          style={{ fontFamily: "var(--font-mono), monospace", letterSpacing: "0.04em" }}
        >
          {service.index}
        </text>
      )}
    </g>
  );
}
