import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// Returns parent counts per city — combines user.city and request cities
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  // Count parents by their stored city (most reliable)
  const userCityRows = await prisma.user.groupBy({
    by: ["city"],
    where: {
      role: "PARENT",
      isDisabled: false,
      onboarded: true,
      city: { not: "" },
    },
    _count: { city: true },
    orderBy: { _count: { city: "desc" } },
  });

  // Also count from childcare requests for parents without city set
  const requestCityRows = await prisma.childcareRequest.groupBy({
    by: ["city"],
    where: {
      city: { not: "" },
      status: "OPEN",
      parent: { isDisabled: false, onboarded: true, city: "" },
    },
    _count: { city: true },
    orderBy: { _count: { city: "desc" } },
  });

  // Merge both sources
  const map: Record<string, number> = {};
  for (const r of userCityRows) {
    const key = r.city.trim();
    if (key) map[key] = (map[key] || 0) + r._count.city;
  }
  for (const r of requestCityRows) {
    const key = r.city.trim();
    if (key) map[key] = (map[key] || 0) + r._count.city;
  }

  const cities = Object.entries(map)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({ success: true, data: cities });
}
