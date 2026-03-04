import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/auth/register/route";
import { prisma } from "@/lib/prisma";

const mockPrisma = vi.mocked(prisma);

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validBody = {
  email: "new@example.com",
  password: "password123",
  firstName: "Jane",
  lastName: "Doe",
  role: "PARENT",
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/register", () => {
  it("returns 400 for invalid body", async () => {
    const res = await POST(makeRequest({ email: "bad" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 409 if email already exists", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: "existing" } as never);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(409);
    const json = await res.json();
    expect(json.error).toContain("already exists");
  });

  it("returns 201 for valid parent registration", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: "new-user",
      email: "new@example.com",
      role: "PARENT",
    } as never);

    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.needsVerification).toBe(true);

    // Should NOT create babysitter profile for parent
    expect(mockPrisma.babysitterProfile.create).not.toHaveBeenCalled();
  });

  it("creates BabysitterProfile for BABYSITTER role", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: "sitter-user",
      email: "sitter@example.com",
      role: "BABYSITTER",
    } as never);
    mockPrisma.babysitterProfile.create.mockResolvedValue({} as never);

    const res = await POST(makeRequest({ ...validBody, role: "BABYSITTER" }));
    expect(res.status).toBe(201);
    expect(mockPrisma.babysitterProfile.create).toHaveBeenCalledWith({
      data: { userId: "sitter-user" },
    });
  });

  it("rejects password shorter than 8 characters", async () => {
    const res = await POST(makeRequest({ ...validBody, password: "short" }));
    expect(res.status).toBe(400);
  });
});
