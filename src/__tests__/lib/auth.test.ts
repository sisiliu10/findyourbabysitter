import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signJwt, verifyJwt } from "@/lib/auth";

describe("hashPassword / verifyPassword", () => {
  it("hashes and verifies a password correctly", async () => {
    const plain = "MySecurePassword123!";
    const hash = await hashPassword(plain);

    expect(hash).not.toBe(plain);
    expect(hash).toMatch(/^\$2[aby]?\$/); // bcrypt hash prefix
    expect(await verifyPassword(plain, hash)).toBe(true);
  });

  it("rejects wrong password", async () => {
    const hash = await hashPassword("correct-password");
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });

  it("produces different hashes for same password (salted)", async () => {
    const plain = "test-password";
    const hash1 = await hashPassword(plain);
    const hash2 = await hashPassword(plain);
    expect(hash1).not.toBe(hash2);
    // But both verify
    expect(await verifyPassword(plain, hash1)).toBe(true);
    expect(await verifyPassword(plain, hash2)).toBe(true);
  });
});

describe("signJwt / verifyJwt", () => {
  const payload = { userId: "user-123", email: "test@example.com", role: "PARENT" };

  it("signs and verifies a JWT", () => {
    const token = signJwt(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // header.payload.signature

    const decoded = verifyJwt(token);
    expect(decoded).not.toBeNull();
    expect(decoded!.userId).toBe("user-123");
    expect(decoded!.email).toBe("test@example.com");
    expect(decoded!.role).toBe("PARENT");
  });

  it("returns null for invalid token", () => {
    expect(verifyJwt("garbage.token.here")).toBeNull();
  });

  it("returns null for tampered token", () => {
    const token = signJwt(payload);
    const tampered = token.slice(0, -5) + "XXXXX";
    expect(verifyJwt(tampered)).toBeNull();
  });

  it("includes expiry in the token", () => {
    const token = signJwt(payload);
    const decoded = verifyJwt(token);
    expect(decoded).not.toBeNull();
    // JWT verified payload should have exp and iat
    expect((decoded as Record<string, unknown>).exp).toBeDefined();
    expect((decoded as Record<string, unknown>).iat).toBeDefined();
  });
});
