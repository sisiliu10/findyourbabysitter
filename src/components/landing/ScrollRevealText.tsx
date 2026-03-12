"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, useInView, MotionValue } from "framer-motion";

interface ScrollRevealTextProps {
  title: string;
  body: string;
  highlights?: string[];
  label?: string;
}

// Editorial sentence numbers
const SENTENCE_NUMBERS = ["01", "02", "03"];

export default function ScrollRevealText({
  title,
  body,
  highlights = [],
  label,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-10% 0px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Progress dot visibility — fade in at start, fade out at end of section
  const dotOpacity = useTransform(scrollYProgress, [0, 0.04, 0.94, 1], [0, 1, 1, 0]);

  // Normalise highlight words for matching
  const normHighlights = highlights.map((h) => h.toLowerCase());

  // Split body into sentences by pipe separator
  const sentences = body.split("|").map((s) => s.trim());

  // Pre-count total words for scroll distribution
  const totalWords = sentences.flatMap((s) => s.split(" ")).length;

  // Build sentence entries with global word indices
  let globalIdx = 0;
  const sentenceEntries = sentences.map((sentence) => {
    const words = sentence.split(" ").map((word) => {
      const entry = { word, globalIndex: globalIdx };
      globalIdx++;
      return entry;
    });
    return { words };
  });

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "170vh" }}>
      {/* Scroll progress indicator — right edge, scoped to section */}
      <motion.div
        style={{ opacity: dotOpacity }}
        className="absolute right-5 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none hidden sm:flex z-10"
      >
        <div className="relative h-20 w-px bg-border-default overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-accent"
            style={{
              scaleY: useTransform(scrollYProgress, [0, 1], [0, 1]),
              transformOrigin: "top",
            }}
          />
        </div>
      </motion.div>

      <div className="sticky top-0 min-h-screen flex items-center">
        <div className="mx-auto max-w-4xl px-6 py-10 w-full">

          {/* Section label + title */}
          <div
            ref={titleRef}
            style={{
              opacity: titleInView ? 1 : 0,
              transform: titleInView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s cubic-bezier(0.25,0.1,0.25,1), transform 0.8s cubic-bezier(0.25,0.1,0.25,1)",
            }}
          >
            {label && (
              <p className="text-xs uppercase tracking-widest text-text-muted mb-4">{label}</p>
            )}
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-6 leading-tight">
              {title}
            </h2>
          </div>


          {/* Sentences */}
          <div>
            {sentenceEntries.map((sentence, si) => {
              const firstWordIndex = sentence.words[0].globalIndex;
              const numStart = 0.05 + (firstWordIndex / totalWords) * 0.83;
              const numEnd = Math.min(numStart + 0.08, 0.96);
              const numOpacity = useTransform(scrollYProgress, [numStart, numEnd], [0, 1]);
              const numY = useTransform(scrollYProgress, [numStart, numEnd], [10, 0]);

              return (
                <div key={si}>
                  <div className="flex gap-5 items-start mb-5 sm:mb-6">
                    {/* Editorial sentence number */}
                    <motion.span
                      style={{ opacity: numOpacity, y: numY }}
                      className="font-mono text-xs text-accent mt-2 shrink-0 select-none"
                    >
                      {SENTENCE_NUMBERS[si]}
                    </motion.span>
                    <p className="font-serif text-xl sm:text-2xl lg:text-3xl leading-relaxed text-text-primary">
                      {sentence.words.map((entry, wi) => (
                        <Word
                          key={wi}
                          word={entry.word}
                          globalIndex={entry.globalIndex}
                          totalWords={totalWords}
                          scrollYProgress={scrollYProgress}
                          normHighlights={normHighlights}
                        />
                      ))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Word({
  word,
  globalIndex,
  totalWords,
  scrollYProgress,
  normHighlights,
}: {
  word: string;
  globalIndex: number;
  totalWords: number;
  scrollYProgress: MotionValue<number>;
  normHighlights: string[];
}) {
  const start = 0.05 + (globalIndex / totalWords) * 0.83;
  const windowSize = Math.max(0.06, 0.2 / (totalWords / 25));
  const end = Math.min(start + windowSize, 0.96);

  const opacity = useTransform(scrollYProgress, [start, end], [0.08, 1]);
  const y = useTransform(scrollYProgress, [start, end], [10, 0]);

  const clean = word.toLowerCase().replace(/[^a-zäöüß]/g, "");
  const isHighlight = normHighlights.some((h) => clean === h.replace(/[^a-zäöüß]/g, ""));

  const color = isHighlight
    ? useTransform(scrollYProgress, [start, end], ["#C4A882", "#D4845C"])
    : undefined;

  return (
    <motion.span style={{ opacity, y, color, display: "inline-block", marginRight: "0.28em" }}>
      {word}
    </motion.span>
  );
}

