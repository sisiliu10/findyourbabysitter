import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border-default">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xs font-medium uppercase tracking-[0.2em] text-text-primary">
          Berlin Babysitter
        </Link>
        <div className="flex items-center gap-8">
          <Link
            href="/login"
            className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="border border-text-primary bg-text-primary px-5 py-2 text-xs font-medium uppercase tracking-wide text-surface-primary transition-colors hover:bg-accent hover:border-accent"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
