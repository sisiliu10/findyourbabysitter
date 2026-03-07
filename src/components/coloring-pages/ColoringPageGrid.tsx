"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import type { AgeCategory, ColoringPage } from "@/data/coloring-pages";

interface Props {
  categories: AgeCategory[];
  pages: ColoringPage[];
}

export function ColoringPageGrid({ categories, pages }: Props) {
  const t = useTranslations("coloringPages");
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id ?? ""
  );

  const filteredPages = pages.filter((p) => p.categoryId === activeCategory);
  const activeCat = categories.find((c) => c.id === activeCategory);

  const handleDownload = useCallback((fileName: string, title: string) => {
    const link = document.createElement("a");
    link.href = `/coloring-pages/${fileName}`;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-coloring-page.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handlePrint = useCallback((fileName: string) => {
    window.open(`/coloring-pages/${fileName}`, "_blank");
  }, []);

  return (
    <>
      {/* Category pills */}
      <div className="flex flex-wrap items-center gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 text-xs font-medium uppercase tracking-wide transition-colors ${
              activeCategory === cat.id
                ? "border border-text-primary bg-text-primary text-surface-primary"
                : "border border-border-default text-text-secondary hover:border-text-primary hover:text-text-primary"
            }`}
          >
            {cat.title}
            <span className="ml-1.5 text-[10px] opacity-60">
              {cat.subtitle}
            </span>
          </button>
        ))}
      </div>

      {/* Active category description */}
      {activeCat && (
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-text-secondary">
          {activeCat.description}
        </p>
      )}

      {/* Card grid */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredPages.map((page) => (
          <div
            key={page.slug}
            className="group border border-border-default bg-surface-secondary transition-colors hover:border-text-primary"
          >
            {/* SVG preview */}
            <div className="relative aspect-[3/4] w-full overflow-hidden border-b border-border-default bg-white p-4 flex items-center justify-center">
              <img
                src={`/coloring-pages/${page.fileName}`}
                alt={page.title}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>

            {/* Card body */}
            <div className="p-5">
              <h3 className="font-serif text-lg text-text-primary">
                {page.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-text-tertiary line-clamp-2">
                {page.description}
              </p>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handlePrint(page.fileName)}
                  className="flex-1 border border-border-default px-3 py-2 text-xs font-medium uppercase tracking-wide text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 9h.008v.008h-.008V9zm-3 0h.008v.008h-.008V9z"
                      />
                    </svg>
                    {t("print")}
                  </span>
                </button>
                <button
                  onClick={() => handleDownload(page.fileName, page.title)}
                  className="flex-1 border border-text-primary bg-text-primary px-3 py-2 text-xs font-medium uppercase tracking-wide text-surface-primary transition-colors hover:bg-accent hover:border-accent"
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <svg
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    {t("download")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
