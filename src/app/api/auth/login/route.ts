import { NextResponse } from "next/server";
import { verifyPassword, signJwt } from "@/lib/auth";
import { setSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validators";
import { authLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    const rateLimited = await checkRateLimit(authLimiter, request);
    if (rateLimited) return rateLimited;

    const body = await request.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.isDisabled) {
      return NextResponse.json(
        { success: false, error: "Your account has been disabled. Please contact support." },
        { status: 403 }
      );
    }

    if (!user.emailVerified) {
      return NextResponse.json(
        { success: false, error: "Please verify your email address before logging in.", needsVerification: true, email: user.email },
        { status: 403 }
      );
    }

    const token = signJwt({ userId: user.id, email: user.email, role: user.role });
    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        onboarded: user.onboarded,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Login failed" },
      { status: 500 }
    );
  }
}
