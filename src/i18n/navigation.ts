/**
 * Locale-aware navigation helpers.
 * Import Link, useRouter, usePathname, redirect from HERE — not from next/link or next/navigation.
 * They automatically prepend the active locale to all hrefs.
 */
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
