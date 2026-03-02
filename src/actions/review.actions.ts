"use server";

import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators";
import { notifyReviewSubmitted } from "@/lib/email";
import type { ActionResult } from "@/types";

export async function submitReview(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const raw = {
      bookingId: formData.get("bookingId") as string,
      rating: parseInt(formData.get("rating") as string, 10),
      title: (formData.get("title") as string) || undefined,
      comment: (formData.get("comment") as string) || undefined,
    };

    const parsed = reviewSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { bookingId, rating, title, comment } = parsed.data;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.status !== "COMPLETED") {
      return { success: false, error: "Can only review completed bookings" };
    }

    if (booking.parentId !== session.userId) {
      return { success: false, error: "Only the parent can submit a review" };
    }

    const existingReview = await prisma.review.findUnique({
      where: { bookingId },
    });

    if (existingReview) {
      return { success: false, error: "A review has already been submitted for this booking" };
    }

    await prisma.$transaction([
      prisma.review.create({
        data: {
          bookingId,
          authorId: session.userId,
          subjectId: booking.sitterId,
          rating,
          title: title || "",
          comment: comment || "",
        },
      }),
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "REVIEWED" },
      }),
    ]);

    // Send email notification to sitter (fire-and-forget)
    const [sitter, parent] = await Promise.all([
      prisma.user.findUnique({ where: { id: booking.sitterId }, select: { email: true } }),
      prisma.user.findUnique({ where: { id: session.userId }, select: { firstName: true, lastName: true } }),
    ]);
    if (sitter && parent) {
      notifyReviewSubmitted(sitter.email, `${parent.firstName} ${parent.lastName}`, rating, bookingId).catch(console.error);
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to submit review",
    };
  }
}
