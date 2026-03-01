import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      <header className="border-b border-border-default">
        <div className="flex h-14 items-center px-6">
          <Link href="/" className="text-xs font-medium uppercase tracking-[0.2em] text-text-primary">
            FindYourBabysitter
          </Link>
        </div>
      </header>
      <div className="flex flex-1 items-start justify-start px-6 py-16 sm:py-24 sm:px-16 lg:px-24">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
