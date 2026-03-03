"use client";

import Link from "next/link";
import { useState } from "react";

const districts = [
  {
    slug: "wedding",
    name: "Wedding",
    points: "280,30 340,25 370,60 380,110 330,130 270,120 250,80",
    labelX: 310,
    labelY: 80,
  },
  {
    slug: "moabit",
    name: "Moabit",
    points: "150,80 250,80 270,120 330,130 300,170 230,175 170,160 130,120",
    labelX: 220,
    labelY: 130,
  },
  {
    slug: "prenzlauer-berg",
    name: "Prenzlauer Berg",
    points: "370,60 430,50 470,80 480,130 440,160 380,160 330,130 380,110",
    labelX: 405,
    labelY: 110,
  },
  {
    slug: "charlottenburg",
    name: "Charlottenburg",
    points: "30,130 130,120 170,160 230,175 220,240 180,270 100,260 40,220 20,170",
    labelX: 120,
    labelY: 195,
  },
  {
    slug: "mitte",
    name: "Mitte",
    points: "300,170 330,130 380,160 440,160 420,210 370,230 310,220 270,200",
    labelX: 350,
    labelY: 190,
  },
  {
    slug: "friedrichshain",
    name: "Friedrichshain",
    points: "440,160 480,130 530,140 550,190 530,230 480,240 420,210",
    labelX: 480,
    labelY: 190,
  },
  {
    slug: "schoeneberg",
    name: "Schöneberg",
    points: "180,270 220,240 270,200 310,220 300,280 260,310 200,310",
    labelX: 245,
    labelY: 275,
  },
  {
    slug: "kreuzberg",
    name: "Kreuzberg",
    points: "310,220 370,230 420,210 480,240 460,290 400,310 340,300 300,280",
    labelX: 385,
    labelY: 265,
  },
  {
    slug: "steglitz",
    name: "Steglitz",
    points: "100,260 200,310 260,310 250,370 200,400 120,390 70,340 60,290",
    labelX: 160,
    labelY: 340,
  },
  {
    slug: "neukoelln",
    name: "Neukölln",
    points: "300,280 340,300 400,310 460,290 470,350 430,400 350,410 280,380 250,370 260,310",
    labelX: 360,
    labelY: 350,
  },
];

export function BerlinMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-xl">
      <svg viewBox="0 30 580 400" className="w-full h-auto">
        {districts.map((d) => {
          const isHovered = hovered === d.slug;
          return (
            <Link key={d.slug} href={`/babysitter/${d.slug}`}>
              <g
                onMouseEnter={() => setHovered(d.slug)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer"
              >
                <polygon
                  points={d.points}
                  fill={isHovered ? "rgba(212, 132, 92, 0.15)" : "#F3EDE6"}
                  stroke={isHovered ? "#D4845C" : "#E5DDD4"}
                  strokeWidth={isHovered ? 2 : 1.5}
                  className="transition-all duration-200"
                />
                <text
                  x={d.labelX}
                  y={d.labelY}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={isHovered ? "#2C2420" : "#7A6B5D"}
                  fontSize={d.name.length > 12 ? 11 : 13}
                  fontWeight={isHovered ? 500 : 400}
                  className="pointer-events-none select-none transition-all duration-200"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  {d.name}
                </text>
              </g>
            </Link>
          );
        })}
      </svg>
    </div>
  );
}
