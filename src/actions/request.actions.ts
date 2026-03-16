"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createRequestSchema } from "@/lib/validators";
import { canCreateRequest } from "@/lib/subscription";
import type { ActionResult } from "@/types";
import { notifyBookingAccepted, type BookingEmailData } from "@/lib/email";

function generateTitle(
  careType: string,
  careCategory?: string,
  numberOfChildren?: number
): string {
  const catLabels: Record<string, string> = {
    after_school: "After school care",
    full_day: "Full day care",
    overnight: "Overnight care",
    date_night: "Date night babysitting",
    other: "Childcare",
  };
  const catLabel = careCategory ? (catLabels[careCategory] ?? "Childcare") : "Childcare";
  const freq = careType === "recurring" ? "Recurring" : "One-time";
  const n = numberOfChildren ?? 1;
  const childWord = n === 1 ? "1 child" : `${n} children`;
  return `${freq} ${catLabel} — ${childWord}`;
}

export async function createRequest(formData: FormData): Promise<ActionResult> {
  let requestId: string | undefined;

  try {
    const session = await requireAuth();

    const raw = {
      careType: formData.get("careType") as string,
      careCategory: (formData.get("careCategory") as string) || undefined,
      recurringDays: (formData.get("recurringDays") as string) || undefined,
      dateNeeded: (formData.get("dateNeeded") as string) || undefined,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      durationHours: parseFloat(formData.get("durationHours") as string),
      numberOfChildren: parseInt(formData.get("numberOfChildren") as string, 10),
      childrenJson: formData.get("childrenJson") as string,
      city: formData.get("city") as string,
      zipCode: formData.get("zipCode") as string,
      description: (formData.get("description") as string) || undefined,
      maxHourlyRate: formData.get("maxHourlyRate")
        ? parseFloat(formData.get("maxHourlyRate") as string)
        : undefined,
    };

    const parsed = createRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    // Check request limit for free parents
    const check = await canCreateRequest(session.userId);
    if (!check.allowed) {
      return { success: false, error: "upgrade_required" };
    }

    const title = generateTitle(data.careType, data.careCategory, data.numberOfChildren);

    const request = await prisma.childcareRequest.create({
      data: {
        parentId: session.userId,
        title,
        description: data.description || "",
        careType: data.careType,
        careCategory: data.careCategory ?? null,
        recurringDays: data.recurringDays ?? null,
        dateNeeded: data.dateNeeded ? new Date(data.dateNeeded) : null,
        startTime: data.startTime,
        endTime: data.endTime,
        durationHours: data.durationHours,
        numberOfChildren: data.numberOfChildren,
        childrenJson: data.childrenJson,
        city: data.city,
        state: "Berlin",
        zipCode: data.zipCode,
        maxHourlyRate: data.maxHourlyRate ?? null,
        specialNotes: "",
      },
    });

    requestId = request.id;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create request",
    };
  }

  redirect(`/requests/${requestId}`);
}

export async function expressInterest(requestId: string): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    if (session.role !== "BABYSITTER") {
      return { success: false, error: "Only sitters can express interest" };
    }

    const request = await prisma.childcareRequest.findUnique({
      where: { id: requestId },
    });

    if (!request || request.status !== "OPEN") {
      return { success: false, error: "Request not found or no longer open" };
    }

    const existing = await prisma.booking.findUnique({
      where: { requestId_sitterId: { requestId, sitterId: session.userId } },
    });
    if (existing) {
      return { success: false, error: "already_expressed" };
    }

    const profile = await prisma.babysitterProfile.findUnique({
      where: { userId: session.userId },
      select: { hourlyRate: true },
    });

    const agreedRate = profile?.hourlyRate ?? 0;

    if (agreedRate === 0) {
      return { success: false, error: "no_rate" };
    }

    const totalEstimated = agreedRate * request.durationHours;

    const booking = await prisma.booking.create({
      data: {
        requestId,
        parentId: request.parentId,
        sitterId: session.userId,
        dateBooked: request.dateNeeded ?? new Date(),
        startTime: request.startTime,
        endTime: request.endTime,
        agreedRate,
        totalEstimated,
        status: "ACCEPTED",
      },
    });

    // Notify parent that a sitter expressed interest (fire-and-forget)
    const [parent, sitter] = await Promise.all([
      prisma.user.findUnique({ where: { id: request.parentId }, select: { email: true, firstName: true, lastName: true } }),
      prisma.user.findUnique({ where: { id: session.userId }, select: { email: true, firstName: true, lastName: true } }),
    ]);
    if (parent && sitter) {
      const emailData: BookingEmailData = {
        bookingId: booking.id,
        dateBooked: booking.dateBooked,
        startTime: booking.startTime,
        endTime: booking.endTime,
        agreedRate: booking.agreedRate,
        parentName: `${parent.firstName} ${parent.lastName}`,
        parentEmail: parent.email,
        sitterName: `${sitter.firstName} ${sitter.lastName}`,
        sitterEmail: sitter.email,
      };
      notifyBookingAccepted(emailData).catch(console.error);
    }

    return { success: true, data: { bookingId: booking.id } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to express interest",
    };
  }
}

export async function deleteRequest(requestId: string): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const request = await prisma.childcareRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return { success: false, error: "Request not found" };
    }

    if (request.parentId !== session.userId) {
      return { success: false, error: "Not authorized to delete this request" };
    }

    await prisma.childcareRequest.delete({ where: { id: requestId } });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete request",
    };
  }

  revalidatePath("/requests");
  redirect("/requests");
}

export async function updateRequest(requestId: string, formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const request = await prisma.childcareRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return { success: false, error: "Request not found" };
    }

    if (request.parentId !== session.userId) {
      return { success: false, error: "Not authorized to edit this request" };
    }

    if (request.status !== "OPEN") {
      return { success: false, error: "Only open requests can be edited" };
    }

    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const city = formData.get("city") as string;
    const zipCode = formData.get("zipCode") as string;
    const description = formData.get("description") as string;
    const specialNotes = formData.get("specialNotes") as string;
    const maxHourlyRateRaw = formData.get("maxHourlyRate") as string;
    const maxHourlyRate = maxHourlyRateRaw ? parseFloat(maxHourlyRateRaw) : null;

    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const durationHours = Math.round(((eh * 60 + em) - (sh * 60 + sm)) / 60 * 10) / 10;

    await prisma.childcareRequest.update({
      where: { id: requestId },
      data: {
        startTime,
        endTime,
        durationHours: durationHours > 0 ? durationHours : request.durationHours,
        city,
        zipCode,
        description,
        specialNotes,
        maxHourlyRate,
      },
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update request",
    };
  }

  revalidatePath("/requests");
  revalidatePath(`/requests/${requestId}`);
  redirect(`/requests/${requestId}`);
}

export async function closeRequest(requestId: string): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const request = await prisma.childcareRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      return { success: false, error: "Request not found" };
    }

    if (request.parentId !== session.userId) {
      return { success: false, error: "Not authorized to close this request" };
    }

    await prisma.childcareRequest.update({
      where: { id: requestId },
      data: { status: "CLOSED" },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to close request",
    };
  }
}
