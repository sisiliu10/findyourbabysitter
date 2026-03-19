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
    slug: "babysitter-rates-berlin",
    title: "Babysitter Rates in Berlin: What to Expect in 2025",
    metaTitle: "Babysitter Rates in Berlin 2025 | How Much Does a Babysitter Cost?",
    metaDescription:
      "How much does a babysitter cost in Berlin? A breakdown of babysitter rates by district, experience level, and hours — so you know what's fair before you book.",
    category: "parenting",
    updatedAt: "2026-03-19",
    neighborhoods: [
      "prenzlauer-berg",
      "mitte",
      "kreuzberg",
      "charlottenburg",
      "neukoelln",
      "wedding",
    ],
    intro:
      "One of the first questions parents ask when looking for a babysitter in Berlin is: how much should I actually pay? Rates vary based on experience, neighborhood, hours, and how many children are involved. Here is a clear breakdown so you can budget confidently and pay fairly.",
    sections: [
      {
        heading: "The typical range: €12–25 per hour",
        content:
          "Most babysitters in Berlin charge between €12 and €25 per hour. That range is wide for a reason — experience, qualifications, and demand all push the number up or down.",
        items: [
          "€12–15/hr — student sitters or those just starting out, without formal childcare qualifications. Good for older kids who need supervision more than active care.",
          "€15–18/hr — sitters with some experience, references, and comfort with a range of ages. The most common range for regular bookings.",
          "€18–22/hr — experienced sitters with formal training (Erzieher qualification, Kita work, or equivalent), first aid certification, or bilingual skills.",
          "€22–25/hr+ — highly qualified or in-demand sitters, overnight bookings, multiple young children, or specialized care (e.g. children with additional needs).",
        ],
      },
      {
        heading: "Rates by neighborhood",
        content:
          "Berlin's neighborhoods vary in cost of living, and babysitter rates reflect that to some degree.",
        items: [
          "Prenzlauer Berg & Charlottenburg — expect to pay toward the higher end. Competition for experienced sitters is strong and the local standard is higher.",
          "Mitte & Friedrichshain — mid-range rates are typical. Many sitters serve multiple central districts.",
          "Kreuzberg & Schöneberg — rates are similar to Mitte; the diverse pool means more options at different price points.",
          "Neukölln & Wedding — the most affordable districts. You can often find reliable sitters at €12–16/hr, especially through community networks.",
        ],
      },
      {
        heading: "What pushes the rate up",
        content:
          "If any of the following apply, expect to pay above the base rate — and budget accordingly.",
        items: [
          "More than two children — each additional child typically adds €2–5/hr.",
          "Very young children (under 12 months) — infant care requires more attention and usually commands a premium.",
          "Late nights or weekends — many sitters add €2–3/hr for bookings after 22:00 or on Sundays.",
          "Short-notice bookings (same day or next day) — sitters who are available on short notice often charge more for flexibility.",
          "Language requirements — a sitter who speaks Spanish, French, or another specific language alongside German or English will often charge at the higher end.",
          "First Aid certification or formal Erzieher training — qualifications carry a premium, and rightly so.",
        ],
      },
      {
        heading: "Should you pay cash or by bank transfer?",
        content:
          "Both are common in Berlin. Some families prefer bank transfer for record-keeping; many sitters still prefer cash, especially for one-off bookings. For regular arrangements, a monthly transfer is practical for everyone.",
        items: [
          "Always agree on payment method before the first booking — it avoids awkward conversations at the door.",
          "For regular bookings, consider paying at the start of each month or after a set number of hours.",
          "If you are booking through a platform, check whether the platform handles payment or whether it is directly between you and the sitter.",
        ],
      },
      {
        heading: "What is fair to expect for the rate you pay",
        content:
          "Regardless of rate, there are baseline expectations that apply to any booking.",
        items: [
          "At €12–15/hr: reliability, basic engagement with your children, the ability to follow your instructions, and communication if anything comes up.",
          "At €16–20/hr: proactive communication, comfort managing routines (bedtime, meals), and the confidence to handle small emergencies calmly.",
          "At €20+/hr: all of the above, plus relevant qualifications, references, and the experience to care for infants or multiple children independently.",
          "At any rate: a sitter should never be on their phone excessively, should follow the house rules you set, and should treat your home with respect.",
        ],
      },
    ],
  },
  {
    slug: "how-to-find-babysitter-berlin",
    title: "How to Find a Babysitter in Berlin",
    metaTitle: "How to Find a Babysitter in Berlin | A Parent's Practical Guide",
    metaDescription:
      "How to find a reliable babysitter in Berlin: where to look, what to check, and how to build a care setup that works long-term. Practical advice for local families.",
    category: "parenting",
    updatedAt: "2026-03-19",
    neighborhoods: [
      "prenzlauer-berg",
      "mitte",
      "kreuzberg",
      "charlottenburg",
      "friedrichshain",
      "neukoelln",
    ],
    intro:
      "Finding a good babysitter in Berlin takes more than a Google search. The city has a large and diverse pool of caregivers, but knowing where to look — and what to look for — makes the difference between a one-off solution and a reliable care setup that actually fits your family.",
    sections: [
      {
        heading: "Start with your neighborhood",
        content:
          "The best babysitters are often the ones who already know your neighborhood. They can take your kids to local playgrounds, pick them up from a nearby Kita, and get to your home quickly in a pinch.",
        items: [
          "Search platforms that let you filter by district — this is faster than scrolling through city-wide results and tends to surface sitters who know your area.",
          "Ask other parents at the Kita gate, at playground meetups, or in local WhatsApp or Signal parent groups. Word-of-mouth referrals are still the most trusted source.",
          "Check community boards in your local cafe, library, or Spielplatz — many sitters post there, especially in family-dense areas like Prenzlauer Berg and Charlottenburg.",
          "Berlin neighborhoods have distinct characters. Kreuzberg sitters may be more flexible about hours; Charlottenburg sitters may lean toward more structured routines. Think about what fits your family.",
        ],
      },
      {
        heading: "What to look for in a profile",
        content:
          "A good sitter profile tells you more than just name and availability. Here is what to pay attention to.",
        items: [
          "Recent reviews from other Berlin families — look for specific mentions of age groups similar to your children, and note any recurring themes (patient, reliable, communicative).",
          "Experience with children your kids' ages — caring for a newborn is very different from looking after a 7-year-old. Make sure the experience matches.",
          "Language background — if you want your child to hear French, Spanish, or another language during sessions, filter for that specifically.",
          "First Aid certification — not mandatory, but a strong signal of professionalism, especially for young children.",
          "A profile photo and short intro video (where available) — these help you get a feel for personality before the first message.",
        ],
      },
      {
        heading: "How to approach the first message",
        content:
          "The way you reach out to a sitter sets the tone for the relationship. Keep it brief but give them enough to respond meaningfully.",
        items: [
          "Include your children's ages, what you are looking for (regular weekday evenings, occasional weekend nights, or a specific date), and your general neighborhood.",
          "Mention any important requirements upfront — language, pets in the home, children with allergies, or specific care needs. It saves time for both sides.",
          "If you are open to a trial meetup before booking, say so. Most sitters appreciate this and it filters for seriousness on both sides.",
          "Respond promptly. Good sitters get multiple inquiries and tend to book up quickly.",
        ],
      },
      {
        heading: "The meetup before the first booking",
        content:
          "Do not skip the in-person meetup. A 30-minute coffee or home visit before any money changes hands is the single most useful step in finding the right fit.",
        items: [
          "Ideally, meet at your home — it is the environment the sitter will work in, and your kids can warm up naturally.",
          "Have your children present. How a sitter engages with them in the first ten minutes tells you a lot.",
          "Ask a few practical questions: availability, transport, experience with similar ages, approach to bedtime or tantrums.",
          "Trust your gut. If the chemistry is not there or something feels off, it is fine to say you are still meeting a few people.",
        ],
      },
      {
        heading: "Building a reliable backup network",
        content:
          "One great sitter is good. Two or three you can call on is much better — especially in Berlin, where last-minute childcare gaps are common.",
        items: [
          "Once you find one sitter who works well, ask if they have colleagues they would recommend. Many sitters in Berlin know each other through training programs or shared networks.",
          "Keep a shortlist of two or three sitters at different price points and availability patterns. This covers you for last-minute needs and planned travel.",
          "Regular arrangements — even just one evening per week — tend to build stronger trust and reliability than one-off bookings. Consider a standing slot if your schedule allows.",
          "Some families use a mix of a regular sitter for predictable needs and a platform for ad-hoc bookings. That combination tends to work well.",
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
