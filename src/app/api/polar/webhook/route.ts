import { Webhooks } from "@polar-sh/nextjs";
import { prisma } from "@/lib/prisma";

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onSubscriptionCreated: async (payload) => {
    const sub = payload.data;
    const customerEmail = sub.customer?.email;
    if (!customerEmail) return;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: customerEmail },
    });
    if (!user) return;

    // Set Polar customer ID on user
    if (sub.customer?.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { polarCustomerId: sub.customer.id },
      });
    }

    // Create or update subscription record
    await prisma.subscription.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        polarSubscriptionId: sub.id,
        polarProductId: sub.productId,
        status: "active",
        currentPeriodStart: new Date(sub.currentPeriodStart),
        currentPeriodEnd: new Date(sub.currentPeriodEnd),
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
      },
      update: {
        polarSubscriptionId: sub.id,
        polarProductId: sub.productId,
        status: "active",
        currentPeriodStart: new Date(sub.currentPeriodStart),
        currentPeriodEnd: new Date(sub.currentPeriodEnd),
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
      },
    });
  },

  onSubscriptionUpdated: async (payload) => {
    const sub = payload.data;

    const existing = await prisma.subscription.findUnique({
      where: { polarSubscriptionId: sub.id },
    });
    if (!existing) return;

    // Map Polar status to our status
    let status = "active";
    if (sub.status === "canceled") status = "canceled";
    else if (sub.status === "past_due") status = "past_due";
    else if (sub.status === "unpaid") status = "past_due";
    else if (sub.status === "active") status = "active";

    await prisma.subscription.update({
      where: { polarSubscriptionId: sub.id },
      data: {
        status,
        currentPeriodStart: new Date(sub.currentPeriodStart),
        currentPeriodEnd: new Date(sub.currentPeriodEnd),
        cancelAtPeriodEnd: sub.cancelAtPeriodEnd ?? false,
      },
    });
  },

  onSubscriptionRevoked: async (payload) => {
    const sub = payload.data;

    await prisma.subscription.updateMany({
      where: { polarSubscriptionId: sub.id },
      data: { status: "expired" },
    });
  },

  onSubscriptionCanceled: async (payload) => {
    const sub = payload.data;

    await prisma.subscription.updateMany({
      where: { polarSubscriptionId: sub.id },
      data: {
        status: "canceled",
        cancelAtPeriodEnd: true,
      },
    });
  },
});
