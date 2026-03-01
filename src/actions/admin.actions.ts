"use server";

import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/types";

export async function toggleUserDisabled(userId: string): Promise<ActionResult> {
  try {
    await requireRole(["ADMIN"]);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isDisabled: !user.isDisabled },
    });

    return { success: true, data: { isDisabled: !user.isDisabled } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle user status",
    };
  }
}
