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
  easy: {
    title: "Einfach",
    subtitle: "Leicht",
    description:
      "Große, einfache Formen mit dicken Umrissen. Perfekt für kleine Hände, die gerade Buntstifte entdecken.",
  },
  medium: {
    title: "Mittel",
    subtitle: "Moderat",
    description:
      "Bekannte Berliner Wahrzeichen mit mehr Details und mittelgroßen Flächen zum Ausmalen.",
  },
  hard: {
    title: "Schwer",
    subtitle: "Detailliert",
    description:
      "Komplexe, detaillierte Szenen aus dem Berliner Leben. Viele kleine Flächen und feine Details — eine echte Herausforderung.",
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
