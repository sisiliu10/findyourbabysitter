"use server";

import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  profileUpdateSchema,
  parentOnboardingSchema,
  sitterOnboardingSchema,
} from "@/lib/validators";
import type { ActionResult } from "@/types";

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const raw: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      if (["hourlyRate", "radiusMiles", "yearsExperience", "ageRangeMin", "ageRangeMax"].includes(key)) {
        raw[key] = parseFloat(value as string);
      } else if (["hasFirstAid", "hasCPR", "hasTransportation"].includes(key)) {
        raw[key] = value === "true" || value === "on";
      } else {
        raw[key] = value;
      }
    }

    const parsed = profileUpdateSchema.safeParse(raw);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const { firstName, lastName, phone, ...profileFields } = parsed.data;

    const userUpdate: Record<string, unknown> = {};
    if (firstName !== undefined) userUpdate.firstName = firstName;
    if (lastName !== undefined) userUpdate.lastName = lastName;
    if (phone !== undefined) userUpdate.phone = phone;

    if (Object.keys(userUpdate).length > 0) {
      await prisma.user.update({
        where: { id: session.userId },
        data: userUpdate,
      });
    }

    const babysitterFields = Object.entries(profileFields).reduce(
      (acc, [key, val]) => {
        if (val !== undefined) acc[key] = val;
        return acc;
      },
      {} as Record<string, unknown>
    );

    if (Object.keys(babysitterFields).length > 0) {
      const profile = await prisma.babysitterProfile.findUnique({
        where: { userId: session.userId },
      });

      if (profile) {
        await prisma.babysitterProfile.update({
          where: { userId: session.userId },
          data: babysitterFields,
        });
      }
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Profile update failed",
    };
  }
}

export async function completeOnboarding(formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.role === "BABYSITTER") {
      const raw: Record<string, unknown> = {};
      for (const [key, value] of formData.entries()) {
        if (["hourlyRate", "radiusMiles", "yearsExperience", "ageRangeMin", "ageRangeMax"].includes(key)) {
          raw[key] = parseFloat(value as string);
        } else if (["hasFirstAid", "hasCPR", "hasTransportation"].includes(key)) {
          raw[key] = value === "true" || value === "on";
        } else {
          raw[key] = value;
        }
      }

      const parsed = sitterOnboardingSchema.safeParse(raw);
      if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
      }

      const { phone, ...profileData } = parsed.data;

      await prisma.babysitterProfile.update({
        where: { userId: session.userId },
        data: profileData,
      });

      await prisma.user.update({
        where: { id: session.userId },
        data: { onboarded: true, phone: phone || user.phone },
      });
    } else {
      const raw = {
        phone: formData.get("phone") as string | undefined,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        zipCode: formData.get("zipCode") as string,
        childrenJson: formData.get("childrenJson") as string,
      };

      const parsed = parentOnboardingSchema.safeParse(raw);
      if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
      }

      await prisma.user.update({
        where: { id: session.userId },
        data: {
          onboarded: true,
          phone: parsed.data.phone || user.phone,
        },
      });
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Onboarding failed",
    };
  }

  redirect("/dashboard");
}
