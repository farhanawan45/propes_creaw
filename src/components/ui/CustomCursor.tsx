"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const FORM_FIELD_SELECTOR = "form, input, textarea, select, label, [contenteditable='true']";
const INTERACTIVE_SELECTOR = "a, button, [role='button'], summary";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const ringX = useSpring(x, { stiffness: 200, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 200, damping: 30, mass: 0.6 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    // Pointer capability only exists client-side, so it can't be read during render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(hasFinePointer);
    if (!hasFinePointer) return;

    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Links/buttons keep the interactive cursor even inside a form (e.g.
      // the submit button) — everything else in a form (fields, labels,
      // the gaps between them) hides the cursor in favor of the native one.
      const interactiveEl = target?.closest<HTMLElement>(INTERACTIVE_SELECTOR);

      if (!interactiveEl && target?.closest(FORM_FIELD_SELECTOR)) {
        setHidden(true);
        setActive(false);
        setLabel(null);
        return;
      }
      setHidden(false);

      const cursorEl = target?.closest<HTMLElement>("[data-cursor]");
      if (cursorEl) {
        setActive(true);
        setLabel(cursorEl.dataset.cursor || null);
        return;
      }

      if (interactiveEl) {
        setActive(true);
        setLabel(null);
        return;
      }

      setActive(false);
      setLabel(null);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="custom-cursor rounded-full bg-copper"
        style={{
          x: springX,
          y: springY,
          width: 6,
          height: 6,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="custom-cursor rounded-full border border-copper flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: active ? 76 : 32,
          height: active ? 76 : 32,
          opacity: hidden ? 0 : 1,
          backgroundColor: active ? "rgba(255,122,26,0.12)" : "rgba(255,122,26,0)",
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {label && (
          <span className="font-mono-label text-[10px] text-copper">{label}</span>
        )}
      </motion.div>
    </>
  );
}
