import type { Playground } from "@/data/playground-guides";

const PLACES_API_BASE = "https://places.googleapis.com/v1/places";

interface PlaceRating {
  rating: number;
  reviewCount: number;
}

/**
 * Fetch rating + review count for a single place via Place Details (New).
 * Uses Enterprise SKU: 1,000 free requests/month.
 */
async function fetchPlaceRating(placeId: string): Promise<PlaceRating | null> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(`${PLACES_API_BASE}/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`[google-places] Place Details failed for ${placeId}: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return {
      rating: data.rating ?? 0,
      reviewCount: data.userRatingCount ?? 0,
    };
  } catch (error) {
    console.error(`[google-places] Fetch error for ${placeId}:`, error);
    return null;
  }
}

/**
 * Fetch ratings for a list of playgrounds in parallel.
 * Returns a serializable record of playground name -> rating data.
 * Failed lookups are silently skipped (fallback data will be used).
 */
export async function fetchPlaygroundRatings(
  playgrounds: Playground[]
): Promise<Record<string, PlaceRating>> {
  const results: Record<string, PlaceRating> = {};

  await Promise.allSettled(
    playgrounds.map(async (pg) => {
      if (!pg.googlePlaceId) return;
      const rating = await fetchPlaceRating(pg.googlePlaceId);
      if (rating) {
        results[pg.name] = rating;
      }
    })
  );

  return results;
}
