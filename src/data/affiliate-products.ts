// ---------------------------------------------------------------------------
// Affiliate Products
// ---------------------------------------------------------------------------
// Replace the `url` values with your real Awin / Amazon Associates affiliate
// links once you've enrolled. Current URLs are Amazon.de search pages so the
// site is functional before you have tracking links.
//
// "booking" context  → first 4 products shown on the booking detail page
// "profile" context  → last 4 products shown on the sitter profile page
// ---------------------------------------------------------------------------

export interface AffiliateProduct {
  id: string;
  nameEn: string;
  nameDe: string;
  descEn: string;
  descDe: string;
  icon: string;
  /** ← Replace with your affiliate link */
  url: string;
  context: "booking" | "profile" | "both";
}

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  // --- Booking context (shown after booking is confirmed) ---
  {
    id: "baby-monitor",
    nameEn: "Baby Monitor",
    nameDe: "Babyphone",
    descEn: "Keep an eye on your little one while your sitter is in charge.",
    descDe: "Behalte dein Kind im Blick, während die Babysitterin aufpasst.",
    icon: "📹",
    url: "https://amzn.to/4bkEtvx",
    context: "booking",
  },
  {
    id: "first-aid-kit",
    nameEn: "First Aid Kit (Kids)",
    nameDe: "Erste-Hilfe-Set für Kinder",
    descEn: "Every home with kids should have one within easy reach.",
    descDe: "In jedem Kinderhaushalt sollte ein Erste-Hilfe-Set griffbereit sein.",
    icon: "🩹",
    url: "https://www.amazon.de/s?k=erste+hilfe+set+kinder", // ← replace with affiliate link
    context: "booking",
  },
  {
    id: "baby-proofing",
    nameEn: "Baby Proofing Kit",
    nameDe: "Kindersicherung-Set",
    descEn: "Socket covers, cabinet locks, and corner guards — peace of mind.",
    descDe: "Steckdosenschutz, Schrankschlösser, Kantenschutz – für ruhige Nerven.",
    icon: "🔒",
    url: "https://www.amazon.de/s?k=kindersicherung+set", // ← replace with affiliate link
    context: "booking",
  },
  {
    id: "diaper-bag",
    nameEn: "Diaper Bag",
    nameDe: "Wickeltasche",
    descEn: "A well-organised bag makes every outing with your sitter easier.",
    descDe: "Eine gut organisierte Tasche macht jeden Ausflug einfacher.",
    icon: "👜",
    url: "https://www.amazon.de/s?k=wickeltasche", // ← replace with affiliate link
    context: "booking",
  },

  // --- Profile context (shown on sitter profile page) ---
  {
    id: "baby-carrier",
    nameEn: "Baby Carrier",
    nameDe: "Babytrage",
    descEn: "Hands-free comfort for your sitter and your baby.",
    descDe: "Freie Hände für die Babysitterin und Komfort für dein Baby.",
    icon: "🤱",
    url: "https://amzn.to/4sEU7sH",
    context: "profile",
  },
  {
    id: "travel-stroller",
    nameEn: "Lightweight Stroller",
    nameDe: "Leichter Buggy",
    descEn: "Compact and easy to fold — ideal for sitters on the go.",
    descDe: "Kompakt und leicht faltbar – ideal für Ausflüge mit der Babysitterin.",
    icon: "🛻",
    url: "https://www.amazon.de/s?k=leichter+buggy+kinderwagen", // ← replace with affiliate link
    context: "profile",
  },
  {
    id: "organic-baby-food",
    nameEn: "Organic Baby Food",
    nameDe: "Bio-Babynahrung",
    descEn: "Healthy snacks and meals your sitter can grab in seconds.",
    descDe: "Gesunde Snacks und Mahlzeiten, die die Babysitterin schnell zur Hand hat.",
    icon: "🥣",
    url: "https://www.amazon.de/s?k=bio+babynahrung+glas", // ← replace with affiliate link
    context: "profile",
  },
  {
    id: "first-aid-book",
    nameEn: "Baby First Aid Book",
    nameDe: "Erste Hilfe beim Baby",
    descEn: "Clear, illustrated guide — reassuring for any caregiver.",
    descDe: "Klar bebilderte Anleitung – beruhigend für alle Betreuungspersonen.",
    icon: "📖",
    url: "https://www.amazon.de/s?k=erste+hilfe+beim+baby+buch", // ← replace with affiliate link
    context: "profile",
  },
];
