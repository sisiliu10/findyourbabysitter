import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface KitaFilters {
  q?: string;
  district?: string;
  minRating?: number;
  hasSpots?: boolean;
  page?: number;
  limit?: number;
}

export async function getKitas(filters: KitaFilters = {}) {
  const { q, district, minRating, hasSpots, page = 1, limit = 18 } = filters;
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
