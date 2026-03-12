"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, useInView, MotionValue } from "framer-motion";

interface ScrollRevealTextProps {
  title: string;
  body: string;
  highlights?: string[];
}

// Small decorative 4-pointed star SVG
function SparkleIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

export default function ScrollRevealText({ title, body, highlights = [] }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const titleInView = useInView(titleRef, { once: true, margin: "-10% 0px" });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Normalise highlight words for matching (strip punctuation)
  const normHighlights = highlights.map((h) => h.toLowerCase());

  // Split body into sentences by pipe separator
  const sentences = body.split("|").map((s) => s.trim());

  // Pre-count total words across all sentences for scroll distribution
  const allWords = sentences.flatMap((s) => s.split(" "));
  const totalWords = allWords.length;

  // Build a flat word list with sentence boundaries
  type WordEntry = { word: string; globalIndex: number };
  type SentenceEntry = { words: WordEntry[] };
  let globalIdx = 0;
  const sentenceEntries: SentenceEntry[] = sentences.map((sentence) => {
    const words = sentence.split(" ").map((word) => {
      const entry: WordEntry = { word, globalIndex: globalIdx };
      globalIdx++;
      return entry;
    });
    return { words };
  });

  // Separator appears midway through each inter-sentence gap
  // sep1 appears between sentence 0 and 1, sep2 between 1 and 2
  const sep1Progress = (sentenceEntries[0].words.length / totalWords) * 0.8 + 0.05;
  const sep2Progress = ((sentenceEntries[0].words.length + sentenceEntries[1].words.length) / totalWords) * 0.8 + 0.05;

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "200vh" }}>
      {/* Scroll progress indicator — right edge */}
      <ProgressDot scrollYProgress={scrollYProgress} />

      <div className="sticky top-0 min-h-screen flex items-center">
        <div className="mx-auto max-w-4xl px-6 py-16">
          {/* Title */}
          <h2
            ref={titleRef}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-14 leading-tight"
            style={{
              opacity: titleInView ? 1 : 0,
              transform: titleInView ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.8s cubic-bezier(0.25,0.1,0.25,1), transform 0.8s cubic-bezier(0.25,0.1,0.25,1)",
            }}
          >
            {title}
          </h2>

          {/* Sentences */}
          <div className="space-y-0">
            {sentenceEntries.map((sentence, si) => (
              <div key={si}>
                <p className="font-serif text-xl sm:text-2xl lg:text-3xl leading-relaxed text-text-primary mb-10 sm:mb-12">
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

                {/* Decorative separator between sentences */}
                {si < sentenceEntries.length - 1 && (
                  <SentenceSeparator
                    scrollYProgress={scrollYProgress}
                    triggerAt={si === 0 ? sep1Progress : sep2Progress}
                  />
                )}
              </div>
            ))}
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
  // Scroll range: reveal starts at 5%, ends at 88%
  const start = 0.05 + (globalIndex / totalWords) * 0.83;
  const windowSize = Math.max(0.06, 0.2 / (totalWords / 25));
  const end = Math.min(start + windowSize, 0.96);

  const opacity = useTransform(scrollYProgress, [start, end], [0.08, 1]);
  const y = useTransform(scrollYProgress, [start, end], [10, 0]);

  // Check if this word (stripped of punctuation) is a highlight
  const clean = word.toLowerCase().replace(/[^a-zäöüß]/g, "");
  const isHighlight = normHighlights.some((h) => clean === h.replace(/[^a-zäöüß]/g, ""));

  const color = isHighlight
    ? useTransform(scrollYProgress, [start, end], ["#C4A882", "#D4845C"])
    : undefined;

  return (
    <motion.span
      style={{ opacity, y, color, display: "inline-block", marginRight: "0.28em" }}
    >
      {word}
    </motion.span>
  );
}

function SentenceSeparator({
  scrollYProgress,
  triggerAt,
}: {
  scrollYProgress: MotionValue<number>;
  triggerAt: number;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [triggerAt - 0.02, triggerAt + 0.05],
    [0, 1]
  );
  const scale = useTransform(
    scrollYProgress,
    [triggerAt - 0.02, triggerAt + 0.05],
    [0.6, 1]
  );

  return (
    <motion.div
      style={{ opacity, scale }}
      className="flex items-center gap-3 mb-10 sm:mb-12 text-accent/50"
    >
      <SparkleIcon size={10} />
      <SparkleIcon size={14} />
      <SparkleIcon size={10} />
    </motion.div>
  );
}

function ProgressDot({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 h-20 flex flex-col items-center gap-1 z-10 pointer-events-none hidden sm:flex">
      <div className="w-px h-full bg-border-default relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-full bg-accent"
          style={{ scaleY, transformOrigin: "top" }}
        />
      </div>
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-accent"
        style={{ opacity: useTransform(scrollYProgress, [0, 0.05], [0, 1]) }}
      />
    </div>
  );
}
