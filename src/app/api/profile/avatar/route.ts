import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { saveAvatar, deleteAvatar } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("avatar") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { avatarUrl: true },
    });

    const avatarUrl = await saveAvatar(file, session.userId);

    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
    });

    // Delete old avatar blob (fire-and-forget)
    if (currentUser?.avatarUrl) {
      deleteAvatar(currentUser.avatarUrl).catch(console.error);
    }

    return NextResponse.json({
      success: true,
      data: { avatarUrl },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to upload avatar" },
      { status: 500 }
    );
  }
}
