import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getUsageStats } from "@/lib/subscription";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.userId },
    });

    const usage = await getUsageStats(session.userId);

    return NextResponse.json({
      success: true,
      data: {
        isPremium: usage.isPremium,
        subscription: subscription
          ? {
              status: subscription.status,
              currentPeriodEnd: subscription.currentPeriodEnd,
              cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            }
          : null,
        usage: {
          conversations: {
            used: usage.conversations.used,
            limit: usage.conversations.limit,
          },
          likes: {
            used: usage.likes.used,
            limit: usage.likes.limit,
          },
          requests: {
            used: usage.requests.used,
            limit: usage.requests.limit,
          },
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to get subscription status",
      },
      { status: 500 }
    );
  }
}
