"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import type { WizardState } from "../RequestWizard";

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onNext: () => void;
}

export function Step1CareType({ state, onChange, onNext }: Props) {
  const t = useTranslations("requestWizard");

  function select(careType: "recurring" | "occasional") {
    onChange({ careType });
    setTimeout(onNext, 200);
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-xl text-text-primary">{t("step1Title")}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => select("recurring")}
          className={cn(
            "flex flex-col items-start gap-2 border-2 p-6 text-left transition",
            state.careType === "recurring"
              ? "border-accent bg-accent-muted"
              : "border-border-default bg-surface-secondary hover:border-text-tertiary"
          )}
        >
          <span className="text-2xl">🔄</span>
          <span className="text-base font-semibold text-text-primary">{t("recurring")}</span>
          <span className="text-sm text-text-secondary">{t("recurringDesc")}</span>
        </button>
        <button
          type="button"
          onClick={() => select("occasional")}
          className={cn(
            "flex flex-col items-start gap-2 border-2 p-6 text-left transition",
            state.careType === "occasional"
              ? "border-accent bg-accent-muted"
              : "border-border-default bg-surface-secondary hover:border-text-tertiary"
          )}
        >
          <span className="text-2xl">📅</span>
          <span className="text-base font-semibold text-text-primary">{t("occasional")}</span>
          <span className="text-sm text-text-secondary">{t("occasionalDesc")}</span>
        </button>
      </div>
    </div>
  );
}
