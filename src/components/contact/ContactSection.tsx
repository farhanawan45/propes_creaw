"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { site } from "@/content/site";
import ContactForm from "@/components/contact/ContactForm";
import LiveClock from "@/components/ui/LiveClock";

// Temporary proof aid for the 50/50 split — flip to true, screenshot at
// 1440/1920, confirm it sits exactly between the two equal-width columns,
// then flip back to false before shipping.
const DEBUG_CENTER_LINE = false;

export default function ContactSection() {
  return (
    <section id="contact" className="section-pad relative bg-pounamu-night">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-copper/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {DEBUG_CENTER_LINE && (
          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-50 w-px -translate-x-1/2 bg-fuchsia-500" />
        )}

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
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

            <div className="mt-10 space-y-5">
              <a href={site.contact.phoneHref} className="flex items-center gap-3 text-ivory/90 transition-colors hover:text-copper">
                <Phone className="h-5 w-5 text-copper" strokeWidth={1.5} />
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-3 text-ivory/90 transition-colors hover:text-copper">
                <Mail className="h-5 w-5 text-copper" strokeWidth={1.5} />
                {site.contact.email}
              </a>
              <div className="flex items-start gap-3 text-ivory/90">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-copper" strokeWidth={1.5} />
                <span className="max-w-[240px]">{site.contact.address}</span>
              </div>
              <a
                href={site.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gradient-outline inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-copper"
              >
                Chat on WhatsApp
              </a>
            </div>

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
            <div className="rounded-3xl border border-deep-line bg-pounamu/60 p-6 sm:p-10">
              <ContactForm />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
