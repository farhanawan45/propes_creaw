"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

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
        className="custom-cursor flex items-center justify-center"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: active ? 24 : 18,
          height: active ? 24 : 18,
          scale: pressed ? 0.72 : 1,
          opacity: hidden ? 0 : 1,
        }}
        transition={{ duration: 0.08, ease: "easeOut" }}
      >
        <span className={`absolute inset-0 rotate-45 rounded-[3px] border transition-colors duration-100 ${active ? "border-copper-light bg-copper/20 shadow-[0_0_14px_rgba(201,119,74,.4)]" : "border-copper/80 bg-pounamu-night/15"}`} />
        <span className="relative h-1.5 w-1.5 rounded-full bg-copper-light shadow-[0_0_7px_rgba(240,176,122,.9)]" />
        {label && (
          <motion.span
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            className="pointer-events-none absolute left-[calc(100%+9px)] whitespace-nowrap rounded-[6px] border border-copper/30 bg-pounamu-night/90 px-2.5 py-1 font-mono-label text-[8px] text-copper-light shadow-[0_8px_24px_rgba(0,0,0,.24)] backdrop-blur-md"
          >
            {label}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
