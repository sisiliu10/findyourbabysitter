import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// POST /api/likes — Record a like; detect mutual match
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { toUserId } = body;

    if (!toUserId || typeof toUserId !== "string") {
      return NextResponse.json(
        { success: false, error: "toUserId is required" },
        { status: 400 }
      );
    }

    if (toUserId === session.userId) {
      return NextResponse.json(
        { success: false, error: "Cannot like yourself" },
        { status: 400 }
      );
    }

    // Upsert the like (idempotent)
    await prisma.like.upsert({
      where: {
        fromUserId_toUserId: {
          fromUserId: session.userId,
          toUserId,
        },
      },
      create: {
        fromUserId: session.userId,
        toUserId,
      },
      update: {},
    });

    // Check if the other user has already liked us → mutual match
    const reciprocalLike = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: toUserId,
          toUserId: session.userId,
        },
      },
    });

    if (reciprocalLike) {
      // Ensure consistent ordering: lower ID is user1
      const [u1, u2] =
        session.userId < toUserId
          ? [session.userId, toUserId]
          : [toUserId, session.userId];

      // Create match (idempotent)
      const match = await prisma.match.upsert({
        where: {
          user1Id_user2Id: { user1Id: u1, user2Id: u2 },
        },
        create: { user1Id: u1, user2Id: u2 },
        update: {},
        include: {
          user1: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          user2: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
      });

      const matchedUser =
        match.user1Id === session.userId ? match.user2 : match.user1;

      return NextResponse.json({
        success: true,
        data: {
          liked: true,
          matched: true,
          match: {
            id: match.id,
            matchedUser,
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: { liked: true, matched: false },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to process like",
      },
      { status: 500 }
    );
  }
}

// GET /api/likes — Get users the current user has already liked
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const likes = await prisma.like.findMany({
      where: { fromUserId: session.userId },
      select: { toUserId: true },
    });

    return NextResponse.json({
      success: true,
      data: { likedUserIds: likes.map((l) => l.toUserId) },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch likes",
      },
      { status: 500 }
    );
  }
}
