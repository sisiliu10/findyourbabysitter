interface LocalizedPlaygroundGuide {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  closingNote: string;
  playgrounds: {
    description: string;
    highlights: string[];
  }[];
}

export const PLAYGROUND_GUIDE_DE: Record<string, LocalizedPlaygroundGuide> = {
  "prenzlauer-berg": {
    metaTitle: "Die besten Spielplätze in Prenzlauer Berg, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Prenzlauer Berg, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Prenzlauer Berg",
    intro:
      "Prenzlauer Berg ist eines der familienfreundlichsten Viertel Berlins, und seine Spielplätze spiegeln das wider. Vom sozialen Treffpunkt am Kollwitzplatz bis zum Abenteuerspielplatz in der Kollwitzstraße — hier sind die Orte, zu denen lokale Eltern immer wieder kommen.",
    closingNote:
      "Die Spielplätze in Prenzlauer Berg sind so familienorientiert wie das Viertel selbst. Ob Sie eine kurze Sandkasten-Session oder einen ganzen Nachmittag voller Abenteuer suchen — ein passender Ort ist immer in der Nähe. Und wenn Sie einen Babysitter brauchen, während Sie die Gegend erkunden, können wir Ihnen helfen.",
    playgrounds: [
      {
        description:
          "Das Herzstück der Familienszene in Prenzlauer Berg. Dieser schattige Spielplatz liegt mitten auf dem Kollwitzplatz und zieht Eltern aus dem ganzen Viertel an. Es gibt eine Kletter-Rutschen-Kombination für größere Kinder, Babyschaukeln für die Kleinen und einen Sandspielbereich, der Kleinkinder stundenlang beschäftigt.",
        highlights: [
          "Umgeben von Cafés, in denen Eltern einen Kaffee trinken können, während die Kinder spielen",
          "Samstags verwandelt der Wochenmarkt den Platz in einen Familienausflug",
          "Großzügiger Schatten durch alte Bäume, ideal für heiße Sommertage",
        ],
      },
      {
        description:
          "Ein entspannter Nachbarschaftsplatz mit einem gut ausgestatteten Spielplatz unter hohen alten Bäumen. Der Helmholtzplatz hat eine lockere Atmosphäre, die es leicht macht, einen ganzen Nachmittag hier zu verbringen. Kinder strömen zu den Klettergerüsten und Tischtennisplatten, während Eltern auf den Bänken plaudern.",
        highlights: [
          "Der sonntägliche Kinderflohmarkt ist eine Nachbarschaftstradition",
          "Tischtennisplatten und Freiflächen für ältere Kinder zum Toben",
          "Ruhiger und weniger überfüllt als der Kollwitzplatz, besonders unter der Woche",
        ],
      },
      {
        description:
          "Im ehemaligen Mauerstreifen gelegen, befindet sich der Spielplatz des Mauerparks neben einem der berühmtesten Sonntagsflohmärkte Berlins. Der Spielbereich ist großzügig mit Klettergerüsten, Schaukeln und viel Platz zum Rennen. Nach dem Spielen können Kinder die berühmten Karaoke-Sessions im Amphitheater beobachten.",
        highlights: [
          "Riesige Freifläche, die selten überfüllt wirkt",
          "Direkt neben dem Sonntagsflohmarkt und dem Karaoke-Amphitheater",
          "Grashügel perfekt für Picknicks nach dem Spielen",
        ],
      },
      {
        description:
          "Dieser betreute Abenteuerspielplatz ist etwas ganz Besonderes. Kinder können mit echtem Holz und Werkzeug bauen, einen Garten pflegen und auf Weisen spielen, die die meisten städtischen Spielplätze nicht erlauben. Er wird von ausgebildeten Betreuern geleitet, die Kindern beim Lernen durch praktisches Spiel helfen.",
        highlights: [
          "Kinder bauen echte Konstruktionen mit Holz, Nägeln und Werkzeug",
          "Betreut von geschultem Personal, nachmittags unter der Woche geöffnet",
          "Eine seltene Gelegenheit für Kinder, wirklich unstrukturiertes, kreatives Spiel zu erleben",
        ],
      },
    ],
  },
  kreuzberg: {
    metaTitle: "Die besten Spielplätze in Kreuzberg, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Kreuzberg, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Kreuzberg",
    intro:
      "Kreuzbergs Spielplätze passen zum Charakter des Viertels: vielfältig, kreativ und voller Leben. Von der imposanten Rutsche im Görlitzer Park bis zu den Spielbereichen am Landwehrkanal — das sind die Orte, die Kreuzberger Familien lieben.",
    closingNote:
      "Kreuzbergs Spielplätze sind so lebendig und abwechslungsreich wie das Viertel selbst. Von der Kanalruhe bis zum Parkabenteuer gibt es immer einen Ort in der Nähe, an dem Kinder ihre Energie loswerden können. Brauchen Sie einen Babysitter, der sich in der Gegend auskennt? Wir helfen Ihnen gerne.",
    playgrounds: [
      {
        description:
          "Eine der beeindruckendsten Rutschen Berlins befindet sich auf einem mondförmigen Hügel im Görlitzer Park. Lokal als ‚Görli' bekannt, bietet dieser bewaldete Parkabschnitt einen großen Spielbereich mit reichlich Schatten im Sommer. Die Rutsche ist ein Magnet für Kinder jeden Alters, und der umliegende Park bietet Platz zum Ballspielen oder Picknicken.",
        highlights: [
          "Riesige Rutsche in einen Landschaftshügel gebaut — ein Kreuzberger Wahrzeichen",
          "Bewaldetes Gebiet bietet natürlichen Schatten an heißen Tagen",
          "Viel offene Grünfläche rund um den Spielplatz zum Rennen und Spielen",
        ],
      },
      {
        description:
          "Ein charmanter kleiner Spielplatz zwischen Kreuzbergs belebten Straßen. Der Waldeck hat hölzerne Spielfiguren, eine Rutsche, Tischtennis, einen Basketballplatz und sogar einen Schachtisch. Es ist der perfekte Ort, an dem ältere und jüngere Kinder gleichermaßen etwas finden.",
        highlights: [
          "Multi-Aktivitäts-Bereich: Tischtennis, Basketball, Schach und Spielgeräte",
          "Hölzerne Spielfiguren verleihen jüngeren Kindern ein Märchenbuch-Gefühl",
          "Klein und eingezäunt, leicht die Kinder im Blick zu behalten",
        ],
      },
      {
        description:
          "Dieser großzügige grüne Platz in der Nähe der ehemaligen Mauer hat Klettergeräte, eine große Wiese und ein Planschbecken, das im Sommer geöffnet ist. Der Mariannenplatz ist einer jener seltenen Berliner Spielplätze, auf dem Kleinkinder und größere Kinder bequem nebeneinander spielen können.",
        highlights: [
          "Planschbecken (Plansche) im Sommer geöffnet — Badesachen mitbringen",
          "Große, flache Wiese ideal für Kleinkinder, die laufen lernen",
          "In der Nähe des Bethanien-Kunstzentrums — Kultur und Outdoor-Spiel kombiniert",
        ],
      },
      {
        description:
          "Ein Spielplatz am Kanal entlang des Landwehrkanals mit Kletterstrukturen, Sandbereichen und Blick aufs Wasser. Ein wunderbarer Ort für einen Nachmittag — Kinder spielen, während Eltern die vorbeifahrenden Boote beobachten. Der Park ist auch ein beliebter Spazierweg, ideal zum Kombinieren mit einem Bummel.",
        highlights: [
          "Lage am Wasser entlang des Landwehrkanals bietet eine friedliche Kulisse",
          "Lässt sich gut mit einem Kanalspaziergang oder einem Café-Stopp verbinden",
          "Sandbereiche und Kletterstrukturen für verschiedene Altersgruppen geeignet",
        ],
      },
    ],
  },
  friedrichshain: {
    metaTitle: "Die besten Spielplätze in Friedrichshain, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Friedrichshain, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Friedrichshain",
    intro:
      "Friedrichshains Spielplätze reichen vom ikonischen Drachen-Klettergerüst in der Schreinerstraße bis zu Abenteuerspielplätzen in einem der ältesten Parks Berlins. Hier sind die Orte, die lokale Familien am höchsten bewerten.",
    closingNote:
      "Von feuerspeienden Drachen bis zum Bauen mit echtem Werkzeug — Friedrichshains Spielplätze bieten für jedes Alter und Energielevel etwas. Wenn Sie neu im Viertel sind oder nur zu Besuch, sind das die Orte, mit denen Sie anfangen sollten.",
    playgrounds: [
      {
        description:
          "Der Drachenspielplatz ist eine Institution in Friedrichshain. Ein riesiges drachenförmiges Klettergerüst mit Rutschen dominiert den Platz, umgeben von einer Wasserpumpe, einem Sandbereich und einem komplett eingezäunten Gelände. Der Drachenkörper spendet im Sommer willkommenen Schatten, und das eingezäunte Design gibt Eltern Sicherheit.",
        highlights: [
          "Ikonisches Drachen-Klettergerüst — einer der meistfotografierten Spielplätze Berlins",
          "Komplett eingezäunt, sicher für Kleinkinder, die gerne auf Entdeckungsreise gehen",
          "Wasserpumpe zum Planschen und Sandspiel in wärmeren Monaten",
        ],
      },
      {
        description:
          "Ein Abenteuer-Themenspielplatz im ältesten öffentlichen Park Berlins. Das Spieldorf liegt neben Teichen und in der Nähe des berühmten Märchenbrunnens. Kinder können klettern, balancieren und die Holzstrukturen erkunden, während der umliegende Park Spazierwege und offene Wiesen bietet.",
        highlights: [
          "Im Volkspark Friedrichshain gelegen, Berlins ältestem öffentlichen Park",
          "Der nahegelegene Märchenbrunnen mit Märchenskulpturen ist einen Besuch wert",
          "Großzügige Parkanlage mit Teichen, Wegen und Picknickplätzen",
        ],
      },
      {
        description:
          "Der Spielplatz am ‚Boxi' ist ein Nachbarschaftsklassiker. Er ist eingezäunt mit Kletterstrukturen, Röhrenrutschen, Schaukeln, einer Wackelbrücke und einem großzügigen Planschbecken. Der Samstagsflohmarkt und Sonntagsbauernmarkt direkt nebenan machen es leicht, Spielen mit Einkaufen zu verbinden.",
        highlights: [
          "Planschbecken im Sommer geöffnet — eine Rettung an heißen Tagen",
          "Samstagsflohmarkt und Sonntagsbauernmarkt direkt auf dem Platz",
          "Eingezäunter Bereich mit Geräten für Kleinkinder und ältere Kinder",
        ],
      },
      {
        description:
          "Ein betreuter Abenteuerspielplatz, auf dem Kinder bauen, gärtnern und frei mit echten Materialien spielen können. Forcki ist während der Öffnungszeiten betreut und gibt Kindern die Art von praktischem, kreativem Spielerlebnis, das in der Stadt selten ist. Nachmittags während der Schulzeit geöffnet.",
        highlights: [
          "Betreut von geschultem Personal, sicher und ansprechend",
          "Kinder bauen mit Holz und gärtnern — wirklich praktisches Spielen",
          "Unter der Woche nachmittags während der Schulzeit geöffnet",
        ],
      },
    ],
  },
  neukoelln: {
    metaTitle: "Die besten Spielplätze in Neukölln, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Neukölln, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Neukölln",
    intro:
      "Neuköllns Spielplätze spiegeln den kreativen, multikulturellen Geist des Viertels wider. Von Flugzeug-Themen-Klettergerüsten am Tempelhof bis zum Tausendundeine-Nacht-Spielplatz in der Hasenheide — diese Spielbereiche haben Charakter.",
    closingNote:
      "Neuköllns Spielplätze haben Persönlichkeit. Ob Ihre Kinder Flugzeuge fliegen, Paläste erkunden oder einfach auf einem riesigen Flugfeld rennen wollen — es gibt einen passenden Ort. Suchen Sie einen Babysitter, der das Viertel kennt? Wir können helfen.",
    playgrounds: [
      {
        description:
          "Inspiriert vom benachbarten ehemaligen Flughafen Tempelhof, bietet dieser Flugzeug-Themenspielplatz Miniatur-Holzpropellerflugzeuge zum Klettern. Kinder lieben das Fliegen-Spielen, während Eltern den weiten Blick über das Tempelhofer Feld dahinter genießen.",
        highlights: [
          "Flugzeug-Thema passt wunderbar zur Geschichte des Flughafens Tempelhof",
          "Direkt am Eingang zum Tempelhofer Feld für Radfahren oder Drachensteigen nach dem Spielen",
          "Offene, luftige Lage mit guter Übersicht für Eltern",
        ],
      },
      {
        description:
          "Auch als Aladdin-Spielplatz bekannt, erweckt dieser wunderschön gestaltete Spielbereich Tausendundeine Nacht zum Leben. Die Geräte sind fantasievoll gestaltet, unter alten Bäumen gibt es reichlich Schatten, und ein Kiosk in der Nähe bedeutet, dass Eltern sich ein Getränk holen können, während die Kinder spielen.",
        highlights: [
          "Tausendundeine-Nacht-Thema lässt es sich wie ein Abenteuer anfühlen",
          "Ausgezeichneter Schatten durch alte Parkbäume",
          "Kiosk in der Nähe für Getränke und Snacks",
        ],
      },
      {
        description:
          "Ein Spielplatz in einem der schönsten versteckten Parks Berlins. Der Körnerpark ist ein versenktes neoklassizistisches Juwel mit Kaskadenbrunnen und gepflegten Rasenflächen. Der Spielbereich ist kleiner, aber die Parkumgebung macht ihn besonders — wie Spielen in einem Geheimgarten.",
        highlights: [
          "Im Körnerpark, einem der schönsten kleinen Parks Berlins",
          "Neoklassizistische Brunnen und gestaltete Terrassen umgeben den Spielbereich",
          "Ruhiger und weniger überfüllt als die meisten Neuköllner Spielplätze",
        ],
      },
      {
        description:
          "Spielbereiche auf dem weitläufigen ehemaligen Flugfeld mit speziellen Geräten für kleinere Kinder neben dem endlosen Freiraum, der Tempelhof einzigartig macht. Nach dem Spielplatz kann die ganze Familie auf den ehemaligen Landebahnen radfahren, skaten oder Drachen steigen lassen.",
        highlights: [
          "Endloser Freiraum zum Rennen, Radfahren und Drachensteigen nach dem Spielen",
          "Eine der einzigartigsten Kulissen Berlins — eine ehemalige Flughafenlandebahn",
          "Flaches Gelände perfekt für Fahrräder, Roller und kleine Beine, die laufen lernen",
        ],
      },
    ],
  },
  mitte: {
    metaTitle: "Die besten Spielplätze in Mitte, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Mitte, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Mitte",
    intro:
      "Einen guten Spielplatz im Berliner Zentrum zu finden ist nicht immer offensichtlich. Zwischen Touristenmassen und belebten Straßen sind das die Spielflächen, die Familien in Mitte tatsächlich nutzen — vom Wasserspielplatz am Weinbergsweg bis zum ruhigen Platz an der Zionskirche.",
    closingNote:
      "Mittes Spielplätze sind vielleicht kleiner als in Wohnvierteln, aber sie sind gut gelegen und beliebt. Perfekt für Familien, die zentral wohnen oder die Stadt erkunden.",
    playgrounds: [
      {
        description:
          "Ein Wasserspielplatz, auf dem Kinder den Wasserfluss steuern. Pumpmechanismen und Bewegungssensor-Sprinkler lassen Kinder Wasserströme durch Kanäle und über Hindernisse lenken. Er ist im Sommer täglich von etwa 10 bis 18 Uhr in Betrieb und einen Besuch an heißen Tagen absolut wert.",
        highlights: [
          "Interaktive Wasserspielgeräte, die Kinder selbst bedienen",
          "Im Sommer täglich geöffnet — der beste Heißwetter-Spielplatz in Mitte",
          "In einem grünen Park gleich neben dem belebten Weinbergsweg",
        ],
      },
      {
        description:
          "Ein zentraler Spielplatz an der Spree, direkt gegenüber der Museumsinsel. Kinder spielen auf Klettergerüsten und in Sandbereichen, während Eltern den Blick auf den Fluss genießen. Im Sommer verleiht die angrenzende Strandbar eine entspannte Urlaubsatmosphäre.",
        highlights: [
          "Blick auf die Spree mit der Museumsinsel als Kulisse",
          "Strandbar nebenan — fühlt sich wie ein Mini-Urlaub an",
          "Zentrale Lage, leicht erreichbar aus ganz Mitte",
        ],
      },
      {
        description:
          "Ein ruhiger, baumbestandener Nachbarschaftsspielplatz auf einem historischen Platz nahe der Zionskirche. Abseits des touristischen Trubels von Zentral-Mitte ist dies der Ort, an den lokale Familien für einen friedlichen Nachmittag kommen. Schaukeln, Rutschen, Klettergeräte und viel Schatten.",
        highlights: [
          "Einer der ruhigsten Spielplätze in Mitte — ein echtes Refugium",
          "Historischer Platz mit Gemeinschaftsatmosphäre",
          "Großzügiger Schatten durch alte Bäume",
        ],
      },
      {
        description:
          "Ein kleiner, aber gut gepflegter Spielbereich in der Nähe des S-Bahnhofs Hackescher Markt. Nicht der größte Spielplatz, aber durch seine zentrale Lage unglaublich praktisch für Familien, die das Stadtzentrum erkunden und eine schnelle Spielpause brauchen.",
        highlights: [
          "Wenige Schritte vom S-Bahnhof Hackescher Markt — der praktischste Spielplatz in Mitte",
          "Gut gepflegte Geräte auf kompaktem Raum",
          "Perfekt für eine schnelle Spielpause während eines Stadtbummels",
        ],
      },
    ],
  },
  charlottenburg: {
    metaTitle: "Die besten Spielplätze in Charlottenburg, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Charlottenburg, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Charlottenburg",
    intro:
      "Charlottenburgs Spielplätze verstecken sich in Schlossgärten, Seeparks und charmanten Wohnplätzen. Der etablierte, familienorientierte Charakter der Gegend zeigt sich in der Qualität und Vielfalt der Spielflächen.",
    closingNote:
      "Charlottenburgs Spielplätze haben eine gepflegte Qualität, die zum Viertel passt. Von Schlossgärten bis Piratenschiffen gibt es viel Abwechslung für Familien jeden Alters.",
    playgrounds: [
      {
        description:
          "Ein offener Sandspielplatz in den hinteren Gärten des Schlosses Charlottenburg. Das Schlossgelände bietet eine großartige Kulisse für den Alltag, und die Wiesen entlang der Spree sind perfekt für ein Picknick danach. Ein Spielplatzbesuch, der sich wie ein Ausflug anfühlt.",
        highlights: [
          "In den Gärten des Schlosses Charlottenburg gelegen — eine einzigartige Kulisse",
          "Wiesen entlang der Spree zum Picknicken nach dem Spielen",
          "Großzügig und selten überfüllt trotz der touristennahen Lage",
        ],
      },
      {
        description:
          "Ein Themenspielplatz entlang einer Seepromenade mit Strukturen in Form von Fischen und Fischerhütten. Der Park umschließt den Lietzensee und bietet einen wunderschönen Spaziergang mit Spielplatz-Stopp in der Mitte. Alte Bäume säumen die Wege und spenden Schatten.",
        highlights: [
          "Kreative Fisch- und Fischerhütten-Themenstrukturen",
          "Seelage am Lietzensee — einer der hübschesten kleinen Parks Berlins",
          "Gut beschattete Promenade perfekt für Kinderwagen-Spaziergänge",
        ],
      },
      {
        description:
          "Ein Hafen-Themenspielplatz auf einem lebhaften Wohnplatz. Sandspiel für Kleinkinder, Wasser- und Matschspielbereiche, Tischtennis und Klettergeräte für ältere Kinder. Der Wochenmarkt auf dem Platz verleiht ein Gemeinschaftsgefühl.",
        highlights: [
          "Hafen-Thema mit Booten und Wasserspiel — Kinder lieben das Fantasie-Element",
          "Eigener Kleinkind-Sandbereich getrennt von den Geräten der Größeren",
          "Wochenmarkt auf dem Platz schafft Gemeinschaftsatmosphäre",
        ],
      },
      {
        description:
          "Ein weitläufiges hölzernes Piratenschiff, das Kinder erklettern, herunterrutschen und erkunden können. Es gibt eine Brücke, Kletternetze, eine Tischtennisplatte an Deck und einen Basketballkorb am Bug. Einer dieser Spielplätze, an dem Kinder stundenlang ‚nur noch fünf Minuten' bitten.",
        highlights: [
          "Lebensgroßes hölzernes Piratenschiff — ein als Spielstruktur getarnter Abenteuerspielplatz",
          "Tischtennis und Basketball halten ältere Kinder bei Laune",
          "Groß genug, dass mehrere Gruppen spielen können, ohne sich zu drängen",
        ],
      },
    ],
  },
  schoeneberg: {
    metaTitle: "Die besten Spielplätze in Schöneberg, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Schöneberg, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Schöneberg",
    intro:
      "Schönebergs Spielplätze haben Charakter. Von einem Hexenhaus bis zu einer Wild-West-Szenerie — dieses Viertel macht keine gewöhnlichen Spielplätze. Hier sind die Empfehlungen lokaler Familien.",
    closingNote:
      "Schönebergs Themenspielplätze machen es zu einem der unterhaltsamsten Viertel Berlins für Kinder. Zwischen Hexen und Cowboys gibt es immer eine neue Geschichte zum Nachspielen. Brauchen Sie einen Babysitter, der das Abenteuer weiterleben lässt? Wir sind da.",
    playgrounds: [
      {
        description:
          "Der Hexenspielplatz macht seinem Namen alle Ehre. Ein Hexenhäuschen mit schiefem Dach, Spinnennetz-Fenstern, Leitern, Baumstämmen und einer Rutsche schaffen ein fantasievolles, leicht gruseliges Spielerlebnis. Kinder lieben das Erzähl-Element — es verwandelt einen Spielplatzbesuch in ein Abenteuer.",
        highlights: [
          "Hexenhaus-Thema ist wirklich fantasievoll und einzigartig in Berlin",
          "Leitern, Baumstämme und eine Rutsche machen es auch körperlich ansprechend",
          "Kompakt genug, damit Eltern leicht den Überblick behalten",
        ],
      },
      {
        description:
          "Ein Wild-West-Themenspielplatz wenige Blocks vom Nollendorfplatz entfernt. Auch Grand-Canyon-Spielplatz genannt, hat er Western-Kletterstrukturen und Spielgeräte, die Kinder ins Cowboy-Land versetzen. Beliebt bei Familien aus dem Viertel, die ein bisschen Themenspiel mögen.",
        highlights: [
          "Wild-West-Thema verleiht eine markante, verspielte Atmosphäre",
          "Wenige Blocks vom Nollendorfplatz — leicht per U-Bahn erreichbar",
          "Gute Mischung aus Klettern und Fantasiespiel",
        ],
      },
      {
        description:
          "Ein großer Spielplatz im Hauptpark von Schöneberg, nahe der goldenen Hirschstatue und dem Rathaus. Sandbereiche, Klettergerüste und breite Rasenflächen geben Familien viel Platz. Der grüne Gürtel des Parks lässt die Stadt vergessen.",
        highlights: [
          "Schönebergs Hauptpark — großzügig und grün",
          "Nahe der ikonischen goldenen Hirschstatue und dem Schöneberger Rathaus",
          "Breite Rasenflächen zum Picknicken und Rennen neben den Spielgeräten",
        ],
      },
      {
        description:
          "Ein Spielplatz auf einem Hügel in einem ruhigen Nachbarschaftspark. Der Cheruskerpark bietet Panoramablick, moderne Klettergeräte und eine große Wiese. Etwas abseits der üblichen Wege, aber den Spaziergang wert für Familien, die eine friedliche Spielsession abseits der Massen suchen.",
        highlights: [
          "Hügellage mit Panoramablick über die Dächer",
          "Moderne Geräte in einer gepflegten, ruhigen Umgebung",
          "Große Wiese für freies Spiel neben den strukturierten Geräten",
        ],
      },
    ],
  },
  wedding: {
    metaTitle: "Die besten Spielplätze in Wedding, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Wedding, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Wedding",
    intro:
      "Weddings Spielplätze sind im besten Sinne unkompliziert: gut ausgestattet, großzügig und umgeben von Parks und Seen. Die wachsende Familienszene im Viertel bedeutet, dass diese Orte jedes Jahr beliebter werden.",
    closingNote:
      "Weddings Spielplätze sind praktisch und beliebt. Das Viertel wächst schnell als Familienziel, und diese Spielflächen sind ein großer Teil des Grundes. Brauchen Sie Unterstützung bei der Kinderbetreuung? Wir helfen Ihnen gerne.",
    playgrounds: [
      {
        description:
          "Ein beliebter Wasserspielbereich im nördlichen Teil des Schillerparks, neben schattigen Kletter- und Spielgeräten. Das große Planschbecken ist im Sommer ein Magnet für Familien aus ganz Wedding. Handtücher und Wechselkleidung mitbringen — die Kinder werden nass.",
        highlights: [
          "Großes Planschbecken plus Wasserspielgeräte — der beste Sommerspielplatz in Wedding",
          "Schattige Spielgeräte neben dem Wasserbereich für Abwechslung",
          "Der Schillerpark selbst hat offene Wiesen und Spazierwege für einen ganzen Ausflug",
        ],
      },
      {
        description:
          "Ein betreuter Abenteuerspielplatz im 29 Hektar großen Humboldthain-Park. Kinder können Holzhütten für Bastelarbeiten nutzen, in einem Lehmofen backen und Werkzeuge und Spiele ausleihen. Die Art von altmodischem, praktischem Spielerlebnis, das Stadtkinder selten genug bekommen.",
        highlights: [
          "Betreutes Personal, Lehmofen zum Backen, Werkzeuge zum Ausleihen",
          "Im großen Humboldthain-Park mit Rosengärten und einem Bunkerhügel zu erkunden",
          "Wirklich ansprechende praktische Aktivitäten, nicht nur Geräte",
        ],
      },
      {
        description:
          "Ein Spielplatz in der Nähe des Seestrandbads am Plötzensee. Kinder können auf Kletterstrukturen und in Sandbereichen spielen, und dann kann die ganze Familie im See schwimmen gehen. Die perfekte Kombination für einen Sommertag in Wedding.",
        highlights: [
          "Direkt am Plötzensee — Spielen und Schwimmen kombinieren",
          "Sandstrand-Atmosphäre verstärkt das Sommertag-Ausflugsgefühl",
          "Einer der wenigen Spielplätze in Berlin mit einem Badesee in der Nähe",
        ],
      },
      {
        description:
          "Der Spielplatz am Hauptplatz von Zentral-Wedding, umgeben von Cafés und dem Wochenmarkt. Moderne Geräte und ein eingezäunter Kleinkinderbereich machen ihn praktisch für den täglichen Gebrauch. Die Art Spielplatz, an dem man auf dem Nachhauseweg vom Einkaufen hält.",
        highlights: [
          "Eingezäunter Kleinkinderbereich gibt Eltern Ruhe",
          "Umgeben von Cafés und dem Wochenmarkt — leicht mit Besorgungen kombinierbar",
          "Moderne, gut gepflegte Geräte an zentraler Lage",
        ],
      },
    ],
  },
  moabit: {
    metaTitle: "Die besten Spielplätze in Moabit, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Moabit, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Moabit",
    intro:
      "Moabit ist ein Viertel am Wasser mit einer wachsenden Familienszene, und seine Spielplätze spiegeln diesen ruhigen, gemeinschaftsorientierten Charakter wider. Hier sind die besten Orte für Kinder in der Gegend.",
    closingNote:
      "Moabits Spielplätze passen zum ruhigen Gemeinschaftsgefühl des Viertels. Es sind die Art von Orten, an denen man jeden Nachmittag dieselben Familien trifft. Wenn Sie sich in Moabit einleben und Unterstützung bei der Kinderbetreuung brauchen, können wir Sie mit lokalen Babysittern verbinden.",
    playgrounds: [
      {
        description:
          "Ein betreuter Abenteuerspielplatz im Ottopark für 5- bis 14-Jährige. Es gibt einen Wasserspielbereich, ausleihbares Spielzeug und verschiedene Spielzonen, die Kinder stundenlang beschäftigen. Das Personal schafft eine einladende, lebhafte Atmosphäre.",
        highlights: [
          "Betreut von geschultem Personal mit organisierten Aktivitäten",
          "Wasserspielbereich und ausleihbares Spielzeug inklusive",
          "Aktive, soziale Atmosphäre — ideal, damit Kinder Freunde finden",
        ],
      },
      {
        description:
          "Ein großer Spielplatz im Fritz-Schloss-Park, umgeben von Fußballplätzen, Tennisplätzen und offener Grünfläche. Der Park ist Moabits Hauptfreizeitgebiet und der Spielplatz sein Familientreffpunkt. Es gibt Platz für Kinder jeden Alters, ihre eigene Ecke zu finden.",
        highlights: [
          "Moabits Hauptpark — das grüne Herz des Viertels",
          "Sportanlagen in der Nähe für ältere Kinder, die mehr als einen Spielplatz wollen",
          "Großzügiges Layout, das nie beengt wirkt",
        ],
      },
      {
        description:
          "Kürzlich renovierter Spielplatz im Hauptpark von Zentral-Moabit. Moderne Geräte stehen neben dem Wochenmarkt und lokalen Cafés. Der praktischste Spielplatz im Viertel — direkt an der Hauptstraße, aber geschützt durch die Bäume des Parks.",
        highlights: [
          "Kürzlich renoviert mit modernen, barrierefreien Geräten",
          "Zentrale Lage an der Turmstraße, nahe Wochenmarkt und Geschäften",
          "Durch Parkbäume geschützt, trotz der Nähe zur Hauptstraße",
        ],
      },
      {
        description:
          "Ein kleiner Spielplatz entlang der Spree-Uferpromenade. Kinder spielen, während sie Flussbargen vorbeifahren sehen. Nicht der größte oder ausgefallenste Spielplatz, aber die Lage am Wasser macht ihn besonders — ein friedlicher Ort für einen ruhigen Nachmittag.",
        highlights: [
          "Spree-Ufer-Lage mit vorbeifahrenden Bargen zum Beobachten",
          "Friedlich und ruhig, ideal für jüngere Kinder",
          "Lässt sich gut mit einem Spaziergang entlang der Uferpromenade verbinden",
        ],
      },
    ],
  },
  steglitz: {
    metaTitle: "Die besten Spielplätze in Steglitz, Berlin | Elternguide",
    metaDescription:
      "Entdecken Sie die besten Spielplätze in Steglitz, Berlin. Unser Guide stellt 4 familienfreundliche Spielbereiche mit Altersempfehlungen und Besonderheiten vor.",
    h1: "Die besten Spielplätze in Steglitz",
    intro:
      "Steglitz ist eines der ruhigsten und grünsten Familienviertel Berlins, und seine Spielplätze spiegeln das wider. Große Parks, Seilbahnen und sogar ein Spielplatz im Botanischen Garten machen diese Gegend zu einem Geheimtipp für Familien.",
    closingNote:
      "Steglitz ist vielleicht nicht das erste Viertel, das einem einfällt, aber für Familien ist es schwer zu übertreffen. Grün, ruhig und voller gepflegter Spielflächen. Wenn Sie einen Babysitter in der Gegend suchen, können wir Ihnen helfen.",
    playgrounds: [
      {
        description:
          "Der Hauptspielplatz in Steglitz' 17 Hektar großem Waldpark. Kletter-Rutschen-Kombinationen, Seilbrücken, Reifenschaukeln, ein Basketballkäfig und Tischtennis bieten Kindern viel Beschäftigung. Die alten Bäume des Parks schaffen eine waldähnliche Atmosphäre, die bei Berliner Spielplätzen selten ist.",
        highlights: [
          "In einem 17 Hektar großen Waldpark mit waldähnlicher Atmosphäre",
          "Große Vielfalt: Seilbrücken, Reifenschaukeln, Basketball, Tischtennis",
          "Großzügiger Schatten durch alte Bäume — angenehm auch im Hochsommer",
        ],
      },
      {
        description:
          "Ein zweiter Spielplatz am Parkrand mit Tunnelrutschen, Seilbahnen, Balanciergeräten und einer Wasserpumpe. Er ist etwas weniger frequentiert als der Hauptspielplatz und hat andere Geräte, sodass Familien oft beide besuchen.",
        highlights: [
          "Seilbahn ist die Hauptattraktion — Kinder stellen sich dafür an",
          "Wasserpumpe für Sommerspiel",
          "Weniger überfüllt als der Hauptspielplatz, ruhigere Atmosphäre",
        ],
      },
      {
        description:
          "Ein Planschbereich und Spielplatz in einem der größten botanischen Gärten der Welt. Nach dem Spielen können Sie die über 20.000 Pflanzenarten in Außengärten und tropischen Gewächshäusern erkunden. Ein Spielplatzbesuch und Naturbildung in einem.",
        highlights: [
          "Im Botanischen Garten Berlin — Spielen und 20.000+ Pflanzen erkunden",
          "Planschbereich für Sommerspaß neben regulären Spielgeräten",
          "Gewächshäuser machen ihn zu einem Ganzjahresziel, nicht nur für den Sommer",
        ],
      },
      {
        description:
          "Ein ruhiger Wohngebiets-Spielplatz mit modernen Geräten, einem Sandkasten und einer kleinen Wiese. In einer grünen Nachbarschaftsecke versteckt, ist es der perfekte Alltagsspielplatz, an dem lokale Familien nach der Schule vorbeischauen. Unprätentiös und gut gepflegt.",
        highlights: [
          "Ruhige Nachbarschaftslage — perfekt für eine entspannte Nachmittagssession",
          "Moderne Geräte in gutem Zustand",
          "Kleine Wiese für freies Spiel neben den strukturierten Geräten",
        ],
      },
    ],
  },
};
