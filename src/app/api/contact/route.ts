import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notifyInterest } from "@/lib/email";

// POST /api/contact
// Creates or finds a match between the current user and toUserId,
// sends a first message, and emails the recipient.
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });

    const { toUserId, message } = await request.json();
    if (!toUserId || typeof toUserId !== "string") {
      return NextResponse.json({ success: false, error: "Missing toUserId" }, { status: 400 });
    }
    if (toUserId === session.userId) {
      return NextResponse.json({ success: false, error: "Cannot contact yourself" }, { status: 400 });
    }

    const text = (typeof message === "string" && message.trim()) ? message.trim() : null;
    if (!text) return NextResponse.json({ success: false, error: "Message is required" }, { status: 400 });

    const recipient = await prisma.user.findUnique({
      where: { id: toUserId, isDisabled: false },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    if (!recipient) return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });

    const sender = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { firstName: true, lastName: true },
    });
    if (!sender) return NextResponse.json({ success: false, error: "Sender not found" }, { status: 404 });

    // Find or create a match between the two users (order-independent)
    const [u1, u2] = [session.userId, toUserId].sort();
    let match = await prisma.match.findFirst({
      where: {
        OR: [
          { user1Id: session.userId, user2Id: toUserId },
          { user1Id: toUserId, user2Id: session.userId },
        ],
      },
    });

    if (!match) {
      // Also upsert likes so the swipe system stays consistent
      await prisma.like.upsert({
        where: { fromUserId_toUserId: { fromUserId: session.userId, toUserId } },
        create: { fromUserId: session.userId, toUserId },
        update: {},
      });
      match = await prisma.match.upsert({
        where: { user1Id_user2Id: { user1Id: u1, user2Id: u2 } },
        create: { user1Id: u1, user2Id: u2 },
        update: {},
      });
    }

    // Send the message
    await prisma.message.create({
      data: {
        matchId: match.id,
        senderId: session.userId,
        content: text,
      },
    });

    // Email the recipient
    const senderName = `${sender.firstName} ${sender.lastName}`;
    notifyInterest(recipient.email, recipient.firstName, senderName, text, match.id).catch(console.error);

    return NextResponse.json({ success: true, data: { matchId: match.id } });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ success: false, error: "Failed to send" }, { status: 500 });
  }
}
