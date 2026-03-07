"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const POLL_INTERVAL = 15_000; // 15 seconds

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(() => {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio("/sounds/notification.wav");
        audioRef.current.volume = 0.5;
      }
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } catch {
      // Ignore audio errors (e.g. autoplay blocked)
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/messages/unread");
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;

        const newCount = json.data?.count ?? 0;
        setCount(newCount);

        // Play sound if count increased (not on first load)
        if (prevCount.current > 0 || newCount > 0) {
          if (newCount > prevCount.current) {
            playSound();
          }
        }
        prevCount.current = newCount;
      } catch {
        // Silently ignore fetch errors
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, POLL_INTERVAL);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [playSound]);

  return count;
}
