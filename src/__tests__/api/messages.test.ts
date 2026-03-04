import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/messages/[conversationId]/route";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const mockPrisma = vi.mocked(prisma);
const mockGetSession = vi.mocked(getSession);

const makeParams = () => Promise.resolve({ conversationId: "bk-1" });

const mockBooking = {
  id: "bk-1",
  parentId: "parent-1",
  sitterId: "sitter-1",
  status: "ACCEPTED",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/messages/[conversationId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const req = new Request("http://localhost/api/messages/bk-1");
    const res = await GET(req, { params: makeParams() });
    expect(res.status).toBe(401);
  });

  it("returns 404 when booking not found", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/messages/bk-1");
    const res = await GET(req, { params: makeParams() });
    expect(res.status).toBe(404);
  });

  it("returns 403 for unrelated user", async () => {
    mockGetSession.mockResolvedValue({ userId: "stranger", email: "x@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);

    const req = new Request("http://localhost/api/messages/bk-1");
    const res = await GET(req, { params: makeParams() });
    expect(res.status).toBe(403);
  });

  it("returns messages for authorized parent", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.findMany.mockResolvedValue([
      {
        id: "msg-1",
        bookingId: "bk-1",
        senderId: "sitter-1",
        content: "Hello!",
        isRead: false,
        createdAt: new Date(),
        sender: { id: "sitter-1", firstName: "Anna", lastName: "Schmidt", avatarUrl: null },
      },
    ] as never);
    mockPrisma.message.updateMany.mockResolvedValue({ count: 1 } as never);

    const req = new Request("http://localhost/api/messages/bk-1");
    const res = await GET(req, { params: makeParams() });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.messages).toHaveLength(1);

    // Should mark other party's messages as read
    expect(mockPrisma.message.updateMany).toHaveBeenCalledWith({
      where: { bookingId: "bk-1", senderId: { not: "parent-1" }, isRead: false },
      data: { isRead: true },
    });
  });

  it("returns messages for authorized sitter", async () => {
    mockGetSession.mockResolvedValue({ userId: "sitter-1", email: "s@test.com", role: "BABYSITTER" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.findMany.mockResolvedValue([] as never);
    mockPrisma.message.updateMany.mockResolvedValue({ count: 0 } as never);

    const req = new Request("http://localhost/api/messages/bk-1");
    const res = await GET(req, { params: makeParams() });
    expect(res.status).toBe(200);
  });
});

describe("POST /api/messages/[conversationId]", () => {
  function makePostRequest(body: Record<string, unknown>) {
    return new Request("http://localhost/api/messages/bk-1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const res = await POST(makePostRequest({ content: "Hi" }), { params: makeParams() });
    expect(res.status).toBe(401);
  });

  it("returns 400 for empty message", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    const res = await POST(makePostRequest({ content: "" }), { params: makeParams() });
    expect(res.status).toBe(400);
  });

  it("returns 404 when booking not found", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(null);

    const res = await POST(makePostRequest({ content: "Hello" }), { params: makeParams() });
    expect(res.status).toBe(404);
  });

  it("returns 403 for unrelated user", async () => {
    mockGetSession.mockResolvedValue({ userId: "stranger", email: "x@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);

    const res = await POST(makePostRequest({ content: "Hello" }), { params: makeParams() });
    expect(res.status).toBe(403);
  });

  it("creates a message and returns 201", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.create.mockResolvedValue({
      id: "msg-new",
      bookingId: "bk-1",
      senderId: "parent-1",
      content: "Hello sitter!",
      isRead: false,
      createdAt: new Date(),
      sender: { id: "parent-1", firstName: "John", lastName: "Doe", avatarUrl: null },
    } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ email: "sitter@test.com" } as never);

    const res = await POST(makePostRequest({ content: "Hello sitter!" }), { params: makeParams() });
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.content).toBe("Hello sitter!");

    // Should have created message with correct data
    expect(mockPrisma.message.create).toHaveBeenCalledWith({
      data: { bookingId: "bk-1", senderId: "parent-1", content: "Hello sitter!" },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });
  });
});
