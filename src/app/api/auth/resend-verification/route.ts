import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { emailLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function POST(request: Request) {
  try {
    const rateLimited = await checkRateLimit(emailLimiter, request);
    if (rateLimited) return rateLimited;

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: true, message: "If an account exists with that email, a verification link has been sent." },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid email enumeration
    if (!user || user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with that email, a verification link has been sent.",
      });
    }

    const verificationToken = randomUUID();
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: verificationToken,
        emailVerificationExpiry: verificationExpiry,
      },
    });

    sendVerificationEmail(user.email, user.firstName, verificationToken).catch(console.error);

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, a verification link has been sent.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to resend" },
      { status: 500 }
    );
  }
}
