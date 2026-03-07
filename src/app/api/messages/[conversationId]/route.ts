import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validators";
import { notifyNewMessage } from "@/lib/email";
import { apiLimiter, checkRateLimit } from "@/lib/ratelimit";

// Resolve conversationId to either a booking or a match, returning participant IDs.
async function resolveConversation(conversationId: string, userId: string) {
  // Try booking first
  const booking = await prisma.booking.findUnique({
    where: { id: conversationId },
  });
  if (booking) {
    if (booking.parentId !== userId && booking.sitterId !== userId) {
      return { type: "unauthorized" as const };
    }
    const otherUserId =
      booking.parentId === userId ? booking.sitterId : booking.parentId;
    return {
      type: "booking" as const,
      bookingId: conversationId,
      matchId: null,
      otherUserId,
    };
  }

  // Try match
  const match = await prisma.match.findUnique({
    where: { id: conversationId },
  });
  if (match) {
    if (match.user1Id !== userId && match.user2Id !== userId) {
      return { type: "unauthorized" as const };
    }
    const otherUserId =
      match.user1Id === userId ? match.user2Id : match.user1Id;
    return {
      type: "match" as const,
      bookingId: null,
      matchId: conversationId,
      otherUserId,
    };
  }

  return { type: "not_found" as const };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { conversationId } = await params;
    const conv = await resolveConversation(conversationId, session.userId);

    if (conv.type === "not_found") {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      );
    }
    if (conv.type === "unauthorized") {
      return NextResponse.json(
        { success: false, error: "Not authorized to view these messages" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const after = searchParams.get("after");

    const where: Record<string, unknown> = conv.bookingId
      ? { bookingId: conv.bookingId }
      : { matchId: conv.matchId };

    if (after) {
      const afterMessage = await prisma.message.findUnique({
        where: { id: after },
        select: { createdAt: true },
      });

      if (afterMessage) {
        where.createdAt = { gt: afterMessage.createdAt };
      }
    }

    const messages = await prisma.message.findMany({
      where,
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark unread messages sent by the other party as read
    const markWhere: Record<string, unknown> = conv.bookingId
      ? { bookingId: conv.bookingId }
      : { matchId: conv.matchId };
    await prisma.message.updateMany({
      where: {
        ...markWhere,
        senderId: { not: session.userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      success: true,
      data: { messages, conversationType: conv.type },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to get messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    const limited = await checkRateLimit(apiLimiter, request);
    if (limited) return limited;

    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { conversationId } = await params;
    const body = await request.json();

    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const conv = await resolveConversation(conversationId, session.userId);

    if (conv.type === "not_found") {
      return NextResponse.json(
        { success: false, error: "Conversation not found" },
        { status: 404 }
      );
    }
    if (conv.type === "unauthorized") {
      return NextResponse.json(
        { success: false, error: "Not authorized to send messages in this conversation" },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        ...(conv.bookingId
          ? { bookingId: conv.bookingId }
          : { matchId: conv.matchId }),
        senderId: session.userId,
        content: parsed.data.content,
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true },
        },
      },
    });

    // Send email notification to the other party (fire-and-forget)
    const recipient = await prisma.user.findUnique({
      where: { id: conv.otherUserId },
      select: { email: true },
    });
    if (recipient) {
      const senderName = `${message.sender.firstName} ${message.sender.lastName}`;
      notifyNewMessage(recipient.email, senderName, parsed.data.content, conversationId).catch(console.error);
    }

    return NextResponse.json(
      { success: true, data: message },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to send message" },
      { status: 500 }
    );
  }
}
