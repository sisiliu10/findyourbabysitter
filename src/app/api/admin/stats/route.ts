import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (session.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Admin access required" },
        { status: 403 }
      );
    }

    const [totalUsers, totalBookings, totalReviews, activeSitters] = await Promise.all([
      prisma.user.count(),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.babysitterProfile.count({
        where: {
          isActive: true,
          user: { isDisabled: false },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalBookings,
        totalReviews,
        activeSitters,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to get stats" },
      { status: 500 }
    );
  }
}
