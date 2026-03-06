"use client";

import {
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type PointerEvent,
} from "react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface SwipeCardProps {
  children: ReactNode;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
}

const SWIPE_THRESHOLD = 100;
const MAX_ROTATION = 12;

export function SwipeCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  isTop,
}: SwipeCardProps) {
  const t = useTranslations("search");
  const cardRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [exiting, setExiting] = useState<"left" | "right" | null>(null);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!isTop) return;
      setDragging(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      cardRef.current?.setPointerCapture(e.pointerId);
    },
    [isTop]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      setOffset({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y,
      });
    },
    [dragging, startPos]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      cardRef.current?.releasePointerCapture(e.pointerId);
      setDragging(false);

      if (offset.x > SWIPE_THRESHOLD) {
        setExiting("right");
        setTimeout(onSwipeRight, 300);
      } else if (offset.x < -SWIPE_THRESHOLD) {
        setExiting("left");
        setTimeout(onSwipeLeft, 300);
      } else {
        setOffset({ x: 0, y: 0 });
      }
    },
    [dragging, offset.x, onSwipeLeft, onSwipeRight]
  );

  const rotation = dragging
    ? (offset.x / (typeof window !== "undefined" ? window.innerWidth : 400)) *
      MAX_ROTATION
    : 0;

  const swipeDirection =
    offset.x > SWIPE_THRESHOLD
      ? "right"
      : offset.x < -SWIPE_THRESHOLD
        ? "left"
        : null;

  const cardStyle = exiting
    ? {
        transform: `translateX(${exiting === "right" ? "120vw" : "-120vw"}) rotate(${exiting === "right" ? MAX_ROTATION : -MAX_ROTATION}deg)`,
        transition: "transform 0.3s ease-out",
      }
    : dragging
      ? {
          transform: `translate(${offset.x}px, ${offset.y * 0.3}px) rotate(${rotation}deg)`,
          transition: "none",
          cursor: "grabbing",
        }
      : {
          transform: "translate(0, 0) rotate(0deg)",
          transition: "transform 0.3s ease-out",
        };

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-0 touch-none select-none",
        isTop ? "z-20 cursor-grab" : "z-10"
      )}
      style={cardStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Swipe indicators — soft glow overlay instead of hard borders */}
      {isTop && dragging && (
        <>
          {/* Green glow for LIKE */}
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity"
            style={{
              opacity: Math.min(Math.max(offset.x / SWIPE_THRESHOLD, 0), 0.6),
              boxShadow: "inset 0 0 60px rgba(90, 138, 98, 0.4)",
            }}
          />
          {/* Red glow for NOPE */}
          <div
            className="pointer-events-none absolute inset-0 z-30 transition-opacity"
            style={{
              opacity: Math.min(Math.max(-offset.x / SWIPE_THRESHOLD, 0), 0.6),
              boxShadow: "inset 0 0 60px rgba(196, 90, 74, 0.4)",
            }}
          />
          {/* LIKE label */}
          <div
            className="pointer-events-none absolute left-6 top-10 z-30 bg-success/90 px-5 py-2 text-lg font-semibold uppercase tracking-[0.2em] text-white shadow-lg"
            style={{
              opacity: Math.min(Math.max(offset.x / SWIPE_THRESHOLD, 0), 1),
              transform: "rotate(-12deg)",
            }}
          >
            {t("like")}
          </div>
          {/* NOPE label */}
          <div
            className="pointer-events-none absolute right-6 top-10 z-30 bg-danger/90 px-5 py-2 text-lg font-semibold uppercase tracking-[0.2em] text-white shadow-lg"
            style={{
              opacity: Math.min(
                Math.max(-offset.x / SWIPE_THRESHOLD, 0),
                1
              ),
              transform: "rotate(12deg)",
            }}
          >
            {t("nope")}
          </div>
        </>
      )}
      {children}
    </div>
  );
}
