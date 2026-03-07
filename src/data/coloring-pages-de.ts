interface LocalizedColoringPage {
  title: string;
  description: string;
}

interface LocalizedAgeCategory {
  title: string;
  subtitle: string;
  description: string;
}

export const AGE_CATEGORIES_DE: Record<string, LocalizedAgeCategory> = {
  "little-explorers": {
    title: "Kleine Entdecker",
    subtitle: "1–3 Jahre",
    description:
      "Große, einfache Formen mit dicken Umrissen. Perfekt für kleine Hände, die gerade Buntstifte entdecken.",
  },
  kindergarten: {
    title: "Kindergartenkinder",
    subtitle: "3–5 Jahre",
    description:
      "Bekannte Berliner Wahrzeichen, vereinfacht zu lustigen Formen mit mittelgroßen Flächen zum Ausmalen.",
  },
  "school-age": {
    title: "Schulkinder",
    subtitle: "6–9 Jahre",
    description:
      "Detailliertere Szenen aus dem Berliner Leben mit kleineren Flächen und mehr Elementen zum Entdecken.",
  },
  "big-artists": {
    title: "Große Künstler",
    subtitle: "Ab 10 Jahre",
    description:
      "Komplexe, detaillierte Designs inspiriert von Berliner Kunst und Architektur. Eine echte Herausforderung.",
  },
};

export const COLORING_PAGES_DE: Record<string, LocalizedColoringPage> = {
  "berlin-bear-simple": {
    title: "Berliner Bär",
    description:
      "Ein freundlicher, runder Berliner Bär winkt zur Begrüßung. Großer, dicker Umriss — perfekt für das erste Malabenteuer.",
  },
  "tv-tower-simple": {
    title: "Fernsehturm",
    description:
      "Der Fernsehturm, wie du ihn noch nie gesehen hast — nur ein großer Kreis auf einem hohen Stiel. Einfach genug für die kleinsten Berliner.",
  },
  pretzel: {
    title: "Brezel",
    description:
      "Eine große, weiche Berliner Brezel mit dicken, leicht nachzuzeichnenden Kurven. Riecht nach Sonntagmorgen beim Bäcker.",
  },
  "u-bahn-train": {
    title: "U-Bahn",
    description:
      "Ein fröhlicher U-Bahn-Wagen rollt dahin. Zwei große Fenster und große runde Räder — die gelbe Linie war noch nie so einfach.",
  },
  "brandenburg-gate-simple": {
    title: "Brandenburger Tor",
    description:
      "Berlins berühmtestes Wahrzeichen, vereinfacht zu markanten Säulen und einem breiten Dach. Zähl die Pfeiler beim Ausmalen.",
  },
  ampelmaennchen: {
    title: "Ampelmännchen",
    description:
      "Das beliebte Ost-Berliner Ampelmännchen, unterwegs mit seinem Hut. Gib ihm deine Lieblingsfarben — er muss nicht grün bleiben.",
  },
  "double-decker-bus": {
    title: "Doppeldeckerbus",
    description:
      "Ein klassischer Berliner Doppeldeckerbus mit großen Fenstern voller fröhlicher Fahrgäste. Wer sitzt oben?",
  },
  "berlin-bear-crown": {
    title: "Berliner Bär mit Krone",
    description:
      "Der Berliner Bär fühlt sich heute königlich — mit Krone und einer kleinen Fahne. Königliche Farben erwünscht.",
  },
  "berlin-skyline": {
    title: "Berliner Skyline",
    description:
      "Die ganze Berliner Skyline vom Fernsehturm bis zur Oberbaumbrücke, über die ganze Seite. Wie viele Wahrzeichen kannst du entdecken?",
  },
  "zoo-animals": {
    title: "Zoo Berlin Tiere",
    description:
      "Ein Elefant, ein Panda und ein Flamingo zusammen — genau wie im Zoo Berlin. Der Panda isst natürlich Bambus.",
  },
  "mauerpark-scene": {
    title: "Mauerpark am Sonntag",
    description:
      "Ein sonniger Sonntag im Mauerpark — jemand singt Karaoke, es gibt einen Flohmarktstand, und Kinder klettern auf dem Hügel.",
  },
  "street-scene-bikes": {
    title: "Berliner Straße mit Fahrrädern",
    description:
      "Eine typische Berliner Seitenstraße mit geparkten Fahrrädern, einem Späti an der Ecke und einer Katze auf dem Fensterbrett. Sehr Berlin.",
  },
  "east-side-gallery": {
    title: "East Side Gallery",
    description:
      "Ein Abschnitt der East Side Gallery mit Platz, um dein eigenes Wandbild zu gestalten. Die Rahmen sind gezeichnet — die Kunst liegt bei dir.",
  },
  "brandenburg-gate-detailed": {
    title: "Brandenburger Tor mit Quadriga",
    description:
      "Das vollständige Brandenburger Tor in feinen Details — jede Säule, jedes Relief, und die Quadriga oben mit ihren vier Pferden.",
  },
  "museum-island": {
    title: "Museumsinsel",
    description:
      "Die fünf Museen der Museumsinsel von der Spree aus gesehen, mit der Kuppel des Berliner Doms dahinter. Für Architekturliebhaber.",
  },
  "kreuzberg-street-art": {
    title: "Kreuzberger Straßenkunst",
    description:
      "Eine Kreuzberger Hausfassade mit Graffiti-Umrissen, Stickern und Wheat-Paste-Kunst. Male die Straßenkunst auf deine Art.",
  },
};
