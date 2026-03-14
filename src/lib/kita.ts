import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface KitaFilters {
  q?: string;
  district?: string;
  minRating?: number;
  hasSpots?: boolean;
  openingHours?: "early" | "fullday" | "extended";
  page?: number;
  limit?: number;
}

export async function getKitas(filters: KitaFilters = {}) {
  const { q, district, minRating, hasSpots, openingHours, page = 1, limit = 18 } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.KitaWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { carrier: { contains: q, mode: "insensitive" } },
    ];
  }

  if (district) {
    where.district = { equals: district, mode: "insensitive" };
  }

  if (minRating) {
    where.rating = { gte: minRating };
  }

  if (hasSpots) {
    where.hasAvailableSpots = true;
  }

  // Opening time filter: format is "HH:MM-HH:MM"
  // String lte works lexicographically for HH:MM prefixes
  if (openingHours === "early") {
    // Opens by 7:30 — "07:30-..." < "07:31" lexicographically
    where.openingHours = { lte: "07:31", not: "" };
  }

  // Closing time filters need substring comparison — use $queryRaw to get matching IDs
  let closingTimeIds: string[] | null = null;
  if (openingHours === "fullday" || openingHours === "extended") {
    const threshold = openingHours === "fullday" ? "17:00" : "18:00";
    const rows = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM "Kita"
      WHERE opening_hours != ''
        AND SPLIT_PART(opening_hours, '-', 2) >= ${threshold}
    `;
    closingTimeIds = rows.map((r) => r.id);
  }

  if (closingTimeIds !== null) {
    where.id = { in: closingTimeIds };
  }

  const [kitas, total] = await Promise.all([
    prisma.kita.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ isParentFavorite: "desc" }, { rating: "desc" }, { reviewCount: "desc" }],
    }),
    prisma.kita.count({ where }),
  ]);

  return {
    kitas,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getDistrictsWithCounts() {
  const districts = await prisma.kita.groupBy({
    by: ["district"],
    _count: { id: true },
    where: { district: { not: "" } },
    orderBy: { district: "asc" },
  });

  return districts.map((d) => ({
    name: d.district,
    count: d._count.id,
  }));
}

export async function getLastKitaSyncDate(): Promise<Date | null> {
  const latest = await prisma.kita.findFirst({
    orderBy: { updatedAt: "desc" },
    select: { updatedAt: true },
  });
  return latest?.updatedAt ?? null;
}
