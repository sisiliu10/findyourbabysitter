export interface GuideSection {
  heading: string;
  content: string;
  items?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: "cafes" | "playgrounds" | "activities" | "parenting";
  updatedAt: string;
  neighborhoods: string[];
  intro: string;
  sections: GuideSection[];
}

export const GUIDES: Guide[] = [
  {
    slug: "kid-friendly-cafes-berlin",
    title: "Kid-Friendly Cafes in Berlin",
    metaTitle: "Kid-Friendly Cafes in Berlin | Best Spots for Families",
    metaDescription:
      "Discover the best kid-friendly cafes in Berlin. Family-tested spots in Prenzlauer Berg, Kreuzberg, and Mitte where parents can relax while kids play.",
    category: "cafes",
    updatedAt: "2026-03-05",
    neighborhoods: ["prenzlauer-berg", "kreuzberg", "mitte"],
    intro:
      "Finding a cafe in Berlin where you can actually finish a coffee while your kids are happy is an art form. Luckily, Berlin has plenty of spots designed with families in mind. Here are our picks across the city's most family-friendly neighborhoods.",
    sections: [
      {
        heading: "Prenzlauer Berg",
        content:
          "Prenzlauer Berg is the undisputed capital of family-friendly cafes in Berlin. Almost every other street has a spot with a play corner, high chairs, and a menu that goes beyond chicken nuggets.",
        items: [
          "Cafe Kiezkind (Helmholtzplatz) — a dedicated play area with toys and books, organic kids menu, and solid flat whites for the adults.",
          "Anna Blume (Kollwitzstrasse) — famous for its flower shop cafe combo. The outdoor terrace is spacious enough for strollers and the cake selection keeps everyone happy.",
          "Cafe Liebling (Raumerstrasse) — cozy neighborhood spot with a small play corner, homemade cakes, and a relaxed vibe that welcomes families.",
        ],
      },
      {
        heading: "Kreuzberg",
        content:
          "Kreuzberg's cafe scene skews creative and multicultural, and that extends to its family-friendly options. Expect less polished play corners and more genuine community vibes.",
        items: [
          "Cafe Rotstint (Graefestrasse) — spacious indoor seating, a kids corner with drawing supplies, and weekend brunch that draws local families.",
          "Five Elephant (Reichenberger Strasse) — world-class cheesecake, specialty coffee, and enough space between tables to park a stroller without guilt.",
          "Kindercafe Kreuzberg (Urbanstrasse) — a proper kids cafe with a big play area, craft activities on weekends, and a full menu for adults.",
        ],
      },
      {
        heading: "Mitte",
        content:
          "Mitte is more polished but still has hidden gems for parents who want good food and a space where kids can move around.",
        items: [
          "Bonanza Coffee (Oderberger Strasse) — not a kids cafe per se, but the big communal tables and relaxed atmosphere make it stroller-friendly.",
          "House of Small Wonder (Johannisstrasse) — Japanese-inspired brunch spot with a calm atmosphere that works surprisingly well with older kids.",
          "Cafe Fleury (Weinbergsweg) — French-style cafe with outdoor seating on a quiet street, pastries that kids love, and a relaxed pace.",
        ],
      },
      {
        heading: "Tips for Cafe Visits with Kids",
        content: "A few things that make cafe visits with kids in Berlin smoother.",
        items: [
          "Visit between 9:30 and 11:00 to beat the brunch rush — most places are calmer and more welcoming to families.",
          "Bring a small activity bag (crayons, stickers) even if the cafe has a play area — transitions are easier.",
          "Check Google Maps reviews for recent mentions of play areas — some cafes add or remove them seasonally.",
          "Many Berlin cafes are cash-only. Bring euros just in case.",
        ],
      },
    ],
  },
  {
    slug: "best-playgrounds-berlin",
    title: "Best Playgrounds in Berlin",
    metaTitle: "Best Playgrounds in Berlin | Top Spots for Kids of All Ages",
    metaDescription:
      "A guide to the best playgrounds in Berlin for kids of all ages. Adventure playgrounds, water play, indoor options, and neighborhood favorites.",
    category: "playgrounds",
    updatedAt: "2026-03-05",
    neighborhoods: [
      "prenzlauer-berg",
      "kreuzberg",
      "friedrichshain",
      "charlottenburg",
    ],
    intro:
      "Berlin takes its playgrounds seriously. From massive adventure playgrounds where kids build with real tools to water play areas that save summer afternoons, here are the best playgrounds across the city.",
    sections: [
      {
        heading: "Adventure Playgrounds",
        content:
          "Berlin's Abenteuerspielplätze (adventure playgrounds) are a world apart from standard play equipment. Kids can build, dig, and explore with real materials under supervision.",
        items: [
          "Kolle 37 (Prenzlauer Berg) — a staffed adventure playground where kids hammer nails, build structures, and get genuinely dirty. Ages 6+.",
          "Abenteuerspielplatz Waslala (Kreuzberg) — set in a green space near the canal, with a fire pit, building area, and animals. Free and staffed.",
          "Abenteuerspielplatz Marie (Wedding) — a community-run space with garden plots, animals, and building activities. Great for school-age kids.",
        ],
      },
      {
        heading: "Water Playgrounds",
        content:
          "Berlin summers call for water play. These playgrounds have splash pads, pumps, and water channels that keep kids cool for hours.",
        items: [
          "Plansche im Volkspark Friedrichshain — a free water play area with fountains and shallow pools. Packed on hot days, but worth it.",
          "Wasserspielplatz Plansche (Plänterwald) — a large water play area tucked in the park, with hand pumps and sand channels. Less crowded than central options.",
          "Britzer Garten Water Playground (Neukölln) — inside the paid park, this water play area has multiple stations and is well-maintained.",
        ],
      },
      {
        heading: "Indoor Play Spaces",
        content:
          "For rainy days or cold Berlin winters, indoor play spaces are essential. These are the spots parents recommend.",
        items: [
          "Labyrinth Kindermuseum (Wedding) — interactive exhibits and physical play areas themed around different topics. Ages 3-11.",
          "ANOHA Kindermuseum (Mitte) — free, inside the Jewish Museum complex. A massive Noah's Ark with climbing and sensory play. Book ahead.",
          "Bambooland (multiple locations) — large indoor playgrounds with climbing frames, ball pits, and dedicated toddler zones.",
        ],
      },
      {
        heading: "Neighborhood Favorites",
        content:
          "Every Berlin neighborhood has that one playground the locals swear by. Here are a few that stand out.",
        items: [
          "Spielplatz Kollwitzplatz (Prenzlauer Berg) — shaded, central, surrounded by cafes. The social hub for local parents.",
          "Drachenspielplatz (Friedrichshain) — a dragon-themed playground near Volkspark with climbing nets and slides. Popular with ages 4-10.",
          "Savignyplatz Playground (Charlottenburg) — small but well-maintained, right on the square with nearby restaurants for post-play refueling.",
          "Görlitzer Park Playground (Kreuzberg) — a big, well-equipped playground at the north end of the park with views of the canal.",
        ],
      },
    ],
  },
  {
    slug: "things-to-do-with-kids-berlin",
    title: "Things to Do with Kids in Berlin",
    metaTitle: "Things to Do with Kids in Berlin | Family Activities & Day Trips",
    metaDescription:
      "The best things to do with kids in Berlin: museums, outdoor activities, seasonal events, and rainy day ideas. Tested by local parents.",
    category: "activities",
    updatedAt: "2026-03-05",
    neighborhoods: ["mitte", "prenzlauer-berg", "kreuzberg"],
    intro:
      "Berlin is one of the best cities in Europe for families. Between world-class museums with free entry, enormous parks, and a culture that genuinely welcomes kids, you will never run out of things to do. Here are our tested favorites.",
    sections: [
      {
        heading: "Museums for Kids",
        content:
          "Berlin's museums are surprisingly kid-friendly. Many offer free entry for children, hands-on exhibits, and dedicated programs for families.",
        items: [
          "Museum für Naturkunde (Mitte) — the dinosaur skeleton in the entrance hall is worth the visit alone. Interactive exhibits keep kids engaged for hours.",
          "Deutsches Technikmuseum (Kreuzberg) — trains, planes, ships, and a hands-on Science Center. Plan for at least half a day.",
          "ANOHA Kindermuseum (Mitte) — a free interactive museum for kids under 11 at the Jewish Museum. Book tickets online in advance.",
          "Legoland Discovery Centre (Potsdamer Platz) — smaller than you would expect, but the build stations and 4D cinema make it worth it for ages 3-10.",
        ],
      },
      {
        heading: "Outdoor Activities",
        content:
          "Berlin has more green space than almost any European capital. Here is how to make the most of it with kids.",
        items: [
          "Tempelhofer Feld — rent cargo bikes or bring your own wheels and ride the old airport runways. Flat, car-free, and massive.",
          "Tiergarten — the central park of Berlin. Rent a rowboat on the lake, visit the playground, or just walk the trails.",
          "Britzer Garten (Neukölln) — a paid park with a miniature train, playgrounds, and beautiful gardens. Quieter than Tiergarten.",
          "Boat rides on the Spree — multiple operators run family-friendly river cruises. Kids love sitting on deck and waving at people on the bridges.",
        ],
      },
      {
        heading: "Seasonal Highlights",
        content:
          "Berlin transforms with the seasons, and there is always something special happening for families.",
        items: [
          "Christmas markets (November-December) — Gendarmenmarkt and Kulturbrauerei are the most family-friendly. Carousel rides and hot chocolate included.",
          "Karneval der Kulturen (May/June) — a street parade in Kreuzberg with music, dancing, and food from around the world. Kids love the costumes.",
          "FEZ Berlin (Wuhlheide) — Europe's largest children's center runs themed programs year-round. Swimming, theater, and workshops.",
          "Langer Tag der Stadtnatur (June) — a citywide nature festival with guided walks, animal encounters, and garden visits. Many events are free.",
        ],
      },
      {
        heading: "Rainy Day Ideas",
        content: "Berlin weather is unpredictable. Here are reliable indoor options when the rain hits.",
        items: [
          "Labyrinth Kindermuseum (Wedding) — interactive exhibits with movement and play. Perfect for ages 3-11.",
          "Stadtbibliothek (any branch) — Berlin's public libraries have excellent children's sections with reading corners and regular story hours in German and English.",
          "Indoor swimming pools — Stadtbad Neukölln and Schwimmhalle Fischerinsel are family-friendly pools with slides and warm water.",
          "Bouldering gyms — BoulderKlub and Bright Site have kids sections and family sessions on weekends.",
        ],
      },
    ],
  },
  {
    slug: "first-meetup-babysitter",
    title: "Your First Meetup with a Babysitter",
    metaTitle: "First Meetup with a Babysitter | Parent's Guide | Berlin Babysitter",
    metaDescription:
      "How to arrange a first meetup with a new babysitter in Berlin. What to ask, what to show, and how to know if the fit is right — a practical guide for parents.",
    category: "parenting",
    updatedAt: "2026-03-12",
    neighborhoods: ["prenzlauer-berg", "kreuzberg", "mitte", "friedrichshain", "charlottenburg"],
    intro:
      "Hiring a babysitter is as much about trust as it is about logistics. Before you hand over the keys, a short in-person meetup can tell you everything you need to know. Here is how to make that first meeting count — for you, your kids, and the sitter.",
    sections: [
      {
        heading: "Start with a coffee, not a booking",
        content:
          "Resist the urge to jump straight into scheduling. Reach out to the sitter via the platform, introduce yourself, and suggest a 30-minute coffee or home visit before committing to anything. This low-stakes meeting lets everyone relax and get a feel for each other without the pressure of a job already on the line. Most sitters on Berlin Babysitter are happy to do this — it is in their interest too.",
        items: [
          "Keep it short — 20 to 30 minutes is enough. You are not interviewing them, you are meeting them.",
          "Meet at your home if possible. It is the environment they will be working in, and your kids can warm up naturally.",
          "If a cafe works better for you, choose somewhere calm and close to where you live.",
        ],
      },
      {
        heading: "Have your kids there",
        content:
          "This is the most important part. How a sitter interacts with your children in those first ten minutes tells you more than any amount of messaging back and forth. Watch whether they make eye contact with the kids, get down to their level, or follow their lead — these small signals matter.",
        items: [
          "Do not arrange the meetup during nap time or mealtime. Kids should be awake, rested, and in a neutral mood.",
          "Let the interaction happen naturally. Resist the urge to script it or prompt your kids to perform.",
          "It is completely normal for younger children to be shy or clingy. Watch how the sitter handles that — patience and calm are good signs.",
          "If your child warms up quickly and shows interest, pay attention to that too. Kids are often better judges than we give them credit for.",
        ],
      },
      {
        heading: "Walk them through your home",
        content:
          "A quick tour takes five minutes and sets everyone up for success. Show the sitter where things are so they can focus on your kids instead of hunting for supplies when the time comes.",
        items: [
          "Emergency contacts — your number, a backup number, and where the nearest Kinderarzt (pediatrician) is.",
          "First aid kit location.",
          "Snacks and meals — what the kids can have, any allergies or dietary restrictions.",
          "Bedtime kit — pajamas drawer, favorite stuffed animal, where the nightlight is.",
          "House rules — screen time limits, outdoor play boundaries, anything non-negotiable.",
        ],
      },
      {
        heading: "Questions worth asking",
        content:
          "You do not need a formal interview list. But a few natural questions help you understand how the sitter thinks and whether your approaches to childcare are compatible.",
        items: [
          "How do you usually handle a child who does not want to go to bed?",
          "Have you ever had a situation with a child that felt difficult? How did you handle it?",
          "What do you enjoy doing with kids this age?",
          "Do you speak German, English, or both? (Relevant if language is important to you.)",
          "Are you available for regular bookings or do you prefer one-offs?",
        ],
      },
      {
        heading: "The trial booking",
        content:
          "After a successful meetup, consider a short trial booking — one to two hours — before you plan anything longer. Do a quick errand nearby, stay reachable, and check in when you get back. This gives your child time to adjust without you being gone for a full evening.",
        items: [
          "Tell your child beforehand that you will be back soon — keep it simple and calm.",
          "Leave the house without a long goodbye. Short, confident farewells are easier on everyone.",
          "Ask the sitter to text you a quick update after 30 minutes if you want peace of mind.",
          "Debrief briefly when you return — ask how it went, what the kids did, whether anything came up.",
        ],
      },
      {
        heading: "Trust your gut",
        content:
          "After the meetup, take a moment to check in with yourself. Did the conversation feel easy? Did your kids seem comfortable? Did the sitter seem genuinely interested, or just going through the motions? A good fit usually feels obvious — and so does a mismatch. There is no obligation to book after a meetup, and a sitter worth hiring will understand that.",
        items: [
          "If something felt off but you cannot name it, trust that feeling. You do not need a specific reason.",
          "If your child had a strong negative reaction, give it weight — but also consider whether it was situational (tired, hungry, overwhelmed).",
          "A good sitter will be fine with you taking a day to decide. Anyone who pressures you into an immediate yes is a yellow flag.",
          "When you find the right fit, let the sitter know. A little positive feedback goes a long way.",
        ],
      },
    ],
  },
];

import { GUIDES_DE } from "./guides-de";

export function getGuide(
  slug: string,
  locale: string = "en"
): Guide | undefined {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) return undefined;
  if (locale === "de" && GUIDES_DE[slug]) {
    return { ...guide, ...GUIDES_DE[slug] };
  }
  return guide;
}
