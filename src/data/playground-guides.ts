export interface Playground {
  name: string;
  address: string;
  description: string;
  highlights: string[];
  ageRange: string;
  googlePlaceId: string;
  googleRating: number;
  googleReviewCount: number;
}

export interface PlaygroundGuide {
  districtSlug: string;
  districtName: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  playgrounds: Playground[];
  closingNote: string;
}

export const PLAYGROUND_GUIDES: PlaygroundGuide[] = [
  {
    districtSlug: "prenzlauer-berg",
    districtName: "Prenzlauer Berg",
    metaTitle: "Best Playgrounds in Prenzlauer Berg, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Prenzlauer Berg, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Prenzlauer Berg",
    intro:
      "Prenzlauer Berg is one of Berlin's most family-friendly neighborhoods, and its playgrounds reflect that. From the social hub at Kollwitzplatz to the adventure playground on Kollwitzstrasse, here are the spots local parents keep coming back to.",
    playgrounds: [
      {
        name: "Spielplatz Kollwitzplatz",
        address: "Kollwitzplatz, 10435 Berlin",
        description:
          "The heart of Prenzlauer Berg's family scene. This shaded playground sits in the middle of Kollwitzplatz and draws parents from across the neighborhood. There's a climbing-slide combination for older kids, baby swings for the little ones, and a sand play area that keeps toddlers busy for hours.",
        highlights: [
          "Surrounded by cafes where parents can grab a coffee while kids play",
          "Farmers market on Saturdays turns the square into a family outing",
          "Generous shade from mature trees, great for hot summer days",
        ],
        ageRange: "1-10 years",
        googlePlaceId: "ChIJNemjhgFOqEcRkz-gD05qXgw",
        googleRating: 4.2,
        googleReviewCount: 30,
      },
      {
        name: "Spielplatz Helmholtzplatz",
        address: "Helmholtzplatz, 10437 Berlin",
        description:
          "A laid-back neighborhood square with a well-equipped playground under tall old trees. Helmholtzplatz has a relaxed vibe that makes it easy to spend a whole afternoon here. Kids flock to the climbing frames and ping-pong tables while parents chat on the benches.",
        highlights: [
          "Sunday children's flea market is a neighborhood tradition",
          "Ping-pong tables and open space for older kids to run around",
          "Quieter and less crowded than Kollwitzplatz, especially on weekdays",
        ],
        ageRange: "2-12 years",
        googlePlaceId: "ChIJ4ckqjP9NqEcRJ4X5Z46yhBg",
        googleRating: 4.1,
        googleReviewCount: 68,
      },
      {
        name: "Mauerpark Playground",
        address: "Gleimstrasse 55, 10437 Berlin",
        description:
          "Located within the former Berlin Wall strip, Mauerpark's playground sits alongside one of Berlin's most iconic Sunday flea markets. The play area is spacious with climbing frames, swings, and plenty of room to run. After playing, kids can watch the famous karaoke sessions in the amphitheater.",
        highlights: [
          "Massive open space that rarely feels overcrowded",
          "Adjacent to the Sunday flea market and karaoke amphitheater",
          "Grassy hillside perfect for picnics after playtime",
        ],
        ageRange: "2-12 years",
        googlePlaceId: "ChIJd-d5Rx1SqEcRgCz33OsCSZQ",
        googleRating: 4.7,
        googleReviewCount: 69,
      },
      {
        name: "Abenteuerlicher Bauspielplatz Kolle 37",
        address: "Kollwitzstrasse 35, 10405 Berlin",
        description:
          "This supervised adventure playground is something truly special. Kids get to build with real wood and tools, tend a garden, and play in ways that most urban playgrounds don't allow. It's staffed by trained supervisors who help children learn through hands-on play.",
        highlights: [
          "Children build real structures with wood, nails, and tools",
          "Supervised by trained staff, open weekday afternoons",
          "A rare chance for kids to experience genuinely unstructured, creative play",
        ],
        ageRange: "6-14 years",
        googlePlaceId: "ChIJLaXOYQJOqEcRzL3hqvCpkL4",
        googleRating: 4.4,
        googleReviewCount: 107,
      },
    ],
    closingNote:
      "Prenzlauer Berg's playgrounds are as family-focused as the neighborhood itself. Whether you're looking for a quick sandbox session or a full afternoon adventure, there's a spot nearby. And if you need a sitter while you explore, we can help with that too.",
  },
  {
    districtSlug: "kreuzberg",
    districtName: "Kreuzberg",
    metaTitle: "Best Playgrounds in Kreuzberg, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Kreuzberg, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Kreuzberg",
    intro:
      "Kreuzberg's playgrounds match the neighborhood's character: diverse, creative, and full of life. From the towering slide in Gorlitzer Park to the canal-side play areas along the Landwehrkanal, these are the spots Kreuzberg families love.",
    playgrounds: [
      {
        name: "Spielplatz Gorlitzer Park",
        address: "Gorlitzer Park, 10999 Berlin",
        description:
          "One of Berlin's most impressive slides sits on a moon-shaped hill inside Gorlitzer Park. Known locally as 'Gorli,' this wooded section of the park offers a large play area with plenty of shade in summer. The slide is a magnet for kids of all ages, and the surrounding park has space to kick a ball or have a picnic.",
        highlights: [
          "Huge slide built into a landscaped hill — a Kreuzberg landmark",
          "Wooded area provides natural shade on hot days",
          "Plenty of open green space around the playground for running and games",
        ],
        ageRange: "3-12 years",
        googlePlaceId: "ChIJfaeGSK1PqEcRKuvvXm68NgE",
        googleRating: 4.5,
        googleReviewCount: 43,
      },
      {
        name: "Waldeck Spielplatz",
        address: "Waldeckpark, Oranienstrasse, 10969 Berlin",
        description:
          "A charming little playground tucked between Kreuzberg's bustling streets. Waldeck has wooden play figures, a slide, table tennis, a basketball court, and even a chess table. It's the kind of place where older kids and younger ones can all find something to do.",
        highlights: [
          "Multi-activity space: table tennis, basketball, chess, and play equipment",
          "Wooden play figures give it a storybook feel for younger children",
          "Small and enclosed, easy to keep an eye on kids",
        ],
        ageRange: "3-10 years",
        googlePlaceId: "ChIJQdMcdSlOqEcR1vcASgEzNN0",
        googleRating: 3.9,
        googleReviewCount: 449,
      },
      {
        name: "Spielplatz Mariannenplatz",
        address: "Mariannenplatz, 10997 Berlin",
        description:
          "This spacious green square near the former Wall has climbing equipment, a large lawn, and a wading pool that opens in summer. Mariannenplatz is one of those rare Berlin playgrounds where toddlers and bigger kids can both play comfortably without getting in each other's way.",
        highlights: [
          "Wading pool (Plansche) opens in summer — bring swimsuits",
          "Large, flat lawn ideal for toddlers learning to walk and run",
          "Near Bethanien arts center, combining culture with outdoor play",
        ],
        ageRange: "1-10 years",
        googlePlaceId: "ChIJl7tlx6RPqEcRTKbJoDMaHkA",
        googleRating: 4.5,
        googleReviewCount: 245,
      },
      {
        name: "Spielplatz am Boecklerpark",
        address: "Prinzenstrasse 1, 10969 Berlin",
        description:
          "A canal-side playground along the Landwehrkanal with climbing structures, sand areas, and views of the water. It's a lovely spot for an afternoon — kids play while parents watch the boats drift by. The park is also a popular walking route, so it's easy to combine with a stroll.",
        highlights: [
          "Waterside setting along the Landwehrkanal adds a peaceful backdrop",
          "Combines well with a canal walk or a stop at a nearby cafe",
          "Sand areas and climbing structures suit a wide age range",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJ-7L7gdJPqEcRhnpx35DYPIA",
        googleRating: 4.4,
        googleReviewCount: 267,
      },
    ],
    closingNote:
      "Kreuzberg's playgrounds are as vibrant and varied as the neighborhood itself. From canal-side calm to park-side adventure, there's always somewhere nearby for kids to burn off energy. Need a sitter who knows the area? We've got you covered.",
  },
  {
    districtSlug: "friedrichshain",
    districtName: "Friedrichshain",
    metaTitle: "Best Playgrounds in Friedrichshain, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Friedrichshain, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Friedrichshain",
    intro:
      "Friedrichshain's playgrounds range from the iconic dragon climbing frame on Schreinerstrasse to adventure playgrounds inside one of Berlin's oldest parks. Here are the ones local families rate highest.",
    playgrounds: [
      {
        name: "Drachenspielplatz",
        address: "Schreinerstrasse 48, 10247 Berlin",
        description:
          "The Dragon Playground is a Friedrichshain institution. A massive dragon-shaped climbing frame with slides dominates the space, surrounded by a water pump, sand area, and a fully fenced perimeter. The dragon's body provides welcome shade in summer, and the enclosed design gives parents peace of mind.",
        highlights: [
          "Iconic dragon climbing frame — one of Berlin's most photographed playgrounds",
          "Fully fenced, making it safe for toddlers who like to wander",
          "Water pump for splashing and sand play in warmer months",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJA915f4pOqEcRp_IJQPy0_Zw",
        googleRating: 4.6,
        googleReviewCount: 551,
      },
      {
        name: "Indianerdorf, Volkspark Friedrichshain",
        address: "Volkspark Friedrichshain, 10249 Berlin",
        description:
          "An adventure-themed playground inside Berlin's oldest public park. The play village sits alongside ponds and near the famous Marchenbrunnen (fairy tale fountain). Kids can climb, balance, and explore the wooden structures while the surrounding park offers walking paths and open meadows.",
        highlights: [
          "Set inside Volkspark Friedrichshain, Berlin's oldest public park",
          "Nearby Marchenbrunnen fountain with fairy tale sculptures is worth a visit",
          "Spacious park setting with ponds, paths, and picnic spots",
        ],
        ageRange: "3-12 years",
        googlePlaceId: "ChIJQXFU2X1PqEcRf3Aeidvn8fk",
        googleRating: 4.7,
        googleReviewCount: 32,
      },
      {
        name: "Spielplatz Boxhagener Platz",
        address: "Boxhagener Platz, 10245 Berlin",
        description:
          "The playground on 'Boxi' is a neighborhood staple. It's fenced with climbing structures, tube slides, swings, a wobble bridge, and a generous paddling pool. The Saturday flea market and Sunday farmers market right next door make it easy to combine play with shopping.",
        highlights: [
          "Paddling pool open in summer — a lifesaver on hot days",
          "Saturday flea market and Sunday farmers market right on the square",
          "Fenced area with equipment for both toddlers and older kids",
        ],
        ageRange: "1-10 years",
        googlePlaceId: "ChIJWfqq3l5OqEcRYtQxzg5VfHk",
        googleRating: 4.6,
        googleReviewCount: 26,
      },
      {
        name: "Abenteuerspielplatz Forcki",
        address: "Forckenbeckplatz, 10247 Berlin",
        description:
          "A supervised adventure playground where kids can build, garden, and play freely with real materials. Forcki is staffed during open hours and gives children the kind of hands-on, creative play experience that's rare in a city. Open afternoons during school terms.",
        highlights: [
          "Supervised by trained staff, safe and engaging",
          "Kids build with wood and garden — genuinely hands-on play",
          "Open weekday afternoons during school terms",
        ],
        ageRange: "6-14 years",
        googlePlaceId: "ChIJjQt-X8UjZUERyOGnXWuANbc",
        googleRating: 4.7,
        googleReviewCount: 44,
      },
    ],
    closingNote:
      "From fire-breathing dragons to hands-on building, Friedrichshain's playgrounds offer something for every age and energy level. If you're new to the neighborhood or just visiting, these are the spots to start with.",
  },
  {
    districtSlug: "neukoelln",
    districtName: "Neukolln",
    metaTitle: "Best Playgrounds in Neukolln, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Neukolln, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Neukolln",
    intro:
      "Neukolln's playgrounds reflect the neighborhood's creative, multicultural spirit. From aviation-themed climbing frames near Tempelhof to the Arabian Nights playground in Hasenheide, these play areas have character.",
    playgrounds: [
      {
        name: "Fliegerspielplatz",
        address: "Near Oderstrasse entrance, Tempelhofer Feld, 12049 Berlin",
        description:
          "Inspired by the adjacent former Tempelhof airport, this aviation-themed playground features miniature wooden propeller airplanes to climb on. Kids love pretending to fly while parents enjoy the open views of Tempelhofer Feld stretching out behind it.",
        highlights: [
          "Aviation theme ties beautifully into the Tempelhof airport history",
          "Right at the entrance to Tempelhofer Feld for post-play cycling or kite-flying",
          "Open, airy setting with great sightlines for parents",
        ],
        ageRange: "3-12 years",
        googlePlaceId: "ChIJX8KB_R5QqEcRgvqGVgxxSJk",
        googleRating: 4.5,
        googleReviewCount: 151,
      },
      {
        name: "1001 Nacht Spielplatz",
        address: "Hasenheide Park, near Hermannplatz, 10967 Berlin",
        description:
          "Also known as the Aladdin playground, this beautifully themed play area brings Arabian Nights to life. The equipment is imaginatively designed, there's plenty of shade under old trees, and a kiosk nearby means parents can grab a drink while kids explore.",
        highlights: [
          "Arabian Nights theme makes it feel like an adventure, not just a playground",
          "Excellent shade from mature park trees",
          "Kiosk nearby for drinks and snacks",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJfdm_bMdPqEcRmJ91V9EKb_4",
        googleRating: 4.9,
        googleReviewCount: 8,
      },
      {
        name: "Spielplatz Kornerpark",
        address: "Kornerpark, Schierker Strasse, 12051 Berlin",
        description:
          "A playground set inside one of Berlin's most beautiful hidden parks. Kornerpark is a sunken Neoclassical gem with cascading fountains and manicured lawns. The play area is smaller but the park setting makes it feel special — like playing in a secret garden.",
        highlights: [
          "Inside Kornerpark, one of Berlin's most stunning small parks",
          "Neoclassical fountains and landscaped terraces surround the play area",
          "Quieter and less crowded than most Neukolln playgrounds",
        ],
        ageRange: "2-8 years",
        googlePlaceId: "ChIJIa1nNZlPqEcRu9s2oAUT140",
        googleRating: 4.3,
        googleReviewCount: 112,
      },
      {
        name: "Kinderspielplatz Tempelhofer Feld",
        address: "Tempelhofer Feld, Oderstrasse entrance, 12049 Berlin",
        description:
          "Play areas on the vast former airfield, with dedicated equipment for smaller kids alongside the endless open space that makes Tempelhof unique. After the playground, the whole family can cycle, skate, or fly kites on the former runways.",
        highlights: [
          "Endless open space for running, cycling, and kite-flying after playground time",
          "One of Berlin's most unique settings — a former airport runway",
          "Flat terrain is perfect for bikes, scooters, and little legs learning to walk",
        ],
        ageRange: "0-14 years",
        googlePlaceId: "ChIJdU4MNxFPqEcRC_NBD33yyr4",
        googleRating: 4.5,
        googleReviewCount: 151,
      },
    ],
    closingNote:
      "Neukolln's playgrounds have personality. Whether your kids want to fly planes, explore palaces, or just run on a giant airfield, there's a spot that fits. Looking for a sitter who knows the neighborhood? We can help.",
  },
  {
    districtSlug: "mitte",
    districtName: "Mitte",
    metaTitle: "Best Playgrounds in Mitte, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Mitte, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Mitte",
    intro:
      "Finding a good playground in Berlin's center isn't always obvious. Between the tourist crowds and busy streets, these are the play spaces Mitte families actually use — from a water playground on Weinbergsweg to a quiet square near Zionskirche.",
    playgrounds: [
      {
        name: "Wasserspielplatz am Weinbergsweg",
        address: "Volkspark am Weinbergsweg, 10119 Berlin",
        description:
          "A water playground where kids control the flow. Pump mechanisms and motion-sensor sprinklers let children direct streams of water through channels and over obstacles. It runs daily in summer from around 10am to 6pm and is absolutely worth the visit on a hot day.",
        highlights: [
          "Interactive water features that kids control themselves",
          "Open daily in summer — the best hot-weather playground in Mitte",
          "Set in a green park just off busy Weinbergsweg",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJXeDJyeRRqEcRUSh_e3mxDnw",
        googleRating: 4.2,
        googleReviewCount: 81,
      },
      {
        name: "Spielplatz Monbijoupark",
        address: "Monbijoupark, Oranienburger Strasse, 10117 Berlin",
        description:
          "A central playground along the Spree, directly opposite Museum Island. Kids play on climbing frames and in sand areas while parents enjoy river views. In summer, the adjacent beach bar adds a relaxed, holiday-like atmosphere to a regular playground visit.",
        highlights: [
          "River Spree views and Museum Island as your backdrop",
          "Beach bar next door makes it feel like a mini holiday",
          "Central location, easy to reach from anywhere in Mitte",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJEcmjshZRqEcR4K96LtSRWKM",
        googleRating: 4.7,
        googleReviewCount: 51,
      },
      {
        name: "Spielplatz am Zionskirchplatz",
        address: "Zionskirchplatz, 10119 Berlin",
        description:
          "A quiet, tree-shaded neighborhood playground on a historic square near Zionskirche. Away from the tourist bustle of central Mitte, this is where local families come for a peaceful afternoon. Swings, slides, climbing equipment, and plenty of shade.",
        highlights: [
          "One of the quietest playgrounds in Mitte — a genuine retreat",
          "Historic square with a community atmosphere",
          "Generous shade from mature trees",
        ],
        ageRange: "1-8 years",
        googlePlaceId: "ChIJTWHtR_tRqEcRLCrQR0D-ymQ",
        googleRating: 4.4,
        googleReviewCount: 118,
      },
      {
        name: "Spielplatz Hackescher Markt",
        address: "Neue Promenade, 10178 Berlin",
        description:
          "A small but well-maintained play area near Hackescher Markt S-Bahn station. It's not the biggest playground, but its central location makes it incredibly convenient for families exploring the city center who need a quick play break.",
        highlights: [
          "Steps from Hackescher Markt S-Bahn — the most convenient playground in Mitte",
          "Well-maintained equipment in a compact space",
          "Perfect for a quick play break during a city outing",
        ],
        ageRange: "1-6 years",
        googlePlaceId: "ChIJEcmjshZRqEcR4K96LtSRWKM",
        googleRating: 4.3,
        googleReviewCount: 15,
      },
    ],
    closingNote:
      "Mitte's playgrounds might be smaller than what you'll find in residential neighborhoods, but they're well-placed and well-loved. Perfect for families who live centrally or are out exploring the city.",
  },
  {
    districtSlug: "charlottenburg",
    districtName: "Charlottenburg",
    metaTitle: "Best Playgrounds in Charlottenburg, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Charlottenburg, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Charlottenburg",
    intro:
      "Charlottenburg's playgrounds are tucked into palace gardens, lakeside parks, and charming residential squares. The area's established, family-oriented character shows in the quality and variety of its play spaces.",
    playgrounds: [
      {
        name: "Spielplatz Schlosspark Charlottenburg",
        address: "Schlosspark Charlottenburg, Spandauer Damm, 14059 Berlin",
        description:
          "An open sand playground in the rear gardens of Charlottenburg Palace. The palace grounds provide a grand setting for everyday play, and the meadows along the Spree are perfect for a picnic afterward. It's a playground visit that feels like a day out.",
        highlights: [
          "Set in the gardens of Charlottenburg Palace — a unique backdrop",
          "Meadows along the Spree for picnics after playtime",
          "Spacious and rarely overcrowded despite the tourist-adjacent location",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJ94cW8DNRqEcRgw1qV1ZxmTc",
        googleRating: 4.5,
        googleReviewCount: 86,
      },
      {
        name: "Spielplatz Lietzenseepark",
        address: "Lietzenseepark, Wundtstrasse, 14057 Berlin",
        description:
          "A themed playground along a lakeside promenade, with structures shaped as fish and fishermen's cottages. The park wraps around Lietzensee lake, making it a beautiful walk with a playground stop in the middle. Old trees line the paths and provide shade.",
        highlights: [
          "Creative fish and fisherman's cottage themed structures",
          "Lakeside setting along Lietzensee — one of Berlin's prettiest small parks",
          "Well-shaded promenade perfect for stroller walks",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJGzmvI9dQqEcRiTUJL5d9f2I",
        googleRating: 4.4,
        googleReviewCount: 150,
      },
      {
        name: "Spielplatz Klausenerplatz",
        address: "Klausenerplatz, 14059 Berlin",
        description:
          "A harbor-themed playground on a lively residential square. Sand play for toddlers, water and mud play areas, table tennis, and climbing equipment for older children. The weekly market on the square adds a community feel.",
        highlights: [
          "Harbor theme with boats and water play — kids love the imagination element",
          "Dedicated toddler sand area separate from bigger kids' equipment",
          "Weekly market on the square creates a community atmosphere",
        ],
        ageRange: "1-12 years",
        googlePlaceId: "ChIJ_3S8yS5RqEcRiwwGdAUiBWg",
        googleRating: 4.3,
        googleReviewCount: 236,
      },
      {
        name: "Piratenschiff Spielplatz",
        address: "Tegeler Weg, 10589 Berlin",
        description:
          "A sprawling wooden pirate ship that kids can climb, slide down, and explore. There's a bridge, climbing nets, a ping-pong table on deck, and a basketball hoop at the bow. It's one of those playgrounds where kids beg to stay 'just five more minutes' for an hour.",
        highlights: [
          "Full-sized wooden pirate ship — an adventure playground disguised as a play structure",
          "Ping-pong and basketball keep older kids entertained",
          "Large enough that multiple groups can play without crowding",
        ],
        ageRange: "4-12 years",
        googlePlaceId: "ChIJl6ovRDBRqEcRNCdeX4BC27U",
        googleRating: 4.1,
        googleReviewCount: 129,
      },
    ],
    closingNote:
      "Charlottenburg's playgrounds have a polished, well-kept quality that matches the neighborhood. From palace gardens to pirate ships, there's plenty of variety for families of all ages.",
  },
  {
    districtSlug: "schoeneberg",
    districtName: "Schoneberg",
    metaTitle: "Best Playgrounds in Schoneberg, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Schoneberg, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Schoneberg",
    intro:
      "Schoneberg's playgrounds have character. From a witch's house to a Wild West scene, this neighborhood doesn't do generic play areas. Here are the ones local families recommend.",
    playgrounds: [
      {
        name: "Hexenspielplatz",
        address: "Gleditschstrasse, 10781 Berlin",
        description:
          "The Witch Playground lives up to its name. A witch's playhouse with a warped roof, cobweb-patterned windows, ladders, logs, and a slide create an imaginative, slightly spooky play experience. Kids love the storytelling element — it turns a playground visit into an adventure.",
        highlights: [
          "Witch's house theme is genuinely imaginative and unique in Berlin",
          "Ladders, logs, and a slide make it physically engaging too",
          "Compact enough for parents to supervise easily",
        ],
        ageRange: "3-10 years",
        googlePlaceId: "ChIJxU7DD0VQqEcRgOaipuJoszM",
        googleRating: 4.6,
        googleReviewCount: 303,
      },
      {
        name: "Cowboy Spielplatz",
        address: "Schwerinstrasse/Frobenstrasse, 10783 Berlin",
        description:
          "A Wild West-themed playground a few blocks from Nollendorfplatz. Also called the Grand Canyon playground, it has Western-style climbing structures and play equipment that transport kids to cowboy country. Popular with neighborhood families who like a bit of themed play.",
        highlights: [
          "Wild West theme gives it a distinctive, playful atmosphere",
          "A few blocks from Nollendorfplatz — easy to reach by U-Bahn",
          "Good mix of climbing and imaginative play",
        ],
        ageRange: "3-12 years",
        googlePlaceId: "ChIJaX53AUlQqEcRs72k-PvZLDY",
        googleRating: 4.8,
        googleReviewCount: 1206,
      },
      {
        name: "Spielplatz Rudolph-Wilde-Park",
        address: "Rudolph-Wilde-Park, Fritz-Elsas-Strasse, 10827 Berlin",
        description:
          "A large playground within Schoneberg's main park, near the golden deer statue and the Rathaus. Sand areas, climbing frames, and wide lawns give families plenty of space. The park's green belt makes it feel like an escape from the city.",
        highlights: [
          "Schoneberg's main park — spacious and green",
          "Near the iconic golden deer statue and Schoneberg Rathaus",
          "Wide lawns for picnics and running alongside the play equipment",
        ],
        ageRange: "1-10 years",
        googlePlaceId: "ChIJ1deWK2ZQqEcR7iiuf3wwW4o",
        googleRating: 4.5,
        googleReviewCount: 2441,
      },
      {
        name: "Spielplatz Cheruskerpark",
        address: "Cheruskerstrasse, 10829 Berlin",
        description:
          "A hilltop playground in a quiet neighborhood park. Cheruskerpark offers panoramic views, modern climbing equipment, and a large meadow. It's off the beaten path but worth the walk for families who want a peaceful play session away from the crowds.",
        highlights: [
          "Hilltop location with panoramic views over the rooftops",
          "Modern equipment in a well-maintained, quiet setting",
          "Large meadow for free play alongside the structured equipment",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJRVayAhVQqEcRCh0h0ZUzOTU",
        googleRating: 4.3,
        googleReviewCount: 37,
      },
    ],
    closingNote:
      "Schoneberg's themed playgrounds make it one of Berlin's most fun neighborhoods for kids. Between witches and cowboys, there's always a new story to act out. Need a sitter who can keep the adventure going? We're here.",
  },
  {
    districtSlug: "wedding",
    districtName: "Wedding",
    metaTitle: "Best Playgrounds in Wedding, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Wedding, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Wedding",
    intro:
      "Wedding's playgrounds are no-frills in the best way: well-equipped, spacious, and surrounded by parks and lakes. The neighborhood's growing family scene means these spots are getting more popular every year.",
    playgrounds: [
      {
        name: "Wasserspielplatz Schillerpark",
        address: "Schillerpark, Barfusstrasse, 13349 Berlin",
        description:
          "A popular water play area in the northern part of Schillerpark, alongside shaded climbing and play equipment. The large paddling pool is a summertime magnet for families across Wedding. Bring towels and a change of clothes — kids will get soaked.",
        highlights: [
          "Large paddling pool plus water play features — the best summer playground in Wedding",
          "Shaded play equipment adjacent to the water area for variety",
          "Schillerpark itself has open lawns and walking paths for a full outing",
        ],
        ageRange: "1-10 years",
        googlePlaceId: "ChIJ8Yjst9pTqEcR_D4ng5Q2sok",
        googleRating: 4.1,
        googleReviewCount: 478,
      },
      {
        name: "Abenteuerspielplatz Humboldthain",
        address: "Volkspark Humboldthain, Wiesenstrasse, 13357 Berlin",
        description:
          "A supervised adventure playground in the 29-hectare Humboldthain park. Kids can use wooden huts for crafts, bake in a clay oven, and borrow tools and games. It's the kind of old-school, hands-on play experience that city kids don't get enough of.",
        highlights: [
          "Supervised staff, clay oven for baking, tools to borrow",
          "Inside the large Humboldthain park with rose gardens and a bunker hill to explore",
          "Genuinely engaging hands-on activities, not just equipment",
        ],
        ageRange: "6-14 years",
        googlePlaceId: "ChIJkXdwSPVRqEcRlS8h2lKpHxs",
        googleRating: 4.3,
        googleReviewCount: 57,
      },
      {
        name: "Spielplatz am Plotzensee",
        address: "Nordufer, 13351 Berlin",
        description:
          "A playground near the lakeside beach at Plotzensee. Kids can play on climbing structures and in sand areas, then the whole family can take a swim in the lake. It's the perfect combination for a summer day in Wedding.",
        highlights: [
          "Right next to Plotzensee lake — combine play with a swim",
          "Sandy beach atmosphere adds to the summer day-out feeling",
          "One of the few playgrounds in Berlin with a swimmable lake nearby",
        ],
        ageRange: "2-12 years",
        googlePlaceId: "ChIJAZDY4tlRqEcRIDNYhyzSHhE",
        googleRating: 4.7,
        googleReviewCount: 7,
      },
      {
        name: "Spielplatz Leopoldplatz",
        address: "Leopoldplatz, 13353 Berlin",
        description:
          "Central Wedding's main square playground, surrounded by cafes and the weekly market. Modern equipment and a fenced toddler area make it practical for everyday use. It's the kind of playground you stop at on the way home from shopping.",
        highlights: [
          "Fenced toddler area gives parents peace of mind with little ones",
          "Surrounded by cafes and the weekly market — easy to combine errands",
          "Modern, well-maintained equipment in a central location",
        ],
        ageRange: "1-8 years",
        googlePlaceId: "ChIJyyMvVn5RqEcRLdurVf9KaFs",
        googleRating: 4.5,
        googleReviewCount: 475,
      },
    ],
    closingNote:
      "Wedding's playgrounds are practical and well-loved. The neighborhood is growing fast as a family destination, and these play spaces are a big part of why. Need a hand with childcare while you settle in? We're here to help.",
  },
  {
    districtSlug: "moabit",
    districtName: "Moabit",
    metaTitle: "Best Playgrounds in Moabit, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Moabit, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Moabit",
    intro:
      "Moabit is a waterside neighborhood with a growing family scene, and its playgrounds reflect that quiet, community-oriented character. Here are the best spots for kids in the area.",
    playgrounds: [
      {
        name: "OTTO-Spielplatz",
        address: "Ottopark, Alt-Moabit, 10555 Berlin",
        description:
          "A supervised adventure playground in Ottopark for ages 5 to 14. There's a water play area, borrowable toys, and various play zones that keep kids engaged for hours. The staff create a welcoming, lively atmosphere.",
        highlights: [
          "Supervised by trained staff with organized activities",
          "Water play area and borrowable toys included",
          "Active, social atmosphere — great for kids to make friends",
        ],
        ageRange: "5-14 years",
        googlePlaceId: "ChIJEaTozQ1RqEcR7tYD5xqat9w",
        googleRating: 4.6,
        googleReviewCount: 173,
      },
      {
        name: "Spielplatz Fritz-Schloss-Park",
        address: "Fritz-Schloss-Park, Rathenower Strasse, 10559 Berlin",
        description:
          "A large playground within Fritz-Schloss-Park, surrounded by football pitches, tennis courts, and open green space. The park is Moabit's main outdoor area and the playground is its family hub. There's room for kids of all ages to find their own corner.",
        highlights: [
          "Moabit's main park — the neighborhood's green heart",
          "Sports facilities nearby for older kids who want more than a playground",
          "Spacious layout means it never feels cramped",
        ],
        ageRange: "2-12 years",
        googlePlaceId: "ChIJ7ydLy5hRqEcR7v7dEQ0PppI",
        googleRating: 4.4,
        googleReviewCount: 940,
      },
      {
        name: "Spielplatz Kleiner Tiergarten",
        address: "Kleiner Tiergarten, Turmstrasse, 10559 Berlin",
        description:
          "Recently renovated playground in central Moabit's main park. Modern equipment sits alongside the weekly market and local cafes. It's the most convenient playground in the neighborhood — right on the main street but sheltered by the park's trees.",
        highlights: [
          "Recently renovated with modern, accessible equipment",
          "Central location on Turmstrasse, near weekly market and shops",
          "Sheltered by park trees despite being steps from the main road",
        ],
        ageRange: "1-10 years",
        googlePlaceId: "ChIJI6xG1ZtRqEcRH2G9lmw3jMs",
        googleRating: 4.4,
        googleReviewCount: 20,
      },
      {
        name: "Uferpromenade Spielplatz",
        address: "Helgolaender Ufer, 10557 Berlin",
        description:
          "A small playground along the Spree embankment. Kids play while watching river barges pass by. It's not the biggest or fanciest playground, but the waterside setting makes it special — a peaceful spot for a calm afternoon.",
        highlights: [
          "Spree riverfront setting with passing barges to watch",
          "Peaceful and quiet, ideal for younger children",
          "Combines well with a walk along the river promenade",
        ],
        ageRange: "2-8 years",
        googlePlaceId: "ChIJY46qNFFRqEcRSAhVFUMgbbI",
        googleRating: 4.4,
        googleReviewCount: 12,
      },
    ],
    closingNote:
      "Moabit's playgrounds match the neighborhood's calm, community feel. They're the kind of places where you see the same families every afternoon. If you're settling into Moabit and need childcare support, we can connect you with local sitters.",
  },
  {
    districtSlug: "steglitz",
    districtName: "Steglitz",
    metaTitle: "Best Playgrounds in Steglitz, Berlin | Guide for Parents",
    metaDescription:
      "Discover the best playgrounds in Steglitz, Berlin. Our guide covers 4 family-friendly play areas with age recommendations and what makes each one special.",
    h1: "Best Playgrounds in Steglitz",
    intro:
      "Steglitz is one of Berlin's quietest, greenest family neighborhoods, and its playgrounds reflect that. Large parks, zip lines, and even a playground inside the Botanical Garden make this area a hidden gem for families.",
    playgrounds: [
      {
        name: "Spielplatz Stadtpark Steglitz (Main)",
        address: "Stadtpark Steglitz, Albrechtstrasse, 12167 Berlin",
        description:
          "The main playground in Steglitz's 17-hectare wooded park. Climbing-slide combinations, rope bridges, tire swings, a basketball cage, and table tennis give kids plenty to do. The park's mature trees create a forest-like atmosphere that's rare in Berlin's playgrounds.",
        highlights: [
          "Set in a 17-hectare wooded park with a forest-like atmosphere",
          "Wide variety: rope bridges, tire swings, basketball, table tennis",
          "Generous shade from mature trees — comfortable even in peak summer",
        ],
        ageRange: "3-14 years",
        googlePlaceId: "ChIJl5qcKpRaqEcRwhJTiLHWiro",
        googleRating: 4.6,
        googleReviewCount: 121,
      },
      {
        name: "Spielplatz Stadtpark Steglitz (Edge)",
        address: "Stadtpark Steglitz, Sedanstrasse entrance, 12167 Berlin",
        description:
          "A second playground on the park's edge, with tunnel slides, zip lines, balancing equipment, and a water pump. It's slightly less busy than the main playground and has a different set of equipment, so families often visit both.",
        highlights: [
          "Zip line is the star attraction — kids queue up for it",
          "Water pump for summer play",
          "Less crowded than the main playground, quieter atmosphere",
        ],
        ageRange: "4-12 years",
        googlePlaceId: "ChIJl5qcKpRaqEcRwhJTiLHWiro",
        googleRating: 4.6,
        googleReviewCount: 121,
      },
      {
        name: "Spielplatz Botanischer Garten",
        address: "Botanischer Garten, Konigin-Luise-Strasse 6-8, 14195 Berlin",
        description:
          "A splash area and playground inside one of the world's largest botanical gardens. After playing, explore the 20,000+ plant species across outdoor gardens and tropical greenhouses. It's a playground visit and nature education rolled into one.",
        highlights: [
          "Inside the Berlin Botanical Garden — combine play with exploring 20,000+ plants",
          "Splash area for summer fun alongside regular play equipment",
          "Greenhouses make it a year-round destination, not just a summer one",
        ],
        ageRange: "2-10 years",
        googlePlaceId: "ChIJC49cbXtaqEcR6I2NHP-sohU",
        googleRating: 4.5,
        googleReviewCount: 34,
      },
      {
        name: "Spielplatz Birkbuschgarten",
        address: "Birkbuschstrasse, 12167 Berlin",
        description:
          "A quiet residential playground with modern equipment, a sandpit, and a small meadow. Tucked into a green neighborhood pocket, it's the kind of everyday playground where local families stop by after school. Unpretentious and well-kept.",
        highlights: [
          "Quiet neighborhood setting — perfect for a calm after-school session",
          "Modern equipment in good condition",
          "Small meadow for free play alongside the structured equipment",
        ],
        ageRange: "1-8 years",
        googlePlaceId: "ChIJeyg_6JNaqEcRE62Y-s5BIXw",
        googleRating: 4.3,
        googleReviewCount: 18,
      },
    ],
    closingNote:
      "Steglitz may not be the first neighborhood that comes to mind, but for families it's hard to beat. Green, quiet, and full of well-maintained play spaces. If you're looking for a sitter in the area, we can help you find one.",
  },
];

export function getPlaygroundGuide(slug: string): PlaygroundGuide | undefined {
  return PLAYGROUND_GUIDES.find((g) => g.districtSlug === slug);
}
