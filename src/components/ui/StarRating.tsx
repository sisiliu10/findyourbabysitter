"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

function StarIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function StarRating({ value, onChange, readonly = false, size = "md", className }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);
  const isInteractive = !readonly && !!onChange;

  const handleClick = useCallback((star: number) => { if (isInteractive) onChange(star); }, [isInteractive, onChange]);
  const handleMouseEnter = useCallback((star: number) => { if (isInteractive) setHoverValue(star); }, [isInteractive]);
  const handleMouseLeave = useCallback(() => { if (isInteractive) setHoverValue(0); }, [isInteractive]);

  const displayValue = hoverValue || value;

  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} onMouseLeave={handleMouseLeave} role={isInteractive ? "radiogroup" : "img"} aria-label={`Rating: ${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= displayValue;
        if (isInteractive) {
          return (
            <button key={star} type="button" onClick={() => handleClick(star)} onMouseEnter={() => handleMouseEnter(star)}
              className={cn("transition-transform duration-100 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-text-primary focus-visible:ring-offset-1", filled ? "text-warning" : "text-text-muted")}
              role="radio" aria-checked={star === value} aria-label={`${star} star${star !== 1 ? "s" : ""}`}>
              <StarIcon filled={filled} className={sizeStyles[size]} />
            </button>
          );
        }
        return (
          <span key={star} className={cn(filled ? "text-warning" : "text-text-muted")}>
            <StarIcon filled={filled} className={sizeStyles[size]} />
          </span>
        );
      })}
    </div>
  );
}

export { StarRating, type StarRatingProps };
