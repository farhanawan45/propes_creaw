import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";
import { isRateLimited } from "@/lib/rate-limit";
import { sendNewsletterSignup } from "@/lib/mailer";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (isRateLimited(`newsletter:${ip}`)) return NextResponse.json({ message: "Too many requests. Please try again later." }, { status: 429 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ message: parsed.error.issues[0]?.message || "Please enter a valid email address." }, { status: 422 });
  if (parsed.data.company) return NextResponse.json({ ok: true });

  try {
    await sendNewsletterSignup(parsed.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to collect newsletter signup:", error);
    return NextResponse.json({ message: "Subscriptions are being configured. Please try again later." }, { status: 503 });
  }
}
