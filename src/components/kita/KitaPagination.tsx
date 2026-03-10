"use client";

import { useTranslations } from "next-intl";

interface KitaPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function KitaPagination({ page, totalPages, total, onPageChange }: KitaPaginationProps) {
  const t = useTranslations("kitaSearch");

  if (totalPages <= 1) return null;

  // Build page numbers to display
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between border-t border-border-default pt-4">
      <span className="text-xs text-text-tertiary">
        {t("totalResults", { count: total })}
      </span>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="border border-border-default px-3 py-1.5 text-xs uppercase tracking-wide text-text-secondary transition-colors hover:border-border-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("previous")}
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`dots-${i}`} className="px-1 text-xs text-text-muted">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`min-w-[32px] border px-2 py-1.5 text-xs transition-colors ${
                p === page
                  ? "border-text-primary bg-text-primary text-surface-primary"
                  : "border-border-default text-text-secondary hover:border-border-hover"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="border border-border-default px-3 py-1.5 text-xs uppercase tracking-wide text-text-secondary transition-colors hover:border-border-hover disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {t("next")}
        </button>
      </div>
    </div>
  );
}
