import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/mailer";

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

  try {
    await sendContactEmail(parsed.data);
  } catch (error) {
    console.error("Failed to send contact email:", error);
    const configurationMissing =
      error instanceof Error && error.message === "SMTP environment variables are not configured";
    return NextResponse.json(
      {
        ok: false,
        code: configurationMissing ? "EMAIL_NOT_CONFIGURED" : "EMAIL_SEND_FAILED",
        message: configurationMissing
          ? "Online enquiries are being configured. Please email us directly for now."
          : "Something went wrong sending your enquiry. Please try again or email us directly.",
      },
      { status: configurationMissing ? 503 : 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
