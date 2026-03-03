"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { hashPassword, verifyPassword, signJwt } from "@/lib/auth";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { registerSchema, loginSchema } from "@/lib/validators";
import { sendVerificationEmail } from "@/lib/email";
import type { ActionResult } from "@/types";

export async function registerUser(formData: FormData): Promise<ActionResult> {
  try {
    const raw = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      role: formData.get("role") as string,
    };

    const parsed = registerSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { email, password, firstName, lastName, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "An account with this email already exists" };
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = randomUUID();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role,
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    if (role === "BABYSITTER") {
      await prisma.babysitterProfile.create({
        data: { userId: user.id },
      });
    }

    sendVerificationEmail(email, firstName, verificationToken).catch(console.error);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Registration failed",
    };
  }
}

export async function loginUser(formData: FormData): Promise<ActionResult> {
  try {
    const raw = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const parsed = loginSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return { success: false, error: "Invalid email or password" };
    }

    if (user.isDisabled) {
      return { success: false, error: "Your account has been disabled. Please contact support." };
    }

    if (!user.emailVerified) {
      return { success: false, error: "Please verify your email address before logging in." };
    }

    const token = signJwt({ userId: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }

  redirect("/dashboard");
}

export async function logoutUser(): Promise<void> {
  await clearSessionCookie();
  redirect("/");
}
