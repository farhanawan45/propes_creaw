import "server-only";

import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import type { ContactFormValues, NewsletterValues } from "@/lib/validation";

let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;

function required(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing database environment variable: ${name}`);
  return value;
}

export function getDb() {
  if (!pool) {
    pool = mysql.createPool({
      host: required("DB_HOST"),
      port: Number(process.env.DB_PORT || 3306),
      user: required("DB_USER"),
      password: required("DB_PASSWORD"),
      database: required("DB_NAME"),
      waitForConnections: true,
      connectionLimit: 8,
      enableKeepAlive: true,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    });
  }
  return pool;
}

export function ensureSchema() {
  schemaReady ??= (async () => {
    const db = getDb();
    await db.execute(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(120) NOT NULL,
        email VARCHAR(254) NOT NULL,
        phone VARCHAR(32) NOT NULL,
        event_date DATE NOT NULL,
        group_size VARCHAR(40) NOT NULL,
        services JSON NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new','contacted','qualified','booked','closed') NOT NULL DEFAULT 'new',
        email_status ENUM('pending','sent','failed') NOT NULL DEFAULT 'pending',
        source_ip VARCHAR(64) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_enquiries_status_created (status, created_at),
        INDEX idx_enquiries_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await db.execute(`
      CREATE TABLE IF NOT EXISTS newsletter_subscribers (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(254) NOT NULL UNIQUE,
        status ENUM('active','unsubscribed') NOT NULL DEFAULT 'active',
        email_status ENUM('pending','sent','failed') NOT NULL DEFAULT 'pending',
        source_ip VARCHAR(64) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_subscribers_status_created (status, created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
  })();
  return schemaReady;
}

export async function createEnquiry(data: ContactFormValues, ip: string) {
  await ensureSchema();
  const [result] = await getDb().execute<ResultSetHeader>(
    `INSERT INTO enquiries
      (full_name, email, phone, event_date, group_size, services, message, source_ip)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.fullName, data.email, data.phone, data.eventDate, data.groupSize, JSON.stringify(data.services), data.message, ip]
  );
  return result.insertId;
}

export async function setEnquiryEmailStatus(id: number, status: "sent" | "failed") {
  await getDb().execute("UPDATE enquiries SET email_status = ? WHERE id = ?", [status, id]);
}

export async function upsertSubscriber(data: NewsletterValues, ip: string) {
  await ensureSchema();
  const [result] = await getDb().execute<ResultSetHeader>(
    `INSERT INTO newsletter_subscribers (email, source_ip)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE status = 'active', source_ip = VALUES(source_ip), updated_at = CURRENT_TIMESTAMP`,
    [data.email, ip]
  );
  const id = result.insertId;
  if (id) return id;
  const [rows] = await getDb().execute<(RowDataPacket & { id: number })[]>(
    "SELECT id FROM newsletter_subscribers WHERE email = ? LIMIT 1",
    [data.email]
  );
  return rows[0].id;
}

export async function setSubscriberEmailStatus(id: number, status: "sent" | "failed") {
  await getDb().execute("UPDATE newsletter_subscribers SET email_status = ? WHERE id = ?", [status, id]);
}

