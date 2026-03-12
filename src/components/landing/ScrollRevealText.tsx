"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, useInView } from "framer-motion";

interface ScrollRevealTextProps {
  title: string;
  body: string;
}

export default function ScrollRevealText({ title, body }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-10% 0px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const words = body.split(" ");
  const total = words.length;

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "220vh" }}>
      <div className="sticky top-0 min-h-screen flex items-center">
        <div className="mx-auto max-w-5xl px-6 py-20">
          <h2
            ref={titleRef}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-text-primary mb-10 leading-tight"
            style={{
              opacity: titleInView ? 1 : 0,
              transform: titleInView ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {title}
          </h2>
          <p className="font-serif text-xl sm:text-2xl lg:text-3xl leading-relaxed text-text-primary">
            {words.map((word, i) => (
              <Word
                key={i}
                word={word}
                index={i}
                total={total}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

function Word({
  word,
  index,
  total,
  scrollYProgress,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Each word reveals across a window of the scroll range
  // Start revealing at 5% of scroll, finish at 85%
  const start = 0.05 + (index / total) * 0.8;
  const end = start + 0.18 / (total / 30);

  const opacity = useTransform(scrollYProgress, [start, Math.min(end, 0.95)], [0.12, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {word}
    </motion.span>
  );
}
