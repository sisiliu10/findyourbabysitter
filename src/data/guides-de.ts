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
  "first-meetup-babysitter": {
    title: "Das erste Treffen mit einem Babysitter",
    metaTitle: "Erstes Treffen mit Babysitter | Eltern-Guide | Berlin Babysitter",
    metaDescription:
      "So arrangierst du ein erstes Kennenlernen mit einem neuen Babysitter in Berlin. Was du fragen solltest, was du zeigen solltest und wie du weißt, ob die Chemie stimmt.",
    intro:
      "Einen Babysitter zu engagieren ist genauso eine Frage des Vertrauens wie der Logistik. Bevor du die Schlüssel übergibst, kann ein kurzes persönliches Kennenlernen alles verraten, was du wissen musst. So machst du dieses erste Treffen sinnvoll — für dich, deine Kinder und den Sitter.",
    sections: [
      {
        heading: "Erst ein Kaffee, dann die Buchung",
        content:
          "Widerstehe dem Impuls, sofort einen Termin einzuplanen. Schreibe dem Sitter über die Plattform, stell dich vor und schlage ein 30-minütiges Treffen oder einen Hausbesuch vor, bevor du dich zu etwas verpflichtest. Dieses entspannte Kennenlernen lässt alle zur Ruhe kommen und ein Gefühl füreinander entwickeln — ohne den Druck, dass der Job schon besiegelt ist. Die meisten Sitter auf Berlin Babysitter machen das gerne mit — es liegt auch in ihrem Interesse.",
        items: [
          "Halte es kurz — 20 bis 30 Minuten reichen. Du führst kein Bewerbungsgespräch, du lernst jemanden kennen.",
          "Triff dich wenn möglich bei dir zu Hause. Das ist die Umgebung, in der der Sitter arbeiten wird, und deine Kinder können sich natürlich eingewöhnen.",
          "Wenn ein Cafe für dich besser passt, wähle etwas Ruhiges in deiner Nähe.",
        ],
      },
      {
        heading: "Deine Kinder sollten dabei sein",
        content:
          "Das ist der wichtigste Teil. Wie ein Sitter in den ersten zehn Minuten mit deinen Kindern umgeht, verrät dir mehr als jede Nachricht hin und her. Achte darauf, ob er oder sie Augenkontakt mit den Kindern sucht, sich auf deren Augenhöhe begibt oder ihnen folgt — diese kleinen Signale zählen.",
        items: [
          "Leg das Treffen nicht in die Schlaf- oder Essenszeit. Die Kinder sollten wach, ausgeruht und in neutraler Stimmung sein.",
          "Lass die Interaktion natürlich entstehen. Versuche nicht, sie zu inszenieren oder deine Kinder zu Höchstleistungen zu animieren.",
          "Es ist völlig normal, dass jüngere Kinder schüchtern oder anhänglich sind. Achte darauf, wie der Sitter damit umgeht — Geduld und Ruhe sind gute Zeichen.",
          "Wenn dein Kind sich schnell öffnet und Interesse zeigt, nimm das ebenfalls wahr. Kinder sind oft bessere Menschenkenner, als wir denken.",
        ],
      },
      {
        heading: "Zeig ihnen deine Wohnung",
        content:
          "Eine kurze Führung dauert fünf Minuten und macht alles einfacher. Zeig dem Sitter, wo was ist, damit er oder sie sich auf deine Kinder konzentrieren kann, anstatt im Ernstfall zu suchen.",
        items: [
          "Notfallkontakte — deine Nummer, eine Backup-Nummer und die nächste Kinderarztpraxis.",
          "Wo der Verbandskasten ist.",
          "Snacks und Mahlzeiten — was die Kinder essen dürfen, Allergien oder Unverträglichkeiten.",
          "Das Schlafenszeit-Paket — Pyjama-Schublade, Lieblingskuscheltier, wo das Nachtlicht ist.",
          "Hausregeln — Bildschirmzeiten, Grenzen beim Draußenspielen, was nicht verhandelbar ist.",
        ],
      },
      {
        heading: "Sinnvolle Fragen",
        content:
          "Du brauchst keine formelle Fragenliste. Aber ein paar natürliche Fragen helfen dir zu verstehen, wie der Sitter denkt und ob eure Vorstellungen von Kinderbetreuung zusammenpassen.",
        items: [
          "Wie gehst du normalerweise mit einem Kind um, das nicht ins Bett will?",
          "Gab es mal eine Situation mit einem Kind, die schwierig war? Wie hast du das gehandhabt?",
          "Was machst du gerne mit Kindern in diesem Alter?",
          "Sprichst du Deutsch, Englisch oder beides? (Relevant, wenn Sprache für dich wichtig ist.)",
          "Bist du für regelmäßige Buchungen verfügbar oder bevorzugst du Einzeltermine?",
        ],
      },
      {
        heading: "Die Probe-Buchung",
        content:
          "Nach einem guten Kennenlernen empfiehlt sich eine kurze Probe-Buchung — ein bis zwei Stunden — bevor du etwas Längeres planst. Erledige schnell einen Einkauf in der Nähe, bleib erreichbar und schau beim Zurückkommen kurz nach. Das gibt deinem Kind Zeit, sich zu gewöhnen, ohne dass du gleich für einen ganzen Abend weg bist.",
        items: [
          "Erkläre deinem Kind vorher ruhig, dass du bald wieder da bist — kurz und entspannt.",
          "Verabschiede dich ohne langes Drama. Kurze, sichere Verabschiedungen erleichtern es allen.",
          "Bitte den Sitter, dir nach 30 Minuten kurz zu schreiben, wenn du beruhigt sein möchtest.",
          "Debrief kurz nach der Rückkehr — frag, wie es lief, was die Kinder gemacht haben, ob etwas vorgefallen ist.",
        ],
      },
      {
        heading: "Vertrau deinem Bauchgefühl",
        content:
          "Nimm dir nach dem Treffen einen Moment für dich. Hat die Unterhaltung sich leicht angefühlt? Wirkten deine Kinder entspannt? War der Sitter wirklich interessiert oder hat er nur Pflichtprogramm gemacht? Ein gutes Match fühlt sich meistens offensichtlich an — und ein schlechtes auch. Du bist nach einem Kennenlernen zu nichts verpflichtet, und ein guter Sitter wird das verstehen.",
        items: [
          "Wenn sich etwas komisch angefühlt hat, du es aber nicht benennen kannst — vertrau diesem Gefühl. Du brauchst keinen konkreten Grund.",
          "Wenn dein Kind stark negativ reagiert hat, nimm das ernst — aber bedenke auch, ob es situationsbedingt war (müde, hungrig, überwältigt).",
          "Ein guter Sitter hat kein Problem damit, wenn du dir einen Tag Zeit nimmst. Wer dich zu einem sofortigen Ja drängt, ist ein Warnsignal.",
          "Wenn du das richtige Match gefunden hast, sag es. Positives Feedback ist für Sitter genauso wertvoll wie für dich.",
        ],
      },
    ],
  },
};
