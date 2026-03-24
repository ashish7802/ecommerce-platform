// Simple per-process rate limiter for local usage.
const requestLedger = new Map();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 60;

export function rateLimiter(request, response, next) {
  const key = request.header("x-forwarded-for") || request.ip || "unknown";
  const now = Date.now();
  const entry = requestLedger.get(key) || { count: 0, startedAt: now };

  if (now - entry.startedAt > WINDOW_MS) {
    entry.count = 0;
    entry.startedAt = now;
  }

  entry.count += 1;
  requestLedger.set(key, entry);

  if (entry.count > MAX_REQUESTS) {
    response.status(429).json({
      error: "rate_limit_exceeded",
      message: "Too many requests in the current minute window.",
      requestId: request.context?.requestId || null
    });
    return;
  }

  next();
}
