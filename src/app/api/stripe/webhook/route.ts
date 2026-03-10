import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription || !session.customer) break;

        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer.id;

        // Fetch full subscription details
        const sub = await getStripe().subscriptions.retrieve(subscriptionId);
        const item = sub.items.data[0];
        const priceId = item?.price?.id || "";
        const periodStart = new Date(item.current_period_start * 1000);
        const periodEnd = new Date(item.current_period_end * 1000);

        // Find user by Stripe customer ID
        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });
        if (!user) break;

        await prisma.subscription.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            status: "active",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
          update: {
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            status: "active",
            currentPeriodStart: periodStart,
            currentPeriodEnd: periodEnd,
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const existing = await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: sub.id },
        });
        if (!existing) break;

        let status = "active";
        if (sub.status === "canceled") status = "expired";
        else if (sub.status === "past_due") status = "past_due";
        else if (sub.status === "unpaid") status = "past_due";
        else if (sub.status === "active" || sub.status === "trialing") status = "active";

        const subItem = sub.items.data[0];
        await prisma.subscription.update({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status,
            currentPeriodStart: new Date(subItem.current_period_start * 1000),
            currentPeriodEnd: new Date(subItem.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "expired" },
        });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subRef = invoice.parent?.subscription_details?.subscription;
        if (!subRef) break;
        const subId = typeof subRef === "string" ? subRef : subRef.id;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subId },
          data: { status: "past_due" },
        });
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
