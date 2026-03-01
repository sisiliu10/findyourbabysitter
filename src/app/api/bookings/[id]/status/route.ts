import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { STATUS_TRANSITIONS } from "@/lib/constants";

export async function PATCH(
  request: Request,
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
    const body = await request.json();
    const { status: newStatus, reason } = body;

    if (!newStatus) {
      return NextResponse.json(
        { success: false, error: "New status is required" },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    const transitions = STATUS_TRANSITIONS[booking.status];
    if (!transitions || !transitions[newStatus]) {
      return NextResponse.json(
        { success: false, error: `Cannot transition from ${booking.status} to ${newStatus}` },
        { status: 400 }
      );
    }

    const allowedRoles = transitions[newStatus];
    const userRole =
      booking.parentId === session.userId
        ? "PARENT"
        : booking.sitterId === session.userId
          ? "BABYSITTER"
          : null;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { success: false, error: "You are not authorized to make this status change" },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = { status: newStatus };

    if (newStatus === "DECLINED" && reason) {
      updateData.declinedReason = reason;
    }

    if (newStatus === "CANCELLED") {
      updateData.cancelledBy = session.userId;
      if (reason) updateData.cancelledReason = reason;
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to update status" },
      { status: 500 }
    );
  }
}
