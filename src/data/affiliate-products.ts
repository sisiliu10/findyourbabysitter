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
    id: "baby-food-maker",
    nameEn: "Baby Food Maker",
    nameDe: "Babynahrung-Zubereiter",
    descEn: "Steam and blend fresh meals for your baby in minutes.",
    descDe: "Frische Babymahlzeiten in Minuten dampfgaren und pürieren.",
    icon: "🍲",
    url: "https://amzn.to/4s9OB1o",
    context: "booking",
  },
  {
    id: "baby-bouncer",
    nameEn: "Baby Bouncer",
    nameDe: "Babywippe",
    descEn: "Keeps baby calm and happy — a lifesaver for any caregiver.",
    descDe: "Hält das Baby ruhig und glücklich – ein Lebensretter für jede Betreuungsperson.",
    icon: "🪑",
    url: "https://amzn.to/4b6RKJq",
    context: "booking",
  },
  {
    id: "baby-play-gym",
    nameEn: "Baby Activity Gym",
    nameDe: "Baby Spielmatte",
    descEn: "Keeps babies entertained for hours — perfect for sitter visits.",
    descDe: "Hält Babys stundenlang beschäftigt – perfekt für die Betreuungszeit.",
    icon: "🎯",
    url: "https://amzn.to/4sbTl6Q",
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
    url: "https://amzn.to/4dmRo2F",
    context: "profile",
  },
  {
    id: "lego-duplo",
    nameEn: "LEGO DUPLO Starter Set",
    nameDe: "LEGO DUPLO Starter-Set",
    descEn: "Classic building fun — sitters and toddlers love it.",
    descDe: "Klassischer Bauspaß – Babysitterinnen und Kleinkinder lieben es.",
    icon: "🧱",
    url: "https://amzn.to/3P7S0zq",
    context: "profile",
  },
  {
    id: "white-noise-machine",
    nameEn: "White Noise Machine",
    nameDe: "Weißes-Rauschen-Gerät",
    descEn: "Helps babies nap longer — makes every sitter's job easier.",
    descDe: "Hilft Babys länger zu schlafen – erleichtert jeder Babysitterin die Arbeit.",
    icon: "🔊",
    url: "https://amzn.to/4btDcCx",
    context: "profile",
  },
];
