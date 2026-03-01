import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-primary">
      {/* Nav — thin, left-weighted */}
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

      <main className="flex-1">
        {/* Hero — left aligned, asymmetric, editorial */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center border-b border-border-default">
            <div className="lg:col-span-7 py-16 sm:py-20 lg:py-24 lg:pr-16">
              <h1 className="font-serif text-4xl leading-[1.1] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
                Childcare that feels right.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-text-secondary">
                Stop scrolling through random profiles.<br />
                Start with babysitters your friends actually use.<br />
                Verified, reviewed, and easy to book in one place.
              </p>
              <div className="mt-10 flex items-center gap-6">
                <Link
                  href="/register"
                  className="border border-text-primary bg-text-primary px-8 py-3.5 text-sm font-medium text-surface-primary transition-colors hover:bg-accent hover:border-accent"
                >
                  Get started
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-text-tertiary transition-colors hover:text-text-primary"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 lg:pl-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-drawing.jpg"
                alt="Child's crayon drawing of a house with flowers and sunshine"
                className="w-full h-auto"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
          </div>
        </section>

        {/* Two paths */}
        <section className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-6">
            <Link
              href="/register?role=PARENT"
              className="group relative overflow-hidden p-8 sm:p-10 transition-transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #E8C9A0, #F2D9B6, #E0B88A, #E8C9A0)",
                backgroundSize: "300% 300%",
                animation: "gradientShift 8s ease infinite",
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-text-primary/40 mb-3">For parents</p>
              <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">
                I need a sitter
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-primary/60">
                Browse profiles, read reviews, book the right person.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-primary/40 transition-colors group-hover:text-text-primary">
                Get started
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </Link>

            <Link
              href="/register?role=BABYSITTER"
              className="group relative overflow-hidden p-8 sm:p-10 transition-transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #C4D8E2, #D6E6EE, #B8CFD9, #C4D8E2)",
                backgroundSize: "300% 300%",
                animation: "gradientShift 8s ease infinite 2s",
              }}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-text-primary/40 mb-3">For sitters</p>
              <h2 className="font-serif text-3xl text-text-primary sm:text-4xl">
                I am a sitter
              </h2>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-primary/60">
                Create your profile, set your rates, connect with families.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-primary/40 transition-colors group-hover:text-text-primary">
                Get started
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </span>
            </Link>
          </div>
        </section>

        {/* Trust — horizontal, not 3-column feature grid */}
        <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
          <p className="text-xs uppercase tracking-wide text-text-muted mb-8">How it works</p>
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
            Berlin Babysitter
          </span>
          <span className="text-xs text-text-muted">
            {new Date().getFullYear()}
          </span>
        </div>
      </footer>
    </div>
  );
}
