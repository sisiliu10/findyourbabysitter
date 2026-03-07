import { COLORING_PAGES_DE } from "./coloring-pages-de";

export interface ColoringPage {
  slug: string;
  title: string;
  description: string;
  fileName: string;
}

export const COLORING_PAGES: ColoringPage[] = [
  {
    slug: "bunny-garden",
    title: "Bunny in the Garden",
    description:
      "A cute bunny watering tulips on a sunny day. Flowers, clouds, and a butterfly — perfect for little hands.",
    fileName: "bunny-garden.jpg",
  },
  {
    slug: "jungle-animals",
    title: "Jungle Animals",
    description:
      "An elephant, giraffe, lion, and monkey hanging out in the jungle. So many animals to color!",
    fileName: "jungle-animals.jpg",
  },
  {
    slug: "rocket-space",
    title: "Rocket in Space",
    description:
      "A rocket blasting off into space with planets, stars, and a smiling moon. 3, 2, 1 — lift off!",
    fileName: "rocket-space.jpg",
  },
  {
    slug: "dinosaurs",
    title: "Dinosaurs",
    description:
      "Friendly dinosaurs playing together with a volcano, palm trees, and clouds. A prehistoric coloring adventure.",
    fileName: "dinosaurs.jpg",
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
