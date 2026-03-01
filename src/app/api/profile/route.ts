import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { profileUpdateSchema } from "@/lib/validators";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { babysitterProfile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const { passwordHash: _, ...safeUser } = user;
  return NextResponse.json(safeUser);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Update user fields
  const userUpdates: Record<string, unknown> = {};
  if (body.firstName) userUpdates.firstName = body.firstName;
  if (body.lastName) userUpdates.lastName = body.lastName;
  if (body.phone !== undefined) userUpdates.phone = body.phone;
  if (body.birthday) userUpdates.birthday = new Date(body.birthday);

  // Mark as onboarded
  userUpdates.onboarded = true;

  await prisma.user.update({
    where: { id: session.userId },
    data: userUpdates,
  });

  // Update babysitter profile if applicable
  if (session.role === "BABYSITTER") {
    const profileData: Record<string, unknown> = {};
    const profileFields = [
      "bio", "hourlyRate", "city", "state", "zipCode", "radiusMiles",
      "yearsExperience", "languages", "ageRangeMin", "ageRangeMax",
      "hasFirstAid", "hasCPR", "hasTransportation", "availabilityJson",
      "latitude", "longitude",
    ];

    for (const field of profileFields) {
      if (body[field] !== undefined) {
        profileData[field] = body[field];
      }
    }

    if (Object.keys(profileData).length > 0) {
      await prisma.babysitterProfile.update({
        where: { userId: session.userId },
        data: profileData,
      });
    }
  }

  // For parents, store children in a future model or just mark onboarded
  // For MVP, children info is stored per-request, not on user profile

  const updatedUser = await prisma.user.findUnique({
    where: { id: session.userId },
    include: { babysitterProfile: true },
  });

  const { passwordHash: _, ...safeUser } = updatedUser!;
  return NextResponse.json(safeUser);
}
