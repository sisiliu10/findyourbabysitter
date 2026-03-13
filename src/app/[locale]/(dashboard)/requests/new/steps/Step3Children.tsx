"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { WizardState } from "../RequestWizard";

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const AGE_RANGES = ["0-1", "1-2", "2-3", "3-5", "5-8", "8-12", "12+"] as const;
const AGE_RANGE_KEYS: Record<string, string> = {
  "0-1": "ageRange_0_1",
  "1-2": "ageRange_1_2",
  "2-3": "ageRange_2_3",
  "3-5": "ageRange_3_5",
  "5-8": "ageRange_5_8",
  "8-12": "ageRange_8_12",
  "12+": "ageRange_12plus",
};

export function Step3Children({ state, onChange, onNext, onBack }: Props) {
  const t = useTranslations("requestWizard");

  function setCount(n: number) {
    const ranges = [...state.childrenAgeRanges];
    while (ranges.length < n) ranges.push("3-5");
    onChange({ numberOfChildren: n, childrenAgeRanges: ranges.slice(0, n) });
  }

  function setAgeRange(index: number, range: string) {
    const next = [...state.childrenAgeRanges];
    next[index] = range;
    onChange({ childrenAgeRanges: next });
  }

  const counts = [1, 2, 3, 4];

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-text-primary">{t("step3Title")}</h2>

      <div className="space-y-3">
        <label className="text-sm font-medium text-text-primary">{t("numberOfChildren")}</label>
        <div className="flex gap-2">
          {counts.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setCount(n)}
              className={cn(
                "h-12 w-12 border text-sm font-semibold transition",
                state.numberOfChildren === n
                  ? "border-accent bg-accent text-white"
                  : "border-border-default bg-surface-secondary text-text-secondary hover:border-text-tertiary"
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: state.numberOfChildren }, (_, i) => (
          <div key={i} className="space-y-1">
            <label className="text-sm font-medium text-text-primary">
              {t("child", { n: i + 1 })} — {t("ageRange")}
            </label>
            <div className="flex flex-wrap gap-2">
              {AGE_RANGES.map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setAgeRange(i, range)}
                  className={cn(
                    "border px-3 py-1.5 text-xs font-medium transition",
                    state.childrenAgeRanges[i] === range
                      ? "border-accent bg-accent text-white"
                      : "border-border-default bg-surface-secondary text-text-secondary hover:border-text-tertiary"
                  )}
                >
                  {t(AGE_RANGE_KEYS[range] as Parameters<typeof t>[0])}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="text-sm text-text-secondary hover:text-text-primary">
          {t("back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-accent px-6 py-2 text-sm font-medium text-white"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
