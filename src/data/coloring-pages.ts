import { AGE_CATEGORIES_DE, COLORING_PAGES_DE } from "./coloring-pages-de";

export interface ColoringPage {
  slug: string;
  title: string;
  description: string;
  fileName: string;
  categoryId: string;
}

export interface AgeCategory {
  id: string;
  title: string;
  subtitle: string;
  ageRange: string;
  description: string;
}

export const AGE_CATEGORIES: AgeCategory[] = [
  {
    id: "easy",
    title: "Easy",
    subtitle: "Simple",
    ageRange: "",
    description:
      "Big, simple shapes with thick outlines. Perfect for tiny hands just discovering crayons.",
  },
  {
    id: "medium",
    title: "Medium",
    subtitle: "Moderate",
    ageRange: "",
    description:
      "Recognizable Berlin landmarks with more detail and medium-sized areas to color.",
  },
  {
    id: "hard",
    title: "Hard",
    subtitle: "Detailed",
    ageRange: "",
    description:
      "Complex, detailed scenes from Berlin life. Lots of small areas and fine details — a real challenge.",
  },
];

export const COLORING_PAGES: ColoringPage[] = [
  // Easy
  {
    slug: "berlin-bear-simple",
    title: "Berlin Bear",
    description:
      "A friendly, round Berlin bear waving hello. Big chunky outline — perfect for a first coloring adventure.",
    fileName: "berlin-bear-simple.svg",
    categoryId: "easy",
  },
  {
    slug: "tv-tower-simple",
    title: "TV Tower",
    description:
      "The Fernsehturm as you've never seen it — just a big circle on a tall stick. Simple enough for the smallest Berliners.",
    fileName: "tv-tower-simple.svg",
    categoryId: "easy",
  },
  {
    slug: "pretzel",
    title: "Pretzel",
    description:
      "A big, soft Berlin pretzel with thick, easy-to-follow curves. Smells like Sunday morning at the bakery.",
    fileName: "pretzel.svg",
    categoryId: "easy",
  },
  {
    slug: "u-bahn-train",
    title: "U-Bahn Train",
    description:
      "A cheerful U-Bahn carriage rolling along. Two big windows and big round wheels — the yellow line has never been this easy.",
    fileName: "u-bahn-train.svg",
    categoryId: "easy",
  },
  {
    slug: "ampelmaennchen",
    title: "Ampelmännchen",
    description:
      "The beloved East German traffic light man, walking with his hat. Give him your favorite colors — he doesn't have to stay green.",
    fileName: "ampelmaennchen.svg",
    categoryId: "easy",
  },
  {
    slug: "berlin-bear-crown",
    title: "Berlin Bear with Crown",
    description:
      "The Berlin bear is feeling fancy today — wearing a crown and holding a little flag. Royal colors encouraged.",
    fileName: "berlin-bear-crown.svg",
    categoryId: "easy",
  },

  // Medium
  {
    slug: "brandenburg-gate-simple",
    title: "Brandenburg Gate",
    description:
      "Berlin's most famous landmark, simplified into bold columns and a wide top. Count the pillars while you color.",
    fileName: "brandenburg-gate-simple.svg",
    categoryId: "medium",
  },
  {
    slug: "double-decker-bus",
    title: "Double-Decker Bus",
    description:
      "A classic Berlin double-decker bus with big windows full of happy passengers. Who's sitting on the top deck?",
    fileName: "double-decker-bus.svg",
    categoryId: "medium",
  },
  {
    slug: "zoo-animals",
    title: "Zoo Berlin Animals",
    description:
      "An elephant, a panda, and a flamingo hanging out together — just like at Zoo Berlin. The panda is eating bamboo, obviously.",
    fileName: "zoo-animals.svg",
    categoryId: "medium",
  },
  {
    slug: "berlin-skyline",
    title: "Berlin Skyline",
    description:
      "The whole Berlin skyline from the TV Tower to the Oberbaum Bridge, stretched across the page. How many landmarks can you spot?",
    fileName: "berlin-skyline.svg",
    categoryId: "medium",
  },
  {
    slug: "mauerpark-scene",
    title: "Mauerpark on Sunday",
    description:
      "A sunny Sunday at Mauerpark — someone is singing karaoke, there's a flea market stall, and kids are climbing on the hill.",
    fileName: "mauerpark-scene.svg",
    categoryId: "medium",
  },

  // Hard
  {
    slug: "street-scene-bikes",
    title: "Berlin Street with Bikes",
    description:
      "A typical Berlin side street with parked bikes, a Späti on the corner, and a cat sitting on a windowsill. Very Berlin.",
    fileName: "street-scene-bikes.svg",
    categoryId: "hard",
  },
  {
    slug: "east-side-gallery",
    title: "East Side Gallery",
    description:
      "A section of the East Side Gallery wall with space to design your own mural. The frames are drawn — the art is up to you.",
    fileName: "east-side-gallery.svg",
    categoryId: "hard",
  },
  {
    slug: "brandenburg-gate-detailed",
    title: "Brandenburg Gate with Quadriga",
    description:
      "The full Brandenburg Gate in fine detail — every column, every relief, and the Quadriga on top with its four horses charging forward.",
    fileName: "brandenburg-gate-detailed.svg",
    categoryId: "hard",
  },
  {
    slug: "museum-island",
    title: "Museum Island",
    description:
      "The five museums of Museum Island seen from the Spree, with the Berlin Cathedral dome rising behind. Architecture lovers, this one is for you.",
    fileName: "museum-island.svg",
    categoryId: "hard",
  },
  {
    slug: "kreuzberg-street-art",
    title: "Kreuzberg Street Art",
    description:
      "A Kreuzberg building facade covered in graffiti outlines, stickers, and wheat-paste art. Fill in the street art your way.",
    fileName: "kreuzberg-street-art.svg",
    categoryId: "hard",
  },
];

export function getColoringPage(
  slug: string,
  locale: string = "en"
): ColoringPage | undefined {
  const page = COLORING_PAGES.find((p) => p.slug === slug);
  if (!page) return undefined;
  if (locale === "de" && COLORING_PAGES_DE[slug]) {
    return { ...page, ...COLORING_PAGES_DE[slug] };
  }
  return page;
}

export function getAgeCategory(
  id: string,
  locale: string = "en"
): AgeCategory | undefined {
  const cat = AGE_CATEGORIES.find((c) => c.id === id);
  if (!cat) return undefined;
  if (locale === "de" && AGE_CATEGORIES_DE[id]) {
    return { ...cat, ...AGE_CATEGORIES_DE[id] };
  }
  return cat;
}
