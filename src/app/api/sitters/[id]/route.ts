import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const profile = await prisma.babysitterProfile.findUnique({
      where: { userId: id, isActive: true, user: { onboarded: true, isDisabled: false } },
      select: {
        userId: true,
        bio: true,
        hourlyRate: true,
        yearsExperience: true,
        languages: true,
        ageRangeMin: true,
        ageRangeMax: true,
        hasFirstAid: true,
        hasCPR: true,
        hasTransportation: true,
        availabilityJson: true,
        isActive: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
            district: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: "Sitter not found" },
        { status: 404 }
      );
    }

    const [reviews, reviewStats] = await Promise.all([
      prisma.review.findMany({
        where: { subjectId: id, isVisible: true },
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.review.aggregate({
        where: { subjectId: id, isVisible: true },
        _count: { id: true },
        _avg: { rating: true },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        profile,
        reviews,
        averageRating: reviewStats._avg.rating,
        reviewCount: reviewStats._count.id,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to get sitter" },
      { status: 500 }
    );
  }
}
