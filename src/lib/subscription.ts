import { prisma } from "@/lib/prisma";
import {
  FREE_WEEKLY_CONVERSATION_LIMIT,
  FREE_DAILY_LIKE_LIMIT,
  FREE_ACTIVE_REQUEST_LIMIT,
} from "@/lib/constants";

export async function isPremium(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, currentPeriodEnd: true },
  });
  return (
    sub !== null &&
    sub.status === "active" &&
    sub.currentPeriodEnd > new Date()
  );
}

export async function canStartConversation(
  userId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
  if (await isPremium(userId)) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Count distinct conversations where this user sent their first message this week
  const result: { count: bigint }[] = await prisma.$queryRaw`
    SELECT COUNT(*) as count FROM (
      SELECT COALESCE("bookingId", "matchId") as conv_key
      FROM "Message"
      WHERE "senderId" = ${userId}
      GROUP BY COALESCE("bookingId", "matchId")
      HAVING MIN("createdAt") >= ${weekAgo}
    ) sub
  `;

  const used = Number(result[0]?.count || 0);
  return {
    allowed: used < FREE_WEEKLY_CONVERSATION_LIMIT,
    used,
    limit: FREE_WEEKLY_CONVERSATION_LIMIT,
  };
}

export async function canLikeToday(
  userId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
  if (await isPremium(userId)) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const used = await prisma.like.count({
    where: {
      fromUserId: userId,
      createdAt: { gte: todayStart },
    },
  });

  return {
    allowed: used < FREE_DAILY_LIKE_LIMIT,
    used,
    limit: FREE_DAILY_LIKE_LIMIT,
  };
}

export async function canCreateRequest(
  userId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
  if (await isPremium(userId)) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const used = await prisma.childcareRequest.count({
    where: {
      parentId: userId,
      status: "OPEN",
    },
  });

  return {
    allowed: used < FREE_ACTIVE_REQUEST_LIMIT,
    used,
    limit: FREE_ACTIVE_REQUEST_LIMIT,
  };
}

export async function getUsageStats(userId: string) {
  const [conversations, likes, requests, premium] = await Promise.all([
    canStartConversation(userId),
    canLikeToday(userId),
    canCreateRequest(userId),
    isPremium(userId),
  ]);

  return { conversations, likes, requests, isPremium: premium };
}
