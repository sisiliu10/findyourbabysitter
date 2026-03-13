import { prisma } from "./prisma";
import { getTimeBucket } from "./utils";

export interface ScoredSitter {
  sitterId: string;
  score: number;
  matchReasons: string[];
  profile: {
    id: string;
    bio: string;
    hourlyRate: number;
    city: string;
    state: string;
    yearsExperience: number;
    hasFirstAid: boolean;
    hasCPR: boolean;
    hasTransportation: boolean;
    languages: string;
    ageRangeMin: number;
    ageRangeMax: number;
    availabilityJson: string;
    radiusMiles: number;
    latitude: number | null;
    longitude: number | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
}

export async function findMatchingSitters(requestId: string): Promise<ScoredSitter[]> {
  const request = await prisma.childcareRequest.findUnique({
    where: { id: requestId },
  });
  if (!request) throw new Error("Request not found");

  const children = JSON.parse(request.childrenJson) as Array<{ age?: number; ageRange?: string }>;
  // Support both legacy {age} and new {ageRange} child formats
  const childAges = children
    .map((c) => c.age ?? (c.ageRange ? parseInt(c.ageRange.split("-")[0]) : null))
    .filter((a): a is number => a !== null);
  const minAge = childAges.length > 0 ? Math.min(...childAges) : 0;
  const maxAge = childAges.length > 0 ? Math.max(...childAges) : 17;

  // Determine which day(s) to check availability against
  const recurringDayMap: Record<string, string> = {
    MON: "monday", TUE: "tuesday", WED: "wednesday", THU: "thursday",
    FRI: "friday", SAT: "saturday", SUN: "sunday",
  };
  let daysToCheck: string[] = [];
  if (request.dateNeeded) {
    daysToCheck = [new Date(request.dateNeeded).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()];
  } else if (request.recurringDays) {
    const codes = JSON.parse(request.recurringDays) as string[];
    daysToCheck = codes.map((c) => recurringDayMap[c]).filter(Boolean);
  }
  const timeBucket = getTimeBucket(request.startTime);

  const sitters = await prisma.babysitterProfile.findMany({
    where: {
      isActive: true,
      user: { isDisabled: false, role: "BABYSITTER" },
    },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
    },
  });

  const scored: ScoredSitter[] = [];

  for (const profile of sitters) {
    let score = 0;
    const reasons: string[] = [];

    if (
      profile.city.toLowerCase() === request.city.toLowerCase() &&
      profile.state.toLowerCase() === request.state.toLowerCase()
    ) {
      score += 30;
      reasons.push("Same city");
    }

    if (profile.latitude && profile.longitude && request.latitude && request.longitude) {
      const dist = haversineDistance(
        profile.latitude, profile.longitude,
        request.latitude, request.longitude
      );
      if (dist <= profile.radiusMiles) {
        score += 20;
        reasons.push(`Within ${Math.round(dist)}mi`);
      } else if (score === 0) {
        continue;
      }
    }

    const availability = JSON.parse(profile.availabilityJson) as Record<string, string[]>;
    const isAvailable = daysToCheck.some((day) => availability[day]?.includes(timeBucket));
    if (isAvailable) {
      score += 25;
      reasons.push("Available at requested time");
    }

    if (profile.ageRangeMin <= minAge && profile.ageRangeMax >= maxAge) {
      score += 15;
      reasons.push("Comfortable with children's ages");
    }

    if (request.maxHourlyRate && profile.hourlyRate <= request.maxHourlyRate) {
      score += 10;
      reasons.push("Within budget");
    }

    if (profile.yearsExperience >= 3) {
      score += 5;
      reasons.push(`${profile.yearsExperience}yr experience`);
    }

    if (profile.hasCPR) { score += 3; reasons.push("CPR certified"); }
    if (profile.hasFirstAid) { score += 3; reasons.push("First Aid certified"); }

    if (score > 0) {
      scored.push({ sitterId: profile.user.id, score, matchReasons: reasons, profile: profile as ScoredSitter["profile"] });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
