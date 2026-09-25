import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "pnc_admin_session";
const SESSION_AGE = 60 * 60 * 8;

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  return value;
}

function signature(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createAdminToken() {
  const payload = `${Date.now() + SESSION_AGE * 1000}`;
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminToken(token?: string) {
  if (!token) return false;
  const [expires, supplied] = token.split(".");
  if (!expires || !supplied || Number(expires) < Date.now()) return false;
  const expected = signature(expires);
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function verifyAdminPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || configured.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  const a = Buffer.from(password);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdminAuthenticated() {
  return verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

