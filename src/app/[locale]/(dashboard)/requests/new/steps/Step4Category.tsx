"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { WizardState } from "../RequestWizard";

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  { key: "after_school", icon: "🏫" },
  { key: "full_day", icon: "☀️" },
  { key: "overnight", icon: "🌙" },
  { key: "date_night", icon: "🌆" },
  { key: "other", icon: "✨" },
] as const;

export function Step4Category({ state, onChange, onNext, onBack }: Props) {
  const t = useTranslations("requestWizard");

  function select(key: string) {
    onChange({ careCategory: key });
    setTimeout(onNext, 200);
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl text-text-primary">{t("step4Title")}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {CATEGORIES.map(({ key, icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => select(key)}
            className={cn(
              "flex items-center gap-3 border-2 p-4 text-left transition",
              state.careCategory === key
                ? "border-accent bg-accent-muted"
                : "border-border-default bg-surface-secondary hover:border-text-tertiary"
            )}
          >
            <span className="text-xl">{icon}</span>
            <span className="text-sm font-medium text-text-primary">
              {t(`cat_${key}` as Parameters<typeof t>[0])}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="text-sm text-text-secondary hover:text-text-primary">
          {t("back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!state.careCategory}
          className="bg-accent px-6 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
