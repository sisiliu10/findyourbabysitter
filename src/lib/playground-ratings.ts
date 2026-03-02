import { unstable_cache } from "next/cache";
import type { Playground } from "@/data/playground-guides";
import { fetchPlaygroundRatings } from "@/lib/google-places";

export interface PlaygroundWithLiveRating extends Playground {
  liveRating: number | null;
  liveReviewCount: number | null;
}

/**
 * Get playground data with live Google ratings for a district.
 * Cached for 7 days per district. Falls back to hardcoded data on failure.
 */
export async function getPlaygroundsWithRatings(
  districtSlug: string,
  playgrounds: Playground[]
): Promise<PlaygroundWithLiveRating[]> {
  const getCachedRatings = unstable_cache(
    async () => fetchPlaygroundRatings(playgrounds),
    [`playground-ratings-${districtSlug}`],
    {
      revalidate: 604800, // 7 days
      tags: ["playground-ratings", `playground-ratings-${districtSlug}`],
    }
  );

  let cachedRatings: Record<string, { rating: number; reviewCount: number }> = {};
  try {
    cachedRatings = await getCachedRatings();
  } catch (error) {
    console.error(`[playground-ratings] Cache fetch failed for ${districtSlug}:`, error);
  }

  return playgrounds.map((pg) => {
    const live = cachedRatings[pg.name];
    return {
      ...pg,
      liveRating: live?.rating ?? null,
      liveReviewCount: live?.reviewCount ?? null,
    };
  });
}
