import { describe, it, expect, vi, beforeEach } from "vitest";
import { PATCH } from "@/app/api/bookings/[id]/status/route";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const mockPrisma = vi.mocked(prisma);
const mockGetSession = vi.mocked(getSession);

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/bookings/bk-1/status", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const makeParams = () => Promise.resolve({ id: "bk-1" });

const mockBooking = {
  id: "bk-1",
  requestId: "req-1",
  parentId: "parent-1",
  sitterId: "sitter-1",
  dateBooked: new Date("2026-03-15"),
  startTime: "09:00",
  endTime: "13:00",
  agreedRate: 15,
  totalEstimated: 60,
  status: "PENDING",
  parentNotes: null,
  sitterNotes: null,
  declinedReason: null,
  cancelledBy: null,
  cancelledReason: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/bookings/[id]/status", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const res = await PATCH(makeRequest({ status: "ACCEPTED" }), { params: makeParams() });
    expect(res.status).toBe(401);
  });

  it("returns 400 when status is missing", async () => {
    mockGetSession.mockResolvedValue({ userId: "sitter-1", email: "s@test.com", role: "BABYSITTER" });
    const res = await PATCH(makeRequest({}), { params: makeParams() });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("status is required");
  });

  it("returns 404 when booking not found", async () => {
    mockGetSession.mockResolvedValue({ userId: "sitter-1", email: "s@test.com", role: "BABYSITTER" });
    mockPrisma.booking.findUnique.mockResolvedValue(null);

    const res = await PATCH(makeRequest({ status: "ACCEPTED" }), { params: makeParams() });
    expect(res.status).toBe(404);
  });

  it("returns 400 for invalid state transition", async () => {
    mockGetSession.mockResolvedValue({ userId: "sitter-1", email: "s@test.com", role: "BABYSITTER" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);

    // PENDING → COMPLETED is not a valid transition
    const res = await PATCH(makeRequest({ status: "COMPLETED" }), { params: makeParams() });
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Cannot transition");
  });

  it("returns 403 when user role is not authorized for transition", async () => {
    // Parent tries to ACCEPT (only babysitter can)
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);

    const res = await PATCH(makeRequest({ status: "ACCEPTED" }), { params: makeParams() });
    expect(res.status).toBe(403);
  });

  it("returns 403 for unrelated user", async () => {
    mockGetSession.mockResolvedValue({ userId: "stranger", email: "x@test.com", role: "BABYSITTER" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);

    const res = await PATCH(makeRequest({ status: "ACCEPTED" }), { params: makeParams() });
    expect(res.status).toBe(403);
  });

  it("allows babysitter to ACCEPT a PENDING booking", async () => {
    mockGetSession.mockResolvedValue({ userId: "sitter-1", email: "s@test.com", role: "BABYSITTER" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.booking.update.mockResolvedValue({ ...mockBooking, status: "ACCEPTED" } as never);
    mockPrisma.user.findUnique.mockResolvedValue({
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
    } as never);

    const res = await PATCH(makeRequest({ status: "ACCEPTED" }), { params: makeParams() });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(mockPrisma.booking.update).toHaveBeenCalledWith({
      where: { id: "bk-1" },
      data: { status: "ACCEPTED" },
    });
  });

  it("allows babysitter to DECLINE with reason", async () => {
    mockGetSession.mockResolvedValue({ userId: "sitter-1", email: "s@test.com", role: "BABYSITTER" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.booking.update.mockResolvedValue({ ...mockBooking, status: "DECLINED" } as never);
    mockPrisma.user.findUnique.mockResolvedValue({
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
    } as never);

    const res = await PATCH(
      makeRequest({ status: "DECLINED", reason: "Schedule conflict" }),
      { params: makeParams() }
    );
    expect(res.status).toBe(200);
    expect(mockPrisma.booking.update).toHaveBeenCalledWith({
      where: { id: "bk-1" },
      data: { status: "DECLINED", declinedReason: "Schedule conflict" },
    });
  });

  it("allows parent to CANCEL a PENDING booking", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.booking.update.mockResolvedValue({ ...mockBooking, status: "CANCELLED" } as never);
    mockPrisma.user.findUnique.mockResolvedValue({
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
    } as never);

    const res = await PATCH(
      makeRequest({ status: "CANCELLED", reason: "Changed plans" }),
      { params: makeParams() }
    );
    expect(res.status).toBe(200);
    expect(mockPrisma.booking.update).toHaveBeenCalledWith({
      where: { id: "bk-1" },
      data: {
        status: "CANCELLED",
        cancelledBy: "parent-1",
        cancelledReason: "Changed plans",
      },
    });
  });

  it("allows parent to CONFIRM an ACCEPTED booking", async () => {
    const acceptedBooking = { ...mockBooking, status: "ACCEPTED" };
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(acceptedBooking as never);
    mockPrisma.booking.update.mockResolvedValue({ ...acceptedBooking, status: "CONFIRMED" } as never);
    mockPrisma.user.findUnique.mockResolvedValue({
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
    } as never);

    const res = await PATCH(makeRequest({ status: "CONFIRMED" }), { params: makeParams() });
    expect(res.status).toBe(200);
  });

  it("allows parent to COMPLETE a CONFIRMED booking", async () => {
    const confirmedBooking = { ...mockBooking, status: "CONFIRMED" };
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(confirmedBooking as never);
    mockPrisma.booking.update.mockResolvedValue({ ...confirmedBooking, status: "COMPLETED" } as never);
    mockPrisma.user.findUnique.mockResolvedValue({
      email: "user@test.com",
      firstName: "Test",
      lastName: "User",
    } as never);

    const res = await PATCH(makeRequest({ status: "COMPLETED" }), { params: makeParams() });
    expect(res.status).toBe(200);
  });
});
