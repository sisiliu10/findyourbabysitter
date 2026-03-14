import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { findMatchingSitters } from "@/lib/matching";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const request = await prisma.childcareRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return NextResponse.json(
        { success: false, error: "Request not found" },
        { status: 404 }
      );
    }

    if (request.parentId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to view matches for this request" },
        { status: 403 }
      );
    }

    const matches = await findMatchingSitters(id);

    return NextResponse.json({
      success: true,
      data: { matches },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to find matches" },
      { status: 500 }
    );
  }
}
