import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/mailer";
import { createEnquiry, setEnquiryEmailStatus } from "@/lib/db";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Please check the form and try again.", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  // Honeypot: if filled, silently pretend success so bots move on.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true });
  }

  let enquiryId: number;
  try {
    enquiryId = await createEnquiry(parsed.data, ip);
  } catch (error) {
    console.error("Failed to store contact enquiry:", error);
    return NextResponse.json(
      { ok: false, message: "We could not save your enquiry. Please try again or email us directly." },
      { status: 503 }
    );
  }

  try {
    await sendContactEmail(parsed.data);
    await setEnquiryEmailStatus(enquiryId, "sent");
  } catch (error) {
    console.error("Failed to send contact email:", error);
    await setEnquiryEmailStatus(enquiryId, "failed").catch(console.error);
  }

  return NextResponse.json({ ok: true, reference: `PNC-${enquiryId}` });
}
