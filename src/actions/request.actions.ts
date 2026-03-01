"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { createRequestSchema } from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function createRequest(formData: FormData): Promise<ActionResult> {
  let requestId: string | undefined;

  try {
    const session = await requireAuth();

    const raw = {
      title: formData.get("title") as string,
      description: (formData.get("description") as string) || undefined,
      dateNeeded: formData.get("dateNeeded") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      durationHours: parseFloat(formData.get("durationHours") as string),
      numberOfChildren: parseInt(formData.get("numberOfChildren") as string, 10),
      childrenJson: formData.get("childrenJson") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      zipCode: formData.get("zipCode") as string,
      maxHourlyRate: formData.get("maxHourlyRate")
        ? parseFloat(formData.get("maxHourlyRate") as string)
        : undefined,
      specialNotes: (formData.get("specialNotes") as string) || undefined,
    };

    const parsed = createRequestSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const data = parsed.data;

    const request = await prisma.childcareRequest.create({
      data: {
        parentId: session.userId,
        title: data.title,
        description: data.description || "",
        dateNeeded: new Date(data.dateNeeded),
        startTime: data.startTime,
        endTime: data.endTime,
        durationHours: data.durationHours,
        numberOfChildren: data.numberOfChildren,
        childrenJson: data.childrenJson,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        maxHourlyRate: data.maxHourlyRate ?? null,
        specialNotes: data.specialNotes || "",
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
