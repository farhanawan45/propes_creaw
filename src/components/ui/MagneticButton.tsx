"use client";

import { forwardRef, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Pre-built motion components — created once at module scope so the
// underlying tag never gets recreated (and reset) on re-render.
const tagComponents = {
  button: motion.button,
  a: motion.a,
} as const;

type TagName = keyof typeof tagComponents;

interface MagneticButtonOwnProps {
  children: ReactNode;
  className?: string;
  as?: TagName;
  strength?: number;
  cursorLabel?: string;
}

// Covers both button-only props (type, disabled) and anchor-only props
// (href, target) so `as="a" href="..."` type-checks without needing a
// bare string index signature (which plays badly with forwardRef's
// PropsWithoutRef/Omit machinery — it silently drops required props).
type MagneticButtonFullProps = MagneticButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MagneticButtonOwnProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof MagneticButtonOwnProps>;

const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonFullProps>(function MagneticButton(
  props,
  forwardedRef
) {
  const {
    children,
    className = "",
    as: Component = "button",
    strength = 0.35,
    cursorLabel,
    ...rest
  }: MagneticButtonFullProps = props;
  const innerRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  const setRefs = (el: HTMLElement | null) => {
    innerRef.current = el;
    if (typeof forwardedRef === "function") forwardedRef(el as HTMLButtonElement);
    else if (forwardedRef) (forwardedRef as React.RefObject<HTMLButtonElement | null>).current = el as HTMLButtonElement;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = innerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Cast away the button/anchor prop-type union — both tags accept the
  // same handful of props we pass here, but TS can't verify that across
  // a dynamic union of the two motion components.
  const MotionComponent = tagComponents[Component] as typeof motion.button;

  return (
    <MotionComponent
      ref={setRefs as React.Ref<HTMLButtonElement>}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      data-cursor={cursorLabel}
      className={className}
      {...(rest as Record<string, never>)}
    >
      {children}
    </MotionComponent>
  );
});

export default MagneticButton;
