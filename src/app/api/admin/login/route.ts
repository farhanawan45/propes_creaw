import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminToken, verifyAdminPassword } from "@/lib/admin-auth";
import { isRateLimited } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(`admin-login:${ip}`)) {
    return NextResponse.json({ message: "Too many attempts. Please wait and try again." }, { status: 429 });
  }
  const { password } = (await request.json().catch(() => ({}))) as { password?: string };
  if (!password || !verifyAdminPassword(password)) {
    return NextResponse.json({ message: "Invalid password." }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createAdminToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

