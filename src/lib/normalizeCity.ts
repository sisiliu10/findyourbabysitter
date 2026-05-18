import { GERMAN_CITIES } from "@/components/CityPicker";

// Normalize a string for fuzzy comparison: lowercase, remove accents, remove spaces/hyphens
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics (ü→u, ö→o, ä→a etc.)
    .replace(/[-\s]/g, "");
}

// Simple Levenshtein distance
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

/**
 * Maps any city string to a canonical city from GERMAN_CITIES.
 * Returns the matched city if confidence is high, otherwise returns the
 * original input (title-cased) so custom cities still work.
 */
export function normalizeCity(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return trimmed;

  const normInput = normalize(trimmed);

  // 1. Exact match (case-insensitive, accent-insensitive)
  const exact = GERMAN_CITIES.find((c) => normalize(c) === normInput);
  if (exact) return exact;

  // 2. Starts-with match (e.g. "Munch" → "München")
  const startsWith = GERMAN_CITIES.find((c) => normalize(c).startsWith(normInput) && normInput.length >= 3);
  if (startsWith) return startsWith;

  // 3. Fuzzy match via Levenshtein — only accept if distance ≤ 2 for short names, ≤ 3 for longer
  let bestCity = "";
  let bestDist = Infinity;
  for (const city of GERMAN_CITIES) {
    const nc = normalize(city);
    const maxDist = nc.length <= 5 ? 1 : nc.length <= 8 ? 2 : 3;
    const dist = levenshtein(normInput, nc);
    if (dist < bestDist && dist <= maxDist) {
      bestDist = dist;
      bestCity = city;
    }
  }
  if (bestCity) return bestCity;

  // 4. No match — return title-cased original so custom cities still work
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}
