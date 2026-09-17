"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { site } from "@/content/site";
import { scrollToHash } from "@/lib/scrollTo";
import { useMenu } from "@/context/MenuContext";
import { useActiveSection } from "@/hooks/useActiveSection";
import MagneticButton from "@/components/ui/MagneticButton";
import LiveClock from "@/components/ui/LiveClock";
import FullscreenMenu from "@/components/layout/FullscreenMenu";

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const [hovered, setHovered] = useState<string | null>(null);
  const [headerReady, setHeaderReady] = useState(false);
  const { open, setOpen } = useMenu();
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 100);
    const diff = y - lastY.current;
    if (y < 120) {
      setHidden(false);
    } else if (diff > 4) {
      setHidden(true);
    } else if (diff < -4) {
      setHidden(false);
    }
    lastY.current = y;
  });

  useEffect(() => {
    const timer = setTimeout(() => setHeaderReady(true), 1900);
    return () => clearTimeout(timer);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    scrollToHash(href);
  };

  return (
    <>
      <motion.header
        animate={{ y: hidden && !open ? "-130%" : "0%" }}
        transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 sm:px-6 sm:pt-5"
      >
        <motion.div
          initial={{ maxWidth: 1440 }}
          animate={{
            maxWidth: scrolled ? 1080 : 1440,
            paddingLeft: scrolled ? 20 : 8,
            paddingRight: scrolled ? 12 : 8,
            paddingTop: scrolled ? 10 : 14,
            paddingBottom: scrolled ? 10 : 14,
            backgroundColor: scrolled ? "rgba(12,31,28,0.7)" : "rgba(12,31,28,0)",
            borderColor: scrolled ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0)",
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full items-center justify-between rounded-full border backdrop-blur-xl"
          style={{ WebkitBackdropFilter: scrolled ? "blur(20px)" : "none" }}
        >
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={headerReady ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="font-display text-xl font-semibold tracking-tight text-ivory focus-ring"
              data-cursor="Home"
            >
              P&amp;C
            </Link>
          </motion.div>

          <nav className="hidden items-center gap-1 md:flex">
            {site.nav.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={headerReady ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
              >
                {(hovered === item.href || (!hovered && active === item.href)) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full border border-deep-line bg-pounamu"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  >
                    <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-copper" />
                  </motion.span>
                )}
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="group relative z-10 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-ivory focus-ring"
                >
                  <span className="font-mono-label text-[10px] text-copper-light">{item.index}</span>
                  {/* Two stacked copies of the label — on hover the top copy
                      slides up and out while the bottom copy slides up into
                      its place, so the text is never fully gone mid-transition. */}
                  <span className="relative block h-[1.2em] overflow-hidden">
                    <span className="block transition-transform duration-300 ease-out group-hover:-translate-y-full">
                      {item.label}
                    </span>
                    <span className="absolute inset-0 block translate-y-full text-copper transition-transform duration-300 ease-out group-hover:translate-y-0">
                      {item.label}
                    </span>
                  </span>
                </a>
              </motion.div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={headerReady ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 sm:gap-4"
          >
            <LiveClock className="hidden lg:inline-flex" />

            <MagneticButton
              as="a"
              href="#contact"
              onClick={(e: React.MouseEvent) => handleNavClick(e, "#contact")}
              cursorLabel="Quote"
              className="inline-flex items-center rounded-full bg-copper px-4 py-2 text-xs font-medium tracking-wide text-pounamu-night transition-colors hover:bg-copper-light sm:hidden"
            >
              Quote
            </MagneticButton>

            <MagneticButton
              as="a"
              href="#contact"
              onClick={(e: React.MouseEvent) => handleNavClick(e, "#contact")}
              cursorLabel="Quote"
              className="group hidden items-center gap-2 rounded-full bg-copper px-5 py-2.5 text-sm font-medium tracking-wide text-pounamu-night transition-colors hover:bg-copper-light sm:inline-flex"
            >
              Get a Quote
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </MagneticButton>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-deep-line text-ivory focus-ring"
              aria-label="Open menu"
              aria-expanded={open}
              data-cursor="Menu"
            >
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="0" y1="1" x2="16" y2="1" />
                <line x1="0" y1="11" x2="16" y2="11" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      </motion.header>

      <AnimatePresence>{open && <FullscreenMenu onClose={() => setOpen(false)} active={active} />}</AnimatePresence>
    </>
  );
}
