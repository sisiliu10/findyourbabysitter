import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Redis client (lazy — only created if env vars are set)
// ---------------------------------------------------------------------------

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// ---------------------------------------------------------------------------
// Rate limiters
// ---------------------------------------------------------------------------

/** 5 requests per 15 minutes — login, reset-password */
export const authLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "15 m"), prefix: "rl:auth" })
  : null;

/** 3 requests per hour — register, forgot-password, resend-verification */
export const emailLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "1 h"), prefix: "rl:email" })
  : null;

/** 30 requests per minute — messages, profile updates */
export const apiLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rl:api" })
  : null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract client IP from Vercel's x-forwarded-for header */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0].trim() || "unknown";
}

/**
 * Check rate limit for a request. Returns a 429 response if the limit is
 * exceeded, or null if the request should proceed.
 *
 * When Upstash is not configured (local dev), logs a warning once and
 * allows all requests through.
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  request: Request,
): Promise<NextResponse | null> {
  if (!limiter) {
    if (!redis) {
      console.warn("[ratelimit] Upstash not configured — skipping rate limit check");
    }
    return null;
  }

  const ip = getClientIp(request);
  const { success } = await limiter.limit(ip);

  if (!success) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  return null;
}
