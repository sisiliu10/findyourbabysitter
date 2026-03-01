"use server";

import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function sendMessage(
  bookingId: string,
  content: string
): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const parsed = messageSchema.safeParse({ content });
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    if (booking.parentId !== session.userId && booking.sitterId !== session.userId) {
      return { success: false, error: "You are not a participant in this booking" };
    }

    const message = await prisma.message.create({
      data: {
        bookingId,
        senderId: session.userId,
        content: parsed.data.content,
      },
    });

    return { success: true, data: { messageId: message.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    };
  }
}
