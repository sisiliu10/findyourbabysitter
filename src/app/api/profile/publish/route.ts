import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// POST { published: boolean } — toggle publish status
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const published: boolean = body.published ?? true;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { onboarded: true },
  });

  if (!user?.onboarded) {
    return NextResponse.json(
      { success: false, error: "incomplete_profile" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: { isPublished: published },
  });

  return NextResponse.json({ success: true, isPublished: published });
}
