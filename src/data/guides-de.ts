import type { GuideSection } from "./guides";

interface LocalizedGuide {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  sections: GuideSection[];
}

export const GUIDES_DE: Record<string, LocalizedGuide> = {
  "kid-friendly-cafes-berlin": {
    title: "Kinderfreundliche Cafes in Berlin",
    metaTitle: "Kinderfreundliche Cafes in Berlin | Die besten Spots für Familien",
    metaDescription:
      "Die besten kinderfreundlichen Cafes in Berlin. Von Familien getestete Spots in Prenzlauer Berg, Kreuzberg und Mitte, wo Eltern entspannen können.",
    intro:
      "Ein Cafe in Berlin zu finden, in dem man tatsächlich seinen Kaffee austrinken kann, während die Kinder glücklich sind, ist eine Kunst. Berlin hat zum Glück viele Orte, die für Familien gemacht sind. Hier sind unsere Empfehlungen aus den familienfreundlichsten Vierteln.",
    sections: [
      {
        heading: "Prenzlauer Berg",
        content:
          "Prenzlauer Berg ist die unangefochtene Hauptstadt kinderfreundlicher Cafes in Berlin. Fast jede zweite Straße hat ein Lokal mit Spielecke, Hochstühlen und einer Speisekarte, die über Chicken Nuggets hinausgeht.",
        items: [
          "Cafe Kiezkind (Helmholtzplatz) — eigener Spielbereich mit Spielzeug und Büchern, Bio-Kindermenü und gute Flat Whites für Erwachsene.",
          "Anna Blume (Kollwitzstrasse) — berühmt für die Kombination aus Blumenladen und Cafe. Die Außenterrasse ist geräumig genug für Kinderwagen und die Kuchenauswahl macht alle glücklich.",
          "Cafe Liebling (Raumerstrasse) — gemütliches Kiezcafe mit kleiner Spielecke, selbstgemachten Kuchen und einer entspannten Atmosphäre.",
        ],
      },
      {
        heading: "Kreuzberg",
        content:
          "Kreuzbergs Cafe-Szene ist kreativ und multikulturell, und das gilt auch für die familienfreundlichen Optionen. Erwarten Sie weniger polierte Spielecken und mehr echte Community-Atmosphäre.",
        items: [
          "Cafe Rotstint (Graefestrasse) — geräumige Innenplätze, eine Kinderecke mit Malsachen und Wochenendbrunch, der lokale Familien anzieht.",
          "Five Elephant (Reichenberger Strasse) — erstklassiger Käsekuchen, Specialty Coffee und genug Platz zwischen den Tischen für einen Kinderwagen.",
          "Kindercafe Kreuzberg (Urbanstrasse) — ein richtiges Kindercafe mit großem Spielbereich, Bastelaktionen am Wochenende und einem vollständigen Menü für Erwachsene.",
        ],
      },
      {
        heading: "Mitte",
        content:
          "Mitte ist eleganter, hat aber versteckte Perlen für Eltern, die gutes Essen und Platz für Kinder suchen.",
        items: [
          "Bonanza Coffee (Oderberger Strasse) — kein Kindercafe per se, aber die großen Gemeinschaftstische und die entspannte Atmosphäre machen es kinderwagen-freundlich.",
          "House of Small Wonder (Johannisstrasse) — japanisch inspirierter Brunchspot mit ruhiger Atmosphäre, die überraschend gut mit älteren Kindern funktioniert.",
          "Cafe Fleury (Weinbergsweg) — Cafe im französischen Stil mit Außenplätzen in einer ruhigen Straße, Gebäck das Kinder lieben, und ein entspanntes Tempo.",
        ],
      },
      {
        heading: "Tipps für Cafe-Besuche mit Kindern",
        content: "Ein paar Dinge, die Cafe-Besuche mit Kindern in Berlin einfacher machen.",
        items: [
          "Besuchen Sie Cafes zwischen 9:30 und 11:00 Uhr, um dem Brunch-Ansturm zuvorzukommen — die meisten sind dann ruhiger und familienfreundlicher.",
          "Bringen Sie eine kleine Beschäftigungstasche mit (Buntstifte, Sticker), auch wenn das Cafe einen Spielbereich hat — Übergänge werden leichter.",
          "Prüfen Sie Google Maps Bewertungen auf aktuelle Erwähnungen von Spielbereichen — manche Cafes ändern sie saisonal.",
          "Viele Berliner Cafes akzeptieren nur Bargeld. Bringen Sie Euros mit, nur für den Fall.",
        ],
      },
    ],
  },
  "best-playgrounds-berlin": {
    title: "Die besten Spielplätze in Berlin",
    metaTitle: "Die besten Spielplätze in Berlin | Top-Spots für Kinder jeden Alters",
    metaDescription:
      "Ein Guide zu den besten Spielplätzen in Berlin für Kinder jeden Alters. Abenteuerspielplätze, Wasserspielplätze, Indoor-Optionen und Favoriten aus den Kiezen.",
    intro:
      "Berlin nimmt seine Spielplätze ernst. Von riesigen Abenteuerspielplätzen, auf denen Kinder mit echtem Werkzeug bauen, bis zu Wasserspielplätzen, die Sommernachmittage retten — hier sind die besten Spielplätze der Stadt.",
    sections: [
      {
        heading: "Abenteuerspielplätze",
        content:
          "Berlins Abenteuerspielplätze sind eine Welt für sich. Kinder können unter Aufsicht bauen, graben und mit echten Materialien experimentieren.",
        items: [
          "Kolle 37 (Prenzlauer Berg) — ein betreuter Abenteuerspielplatz, wo Kinder Nägel hämmern, Strukturen bauen und richtig dreckig werden. Ab 6 Jahren.",
          "Abenteuerspielplatz Waslala (Kreuzberg) — in einer Grünfläche am Kanal gelegen, mit Feuerstelle, Baubereich und Tieren. Kostenlos und betreut.",
          "Abenteuerspielplatz Marie (Wedding) — ein von der Gemeinschaft betriebener Ort mit Gartenbeeten, Tieren und Bauaktivitäten. Ideal für Schulkinder.",
        ],
      },
      {
        heading: "Wasserspielplätze",
        content:
          "Berliner Sommer verlangen nach Wasserspiel. Diese Spielplätze haben Spritzfontänen, Pumpen und Wasserkanäle, die Kinder stundenlang beschäftigen.",
        items: [
          "Plansche im Volkspark Friedrichshain — ein kostenloser Wasserspielplatz mit Fontänen und flachen Becken. An heißen Tagen voll, aber es lohnt sich.",
          "Wasserspielplatz Plansche (Plänterwald) — ein großer Wasserspielplatz im Park versteckt, mit Handpumpen und Sandkanälen. Weniger überlaufen als zentrale Optionen.",
          "Britzer Garten Wasserspielplatz (Neukölln) — im kostenpflichtigen Park gelegen, mit mehreren Stationen und gut gepflegt.",
        ],
      },
      {
        heading: "Indoor-Spielplätze",
        content:
          "Für Regentage oder kalte Berliner Winter sind Indoor-Spielplätze unverzichtbar. Das sind die Orte, die Eltern empfehlen.",
        items: [
          "Labyrinth Kindermuseum (Wedding) — interaktive Ausstellungen und physische Spielbereiche zu wechselnden Themen. Alter 3-11.",
          "ANOHA Kindermuseum (Mitte) — kostenlos, im Komplex des Jüdischen Museums. Eine riesige Arche Noah mit Kletter- und Sinnesaktivitäten. Vorher buchen.",
          "Bambooland (mehrere Standorte) — große Indoor-Spielplätze mit Klettergerüsten, Bällebädern und eigenen Kleinkindbereichen.",
        ],
      },
      {
        heading: "Kiez-Favoriten",
        content:
          "Jeder Berliner Kiez hat diesen einen Spielplatz, auf den die Einheimischen schwören. Hier sind einige, die herausstechen.",
        items: [
          "Spielplatz Kollwitzplatz (Prenzlauer Berg) — schattig, zentral, umgeben von Cafes. Der soziale Treffpunkt für lokale Eltern.",
          "Drachenspielplatz (Friedrichshain) — ein Drachen-Spielplatz in der Nähe des Volksparks mit Kletternetzen und Rutschen. Beliebt bei 4-10-Jährigen.",
          "Savignyplatz Spielplatz (Charlottenburg) — klein aber gepflegt, direkt am Platz mit Restaurants in der Nähe zum Auftanken nach dem Spielen.",
          "Görlitzer Park Spielplatz (Kreuzberg) — ein großer, gut ausgestatteter Spielplatz am Nordende des Parks mit Blick auf den Kanal.",
        ],
      },
    ],
  },
  "things-to-do-with-kids-berlin": {
    title: "Unternehmungen mit Kindern in Berlin",
    metaTitle: "Unternehmungen mit Kindern in Berlin | Familienaktivitäten & Ausflüge",
    metaDescription:
      "Die besten Unternehmungen mit Kindern in Berlin: Museen, Outdoor-Aktivitäten, saisonale Events und Ideen für Regentage. Von lokalen Eltern getestet.",
    intro:
      "Berlin ist eine der besten Städte Europas für Familien. Zwischen Weltklasse-Museen mit freiem Eintritt, riesigen Parks und einer Kultur, die Kinder wirklich willkommen heißt, gehen Ihnen die Ideen nie aus. Hier sind unsere getesteten Favoriten.",
    sections: [
      {
        heading: "Museen für Kinder",
        content:
          "Berlins Museen sind überraschend kinderfreundlich. Viele bieten freien Eintritt für Kinder, interaktive Ausstellungen und spezielle Programme für Familien.",
        items: [
          "Museum für Naturkunde (Mitte) — allein das Dinosaurierskelett im Eingangsbereich ist den Besuch wert. Interaktive Ausstellungen halten Kinder stundenlang beschäftigt.",
          "Deutsches Technikmuseum (Kreuzberg) — Züge, Flugzeuge, Schiffe und ein interaktives Science Center. Planen Sie mindestens einen halben Tag ein.",
          "ANOHA Kindermuseum (Mitte) — ein kostenloses interaktives Museum für Kinder unter 11 im Jüdischen Museum. Tickets online im Voraus buchen.",
          "Legoland Discovery Centre (Potsdamer Platz) — kleiner als erwartet, aber die Baustationen und das 4D-Kino machen es lohnenswert für 3-10-Jährige.",
        ],
      },
      {
        heading: "Outdoor-Aktivitäten",
        content:
          "Berlin hat mehr Grünfläche als fast jede andere europäische Hauptstadt. So nutzen Sie sie am besten mit Kindern.",
        items: [
          "Tempelhofer Feld — mieten Sie Lastenräder oder bringen Sie eigene Räder mit und fahren Sie auf den alten Flughafenbahnen. Flach, autofrei und riesig.",
          "Tiergarten — der Zentralpark Berlins. Mieten Sie ein Ruderboot auf dem See, besuchen Sie den Spielplatz oder spazieren Sie einfach durch die Wege.",
          "Britzer Garten (Neukölln) — ein kostenpflichtiger Park mit einer Miniatureisenbahn, Spielplätzen und wunderschönen Gärten. Ruhiger als der Tiergarten.",
          "Bootsfahrten auf der Spree — mehrere Anbieter bieten familienfreundliche Flussrundfahrten an. Kinder lieben es, an Deck zu sitzen und den Leuten auf den Brücken zuzuwinken.",
        ],
      },
      {
        heading: "Saisonale Highlights",
        content:
          "Berlin verwandelt sich mit den Jahreszeiten, und es gibt immer etwas Besonderes für Familien.",
        items: [
          "Weihnachtsmärkte (November-Dezember) — Gendarmenmarkt und Kulturbrauerei sind die familienfreundlichsten. Karussellfahrten und heiße Schokolade inklusive.",
          "Karneval der Kulturen (Mai/Juni) — ein Straßenumzug in Kreuzberg mit Musik, Tanz und Essen aus aller Welt. Kinder lieben die Kostüme.",
          "FEZ Berlin (Wuhlheide) — Europas größtes Kinder- und Jugendfreizeitzentrum mit ganzjährig wechselnden Programmen. Schwimmen, Theater und Workshops.",
          "Langer Tag der Stadtnatur (Juni) — ein stadtweites Naturfestival mit geführten Wanderungen, Tierbegegnungen und Gartenbesuchen. Viele Veranstaltungen sind kostenlos.",
        ],
      },
      {
        heading: "Ideen für Regentage",
        content:
          "Berliner Wetter ist unberechenbar. Hier sind zuverlässige Indoor-Optionen, wenn es regnet.",
        items: [
          "Labyrinth Kindermuseum (Wedding) — interaktive Ausstellungen mit Bewegung und Spiel. Perfekt für 3-11-Jährige.",
          "Stadtbibliothek (jede Filiale) — Berlins öffentliche Bibliotheken haben ausgezeichnete Kinderabteilungen mit Leseecken und regelmäßigen Vorlesestunden auf Deutsch und Englisch.",
          "Hallenbäder — Stadtbad Neukölln und Schwimmhalle Fischerinsel sind familienfreundliche Bäder mit Rutschen und warmem Wasser.",
          "Boulderhallen — BoulderKlub und Bright Site haben Kinderbereiche und Familien-Sessions am Wochenende.",
        ],
      },
    ],
  },
};
