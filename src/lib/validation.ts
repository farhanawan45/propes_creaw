import { z } from "zod";
import { site } from "@/content/site";

const serviceIds = site.services.map((s) => s.id) as [string, ...string[]];

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number, including country code")
    .max(24),
  eventDate: z.string().trim().min(1, "Please select a date"),
  groupSize: z.string().trim().min(1, "Please enter your group size"),
  services: z.array(z.enum(serviceIds)).min(1, "Please select at least one service"),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (min. 10 characters)")
    .max(2000),
  consent: z.literal(true, {
    error: "Please accept the privacy policy to continue",
  }),
  // Honeypot — must stay empty. Bots that fill every field trip this.
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const newsletterSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(254),
  company: z.string().max(0).optional().or(z.literal("")),
});

export type NewsletterValues = z.infer<typeof newsletterSchema>;
