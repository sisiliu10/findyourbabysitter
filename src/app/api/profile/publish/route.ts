import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { onboarded: true, avatarUrl: true },
  });

  if (!user?.onboarded) {
    return NextResponse.json(
      { success: false, error: "Complete your profile first" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { isPublished: true },
  });

  return NextResponse.json({ success: true });
}
