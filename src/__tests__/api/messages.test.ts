import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET, POST } from "@/app/api/messages/[conversationId]/route";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { notifyNewMessage } from "@/lib/email";
import { canStartConversation } from "@/lib/subscription";

const mockPrisma = vi.mocked(prisma);
const mockGetSession = vi.mocked(getSession);
const mockNotifyNewMessage = vi.mocked(notifyNewMessage);
const mockCanStartConversation = vi.mocked(canStartConversation);

const makeParams = () => Promise.resolve({ conversationId: "bk-1" });

const mockBooking = {
  id: "bk-1",
  parentId: "parent-1",
  sitterId: "sitter-1",
  status: "ACCEPTED",
};

const mockOtherUser = {
  id: "sitter-1",
  firstName: "Anna",
  lastName: "Schmidt",
  avatarUrl: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  // Default: no match found (booking path is primary)
  mockPrisma.match.findUnique.mockResolvedValue(null);
  // Default: subscription allows conversations
  mockCanStartConversation.mockResolvedValue({ allowed: true, used: 0, limit: 5 });
  // Default: no existing messages in conversation
  mockPrisma.message.count.mockResolvedValue(0);
});

describe("GET /api/messages/[conversationId]", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValue(null);
    const req = new Request("http://localhost/api/messages/bk-1");
    const res = await GET(req, { params: makeParams() });
    expect(res.status).toBe(401);
  });

  it("returns 404 when booking not found and no match found", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(null);
    mockPrisma.match.findUnique.mockResolvedValue(null);

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
    mockPrisma.user.findUnique.mockResolvedValue(mockOtherUser as never);

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
    mockPrisma.user.findUnique.mockResolvedValue(mockOtherUser as never);

    const req = new Request("http://localhost/api/messages/bk-1");
    const res = await GET(req, { params: makeParams() });
    expect(res.status).toBe(200);
  });

  it("filters messages by ?after= cursor", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    const cursorDate = new Date("2026-03-15T10:00:00Z");
    mockPrisma.message.findUnique.mockResolvedValue({ id: "msg-0", createdAt: cursorDate } as never);
    mockPrisma.message.findMany.mockResolvedValue([] as never);
    mockPrisma.message.updateMany.mockResolvedValue({ count: 0 } as never);
    mockPrisma.user.findUnique.mockResolvedValue(mockOtherUser as never);

    const req = new Request("http://localhost/api/messages/bk-1?after=msg-0");
    const res = await GET(req, { params: makeParams() });
    expect(res.status).toBe(200);

    // Should look up the cursor message
    expect(mockPrisma.message.findUnique).toHaveBeenCalledWith({
      where: { id: "msg-0" },
      select: { createdAt: true },
    });
    // Should query with createdAt > cursor
    expect(mockPrisma.message.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ createdAt: { gt: cursorDate } }),
      })
    );
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

  it("returns 400 for whitespace-only message", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    const res = await POST(makePostRequest({ content: "   " }), { params: makeParams() });
    expect(res.status).toBe(400);
  });

  it("returns 404 when booking not found and no match found", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(null);
    mockPrisma.match.findUnique.mockResolvedValue(null);

    const res = await POST(makePostRequest({ content: "Hello" }), { params: makeParams() });
    expect(res.status).toBe(404);
  });

  it("returns 403 for unrelated user", async () => {
    mockGetSession.mockResolvedValue({ userId: "stranger", email: "x@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);

    const res = await POST(makePostRequest({ content: "Hello" }), { params: makeParams() });
    expect(res.status).toBe(403);
  });

  it("returns 403 when booking is DECLINED (closed)", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue({ ...mockBooking, status: "DECLINED" } as never);

    const res = await POST(makePostRequest({ content: "Hello" }), { params: makeParams() });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toContain("no longer active");
  });

  it("returns 403 when booking is CANCELLED (closed)", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue({ ...mockBooking, status: "CANCELLED" } as never);

    const res = await POST(makePostRequest({ content: "Hello" }), { params: makeParams() });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toContain("no longer active");
  });

  it("returns 403 with upgrade_required when parent hits conversation limit", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.count.mockResolvedValue(0); // first message in this conversation
    mockCanStartConversation.mockResolvedValue({ allowed: false, used: 5, limit: 5 });

    const res = await POST(makePostRequest({ content: "Hello" }), { params: makeParams() });
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.code).toBe("upgrade_required");
  });

  it("skips conversation limit check when parent already sent a message in this conversation", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.count.mockResolvedValue(3); // already sent messages — not first
    mockPrisma.message.create.mockResolvedValue({
      id: "msg-new",
      bookingId: "bk-1",
      senderId: "parent-1",
      content: "Follow-up message",
      isRead: false,
      createdAt: new Date(),
      sender: { id: "parent-1", firstName: "John", lastName: "Doe", avatarUrl: null },
    } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ email: "sitter@test.com" } as never);

    const res = await POST(makePostRequest({ content: "Follow-up message" }), { params: makeParams() });
    expect(res.status).toBe(201);
    // canStartConversation should NOT be called when not the first message
    expect(mockCanStartConversation).not.toHaveBeenCalled();
  });

  it("sitter is not subject to conversation limit", async () => {
    mockGetSession.mockResolvedValue({ userId: "sitter-1", email: "s@test.com", role: "BABYSITTER" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.create.mockResolvedValue({
      id: "msg-new",
      bookingId: "bk-1",
      senderId: "sitter-1",
      content: "Hi parent!",
      isRead: false,
      createdAt: new Date(),
      sender: { id: "sitter-1", firstName: "Anna", lastName: "Schmidt", avatarUrl: null },
    } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ email: "parent@test.com" } as never);

    const res = await POST(makePostRequest({ content: "Hi parent!" }), { params: makeParams() });
    expect(res.status).toBe(201);
    expect(mockCanStartConversation).not.toHaveBeenCalled();
  });

  it("creates a message and returns 201", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.count.mockResolvedValue(0);
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

    expect(mockPrisma.message.create).toHaveBeenCalledWith({
      data: { bookingId: "bk-1", senderId: "parent-1", content: "Hello sitter!" },
      include: { sender: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });
  });

  it("sends email notification to recipient after message is created", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.count.mockResolvedValue(2);
    mockPrisma.message.create.mockResolvedValue({
      id: "msg-new",
      bookingId: "bk-1",
      senderId: "parent-1",
      content: "When are you available?",
      isRead: false,
      createdAt: new Date(),
      sender: { id: "parent-1", firstName: "John", lastName: "Doe", avatarUrl: null },
    } as never);
    mockPrisma.user.findUnique.mockResolvedValue({ email: "sitter@test.com" } as never);

    await POST(makePostRequest({ content: "When are you available?" }), { params: makeParams() });

    expect(mockNotifyNewMessage).toHaveBeenCalledWith(
      "sitter@test.com",
      "John Doe",
      "",
      "bk-1"
    );
  });

  it("does not send email when recipient user not found", async () => {
    mockGetSession.mockResolvedValue({ userId: "parent-1", email: "p@test.com", role: "PARENT" });
    mockPrisma.booking.findUnique.mockResolvedValue(mockBooking as never);
    mockPrisma.message.count.mockResolvedValue(2);
    mockPrisma.message.create.mockResolvedValue({
      id: "msg-new",
      bookingId: "bk-1",
      senderId: "parent-1",
      content: "Hello",
      isRead: false,
      createdAt: new Date(),
      sender: { id: "parent-1", firstName: "John", lastName: "Doe", avatarUrl: null },
    } as never);
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await POST(makePostRequest({ content: "Hello" }), { params: makeParams() });
    expect(res.status).toBe(201);
    expect(mockNotifyNewMessage).not.toHaveBeenCalled();
  });
});
