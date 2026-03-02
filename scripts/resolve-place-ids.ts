/**
 * One-time script to resolve Google Place IDs for all playgrounds.
 * Run: npx tsx scripts/resolve-place-ids.ts
 *
 * Uses Google Places API (New) Text Search endpoint.
 * Text Search (IDs Only) is free for first 10,000 req/month.
 */

import { PLAYGROUND_GUIDES } from "../src/data/playground-guides";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  console.error("Missing GOOGLE_PLACES_API_KEY or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY");
  process.exit(1);
}

interface PlaceResult {
  id: string;
  displayName?: { text: string };
  rating?: number;
  userRatingCount?: number;
}

async function resolvePlaceId(name: string, address: string): Promise<PlaceResult | null> {
  const query = `${name}, ${address}`;
  try {
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY!,
        "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount",
      },
      body: JSON.stringify({ textQuery: query }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`  API error for "${name}": ${res.status} ${text}`);
      return null;
    }

    const data = await res.json();
    return data.places?.[0] ?? null;
  } catch (err) {
    console.error(`  Fetch error for "${name}":`, err);
    return null;
  }
}

async function main() {
  console.log("Resolving Google Place IDs for all playgrounds...\n");

  const results: Record<string, string> = {};
  let resolved = 0;
  let failed = 0;

  for (const guide of PLAYGROUND_GUIDES) {
    console.log(`=== ${guide.districtName} ===`);

    // Fetch all 4 in parallel
    const promises = guide.playgrounds.map(async (pg) => {
      const place = await resolvePlaceId(pg.name, pg.address);
      if (place) {
        results[pg.name] = place.id;
        const ratingInfo = place.rating
          ? ` (${place.rating} stars, ${place.userRatingCount} reviews)`
          : "";
        console.log(`  ✓ "${pg.name}" -> ${place.id}${ratingInfo}`);
        resolved++;
      } else {
        console.log(`  ✗ "${pg.name}" -> NOT FOUND`);
        failed++;
      }
    });

    await Promise.all(promises);

    // Small delay between districts to be respectful to the API
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log(`\n--- Summary: ${resolved} resolved, ${failed} failed ---\n`);

  // Output in a copy-paste friendly format
  console.log("// Place IDs to add to playground-guides.ts:");
  for (const [name, placeId] of Object.entries(results)) {
    console.log(`  "${name}": "${placeId}",`);
  }
}

main().catch(console.error);
