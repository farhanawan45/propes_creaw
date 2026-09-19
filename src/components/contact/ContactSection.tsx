"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { site } from "@/content/site";
import ContactForm from "@/components/contact/ContactForm";
import LiveClock from "@/components/ui/LiveClock";

// Temporary proof aid for the 50/50 split — flip to true, screenshot at
// 1440/1920, confirm it sits exactly between the two equal-width columns,
// then flip back to false before shipping.

export default function ContactSection() {
  return (
    <section id="contact" className="section-pad relative overflow-hidden bg-pounamu-night">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="grid h-full w-full grid-cols-1 opacity-30 lg:w-[55%] lg:grid-cols-[1.4fr_.6fr]">
          <div className="relative h-full">
            <Image src="/images/service-event-management.jpg" alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="relative hidden h-full lg:block">
            <Image src="/images/service-decor-fabrications.jpg" alt="" fill sizes="18vw" className="object-cover" />
          </div>
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,27,23,.7)_0%,rgba(5,27,23,.9)_48%,rgba(5,27,23,1)_68%)] max-lg:bg-pounamu-night/75" />
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-copper/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-[120px] lg:self-start"
          >
            <div className="font-mono-label text-copper">{site.contact.label}</div>
            <h2
              className="mt-4 font-display font-semibold tracking-tight text-ivory"
              style={{ fontSize: "clamp(32px, 3.6vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              {site.contact.title}
            </h2>
            <p className="mt-6 max-w-sm text-lg font-light leading-relaxed text-mist">{site.contact.sub}</p>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex gap-5">
                {site.social.map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="font-mono-label text-mist transition-colors hover:text-copper">
                    {s.label}
                  </a>
                ))}
              </div>
              <LiveClock />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="rounded-3xl border border-deep-line bg-pounamu/65 p-5 backdrop-blur-md sm:p-7">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
