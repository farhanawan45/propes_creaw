"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import { motion } from "framer-motion";

type Status = "idle" | "submitting" | "success" | "error";

export default function NewsletterSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.get("email"), company: data.get("company") }),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Unable to subscribe right now.");
      form.reset();
      setStatus("success");
      setMessage("You are on the list. Watch your inbox for what is next.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to subscribe right now.");
    }
  };

  return (
    <section className="relative overflow-hidden bg-pounamu-night px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-10 lg:px-12 lg:pb-12 lg:pt-12" aria-labelledby="newsletter-title">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto grid max-w-[1344px] overflow-hidden rounded-[24px] border border-copper/25 bg-[#06205b] shadow-[0_30px_100px_rgba(0,0,0,.35)] lg:grid-cols-[.85fr_1.15fr]"
      >
        <div className="relative min-h-[180px] overflow-hidden sm:min-h-[220px] lg:min-h-[260px]">
          <Image src="/images/service-event-management.webp" alt="An elegant event setting in New Zealand" fill sizes="(max-width: 1023px) 100vw, 42vw" className="object-cover transition-transform duration-[1600ms] hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-pounamu-night/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#06205b]/30" />
          <div className="absolute bottom-5 left-5 rounded-[10px] border border-white/25 bg-pounamu-night/35 px-4 py-2 font-mono-label text-[8px] tracking-[0.18em] text-ivory backdrop-blur-md sm:bottom-7 sm:left-7">
            INSIDE PROPS &amp; CREW
          </div>
        </div>

        <div className="relative flex flex-col justify-center p-6 sm:p-8 lg:p-10 xl:p-11">
          <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-copper/10 blur-[90px]" />
          <div className="relative">
            <div className="font-mono-label text-[9px] tracking-[0.2em] text-copper">STAY IN THE KNOW</div>
            <h2 id="newsletter-title" className="mt-3 max-w-[18ch] font-display text-[clamp(1.5rem,2.6vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ivory">
              The best of New Zealand, delivered.
            </h2>
            <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-mist sm:text-base">
              Receive event inspiration, destination insights, new experiences and considered offers from our crew.
            </p>

            <form onSubmit={submit} className="mt-5 lg:max-w-[560px]" noValidate>
              <label htmlFor="newsletter-email" className="sr-only">Email address</label>
              <div className="flex rounded-[14px] border border-ivory/15 bg-pounamu-night/70 p-1.5 transition-colors focus-within:border-copper/70">
                <Mail className="ml-3 hidden h-4 w-4 self-center text-copper sm:block" strokeWidth={1.6} aria-hidden="true" />
                <input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder="Your email address" disabled={status === "submitting"} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-ivory outline-none placeholder:text-mist/50 disabled:opacity-60" />
                <input name="company" type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <button type="submit" disabled={status === "submitting"} className="btn-gradient flex shrink-0 items-center gap-2 rounded-[10px] px-4 py-3 text-sm font-semibold text-ivory transition-opacity disabled:cursor-wait disabled:opacity-60 sm:px-5">
                  {status === "submitting" ? "Joining…" : status === "success" ? <><Check className="h-4 w-4" /> Joined</> : <>Join the list <ArrowUpRight className="h-4 w-4" /></>}
                </button>
              </div>
              <div className="mt-3 flex flex-col gap-2 text-[11px] leading-relaxed text-mist/55 sm:flex-row sm:items-center sm:justify-between">
                <p>By joining, you agree to receive marketing emails. Unsubscribe anytime.</p>
                <Link href="/privacy" className="shrink-0 underline underline-offset-4 transition-colors hover:text-copper">Privacy Policy</Link>
              </div>
              <p className={`mt-3 min-h-5 text-sm ${status === "error" ? "text-red-300" : "text-copper-light"}`} role="status" aria-live="polite">{message}</p>
            </form>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
