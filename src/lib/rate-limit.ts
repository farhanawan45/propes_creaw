// Simple in-memory sliding-window rate limiter for the contact API route.
// Sufficient for a single-instance Node/PM2 deployment (see DEPLOYMENT.md).
// For multi-instance deployments, swap this for a shared store (e.g. Redis).

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(identifier) ?? []).filter(
    (t) => now - t < WINDOW_MS
  );

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(identifier, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(identifier, timestamps);

  // Opportunistic cleanup to avoid unbounded growth.
  if (hits.size > 5000) {
    for (const [key, value] of hits) {
      if (value.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return false;
}
