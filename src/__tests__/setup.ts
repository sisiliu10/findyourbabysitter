import { vi } from "vitest";

// Set required env vars for tests
process.env.JWT_SECRET = "test-jwt-secret-key-for-testing";
process.env.NODE_ENV = "test";

// Mock Prisma client
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    babysitterProfile: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    childcareRequest: {
      findUnique: vi.fn(),
    },
    booking: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    match: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    message: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      updateMany: vi.fn(),
      count: vi.fn(),
    },
    subscription: {
      findUnique: vi.fn(),
    },
    $queryRaw: vi.fn(),
  },
}));

// Mock session helpers
vi.mock("@/lib/session", () => ({
  getSession: vi.fn(),
  setSessionCookie: vi.fn(),
  clearSessionCookie: vi.fn(),
  requireAuth: vi.fn(),
  requireRole: vi.fn(),
}));

// Mock rate limiter — always allow
vi.mock("@/lib/ratelimit", () => ({
  authLimiter: null,
  emailLimiter: null,
  apiLimiter: null,
  checkRateLimit: vi.fn().mockResolvedValue(null),
  getClientIp: vi.fn().mockReturnValue("127.0.0.1"),
}));

// Mock email — all fire-and-forget
vi.mock("@/lib/email", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  notifyBookingCreated: vi.fn().mockResolvedValue(undefined),
  notifyBookingAccepted: vi.fn().mockResolvedValue(undefined),
  notifyBookingDeclined: vi.fn().mockResolvedValue(undefined),
  notifyBookingConfirmed: vi.fn().mockResolvedValue(undefined),
  notifyBookingCompleted: vi.fn().mockResolvedValue(undefined),
  notifyBookingCancelled: vi.fn().mockResolvedValue(undefined),
  notifyNewMessage: vi.fn().mockResolvedValue(undefined),
  notifyReviewSubmitted: vi.fn().mockResolvedValue(undefined),
}));

// Mock subscription helpers — free tier by default
vi.mock("@/lib/subscription", () => ({
  isPremium: vi.fn().mockResolvedValue(false),
  canStartConversation: vi.fn().mockResolvedValue({ allowed: true, used: 0, limit: 5 }),
  canLikeToday: vi.fn().mockResolvedValue({ allowed: true, used: 0, limit: 5 }),
  canCreateRequest: vi.fn().mockResolvedValue({ allowed: true, used: 0, limit: 3 }),
}));
