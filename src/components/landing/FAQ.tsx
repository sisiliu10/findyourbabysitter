import type { FAQ as FAQType } from "@/data/landing-pages";

export function FAQ({ items }: { items: FAQType[] }) {
  return (
    <div className="divide-y divide-border-default border-y border-border-default">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer items-center justify-between py-5 text-sm font-medium text-text-primary transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            <span className="pr-4">{item.question}</span>
            <svg
              className="h-4 w-4 flex-shrink-0 text-text-muted transition-transform group-open:rotate-45"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </summary>
          <p className="pb-5 pr-8 text-sm leading-relaxed text-text-secondary">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
