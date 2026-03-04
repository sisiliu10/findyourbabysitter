import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/auth/login/route";
import { prisma } from "@/lib/prisma";
import * as auth from "@/lib/auth";

const mockPrisma = vi.mocked(prisma);

function makeRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const mockUser = {
  id: "user-1",
  email: "test@example.com",
  passwordHash: "$2a$12$hashedpassword",
  role: "PARENT",
  firstName: "John",
  lastName: "Doe",
  phone: null,
  avatarUrl: null,
  birthday: null,
  instagram: null,
  isDisabled: false,
  onboarded: true,
  emailVerified: true,
  emailVerificationToken: null,
  emailVerificationExpiry: null,
  passwordResetToken: null,
  passwordResetExpiry: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/auth/login", () => {
  it("returns 400 for invalid body", async () => {
    const res = await POST(makeRequest({ email: "bad" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 401 for non-existent user", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const res = await POST(makeRequest({ email: "noone@example.com", password: "password123" }));
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Invalid email or password");
  });

  it("returns 401 for wrong password", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser as never);
    vi.spyOn(auth, "verifyPassword").mockResolvedValue(false);

    const res = await POST(makeRequest({ email: "test@example.com", password: "wrongpass" }));
    expect(res.status).toBe(401);
  });

  it("returns 403 for disabled account", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, isDisabled: true } as never);
    vi.spyOn(auth, "verifyPassword").mockResolvedValue(true);

    const res = await POST(makeRequest({ email: "test@example.com", password: "password123" }));
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.error).toContain("disabled");
  });

  it("returns 403 for unverified email", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ ...mockUser, emailVerified: false } as never);
    vi.spyOn(auth, "verifyPassword").mockResolvedValue(true);

    const res = await POST(makeRequest({ email: "test@example.com", password: "password123" }));
    expect(res.status).toBe(403);
    const json = await res.json();
    expect(json.needsVerification).toBe(true);
  });

  it("returns 200 with user data on successful login", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(mockUser as never);
    vi.spyOn(auth, "verifyPassword").mockResolvedValue(true);

    const res = await POST(makeRequest({ email: "test@example.com", password: "password123" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data.userId).toBe("user-1");
    expect(json.data.email).toBe("test@example.com");
    expect(json.data.role).toBe("PARENT");
    expect(json.data.firstName).toBe("John");
  });
});
