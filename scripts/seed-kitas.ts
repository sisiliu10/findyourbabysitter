/**
 * Kita Seed Script — Intercepts HeyAva's Supabase API to get Berlin Kita data.
 *
 * Usage: npx tsx scripts/seed-kitas.ts
 *        npx tsx scripts/seed-kitas.ts --debug
 *
 * HeyAva uses Supabase Edge Functions (search-kitas) that return rich data.
 * This script opens the page, intercepts API responses, and stores results in our DB.
 */
import puppeteer from "puppeteer";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();
const DEBUG = process.argv.includes("--debug");

interface KitaData {
  heyAvaSlug: string;
  name: string;
  carrier: string;
  address: string;
  zipCode: string;
  district: string;
  photoUrl: string;
  rating: number;
  reviewCount: number;
  openingHours: string;
  capacity: number | null;
  minAge: string;
  hasAvailableSpots: boolean;
  isParentFavorite: boolean;
  hasJobs: boolean;
  latitude: number | null;
  longitude: number | null;
  phone: string;
  website: string;
  description: string;
}

function debugSave(label: string, data: any) {
  if (!DEBUG) return;
  const dir = path.join(process.cwd(), "scripts", "debug");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${label}.json`), JSON.stringify(data, null, 2));
}

function parseKita(item: any): KitaData | null {
  const name = (item.Einrichtungsname || "").trim();
  if (!name) return null;

  // Build slug from Profil_URL or Webflow_Slug
  let slug = item.Webflow_Slug || "";
  if (!slug && item.Profil_URL) {
    const m = item.Profil_URL.match(/\/e\/([^/?#]+)/);
    if (m) slug = m[1];
  }
  if (!slug) {
    slug = name
      .toLowerCase()
      .replace(/[äÄ]/g, "ae").replace(/[öÖ]/g, "oe").replace(/[üÜ]/g, "ue").replace(/ß/g, "ss")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  const street = (item["Straße"] || "").trim();
  const hausnummer = (item.Hausnummer || "").trim();
  const plz = String(item.PLZ || "").trim();
  const ort = (item.Ort || item.ort_name || item.gemeinde_name || "Berlin").trim();
  const district = item["Einrichtungsbezirk Name"] || item.hauptbezirk || item.subbezirk || "";

  const fullAddress = item.Full_Adress ||
    [street && hausnummer ? `${street} ${hausnummer}` : street, `${plz} ${ort}`.trim()]
      .filter(Boolean)
      .join(", ");

  // Photo
  let photoUrl = "";
  if (item.Header_image) {
    photoUrl = typeof item.Header_image === "string" ? item.Header_image : item.Header_image.url || "";
  }
  if (!photoUrl && item.Bilder) {
    const bilder = typeof item.Bilder === "string" ? item.Bilder : item.Bilder;
    if (Array.isArray(bilder) && bilder.length > 0) {
      photoUrl = typeof bilder[0] === "string" ? bilder[0] : bilder[0].url || "";
    }
  }

  // Rating from Google or parent reviews
  const rating = parseFloat(item.google_maps_rating || item.parent_overall_avg || "0") || 0;
  const reviewCount = parseInt(item.google_maps_reviews_count || item.parent_reviews_count || "0", 10) || 0;

  // Opening hours
  let openingHours = "";
  if (item.oeffnungszeit_von && item.oeffnungszeit_bis) {
    openingHours = `${item.oeffnungszeit_von}-${item.oeffnungszeit_bis}`;
  } else if (item.Oeffnungszeiten) {
    openingHours = String(item.Oeffnungszeiten);
  }

  // Capacity
  const capacity = parseInt(item.Plaetze || "0", 10) || null;

  // Min age
  let minAge = "";
  if (item.Aufnahmealter_ab != null) {
    const months = parseInt(String(item.Aufnahmealter_ab), 10);
    if (!isNaN(months)) {
      if (months < 12) minAge = `Ab ${months}. Monat`;
      else minAge = `Ab ${Math.round(months / 12)}. Jahr`;
    }
  }

  // Coordinates
  const lat = parseFloat(item.geo_ort_lat || "0") || null;
  const lng = parseFloat(item.geo_ort_lon || "0") || null;

  // Tags
  const hasAvailableSpots = !!(item.freie_plaetze || item.has_free_places);
  const isParentFavorite = !!(item.Featured || item.is_favorite);
  const hasJobs = !!(item.has_jobs || item.open_positions);

  return {
    heyAvaSlug: slug,
    name,
    carrier: (item["Trägername"] || "").trim(),
    address: fullAddress,
    zipCode: plz,
    district,
    photoUrl,
    rating: Math.min(5, Math.max(0, rating)),
    reviewCount,
    openingHours,
    capacity,
    minAge,
    hasAvailableSpots,
    isParentFavorite,
    hasJobs,
    latitude: lat && lat > 50 && lat < 55 ? lat : null,
    longitude: lng && lng > 12 && lng < 15 ? lng : null,
    phone: (item.Telefon || item.google_places_phone || "").trim(),
    website: (item.Website || "").trim(),
    description: (item.Kurzbeschreibung || item.Beschreibung || "").trim().slice(0, 500),
  };
}

async function main() {
  console.log("Starting HeyAva Berlin Kita scraper...");
  console.log(`  Debug: ${DEBUG}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
  );

  // Intercept search-kitas API responses
  const kitaResponses: any[] = [];

  page.on("response", async (response) => {
    const url = response.url();
    if (url.includes("search-kitas")) {
      try {
        const body = await response.json().catch(() => null);
        if (body && body.data && Array.isArray(body.data)) {
          kitaResponses.push(body);
          console.log(`  [api] Got ${body.data.length} kitas (total: ${body.total}, offset: ${body.offset})`);
        }
      } catch { /* ignore */ }
    }
  });

  console.log("Loading HeyAva kita search for Berlin...");
  await page.goto("https://www.heyava.de/kitasuche?search=Berlin", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  await new Promise((r) => setTimeout(r, 6000));

  // Dismiss cookie banner
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll("button"));
    const accept = btns.find((b) => (b.textContent || "").toUpperCase().includes("ALLE AKZEPTIEREN"));
    if (accept) (accept as HTMLElement).click();
  });
  await new Promise((r) => setTimeout(r, 1000));

  console.log(`\nCaptured ${kitaResponses.length} search-kitas responses`);

  // Parse the Berlin-specific response (the one with PLZ starting with 1)
  const allKitas: KitaData[] = [];

  for (const resp of kitaResponses) {
    for (const item of resp.data) {
      const plz = String(item.PLZ || "");
      // Filter for Berlin area (PLZ 10xxx-14xxx)
      if (plz.match(/^1[0-4]\d{3}$/)) {
        const kita = parseKita(item);
        if (kita) allKitas.push(kita);
      }
    }
  }

  console.log(`Parsed ${allKitas.length} Berlin kitas from initial load`);

  // Paginate to get more
  const totalFromApi = kitaResponses.length > 0 ? kitaResponses[kitaResponses.length - 1].total || 0 : 0;
  console.log(`Total kitas in API: ${totalFromApi}`);

  if (allKitas.length > 0 && totalFromApi > 200) {
    const maxPages = 15;
    for (let pageNum = 2; pageNum <= maxPages; pageNum++) {
      console.log(`\nClicking page ${pageNum}...`);
      kitaResponses.length = 0;

      const clicked = await page.evaluate((targetPage) => {
        // Find pagination buttons
        const allBtns = Array.from(document.querySelectorAll("button, a"));

        // Try "Weiter" first
        const weiter = allBtns.find((b) => (b.textContent || "").trim() === "Weiter");
        if (weiter) {
          (weiter as HTMLElement).click();
          return true;
        }

        // Try page number button
        const pageBtn = allBtns.find((b) => (b.textContent || "").trim() === String(targetPage));
        if (pageBtn) {
          (pageBtn as HTMLElement).click();
          return true;
        }

        // Try ">" or next arrow
        const arrow = allBtns.find((b) => {
          const t = (b.textContent || "").trim();
          return t === ">" || t === "›" || t === "→";
        });
        if (arrow) {
          (arrow as HTMLElement).click();
          return true;
        }

        return false;
      }, pageNum);

      if (!clicked) {
        console.log("  No pagination button found. Done.");
        break;
      }

      await new Promise((r) => setTimeout(r, 5000));

      let newKitas = 0;
      for (const resp of kitaResponses) {
        for (const item of resp.data) {
          const plz = String(item.PLZ || "");
          if (plz.match(/^1[0-4]\d{3}$/)) {
            const kita = parseKita(item);
            if (kita) {
              allKitas.push(kita);
              newKitas++;
            }
          }
        }
      }

      console.log(`  Got ${newKitas} Berlin kitas from page ${pageNum}`);
      if (newKitas === 0 && kitaResponses.length === 0) {
        console.log("  No new API calls. Done.");
        break;
      }
    }
  }

  await browser.close();

  // Deduplicate
  const uniqueMap = new Map<string, KitaData>();
  for (const kita of allKitas) {
    uniqueMap.set(kita.heyAvaSlug, kita);
  }
  const uniqueKitas = Array.from(uniqueMap.values());
  console.log(`\nTotal unique Berlin kitas: ${uniqueKitas.length}`);

  if (uniqueKitas.length > 0) {
    debugSave("parsed-kitas", uniqueKitas.slice(0, 5));
    console.log(`\nSample kita:`);
    const sample = uniqueKitas[0];
    console.log(`  Name: ${sample.name}`);
    console.log(`  Carrier: ${sample.carrier}`);
    console.log(`  Address: ${sample.address}`);
    console.log(`  District: ${sample.district}`);
    console.log(`  Rating: ${sample.rating} (${sample.reviewCount} reviews)`);
    console.log(`  Hours: ${sample.openingHours}`);
    console.log(`  Capacity: ${sample.capacity}`);
    console.log(`  Coords: ${sample.latitude}, ${sample.longitude}`);
    console.log(`  Photo: ${sample.photoUrl ? "yes" : "no"}`);
  }

  if (uniqueKitas.length === 0) {
    console.log("\nNo Berlin kitas found. The search might not be filtering for Berlin.");
    await prisma.$disconnect();
    return;
  }

  // Try Prisma first, fall back to Neon HTTP API
  console.log("\nUpserting into database...");
  let success = 0;
  let errors = 0;

  // Test DB connection
  let usePrisma = true;
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    console.log("  Prisma connection failed (port 5432 blocked). Using Neon HTTP API...");
    usePrisma = false;
  }

  if (usePrisma) {
    for (const kita of uniqueKitas) {
      try {
        await prisma.kita.upsert({
          where: { heyAvaSlug: kita.heyAvaSlug },
          create: { ...kita },
          update: {
            name: kita.name, carrier: kita.carrier, address: kita.address,
            zipCode: kita.zipCode, district: kita.district, photoUrl: kita.photoUrl,
            rating: kita.rating, reviewCount: kita.reviewCount, openingHours: kita.openingHours,
            capacity: kita.capacity, minAge: kita.minAge, hasAvailableSpots: kita.hasAvailableSpots,
            isParentFavorite: kita.isParentFavorite, hasJobs: kita.hasJobs,
            latitude: kita.latitude, longitude: kita.longitude,
            phone: kita.phone, website: kita.website, description: kita.description,
          },
        });
        success++;
      } catch (err: any) {
        errors++;
        if (errors <= 3) console.error(`  Error: ${kita.heyAvaSlug}: ${err.message}`);
      }
    }
  } else {
    // Use Neon HTTP SQL API (works over HTTPS, no port 5432 needed)
    const NEON_SQL_URL = "https://ep-summer-credit-ai1b9do8-pooler.c-4.us-east-1.aws.neon.tech/sql";
    const NEON_CONN = process.env.POSTGRES_URL || "";

    async function neonQuery(query: string, params: any[] = []) {
      const res = await fetch(NEON_SQL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Neon-Connection-String": NEON_CONN,
        },
        body: JSON.stringify({ query, params }),
      });
      return res.json();
    }

    for (const kita of uniqueKitas) {
      try {
        const id = `kita_${kita.heyAvaSlug.slice(0, 20)}_${Date.now().toString(36)}`;
        const now = new Date().toISOString();

        // Try INSERT, on conflict UPDATE
        const result = await neonQuery(
          `INSERT INTO "Kita" ("id", "heyAvaSlug", "name", "carrier", "address", "zipCode", "district",
            "latitude", "longitude", "phone", "website", "photoUrl", "rating", "reviewCount",
            "openingHours", "capacity", "minAge", "hasAvailableSpots", "isParentFavorite", "hasJobs",
            "description", "createdAt", "updatedAt")
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23)
          ON CONFLICT ("heyAvaSlug") DO UPDATE SET
            "name"=$3, "carrier"=$4, "address"=$5, "zipCode"=$6, "district"=$7,
            "latitude"=$8, "longitude"=$9, "phone"=$10, "website"=$11, "photoUrl"=$12,
            "rating"=$13, "reviewCount"=$14, "openingHours"=$15, "capacity"=$16, "minAge"=$17,
            "hasAvailableSpots"=$18, "isParentFavorite"=$19, "hasJobs"=$20,
            "description"=$21, "updatedAt"=$23`,
          [
            id, kita.heyAvaSlug, kita.name, kita.carrier, kita.address, kita.zipCode, kita.district,
            kita.latitude, kita.longitude, kita.phone, kita.website, kita.photoUrl,
            kita.rating, kita.reviewCount, kita.openingHours, kita.capacity, kita.minAge,
            kita.hasAvailableSpots, kita.isParentFavorite, kita.hasJobs,
            kita.description, now, now,
          ]
        );

        if (result.command === "INSERT") {
          success++;
        } else if (result.message) {
          errors++;
          if (errors <= 3) console.error(`  Error: ${kita.heyAvaSlug}: ${result.message}`);
        } else {
          success++;
        }
      } catch (err: any) {
        errors++;
        if (errors <= 3) console.error(`  Error: ${kita.heyAvaSlug}: ${err.message}`);
      }
    }
  }

  console.log(`\nDone! Upserted: ${success}, Errors: ${errors}`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal error:", err);
  prisma.$disconnect();
  process.exit(1);
});
