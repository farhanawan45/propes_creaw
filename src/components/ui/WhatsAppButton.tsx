"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { site } from "@/content/site";
import { useMenu } from "@/context/MenuContext";

export default function WhatsAppButton() {
  const { open } = useMenu();
  const [overWork, setOverWork] = useState(false);
  const [overSubmit, setOverSubmit] = useState(false);

  useEffect(() => {
    const target = document.getElementById("work");
    if (!target) return;
    // The Work gallery's cards run edge-to-edge, so the fixed button
    // would otherwise sit on top of card titles as they scroll past.
    const observer = new IntersectionObserver(
      ([entry]) => setOverWork(entry.isIntersecting),
      { threshold: 0.35 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = document.getElementById("contact-submit");
    if (!target) return;
    // Hide while the submit button is in view so the fixed button never
    // sits on top of it (and the visible tap target isn't shrunk).
    const observer = new IntersectionObserver(
      ([entry]) => setOverSubmit(entry.isIntersecting),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {!open && !overWork && !overSubmit && (
        <motion.a
          href={site.contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          data-cursor="Chat"
          className="fixed bottom-6 right-6 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 focus-ring"
          style={{ width: 52, height: 52 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, transition: { delay: 1.8, type: "spring", stiffness: 260, damping: 20 } }}
          exit={{ scale: 0, opacity: 0, transition: { duration: 0.25, ease: "easeIn" } }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white" aria-hidden="true">
            <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.35.66 4.55 1.8 6.43L4 29l7.73-1.75a11.97 11.97 0 0 0 4.29.79c6.62 0 12.02-5.4 12.02-12.02C28.04 8.4 22.64 3 16.02 3zm0 21.86c-1.5 0-2.95-.4-4.22-1.15l-.3-.18-4.6 1.04 1.06-4.48-.2-.32a9.82 9.82 0 0 1-1.54-5.25c0-5.45 4.43-9.88 9.9-9.88 5.44 0 9.87 4.43 9.87 9.88 0 5.45-4.43 9.87-9.9 9.87zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.37-1.47-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.46.13-.6.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5-.17-.01-.37-.01-.57-.01s-.52.07-.8.37c-.27.3-1.04 1.02-1.04 2.49s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35z" />
          </svg>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
