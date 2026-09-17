import nodemailer from "nodemailer";
import type { ContactFormValues } from "./validation";
import { site } from "@/content/site";

export function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP environment variables are not configured");
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(data: ContactFormValues) {
  const transporter = getTransporter();
  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;
  const from = process.env.CONTACT_FROM_EMAIL || process.env.SMTP_USER!;

  const serviceLabels = data.services
    .map((id) => site.services.find((s) => s.id === id)?.name ?? id)
    .join(", ") || "Not specified";

  const html = `
    <h2>New enquiry — ${escapeHtml(site.name)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Event / Travel Date:</strong> ${escapeHtml(data.eventDate)}</p>
    <p><strong>Group Size:</strong> ${escapeHtml(data.groupSize)}</p>
    <p><strong>Services Interested In:</strong> ${escapeHtml(serviceLabels)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
  `;

  await transporter.sendMail({
    to,
    from,
    replyTo: data.email,
    subject: `New enquiry from ${data.fullName} — ${site.name}`,
    html,
  });
}
