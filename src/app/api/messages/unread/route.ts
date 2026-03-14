import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.userId;

    // Get all booking IDs where user is a participant
    const bookings = await prisma.booking.findMany({
      where: { OR: [{ parentId: userId }, { sitterId: userId }] },
      select: { id: true },
    });
    const bookingIds = bookings.map((b) => b.id);

    // Get all match IDs where user is a participant
    const matches = await prisma.match.findMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
      select: { id: true },
    });
    const matchIds = matches.map((m) => m.id);

    // Count unread messages not sent by the current user
    const unreadMessages = await prisma.message.count({
      where: {
        senderId: { not: userId },
        isRead: false,
        OR: [
          ...(bookingIds.length > 0 ? [{ bookingId: { in: bookingIds } }] : []),
          ...(matchIds.length > 0 ? [{ matchId: { in: matchIds } }] : []),
        ],
      },
    });

    // Count new matches (created in last 7 days) with no messages yet
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newMatchCount = matchIds.length > 0
      ? await prisma.match.count({
          where: {
            id: { in: matchIds },
            createdAt: { gte: sevenDaysAgo },
            messages: { none: {} },
          },
        })
      : 0;

    const count = unreadMessages + newMatchCount;

    return NextResponse.json({ success: true, data: { count } });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to get unread count" },
      { status: 500 },
    );
  }
}
