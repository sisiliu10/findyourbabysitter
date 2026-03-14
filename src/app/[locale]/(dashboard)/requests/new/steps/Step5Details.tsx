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

const BERLIN_ZIP_RE = /^(10|12|13|14)\d{3}$/;

function isBerlinZip(zip: string) {
  return BERLIN_ZIP_RE.test(zip.trim());
}

function isBerlinCity(city: string) {
  return city.trim().toLowerCase().includes("berlin");
}

export function Step5Details({ state, onChange, onNext, onBack }: Props) {
  const t = useTranslations("requestWizard");

  const MIN_DESCRIPTION = 20;

  const zipTouched = state.zipCode.trim().length > 0;
  const cityTouched = state.city.trim().length > 0;
  const zipValid = isBerlinZip(state.zipCode);
  const cityValid = isBerlinCity(state.city);

  function canContinue() {
    return (
      state.description.trim().length >= MIN_DESCRIPTION &&
      cityValid &&
      zipValid
    );
  }

  const descLen = state.description.trim().length;
  const descMet = descLen >= MIN_DESCRIPTION;

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-text-primary">{t("step5Title")}</h2>

      <div className="space-y-1">
        <Textarea
          label={t("descriptionLabel")}
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder={t("descriptionPlaceholder")}
          rows={4}
          maxLength={2000}
        />
        <p className={`text-xs ${descMet ? "text-success" : "text-text-tertiary"}`}>
          {descMet
            ? t("descriptionMinHintDone", { current: descLen })
            : t("descriptionMinHint", { current: descLen, min: MIN_DESCRIPTION })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Input
            label={t("cityLabel")}
            value={state.city}
            onChange={(e) => onChange({ city: e.target.value })}
            placeholder="Berlin"
            required
          />
          {cityTouched && !cityValid && (
            <p className="flex items-center gap-1 text-xs text-danger">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {t("cityErrorBerlin")}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Input
            label={t("zipCodeLabel")}
            value={state.zipCode}
            onChange={(e) => onChange({ zipCode: e.target.value })}
            placeholder="10117"
            required
            maxLength={5}
          />
          {zipTouched && !zipValid && (
            <p className="flex items-center gap-1 text-xs text-danger">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              {t("zipErrorBerlin")}
            </p>
          )}
        </div>
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
