"use client";

import type { CSSProperties } from "react";
import type { Service } from "@/content/site";

interface OrbitLabelProps {
  service: Service;
  x: number; // SVG user-space coords, 0-1000 (radius 380 — outside the node ring)
  y: number;
  angleDeg: number;
  active: boolean;
  dimmed: boolean;
}

type Anchor = "left" | "right" | "top" | "bottom";

function getAnchor(angleDeg: number): Anchor {
  const norm = ((angleDeg % 360) + 360) % 360;
  if (norm > 258 && norm < 282) return "top";
  if (norm > 78 && norm < 102) return "bottom";
  return norm > 90 && norm < 270 ? "left" : "right";
}

// Labels stay plain HTML (crisp text + line-clamping is much simpler than
// SVG <text> wrapping) in an absolutely-positioned overlay that shares the
// exact same 1:1 aspect container as the SVG — left/top are just x/y
// converted from the 0-1000 SVG space to a 0-100% box, so a label can
// never drift from the line/node it belongs to.
export default function OrbitLabel({ service, x, y, angleDeg, active, dimmed }: OrbitLabelProps) {
  const anchor = getAnchor(angleDeg);

  let transform = "translate(-50%, 6px)";
  let align = "items-center text-center";
  if (anchor === "left") {
    transform = "translate(calc(-100% - 10px), -50%)";
    align = "items-end text-right";
  } else if (anchor === "right") {
    transform = "translate(10px, -50%)";
    align = "items-start text-left";
  } else if (anchor === "top") {
    transform = "translate(-50%, calc(-100% - 6px))";
  }

  const style: CSSProperties = {
    left: `${x / 10}%`,
    top: `${y / 10}%`,
    transform,
    opacity: dimmed ? 0.35 : 1,
  };

  return (
    <div
      data-orbit-label
      className={`pointer-events-none absolute flex w-[140px] flex-col transition-opacity duration-300 ${align}`}
      style={style}
    >
      <span className="font-mono-label text-[10px] text-mist/70">{service.index}</span>
      <span
        className={`mt-0.5 text-sm font-medium leading-snug transition-colors duration-300 ${
          active ? "text-ivory" : "text-mist"
        }`}
        style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
      >
        {service.name}
      </span>
    </div>
  );
}
