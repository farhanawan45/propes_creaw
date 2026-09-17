"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ServiceId } from "@/content/site";
import { contactSchema } from "@/lib/validation";
import { useEnquiry } from "@/context/EnquiryContext";
import { TextField, TextAreaField } from "@/components/contact/TextField";
import PhoneField from "@/components/contact/PhoneField";
import DateField from "@/components/contact/DateField";
import ServicesMultiSelect from "@/components/contact/ServicesMultiSelect";
import Checkbox from "@/components/contact/Checkbox";

type Status = "idle" | "loading" | "success" | "error";

const initialForm = {
  fullName: "",
  email: "",
  countryCode: "+64",
  phoneNumber: "",
  eventDate: undefined as Date | undefined,
  groupSize: "",
  services: [] as ServiceId[],
  message: "",
  consent: false,
  company: "", // honeypot
};

function formatDateForSubmit(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function ContactForm() {
  const { pendingService, clearPendingService } = useEnquiry();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Adjust form state during render when a new service enquiry comes in
  // (React's sanctioned alternative to an effect for syncing external
  // state), rather than reacting to it a render later in an effect.
  if (pendingService && !form.services.includes(pendingService)) {
    setForm((f) => ({ ...f, services: [...f.services, pendingService] }));
    clearPendingService();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: `${form.countryCode} ${form.phoneNumber}`.trim(),
      eventDate: form.eventDate ? formatDateForSubmit(form.eventDate) : "",
      groupSize: form.groupSize,
      services: form.services,
      message: form.message,
      consent: form.consent as true,
      company: form.company,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus("error");
        setStatusMessage(data.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setStatusMessage("Thank you — your enquiry has been sent. We'll be in touch within one business day.");
      setForm(initialForm);
    } catch {
      setStatus("error");
      setStatusMessage("Something went wrong sending your enquiry. Please try again or email us directly.");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Honeypot */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <TextField
          label="Full Name"
          name="fullName"
          required
          placeholder="Priya Sharma"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          error={errors.fullName}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          required
          placeholder="priya@company.com"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <PhoneField
          countryCode={form.countryCode}
          phoneNumber={form.phoneNumber}
          onCountryChange={(code) => setForm((f) => ({ ...f, countryCode: code }))}
          onNumberChange={(value) => setForm((f) => ({ ...f, phoneNumber: value }))}
          error={errors.phone}
        />
        <DateField
          value={form.eventDate}
          onChange={(date) => setForm((f) => ({ ...f, eventDate: date }))}
          error={errors.eventDate}
        />
      </div>

      <div className="grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2">
        <TextField
          label="Group Size"
          name="groupSize"
          type="number"
          min={1}
          required
          placeholder="e.g. 120 guests"
          value={form.groupSize}
          onChange={(e) => setForm((f) => ({ ...f, groupSize: e.target.value }))}
          error={errors.groupSize}
        />
        <ServicesMultiSelect
          value={form.services}
          onChange={(next) => setForm((f) => ({ ...f, services: next }))}
          error={errors.services}
        />
      </div>

      <TextAreaField
        label="Message"
        name="message"
        required
        placeholder="Tell us about your event, dates and ideas"
        value={form.message}
        onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
        error={errors.message}
      />

      <Checkbox checked={form.consent} onChange={(checked) => setForm((f) => ({ ...f, consent: checked }))}>
        I agree to the{" "}
        <a href="#privacy" className="text-copper underline underline-offset-2">
          Privacy Policy
        </a>{" "}
        and consent to being contacted about my enquiry.*
      </Checkbox>
      {errors.consent && <p className="text-[13px] text-[#E5484D]">{errors.consent}</p>}

      <button
        type="submit"
        id="contact-submit"
        disabled={status === "loading"}
        className="flex h-[60px] w-full items-center justify-center gap-2 rounded-full bg-copper text-sm font-semibold tracking-wide text-pounamu-night transition-colors hover:bg-copper-light disabled:opacity-60 focus-ring"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-pounamu-night/30 border-t-pounamu-night" />
            Sending...
          </>
        ) : (
          "Send Enquiry"
        )}
      </button>

      <AnimatePresence mode="wait">
        {(status === "success" || status === "error") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            role="status"
            className={`rounded-xl border px-5 py-4 text-sm ${
              status === "success"
                ? "border-copper/40 bg-copper/10 text-ivory"
                : "border-red-400/40 bg-red-400/10 text-ivory"
            }`}
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
