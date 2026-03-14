/**
 * Berlin zip code (PLZ) prefix → district mapping.
 * Uses the first 3 digits of the 5-digit PLZ to determine the Bezirk/Kiez.
 */
const DISTRICT_MAP: Record<string, string> = {
  // Mitte
  "101": "Mitte",
  "102": "Mitte",
  // Friedrichshain
  "103": "Friedrichshain",
  // Prenzlauer Berg
  "104": "Prenzlauer Berg",
  // Pankow
  "105": "Pankow",
  // Weißensee
  "106": "Weißensee",
  // Reinickendorf / Tegel area
  "107": "Reinickendorf",
  // Spandau
  "108": "Spandau",
  // Kreuzberg
  "109": "Kreuzberg",
  "120": "Kreuzberg",
  "121": "Kreuzberg",
  // Tempelhof
  "122": "Tempelhof",
  // Steglitz
  "123": "Steglitz",
  "124": "Steglitz",
  // Zehlendorf
  "125": "Zehlendorf",
  // Schöneberg / Friedenau
  "126": "Schöneberg",
  // Charlottenburg
  "127": "Charlottenburg",
  "128": "Charlottenburg",
  // Wilmersdorf
  "129": "Wilmersdorf",
  // Tiergarten / Moabit
  "130": "Tiergarten",
  // Wedding
  "131": "Wedding",
  "132": "Wedding",
  // Tegel / Reinickendorf
  "133": "Reinickendorf",
  // Spandau
  "134": "Spandau",
  "135": "Spandau",
  "136": "Spandau",
  // Neukölln
  "137": "Neukölln",
  "138": "Neukölln",
  // Treptow
  "139": "Treptow",
  // Lichtenberg
  "140": "Lichtenberg",
  // Marzahn-Hellersdorf
  "141": "Marzahn-Hellersdorf",
  // Steglitz (Lichterfelde is a Kiez within Steglitz)
  "142": "Steglitz",
  // Zehlendorf / Wannsee
  "143": "Zehlendorf",
  // Buckow / Rudow (southern Neukölln)
  "144": "Neukölln",
  // Treptow-Köpenick
  "145": "Treptow-Köpenick",
  "146": "Treptow-Köpenick",
  // Marzahn-Hellersdorf
  "147": "Marzahn-Hellersdorf",
  // Hohenschönhausen / Lichtenberg
  "148": "Hohenschönhausen",
};

/**
 * Sorted unique list of all Berlin districts, for use in filter UIs.
 */
export const BERLIN_DISTRICTS: string[] = [
  ...new Set(Object.values(DISTRICT_MAP)),
].sort();

/**
 * Derives a Berlin district name from a German zip code (PLZ).
 * Returns the district name, or empty string if not a Berlin zip.
 */
export function getDistrictFromZip(zip: string): string {
  const clean = zip.replace(/\s/g, "");
  if (clean.length < 3) return "";
  const prefix = clean.slice(0, 3);
  return DISTRICT_MAP[prefix] || "";
}
