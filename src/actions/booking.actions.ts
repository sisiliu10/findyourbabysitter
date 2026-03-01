"use server";

import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validators";
import { STATUS_TRANSITIONS } from "@/lib/constants";
import type { ActionResult } from "@/types";

export async function createBooking(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const raw = {
      requestId: formData.get("requestId") as string,
      sitterId: formData.get("sitterId") as string,
      agreedRate: parseFloat(formData.get("agreedRate") as string),
      parentNotes: (formData.get("parentNotes") as string) || undefined,
    };

    const parsed = createBookingSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { requestId, sitterId, agreedRate, parentNotes } = parsed.data;

    const request = await prisma.childcareRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return { success: false, error: "Request not found" };
    }

    if (request.parentId !== session.userId) {
      return { success: false, error: "Not authorized to create a booking for this request" };
    }

    const existingBooking = await prisma.booking.findUnique({
      where: {
        requestId_sitterId: { requestId, sitterId },
      },
    });

    if (existingBooking) {
      return { success: false, error: "A booking already exists for this sitter and request" };
    }

    const totalEstimated = agreedRate * request.durationHours;

    const booking = await prisma.booking.create({
      data: {
        requestId,
        parentId: session.userId,
        sitterId,
        dateBooked: request.dateNeeded,
        startTime: request.startTime,
        endTime: request.endTime,
        agreedRate,
        totalEstimated,
        status: "PENDING",
        parentNotes: parentNotes || "",
      },
    });

    return { success: true, data: { bookingId: booking.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create booking",
    };
  }
}

export async function updateBookingStatus(
  bookingId: string,
  newStatus: string,
  reason?: string
): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    const transitions = STATUS_TRANSITIONS[booking.status];
    if (!transitions || !transitions[newStatus]) {
      return {
        success: false,
        error: `Cannot transition from ${booking.status} to ${newStatus}`,
      };
    }

    const allowedRoles = transitions[newStatus];
    const userRole =
      booking.parentId === session.userId
        ? "PARENT"
        : booking.sitterId === session.userId
          ? "BABYSITTER"
          : null;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return { success: false, error: "You are not authorized to make this status change" };
    }

    const updateData: Record<string, unknown> = { status: newStatus };

    if (newStatus === "DECLINED" && reason) {
      updateData.declinedReason = reason;
    }

    if (newStatus === "CANCELLED") {
      updateData.cancelledBy = session.userId;
      if (reason) updateData.cancelledReason = reason;
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: updateData,
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update booking status",
    };
  }
}
