"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Lightweight navigation timing instrumentation.
 * Logs tab-switch duration using the Performance API.
 * Mount this once in the dashboard layout.
 */
export function NavigationTimings() {
  const pathname = usePathname();
  const navStart = useRef<number>(0);
  const prevPath = useRef<string>(pathname);

  useEffect(() => {
    if (prevPath.current !== pathname) {
      // Navigation completed — measure the time
      const duration = performance.now() - navStart.current;
      const from = prevPath.current;
      const to = pathname;

      if (duration > 0 && duration < 30_000) {
        console.log(
          `[nav] ${from} → ${to}: ${duration.toFixed(0)}ms`
        );

        // Also record as a Performance measure for DevTools
        try {
          performance.measure(`nav:${from}→${to}`, {
            start: navStart.current,
            duration,
          });
        } catch {
          // Older browsers may not support this overload
        }

        if (duration > 2000) {
          console.warn(`[nav] Slow navigation: ${duration.toFixed(0)}ms (${from} → ${to})`);
        }
      }

      prevPath.current = pathname;
    }
  }, [pathname]);

  // Capture the start time when pathname is about to change
  // We use a click listener on nav links to mark the start
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (anchor?.href && !anchor.href.startsWith("http")) {
        navStart.current = performance.now();
      }
      // Also handle internal Next.js links (relative hrefs)
      if (anchor?.getAttribute("href")?.startsWith("/")) {
        navStart.current = performance.now();
      }
    }

    document.addEventListener("click", handleClick, { capture: true });
    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
