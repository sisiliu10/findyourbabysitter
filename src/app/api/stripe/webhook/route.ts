import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import {
  notifyPaymentFailed,
  notifyPaymentActionRequired,
  notifySubscriptionRenewed,
  notifySubscriptionCanceled,
} from "@/lib/email";
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

        // Fetch record before updating so we can get periodEnd for the email
        const record = await prisma.subscription.findFirst({
          where: { stripeSubscriptionId: sub.id },
          include: { user: { select: { email: true, firstName: true } } },
        });

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { status: "expired" },
        });

        if (record?.user) {
          const accessUntil = record.currentPeriodEnd;
          notifySubscriptionCanceled(record.user.email, record.user.firstName, accessUntil).catch(console.error);
        }
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

        // Send payment failed email
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
            select: { email: true, firstName: true },
          });
          if (user) {
            notifyPaymentFailed(user.email, user.firstName).catch(console.error);
          }
        }
        break;
      }

      case "invoice.payment_action_required": {
        // SCA / 3D Secure authentication required (common in Germany/EU)
        const invoice = event.data.object as Stripe.Invoice;
        const subRef = invoice.parent?.subscription_details?.subscription;
        if (!subRef) break;
        const subId = typeof subRef === "string" ? subRef : subRef.id;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subId },
          data: { status: "action_required" },
        });

        // Send authentication required email
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
            select: { email: true, firstName: true },
          });
          if (user) {
            notifyPaymentActionRequired(user.email, user.firstName).catch(console.error);
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        // Subscription renewal succeeded — restore active status
        // (initial checkout is handled by checkout.session.completed)
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.billing_reason !== "subscription_cycle") break;

        const subRef = invoice.parent?.subscription_details?.subscription;
        if (!subRef) break;
        const subId = typeof subRef === "string" ? subRef : subRef.id;

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subId },
          data: { status: "active" },
        });

        // Send renewal confirmation email
        const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (customerId) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: customerId },
            select: { email: true, firstName: true },
          });
          if (user) {
            const nextBillingDate = invoice.lines?.data?.[0]?.period?.end
              ? new Date(invoice.lines.data[0].period.end * 1000)
              : undefined;
            notifySubscriptionRenewed(user.email, user.firstName, nextBillingDate).catch(console.error);
          }
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
