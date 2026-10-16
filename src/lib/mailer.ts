import type { ContactFormValues } from "./validation";
import type { NewsletterValues } from "./validation";
import { site } from "@/content/site";
import { sendEmail } from "@/server/email";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(data: ContactFormValues) {
  const to = process.env.CONTACT_TO_EMAIL || site.contact.email;

  const serviceLabels = data.services
    .map((id) => site.services.find((s) => s.id === id)?.name ?? id)
    .join(", ") || "Not specified";

  const html = `
    <h2>New enquiry from ${escapeHtml(site.name)}</h2>
    <p><strong>Name:</strong> ${escapeHtml(data.fullName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Event / Travel Date:</strong> ${escapeHtml(data.eventDate)}</p>
    <p><strong>Group Size:</strong> ${escapeHtml(data.groupSize)}</p>
    <p><strong>Services Interested In:</strong> ${escapeHtml(serviceLabels)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
  `;

  await sendEmail({
    to,
    replyTo: data.email,
    subject: `New enquiry from ${data.fullName}, ${site.name}`,
    html,
  });
}

export async function sendNewsletterSignup(data: NewsletterValues) {
  const to = process.env.NEWSLETTER_TO_EMAIL || process.env.CONTACT_TO_EMAIL || site.contact.email;

  await sendEmail({
    to,
    replyTo: data.email,
    subject: `Newsletter signup: ${data.email}`,
    html: `<h2>New newsletter signup</h2><p><strong>Email:</strong> ${escapeHtml(data.email)}</p><p>This subscriber consented through the ${escapeHtml(site.name)} website newsletter form.</p>`,
  });
}

export async function sendAdminPasswordReset(to: string, resetUrl: string) {
  await sendEmail({
    to,
    subject: `${site.name} admin password reset`,
    html: `<h2>Reset your admin password</h2><p>A password reset was requested for the ${escapeHtml(site.name)} admin portal.</p><p><a href="${escapeHtml(resetUrl)}">Reset admin password</a></p><p>This secure link expires in 30 minutes and can only be used once. If you did not request it, you can ignore this email.</p>`,
  });
}
