import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { isPremium } from "@/lib/subscription";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        phone: true,
        avatarUrl: true,
        birthday: true,
        instagram: true,
        bio: true,
        childcareTypes: true,
        timesOfDay: true,
        careFrequency: true,
        zipCode: true,
        district: true,
        isDisabled: true,
        onboarded: true,
        createdAt: true,
        babysitterProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const premium = await isPremium(user.id);

    return NextResponse.json({ success: true, data: { ...user, isPremium: premium } });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to get user" },
      { status: 500 }
    );
  }
}
