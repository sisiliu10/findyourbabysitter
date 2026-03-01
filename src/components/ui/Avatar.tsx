"use client";

import { useState } from "react";
import { cn, getInitials } from "@/lib/utils";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  firstName: string;
  lastName: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-xl",
};

function Avatar({
  src,
  firstName,
  lastName,
  size = "md",
  className,
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(firstName, lastName);
  const showImage = src && !imgError;

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center bg-surface-tertiary text-text-secondary font-medium overflow-hidden",
        sizeStyles[size],
        className,
      )}
      role="img"
      aria-label={`${firstName} ${lastName}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={`${firstName} ${lastName}`}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </div>
  );
}

export { Avatar, type AvatarProps };
