// ---------------------------------------------------------------------------
// Affiliate Products
// ---------------------------------------------------------------------------
// Replace the `url` values with your real Awin / Amazon Associates affiliate
// links once you've enrolled. Current URLs are Amazon.de search pages so the
// site is functional before you have tracking links.
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
}

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: "baby-monitor",
    nameEn: "Baby Monitor",
    nameDe: "Babyphone",
    descEn: "Keep an eye on your little one while your sitter is in charge.",
    descDe: "Behalte dein Kind im Blick, während die Babysitterin aufpasst.",
    icon: "📹",
    url: "https://amzn.to/4bkEtvx",
  },
  {
    id: "baby-food-maker",
    nameEn: "Baby Food Maker",
    nameDe: "Babynahrung-Zubereiter",
    descEn: "Steam and blend fresh meals for your baby in minutes.",
    descDe: "Frische Babymahlzeiten in Minuten dampfgaren und pürieren.",
    icon: "🍲",
    url: "https://amzn.to/4s9OB1o",
  },
  {
    id: "baby-bouncer",
    nameEn: "Baby Bouncer",
    nameDe: "Babywippe",
    descEn: "Keeps baby calm and happy — a lifesaver for any caregiver.",
    descDe: "Hält das Baby ruhig und glücklich – ein Lebensretter für jede Betreuungsperson.",
    icon: "🪑",
    url: "https://amzn.to/4b6RKJq",
  },
  {
    id: "baby-play-gym",
    nameEn: "Baby Activity Gym",
    nameDe: "Baby Spielmatte",
    descEn: "Keeps babies entertained for hours — perfect for sitter visits.",
    descDe: "Hält Babys stundenlang beschäftigt – perfekt für die Betreuungszeit.",
    icon: "🎯",
    url: "https://amzn.to/4sbTl6Q",
  },
  {
    id: "baby-carrier",
    nameEn: "Baby Carrier",
    nameDe: "Babytrage",
    descEn: "Hands-free comfort for your sitter and your baby.",
    descDe: "Freie Hände für die Babysitterin und Komfort für dein Baby.",
    icon: "🤱",
    url: "https://amzn.to/4sEU7sH",
  },
  {
    id: "travel-stroller",
    nameEn: "Lightweight Stroller",
    nameDe: "Leichter Buggy",
    descEn: "Compact and easy to fold — ideal for sitters on the go.",
    descDe: "Kompakt und leicht faltbar – ideal für Ausflüge mit der Babysitterin.",
    icon: "🛻",
    url: "https://amzn.to/4dmRo2F",
  },
  {
    id: "lego-duplo",
    nameEn: "LEGO DUPLO Starter Set",
    nameDe: "LEGO DUPLO Starter-Set",
    descEn: "Classic building fun — sitters and toddlers love it.",
    descDe: "Klassischer Bauspaß – Babysitterinnen und Kleinkinder lieben es.",
    icon: "🧱",
    url: "https://amzn.to/3P7S0zq",
  },
  {
    id: "white-noise-machine",
    nameEn: "White Noise Machine",
    nameDe: "Weißes-Rauschen-Gerät",
    descEn: "Helps babies nap longer — makes every sitter's job easier.",
    descDe: "Hilft Babys länger zu schlafen – erleichtert jeder Babysitterin die Arbeit.",
    icon: "🔊",
    url: "https://amzn.to/4btDcCx",
  },
];
