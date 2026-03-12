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
  {
    slug: "pond-animals",
    title: "Pond Animals",
    description:
      "A happy frog on a lily pad, a turtle, a duck, and a fish — all gathered at a sunny pond. Dragonfly included.",
    fileName: "pond-animals.jpg",
  },
  {
    slug: "zoo",
    title: "Day at the Zoo",
    description:
      "An elephant, giraffe, monkey, and lion gathered at the ZOO sign. Lots of detail to color and explore.",
    fileName: "zoo.jpg",
  },
  {
    slug: "dino-world",
    title: "Dino World",
    description:
      "A tall brachiosaurus, a triceratops, and a pterodactyl soaring above palm trees and a volcano. Dino paradise.",
    fileName: "dino-world.jpg",
  },
  {
    slug: "dragon-castle",
    title: "Dragon & Castle",
    description:
      "A fierce but friendly dragon perched on top of a stone castle tower. Perfect for kids who love fantasy.",
    fileName: "dragon-castle.jpg",
  },
  {
    slug: "cozy-village",
    title: "Cozy Village",
    description:
      "Two charming cottages with flower boxes, a cobblestone path, birds on the roof, and a cat napping outside.",
    fileName: "cozy-village.jpg",
  },
  {
    slug: "bunny-reading",
    title: "Bunny Reading",
    description:
      "A cozy bunny curled up in an armchair reading a book, surrounded by houseplants and a full bookshelf.",
    fileName: "bunny-reading.jpg",
  },
  {
    slug: "easter-bunny",
    title: "Easter Bunny",
    description:
      "An adorable bunny sitting in a flower basket surrounded by Easter eggs, butterflies, and bees.",
    fileName: "easter-bunny.jpg",
  },
  {
    slug: "unicorn",
    title: "Unicorn",
    description:
      "A sweet unicorn with a flowing mane prancing through a sunny meadow with flowers. Pure magic to color.",
    fileName: "unicorn.jpg",
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
