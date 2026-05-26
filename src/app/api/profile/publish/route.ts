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

  await prisma.user.update({
    where: { id: session.userId },
    data: { isPublished: published },
  });

  return NextResponse.json({ success: true, isPublished: published });
}
