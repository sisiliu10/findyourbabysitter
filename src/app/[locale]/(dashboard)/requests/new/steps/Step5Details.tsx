"use client";

import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { WizardState } from "../RequestWizard";

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step5Details({ state, onChange, onNext, onBack }: Props) {
  const t = useTranslations("requestWizard");

  function canContinue() {
    return state.city.trim().length > 0 && state.zipCode.trim().length >= 4;
  }

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-text-primary">{t("step5Title")}</h2>

      <Textarea
        label={t("descriptionLabel")}
        value={state.description}
        onChange={(e) => onChange({ description: e.target.value })}
        placeholder={t("descriptionPlaceholder")}
        rows={4}
        maxLength={2000}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("cityLabel")}
          value={state.city}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="Berlin"
          required
        />
        <Input
          label={t("zipCodeLabel")}
          value={state.zipCode}
          onChange={(e) => onChange({ zipCode: e.target.value })}
          placeholder="10117"
          required
        />
      </div>

      <div className="space-y-1">
        <Input
          label={t("budgetLabel")}
          type="number"
          min="1"
          step="0.5"
          value={state.maxHourlyRate}
          onChange={(e) => onChange({ maxHourlyRate: e.target.value })}
          placeholder="e.g. 20"
        />
        <p className="text-xs text-text-tertiary">{t("budgetHint")}</p>
      </div>

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="text-sm text-text-secondary hover:text-text-primary">
          {t("back")}
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue()}
          className="bg-accent px-6 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {t("continue")}
        </button>
      </div>
    </div>
  );
}
