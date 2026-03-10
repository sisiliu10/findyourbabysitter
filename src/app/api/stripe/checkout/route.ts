import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, email: true, role: true, stripeCustomerId: true },
    });

    if (!user || user.role !== "PARENT") {
      return NextResponse.json({ error: "Only parents can subscribe" }, { status: 403 });
    }

    const { priceId } = await request.json();
    const stripePriceId =
      priceId === "yearly"
        ? process.env.STRIPE_PRICE_YEARLY!
        : process.env.STRIPE_PRICE_MONTHLY!;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://berlinbabysitter.com";

    // Reuse existing Stripe customer or create new one
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await getStripe().customers.create({ email: user.email });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${appUrl}/subscription?success=true`,
      cancel_url: `${appUrl}/pricing`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
