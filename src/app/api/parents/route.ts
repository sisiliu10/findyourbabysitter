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

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);
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
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch parents" },
      { status: 500 }
    );
  }
}
