import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-primary px-6 text-center">
      <h1 className="font-serif text-6xl text-text-primary">404</h1>
      <p className="mt-4 text-lg text-text-secondary">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 border border-text-primary bg-text-primary px-8 py-3.5 text-surface-primary transition-colors hover:bg-accent"
      >
        Back to homepage
      </Link>
    </div>
  );
}
