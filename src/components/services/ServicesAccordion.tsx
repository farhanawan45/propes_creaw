"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check } from "lucide-react";
import { site } from "@/content/site";
import { scrollToHash } from "@/lib/scrollTo";
import { useEnquiry } from "@/context/EnquiryContext";

export default function ServicesAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { requestEnquiry } = useEnquiry();

  return (
    <div>
      <div className="mb-10 flex justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-copper bg-pounamu font-display text-xl font-semibold text-ivory shadow-[0_0_40px_-10px_rgba(201,119,74,0.55)]">
          <span className="text-copper">P&amp;C</span>
          <span className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-deep-line" />
        </div>
      </div>

      <div className="divide-y divide-deep-line border-y border-deep-line">
        {site.services.map((service) => {
          const open = openId === service.id;
          return (
            <div key={service.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : service.id)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left focus-ring"
                aria-expanded={open}
              >
                <span className="flex items-center gap-4">
                  <span className="font-mono-label text-copper">{service.index}</span>
                  <span className="text-base font-medium text-ivory">{service.name}</span>
                </span>
                <Plus
                  className={`h-5 w-5 shrink-0 text-mist transition-transform duration-300 ${
                    open ? "rotate-45 text-copper" : ""
                  }`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6">
                      <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl">
                        <Image src={service.image} alt={service.name} fill sizes="90vw" className="object-cover" />
                      </div>
                      <p className="text-base font-light leading-relaxed text-mist">{service.description}</p>
                      <ul className="mt-4 space-y-2">
                        {service.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-3 text-sm text-ivory/85">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-copper" strokeWidth={2} />
                            {h}
                          </li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        onClick={() => {
                          requestEnquiry(service.id);
                          scrollToHash("#contact");
                        }}
                        className="mt-5 w-full rounded-full bg-copper px-6 py-3 text-sm font-semibold text-pounamu-night transition-colors hover:bg-copper-light"
                      >
                        Enquire about this service
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
