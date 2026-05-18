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

export async function POST() {
  await requireOwner();

  const unverified = await prisma.user.findMany({
    where: { emailVerified: false, role: { not: "ADMIN" } },
    select: { id: true, email: true, firstName: true },
  });

  const newExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
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
