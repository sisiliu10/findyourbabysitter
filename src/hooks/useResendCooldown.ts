import { useState, useEffect } from "react";

const COOLDOWN_SECONDS = 30;

export function useResendCooldown() {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  return {
    cooldown,
    startCooldown: () => setCooldown(COOLDOWN_SECONDS),
    isOnCooldown: cooldown > 0,
  };
}
