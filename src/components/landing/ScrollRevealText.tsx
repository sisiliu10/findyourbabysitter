"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion, useInView, MotionValue } from "framer-motion";

interface ScrollRevealTextProps {
  title: string;
  body: string;
  highlights?: string[];
  label?: string;
}

// Small decorative 4-pointed star SVG
function SparkleIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2 L13.5 10.5 L22 12 L13.5 13.5 L12 22 L10.5 13.5 L2 12 L10.5 10.5 Z" />
    </svg>
  );
}

// Sentence icons — trust, kita/reviews, ease
const SENTENCE_ICONS = [
  // Two overlapping circles (trust / community)
  <svg key="trust" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
    <circle cx="9" cy="12" r="6" />
    <circle cx="15" cy="12" r="6" />
  </svg>,
  // Star outline (reviews / quality)
  <svg key="star" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>,
  // Checkmark circle (ease / speed)
  <svg key="check" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <polyline points="8,12 11,15 16,9" />
  </svg>,
];

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

  // Scroll hint arrow — visible until user starts scrolling
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

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

  // Separator trigger points
  const sep1Progress = (sentenceEntries[0].words.length / totalWords) * 0.8 + 0.05;
  const sep2Progress =
    ((sentenceEntries[0].words.length + sentenceEntries[1].words.length) / totalWords) * 0.8 + 0.05;

  return (
    <div ref={containerRef} className="relative" style={{ minHeight: "200vh" }}>
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
        <div className="mx-auto max-w-4xl px-6 py-16 w-full">

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
            <h2 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-10 leading-tight">
              {title}
            </h2>
          </div>

          {/* Scroll hint */}
          <motion.div
            style={{ opacity: hintOpacity }}
            className="flex flex-col items-start gap-1 mb-10 text-text-muted"
          >
            <span className="text-xs uppercase tracking-widest">scroll</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-bounce"
              aria-hidden
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>

          {/* Sentences */}
          <div>
            {sentenceEntries.map((sentence, si) => {
              const firstWordIndex = sentence.words[0].globalIndex;
              const iconStart = 0.05 + (firstWordIndex / totalWords) * 0.83;
              const iconEnd = Math.min(iconStart + 0.08, 0.96);
              const iconOpacity = useTransform(scrollYProgress, [iconStart, iconEnd], [0.08, 1]);
              const iconY = useTransform(scrollYProgress, [iconStart, iconEnd], [10, 0]);

              return (
                <div key={si}>
                  <p className="font-serif text-xl sm:text-2xl lg:text-3xl leading-relaxed text-text-primary mb-10 sm:mb-12">
                    {/* Sentence icon */}
                    <motion.span
                      style={{ opacity: iconOpacity, y: iconY, display: "inline-block", marginRight: "0.4em", verticalAlign: "middle", color: "var(--color-accent)" }}
                    >
                      {SENTENCE_ICONS[si]}
                    </motion.span>
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

  const underlineScaleX = isHighlight
    ? useTransform(scrollYProgress, [start, end], [0, 1])
    : undefined;

  if (isHighlight) {
    return (
      <motion.span
        style={{ opacity, y, color, display: "inline-block", marginRight: "0.28em", position: "relative" }}
      >
        {word}
        <motion.span
          style={{
            scaleX: underlineScaleX,
            transformOrigin: "left",
            position: "absolute",
            bottom: "-2px",
            left: 0,
            width: "100%",
            height: "2px",
            background: "#D4845C",
            display: "block",
          }}
        />
      </motion.span>
    );
  }

  return (
    <motion.span style={{ opacity, y, display: "inline-block", marginRight: "0.28em" }}>
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
  const opacity = useTransform(scrollYProgress, [triggerAt - 0.02, triggerAt + 0.05], [0, 1]);
  const scale = useTransform(scrollYProgress, [triggerAt - 0.02, triggerAt + 0.05], [0.6, 1]);

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
