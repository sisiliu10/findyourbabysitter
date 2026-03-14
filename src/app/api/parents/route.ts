import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    if (session.role !== "BABYSITTER") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "20", 10), 100));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      role: "PARENT",
      isDisabled: false,
      onboarded: true,
      id: { not: session.userId },
    };

    if (city) {
      where.childcareRequests = {
        some: { city: { contains: city } },
      };
    }

    const [parents, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          birthday: true,
          bio: true,
          childcareTypes: true,
          timesOfDay: true,
          careFrequency: true,
          zipCode: true,
          district: true,
          lastSeenAt: true,
          createdAt: true,
          childcareRequests: {
            where: { status: "OPEN" },
            orderBy: { dateNeeded: "desc" },
            take: 3,
            select: {
              id: true,
              title: true,
              city: true,
              state: true,
              numberOfChildren: true,
              childrenJson: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        parents,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch parents" },
      { status: 500 }
    );
  }
}
