import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { emailLimiter, checkRateLimit } from "@/lib/ratelimit";

const SUCCESS_MESSAGE = "If an account exists with that email, a password reset link has been sent.";

export async function POST(request: Request) {
  try {
    const rateLimited = await checkRateLimit(emailLimiter, request);
    if (rateLimited) return rateLimited;

    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || user.isDisabled) {
      return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
    }

    const resetToken = randomUUID();
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: resetExpiry,
      },
    });

    sendPasswordResetEmail(user.email, user.firstName, resetToken).catch(console.error);

    return NextResponse.json({ success: true, message: SUCCESS_MESSAGE });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Request failed" },
      { status: 500 }
    );
  }
}
