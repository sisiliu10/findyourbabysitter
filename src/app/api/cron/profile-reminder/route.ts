import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyProfileReminder } from "@/lib/email";

export async function GET(request: Request) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

  // Find users who signed up 3–4 hours ago, verified email, but haven't completed their profile
  const users = await prisma.user.findMany({
    where: {
      createdAt: {
        gte: fourHoursAgo,
        lte: threeHoursAgo,
      },
      onboarded: false,
      emailVerified: true,
      role: { not: "ADMIN" },
    },
    select: {
      email: true,
      firstName: true,
      role: true,
    },
  });

  for (const user of users) {
    notifyProfileReminder(user.email, user.firstName, user.role).catch(console.error);
  }

  console.log(`[profile-reminder] Sent reminders to ${users.length} user(s)`);
  return NextResponse.json({ sent: users.length });
}
