import { NextResponse } from "next/server";
import { requireOwner } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";
import { randomUUID } from "crypto";

export async function GET() {
  await requireOwner();

  const unverified = await prisma.user.findMany({
    where: { emailVerified: false, role: { not: "ADMIN" } },
    select: { id: true, email: true, firstName: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ count: unverified.length, users: unverified });
}

export async function POST(request: Request) {
  await requireOwner();

  const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // If userId provided, resend only for that user
  let body: { userId?: string } = {};
  try { body = await request.json(); } catch { /* no body */ }

  if (body.userId) {
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
      select: { id: true, email: true, firstName: true, emailVerified: true },
    });
    if (!user || user.emailVerified) {
      return NextResponse.json({ success: false, error: "User not found or already verified" }, { status: 400 });
    }
    const token = randomUUID();
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: token, emailVerificationExpiry: newExpiry },
    });
    await sendVerificationEmail(user.email, user.firstName, token);
    return NextResponse.json({ success: true, sent: 1 });
  }

  // Otherwise resend to all unverified
  const unverified = await prisma.user.findMany({
    where: { emailVerified: false, role: { not: "ADMIN" } },
    select: { id: true, email: true, firstName: true },
  });

  let sent = 0;
  for (const user of unverified) {
    const token = randomUUID();
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerificationToken: token, emailVerificationExpiry: newExpiry },
    });
    await sendVerificationEmail(user.email, user.firstName, token);
    sent++;
  }

  return NextResponse.json({ success: true, sent });
}
