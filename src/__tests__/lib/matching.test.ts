import { describe, it, expect, vi, beforeEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { findMatchingSitters } from "@/lib/matching";

const mockPrisma = vi.mocked(prisma);

// Helper to build a sitter profile for testing
function makeSitter(overrides: Record<string, unknown> = {}) {
  return {
    id: "profile-1",
    userId: "sitter-1",
    bio: "I love kids",
    hourlyRate: 15,
    currency: "EUR",
    city: "Berlin",
    state: "Berlin",
    zipCode: "10115",
    latitude: 52.52,
    longitude: 13.405,
    radiusMiles: 10,
    availabilityJson: JSON.stringify({ monday: ["morning", "afternoon"], tuesday: ["evening"] }),
    yearsExperience: 5,
    languages: "English, German",
    certifications: null,
    ageRangeMin: 0,
    ageRangeMax: 12,
    hasFirstAid: true,
    hasCPR: true,
    hasTransportation: false,
    referencesJson: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: "sitter-1",
      firstName: "Anna",
      lastName: "Schmidt",
      avatarUrl: null,
    },
    ...overrides,
  };
}

// Helper to build a request
function makeRequest(overrides: Record<string, unknown> = {}) {
  return {
    id: "req-1",
    parentId: "parent-1",
    title: "Need sitter",
    description: null,
    dateNeeded: new Date("2026-03-09"), // Monday
    startTime: "09:00",
    endTime: "13:00",
    durationHours: 4,
    childrenJson: JSON.stringify([{ name: "Emma", age: 3 }]),
    numberOfChildren: 1,
    city: "Berlin",
    state: "Berlin",
    zipCode: "10115",
    latitude: 52.52,
    longitude: 13.405,
    address: null,
    maxHourlyRate: 20,
    specialNotes: null,
    status: "OPEN",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("findMatchingSitters", () => {
  it("throws if request not found", async () => {
    mockPrisma.childcareRequest.findUnique.mockResolvedValue(null);
    await expect(findMatchingSitters("nonexistent")).rejects.toThrow("Request not found");
  });

  it("scores a perfect match highly", async () => {
    const request = makeRequest();
    const sitter = makeSitter();

    mockPrisma.childcareRequest.findUnique.mockResolvedValue(request as never);
    mockPrisma.babysitterProfile.findMany.mockResolvedValue([sitter] as never);

    const results = await findMatchingSitters("req-1");
    expect(results).toHaveLength(1);

    const match = results[0];
    // Same city: 30, within radius: 20, available: 25, age range: 15, within budget: 10, 3+yr: 5, CPR: 3, FirstAid: 3
    expect(match.score).toBe(111);
    expect(match.sitterId).toBe("sitter-1");
    expect(match.matchReasons).toContain("Same city");
    expect(match.matchReasons).toContain("Available at requested time");
    expect(match.matchReasons).toContain("Within budget");
    expect(match.matchReasons).toContain("CPR certified");
    expect(match.matchReasons).toContain("First Aid certified");
  });

  it("gives 0 score and excludes sitter in different city with out-of-range distance", async () => {
    const request = makeRequest();
    // Sitter in Munich (far from Berlin)
    const sitter = makeSitter({
      city: "Munich",
      state: "Bavaria",
      latitude: 48.1351,
      longitude: 11.582,
      radiusMiles: 10,
    });

    mockPrisma.childcareRequest.findUnique.mockResolvedValue(request as never);
    mockPrisma.babysitterProfile.findMany.mockResolvedValue([sitter] as never);

    const results = await findMatchingSitters("req-1");
    // Sitter is outside radius AND different city, so gets skipped by `continue`
    expect(results).toHaveLength(0);
  });

  it("handles sitter without lat/lng (no distance scoring)", async () => {
    const request = makeRequest();
    const sitter = makeSitter({ latitude: null, longitude: null });

    mockPrisma.childcareRequest.findUnique.mockResolvedValue(request as never);
    mockPrisma.babysitterProfile.findMany.mockResolvedValue([sitter] as never);

    const results = await findMatchingSitters("req-1");
    expect(results).toHaveLength(1);
    // Same city: 30, no distance check, available: 25, age: 15, budget: 10, exp: 5, CPR: 3, FA: 3
    expect(results[0].score).toBe(91);
  });

  it("skips availability points when sitter unavailable at requested time", async () => {
    const request = makeRequest({
      dateNeeded: new Date("2026-03-11"), // Wednesday
      startTime: "09:00",
    });
    // Sitter only available Mon morning/afternoon, Tue evening
    const sitter = makeSitter({ latitude: null, longitude: null });

    mockPrisma.childcareRequest.findUnique.mockResolvedValue(request as never);
    mockPrisma.babysitterProfile.findMany.mockResolvedValue([sitter] as never);

    const results = await findMatchingSitters("req-1");
    expect(results).toHaveLength(1);
    // No availability points (25 missing)
    expect(results[0].matchReasons).not.toContain("Available at requested time");
  });

  it("skips budget points when sitter exceeds maxHourlyRate", async () => {
    const request = makeRequest({ maxHourlyRate: 10 }); // budget lower than sitter's 15
    const sitter = makeSitter({ latitude: null, longitude: null });

    mockPrisma.childcareRequest.findUnique.mockResolvedValue(request as never);
    mockPrisma.babysitterProfile.findMany.mockResolvedValue([sitter] as never);

    const results = await findMatchingSitters("req-1");
    expect(results).toHaveLength(1);
    expect(results[0].matchReasons).not.toContain("Within budget");
  });

  it("skips age range points when children are outside sitter's range", async () => {
    const request = makeRequest({
      childrenJson: JSON.stringify([{ name: "Teen", age: 15 }]),
    });
    // Sitter only handles 0-12
    const sitter = makeSitter({ latitude: null, longitude: null });

    mockPrisma.childcareRequest.findUnique.mockResolvedValue(request as never);
    mockPrisma.babysitterProfile.findMany.mockResolvedValue([sitter] as never);

    const results = await findMatchingSitters("req-1");
    expect(results).toHaveLength(1);
    expect(results[0].matchReasons).not.toContain("Comfortable with children's ages");
  });

  it("sorts results by score descending", async () => {
    const request = makeRequest();
    const goodSitter = makeSitter({ latitude: null, longitude: null });
    const weakSitter = makeSitter({
      id: "profile-2",
      userId: "sitter-2",
      latitude: null,
      longitude: null,
      city: "Hamburg",
      state: "Hamburg",
      yearsExperience: 1,
      hasCPR: false,
      hasFirstAid: false,
      availabilityJson: "{}",
      user: { id: "sitter-2", firstName: "Bob", lastName: "Jones", avatarUrl: null },
    });

    mockPrisma.childcareRequest.findUnique.mockResolvedValue(request as never);
    mockPrisma.babysitterProfile.findMany.mockResolvedValue([weakSitter, goodSitter] as never);

    const results = await findMatchingSitters("req-1");
    expect(results.length).toBeGreaterThanOrEqual(1);
    // Good sitter should be first
    if (results.length > 1) {
      expect(results[0].score).toBeGreaterThan(results[1].score);
    }
  });

  it("returns empty array when no sitters exist", async () => {
    const request = makeRequest();

    mockPrisma.childcareRequest.findUnique.mockResolvedValue(request as never);
    mockPrisma.babysitterProfile.findMany.mockResolvedValue([] as never);

    const results = await findMatchingSitters("req-1");
    expect(results).toEqual([]);
  });
});
