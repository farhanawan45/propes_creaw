"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/content/site";

export default function ServiceTicker() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % site.services.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden h-5 overflow-hidden sm:block sm:w-48">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="block font-mono-label text-ivory/70 whitespace-nowrap"
        >
          {site.services[index].name}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
