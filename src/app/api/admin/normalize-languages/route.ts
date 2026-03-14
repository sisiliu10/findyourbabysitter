import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { normalizeLanguages } from "@/lib/language-normalizer";

// POST /api/admin/normalize-languages
// One-time backfill: normalizes all babysitter profile language strings to canonical values.
export async function POST() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profiles = await prisma.babysitterProfile.findMany({
    select: { userId: true, languages: true },
  });

  let updated = 0;
  const changes: { userId: string; before: string; after: string }[] = [];

  for (const p of profiles) {
    const normalized = normalizeLanguages(p.languages);
    if (normalized !== p.languages) {
      await prisma.babysitterProfile.update({
        where: { userId: p.userId },
        data: { languages: normalized },
      });
      changes.push({ userId: p.userId, before: p.languages, after: normalized });
      updated++;
    }
  }

  return NextResponse.json({ total: profiles.length, updated, changes });
}
