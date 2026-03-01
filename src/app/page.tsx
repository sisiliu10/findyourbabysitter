import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      {/* Nav — thin, left-weighted */}
      <header className="border-b border-border-default">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-xs font-medium uppercase tracking-[0.2em] text-text-primary">
            FindYourBabysitter
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

      <main className="flex-1">
        {/* Hero — left aligned, asymmetric, editorial */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-border-default">
            <div className="lg:col-span-7 py-24 sm:py-32 lg:py-40 lg:pr-16">
              <h1 className="font-serif text-5xl leading-[1.05] tracking-tight text-text-primary sm:text-6xl lg:text-7xl">
                Childcare that<br />
                feels right.
              </h1>
              <p className="mt-8 max-w-md text-base leading-relaxed text-text-secondary">
                Verified babysitters in your neighborhood. Real reviews from real
                parents. No algorithms, no noise — just people you can trust
                with your kids.
              </p>
              <div className="mt-12 flex items-center gap-6">
                <Link
                  href="/register"
                  className="border border-text-primary bg-text-primary px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-surface-primary transition-colors hover:bg-accent hover:border-accent"
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="text-xs uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-primary"
                >
                  Already a member
                </Link>
              </div>
            </div>
            <div className="flex flex-col justify-between py-12 lg:col-span-5 lg:border-l lg:border-border-default lg:pl-12 lg:py-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-drawing.jpg"
                alt="Child's crayon drawing of a house with flowers and sunshine"
                className="w-full h-auto"
                style={{ mixBlendMode: "multiply" }}
              />

              <div className="space-y-6 text-sm text-text-tertiary mt-8">
                <p className="text-xs uppercase tracking-wide text-text-muted">Since 2024</p>
                <div className="space-y-1">
                  <p>1,200+ verified sitters</p>
                  <p>4.8 avg parent rating</p>
                  <p>Background checked</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Two paths — asymmetric grid, not centered cards */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <Link
              href="/register?role=PARENT"
              className="group border-b border-border-default py-16 lg:border-r lg:border-b-0 lg:pr-16"
            >
              <p className="text-xs uppercase tracking-wide text-text-muted mb-4">01</p>
              <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">
                I need a sitter
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">
                Browse verified profiles, read honest reviews, and book
                the right person for your family. Direct and simple.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-text-tertiary transition-colors group-hover:text-accent">
                Start here
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </Link>

            <Link
              href="/register?role=BABYSITTER"
              className="group border-b border-border-default py-16 lg:pl-16"
            >
              <p className="text-xs uppercase tracking-wide text-text-muted mb-4">02</p>
              <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">
                I am a sitter
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary">
                Create your profile, set your own rates and schedule,
                and connect with families who need you.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-text-tertiary transition-colors group-hover:text-accent">
                Start here
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </Link>
          </div>
        </section>

        {/* Trust — horizontal, not 3-column feature grid */}
        <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <p className="text-xs uppercase tracking-wide text-text-muted mb-12">How it works</p>
          <div className="grid grid-cols-1 gap-0 sm:grid-cols-3">
            {[
              {
                num: "01",
                title: "Verified profiles",
                desc: "Every sitter is reviewed and ID-verified before they appear on the platform.",
              },
              {
                num: "02",
                title: "Background checks",
                desc: "Trust badges for sitters who complete our third-party verification process.",
              },
              {
                num: "03",
                title: "Honest reviews",
                desc: "Real feedback from parents who booked. No curated testimonials.",
              },
            ].map((item, i) => (
              <div
                key={item.num}
                className={`py-8 sm:py-0 ${i < 2 ? "border-b sm:border-b-0 sm:border-r border-border-default sm:pr-10" : ""} ${i > 0 ? "sm:pl-10" : ""}`}
              >
                <p className="text-xs text-text-muted mb-3">{item.num}</p>
                <h3 className="text-sm font-medium text-text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-tertiary">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer — minimal, left-weighted */}
      <footer className="border-t border-border-default">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <span className="text-xs uppercase tracking-wide text-text-muted">
            FindYourBabysitter
          </span>
          <span className="text-xs text-text-muted">
            {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
