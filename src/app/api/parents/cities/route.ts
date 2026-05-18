import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// Returns parent counts grouped by city so the city picker can show
// how many families are in each city.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false }, { status: 401 });

  const rows = await prisma.childcareRequest.groupBy({
    by: ["city"],
    where: {
      city: { not: "" },
      status: "OPEN",
      parent: { isDisabled: false, onboarded: true },
    },
    _count: { city: true },
    orderBy: { _count: { city: "desc" } },
  });

  const cities = rows
    .filter((r) => r.city.trim())
    .map((r) => ({ city: r.city, count: r._count.city }));

  return NextResponse.json({ success: true, data: cities });
}
