// Simple in-memory sliding-window rate limiter for the contact API route.
// Sufficient for a single-instance Node/PM2 deployment (see DEPLOYMENT.md).
// For multi-instance deployments, swap this for a shared store (e.g. Redis).

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

function activeHits(identifier: string, now = Date.now()) {
  const timestamps = (hits.get(identifier) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );
  if (timestamps.length) hits.set(identifier, timestamps);
  else hits.delete(identifier);
  return timestamps;
}

export function hasReachedRateLimit(identifier: string): boolean {
  return activeHits(identifier).length >= MAX_REQUESTS;
}

export function recordRateLimitHit(identifier: string): boolean {
  const now = Date.now();
  const timestamps = activeHits(identifier, now);
  timestamps.push(now);
  hits.set(identifier, timestamps);

  if (hits.size > 5000) {
    for (const key of hits.keys()) activeHits(key, now);
  }

  return timestamps.length >= MAX_REQUESTS;
}

export function clearRateLimit(identifier: string) {
  hits.delete(identifier);
}

export function isRateLimited(identifier: string): boolean {
  if (hasReachedRateLimit(identifier)) return true;
  recordRateLimitHit(identifier);
  return false;
}
