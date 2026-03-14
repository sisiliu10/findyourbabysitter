import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { success: false, error: "Verification token is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { emailVerificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid verification link. Please request a new one." },
        { status: 400 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message: "Your email is already verified. You can log in.",
      });
    }

    if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
      return NextResponse.json(
        { success: false, error: "This verification link has expired. Please request a new one.", email: user.email },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiry: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your email has been verified. You can now log in.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
