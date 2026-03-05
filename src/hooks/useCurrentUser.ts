"use client";

import { useState, useEffect } from "react";

interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl: string | null;
  onboarded: boolean;
}

// Module-level cache: Sidebar, MobileNav, Topbar all share one request
let cachedPromise: Promise<CurrentUser | null> | null = null;
let cachedUser: CurrentUser | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60_000; // 60s

function fetchCurrentUser(): Promise<CurrentUser | null> {
  const now = Date.now();
  if (cachedPromise && now - cacheTimestamp < CACHE_TTL) {
    return cachedPromise;
  }
  cacheTimestamp = now;
  cachedPromise = fetch("/api/auth/me")
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => {
      cachedUser = json?.data ?? null;
      return cachedUser;
    })
    .catch(() => {
      cachedUser = null;
      cachedPromise = null;
      return null;
    });
  return cachedPromise;
}

export function invalidateCurrentUser() {
  cachedPromise = null;
  cachedUser = null;
  cacheTimestamp = 0;
}

export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(cachedUser);
  const [loading, setLoading] = useState(cachedUser === null);

  useEffect(() => {
    if (cachedUser) {
      setUser(cachedUser);
      setLoading(false);
      return;
    }
    fetchCurrentUser()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
