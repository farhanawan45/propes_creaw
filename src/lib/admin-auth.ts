import "server-only";

import { createHash, createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";
import { ensureSchema, getDb } from "@/lib/db";

export const ADMIN_COOKIE = "pnc_admin_session";
const SESSION_AGE = 60 * 60 * 8;
const RESET_AGE_MINUTES = 30;
const scrypt = promisify(scryptCallback);

function secret() {
  const sessionSecret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (sessionSecret && sessionSecret.length >= 32) return sessionSecret;

  // Some managed hosting releases do not refresh newly added secrets in the
  // published runtime immediately. Keep sessions available by deriving a
  // separate signing key from the already-required admin password.
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || adminPassword.length < 12) {
    throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  }
  return createHash("sha256")
    .update(`props-n-crew:admin-session:${adminPassword}`)
    .digest("hex");
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

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

async function verifyPasswordHash(password: string, stored: string) {
  const [salt, encoded] = stored.split(":");
  if (!salt || !encoded) return false;
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const supplied = Buffer.from(encoded, "hex");
  return derived.length === supplied.length && timingSafeEqual(derived, supplied);
}

export async function verifyAdminPassword(password: string) {
  try {
    await ensureSchema();
    const [rows] = await getDb().execute<(RowDataPacket & { password_hash: string })[]>(
      "SELECT password_hash FROM admin_credentials WHERE id = 1 LIMIT 1"
    );
    if (rows[0]?.password_hash) return verifyPasswordHash(password, rows[0].password_hash);
  } catch (error) {
    console.error("Unable to read database-backed admin password; using environment fallback", error);
  }

  const configured = process.env.ADMIN_PASSWORD;
  if (!configured || configured.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters");
  const a = Buffer.from(password);
  const b = Buffer.from(configured);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createAdminPasswordReset() {
  await ensureSchema();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const db = getDb();
  await db.execute("DELETE FROM admin_password_resets WHERE used_at IS NOT NULL OR expires_at < NOW() OR created_at < DATE_SUB(NOW(), INTERVAL 1 DAY)");
  await db.execute(
    "INSERT INTO admin_password_resets (token_hash, expires_at) VALUES (?, DATE_ADD(NOW(), INTERVAL ? MINUTE))",
    [tokenHash, RESET_AGE_MINUTES]
  );
  return token;
}

export async function resetAdminPassword(token: string, password: string) {
  await ensureSchema();
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const passwordHash = await hashPassword(password);
  const db = getDb();
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const [rows] = await connection.execute<(RowDataPacket & { id: number })[]>(
      "SELECT id FROM admin_password_resets WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW() FOR UPDATE",
      [tokenHash]
    );
    if (!rows[0]) {
      await connection.rollback();
      return false;
    }
    await connection.execute(
      `INSERT INTO admin_credentials (id, password_hash) VALUES (1, ?)
       ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), updated_at = CURRENT_TIMESTAMP`,
      [passwordHash]
    );
    await connection.execute("UPDATE admin_password_resets SET used_at = NOW() WHERE id = ?", [rows[0].id]);
    await connection.execute("UPDATE admin_password_resets SET used_at = NOW() WHERE used_at IS NULL AND id <> ?", [rows[0].id]);
    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function isAdminAuthenticated() {
  return verifyAdminToken((await cookies()).get(ADMIN_COOKIE)?.value);
}

