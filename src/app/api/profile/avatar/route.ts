import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { saveAvatar } from "@/lib/upload";

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

    const avatarUrl = await saveAvatar(file);

    await prisma.user.update({
      where: { id: session.userId },
      data: { avatarUrl },
    });

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
