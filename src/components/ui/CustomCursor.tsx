"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const FORM_FIELD_SELECTOR = "form, input, textarea, select, label, [contenteditable='true']";
const INTERACTIVE_SELECTOR = "a, button, [role='button'], summary";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [pressed, setPressed] = useState(false);
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

    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);
    const handleLeave = () => setHidden(true);
    const handleEnter = () => setHidden(false);

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
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
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
        animate={{ opacity: hidden ? 0 : 1, scale: pressed ? 0.55 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="custom-cursor flex items-center justify-center rounded-full border border-copper"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: active ? 46 : 32,
          height: active ? 46 : 32,
          scale: pressed ? 0.82 : 1,
          opacity: hidden ? 0 : 1,
          borderColor: active ? "rgba(240,176,122,0.95)" : "rgba(201,119,74,0.75)",
          boxShadow: active ? "0 0 22px rgba(201,119,74,0.28), inset 0 0 14px rgba(201,119,74,0.1)" : "0 0 0 rgba(201,119,74,0)",
        }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        {active && (
          <motion.span
            className="absolute inset-[-4px] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.8, ease: "linear", repeat: Infinity }}
          >
            <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-copper-light shadow-[0_0_9px_rgba(240,176,122,.9)]" />
            <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-copper" />
          </motion.span>
        )}
        {label && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-none absolute left-[calc(100%+10px)] whitespace-nowrap rounded-full border border-copper/30 bg-pounamu-night/90 px-2.5 py-1 font-mono-label text-[8px] text-copper-light shadow-[0_8px_24px_rgba(0,0,0,.24)] backdrop-blur-md"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
