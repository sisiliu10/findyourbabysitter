import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  parentOnboardingSchema,
  sitterOnboardingSchema,
  createRequestSchema,
  createBookingSchema,
  reviewSchema,
  messageSchema,
  profileUpdateSchema,
} from "@/lib/validators";

describe("registerSchema", () => {
  const validData = {
    email: "test@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    role: "PARENT" as const,
  };

  it("accepts valid parent registration", () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts valid babysitter registration", () => {
    const result = registerSchema.safeParse({ ...validData, role: "BABYSITTER" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({ ...validData, email: "not-email" });
    expect(result.success).toBe(false);
  });

  it("rejects short password", () => {
    const result = registerSchema.safeParse({ ...validData, password: "short" });
    expect(result.success).toBe(false);
  });

  it("rejects empty firstName", () => {
    const result = registerSchema.safeParse({ ...validData, firstName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid role", () => {
    const result = registerSchema.safeParse({ ...validData, role: "ADMIN" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid login", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "pass" });
    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({ email: "test@example.com", password: "" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = loginSchema.safeParse({ email: "bad", password: "pass" });
    expect(result.success).toBe(false);
  });
});

describe("parentOnboardingSchema", () => {
  it("accepts valid parent onboarding", () => {
    const result = parentOnboardingSchema.safeParse({
      city: "Berlin",
      state: "Berlin",
      zipCode: "10115",
      childrenJson: '[{"name":"Emma","age":3}]',
    });
    expect(result.success).toBe(true);
  });

  it("rejects short zipCode", () => {
    const result = parentOnboardingSchema.safeParse({
      city: "Berlin",
      state: "Berlin",
      zipCode: "101",
      childrenJson: "[]",
    });
    expect(result.success).toBe(false);
  });

  it("allows optional phone", () => {
    const result = parentOnboardingSchema.safeParse({
      phone: "+491234567",
      city: "Berlin",
      state: "Berlin",
      zipCode: "10115",
      childrenJson: "[]",
    });
    expect(result.success).toBe(true);
  });
});

describe("sitterOnboardingSchema", () => {
  const validSitter = {
    bio: "I have 5 years of experience caring for children.",
    hourlyRate: 15,
    city: "Berlin",
    state: "Berlin",
    zipCode: "10115",
    phone: "+49123456789",
  };

  it("accepts valid sitter with defaults", () => {
    const result = sitterOnboardingSchema.safeParse(validSitter);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.radiusMiles).toBe(10);
      expect(result.data.hasCPR).toBe(false);
      expect(result.data.hasFirstAid).toBe(false);
    }
  });

  it("rejects bio shorter than 10 chars", () => {
    const result = sitterOnboardingSchema.safeParse({ ...validSitter, bio: "Short" });
    expect(result.success).toBe(false);
  });

  it("rejects hourlyRate over 500", () => {
    const result = sitterOnboardingSchema.safeParse({ ...validSitter, hourlyRate: 501 });
    expect(result.success).toBe(false);
  });

  it("rejects hourlyRate under 1", () => {
    const result = sitterOnboardingSchema.safeParse({ ...validSitter, hourlyRate: 0 });
    expect(result.success).toBe(false);
  });
});

describe("createRequestSchema", () => {
  const validRequest = {
    careType: "occasional" as const,
    dateNeeded: "2026-03-15",
    startTime: "09:00",
    endTime: "13:00",
    durationHours: 4,
    numberOfChildren: 2,
    childrenJson: '[{"name":"Emma","age":3}]',
    city: "Berlin",
    zipCode: "10115",
  };

  it("accepts valid request", () => {
    const result = createRequestSchema.safeParse(validRequest);
    expect(result.success).toBe(true);
  });

  it("rejects non-Berlin city", () => {
    const result = createRequestSchema.safeParse({ ...validRequest, city: "Hamburg" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid time format", () => {
    const result = createRequestSchema.safeParse({ ...validRequest, startTime: "9am" });
    expect(result.success).toBe(false);
  });

  it("accepts valid HH:MM format", () => {
    const result = createRequestSchema.safeParse({ ...validRequest, startTime: "09:30" });
    expect(result.success).toBe(true);
  });

  it("rejects numberOfChildren over 10", () => {
    const result = createRequestSchema.safeParse({ ...validRequest, numberOfChildren: 11 });
    expect(result.success).toBe(false);
  });
});

describe("createBookingSchema", () => {
  it("accepts valid booking", () => {
    const result = createBookingSchema.safeParse({
      requestId: "req-123",
      sitterId: "sit-456",
      agreedRate: 15,
    });
    expect(result.success).toBe(true);
  });

  it("rejects negative agreedRate", () => {
    const result = createBookingSchema.safeParse({
      requestId: "req-123",
      sitterId: "sit-456",
      agreedRate: -5,
    });
    expect(result.success).toBe(false);
  });
});

describe("reviewSchema", () => {
  it("accepts valid review", () => {
    const result = reviewSchema.safeParse({
      bookingId: "bk-123",
      rating: 5,
      title: "Great sitter!",
      comment: "Would recommend.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects rating below 1", () => {
    const result = reviewSchema.safeParse({ bookingId: "bk-123", rating: 0 });
    expect(result.success).toBe(false);
  });

  it("rejects rating above 5", () => {
    const result = reviewSchema.safeParse({ bookingId: "bk-123", rating: 6 });
    expect(result.success).toBe(false);
  });

  it("allows missing title and comment", () => {
    const result = reviewSchema.safeParse({ bookingId: "bk-123", rating: 3 });
    expect(result.success).toBe(true);
  });
});

describe("messageSchema", () => {
  it("accepts valid message", () => {
    const result = messageSchema.safeParse({ content: "Hello!" });
    expect(result.success).toBe(true);
  });

  it("rejects empty message", () => {
    const result = messageSchema.safeParse({ content: "" });
    expect(result.success).toBe(false);
  });

  it("rejects message over 5000 chars", () => {
    const result = messageSchema.safeParse({ content: "a".repeat(5001) });
    expect(result.success).toBe(false);
  });
});

describe("profileUpdateSchema", () => {
  it("accepts empty object (all optional)", () => {
    const result = profileUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial updates", () => {
    const result = profileUpdateSchema.safeParse({ firstName: "Jane", hourlyRate: 20 });
    expect(result.success).toBe(true);
  });

  it("rejects hourlyRate over 500", () => {
    const result = profileUpdateSchema.safeParse({ hourlyRate: 501 });
    expect(result.success).toBe(false);
  });
});
