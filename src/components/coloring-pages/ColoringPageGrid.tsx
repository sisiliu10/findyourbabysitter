"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import type { ColoringPage } from "@/data/coloring-pages";

interface Props {
  pages: ColoringPage[];
}

export function ColoringPageGrid({ pages }: Props) {
  const t = useTranslations("coloringPages");

  const handleDownload = useCallback((fileName: string, title: string) => {
    const ext = fileName.split(".").pop() ?? "jpg";
    const link = document.createElement("a");
    link.href = `/coloring-pages/${fileName}`;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}-coloring-page.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {pages.map((page) => (
        <div
          key={page.slug}
          className="group border border-border-default bg-surface-secondary transition-colors hover:border-text-primary"
        >
          {/* Image preview */}
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

            {/* Download button */}
            <div className="mt-4">
              <button
                onClick={() => handleDownload(page.fileName, page.title)}
                className="w-full border border-text-primary bg-text-primary px-3 py-2 text-xs font-medium uppercase tracking-wide text-surface-primary transition-colors hover:bg-accent hover:border-accent"
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
  );
}
