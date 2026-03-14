import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const state = searchParams.get("state");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");
    const day = searchParams.get("day");
    const timeSlot = searchParams.get("timeSlot");
    const hasCPR = searchParams.get("hasCPR");
    const hasFirstAid = searchParams.get("hasFirstAid");
    const language = searchParams.get("language");
    const sitterType = searchParams.get("sitterType");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(parseInt(searchParams.get("limit") || "20", 10), 100));
    const skip = (page - 1) * limit;

    const where: Prisma.BabysitterProfileWhereInput = {
      isActive: true,
      user: { isDisabled: false, role: "BABYSITTER", onboarded: true },
    };

    // SQLite doesn't support mode: "insensitive", so use contains for case-insensitive search
    if (city) where.city = { contains: city };
    if (state) where.state = { equals: state };

    if (minRate || maxRate) {
      where.hourlyRate = {};
      if (minRate) where.hourlyRate.gte = parseFloat(minRate);
      if (maxRate) where.hourlyRate.lte = parseFloat(maxRate);
    }

    if (hasCPR === "true") where.hasCPR = true;
    if (hasFirstAid === "true") where.hasFirstAid = true;
    if (language) where.languages = { contains: language, mode: "insensitive" };
    if (sitterType) where.sitterType = sitterType;

    const gender = searchParams.get("gender");
    if (gender) where.gender = gender;

    const district = searchParams.get("district");
    if (district) {
      where.user = {
        ...(where.user as Prisma.UserWhereInput),
        district: { equals: district, mode: "insensitive" },
      };
    }

    const [sitters, total] = await Promise.all([
      prisma.babysitterProfile.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
              birthday: true,
              district: true,
              lastSeenAt: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
      }),
      prisma.babysitterProfile.count({ where }),
    ]);

    // Post-filter by availability (day/timeSlot) since it is stored as JSON
    let filteredSitters = sitters;
    if (day || timeSlot) {
      filteredSitters = sitters.filter((sitter) => {
        try {
          const availability = JSON.parse(sitter.availabilityJson) as Record<string, string[]>;
          if (day && timeSlot) {
            return availability[day]?.includes(timeSlot);
          }
          if (day) {
            return availability[day] && availability[day].length > 0;
          }
          if (timeSlot) {
            return Object.values(availability).some((slots) => slots.includes(timeSlot));
          }
          return true;
        } catch {
          return false;
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        sitters: filteredSitters,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to search sitters" },
      { status: 500 }
    );
  }
}
