"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import type { WizardState } from "../RequestWizard";

interface Props {
  state: WizardState;
  onChange: (patch: Partial<WizardState>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

export function Step2Schedule({ state, onChange, onNext, onBack }: Props) {
  const t = useTranslations("requestWizard");

  function toggleDay(day: string) {
    const current = state.recurringDays;
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    onChange({ recurringDays: next });
  }

  function calcDuration(): number {
    if (!state.startTime || !state.endTime) return 0;
    const [sh, sm] = state.startTime.split(":").map(Number);
    const [eh, em] = state.endTime.split(":").map(Number);
    const diff = (eh + em / 60) - (sh + sm / 60);
    return Math.max(0, Math.round(diff * 100) / 100);
  }

  function canContinue(): boolean {
    if (state.careType === "recurring") {
      return state.recurringDays.length > 0 && !!state.startTime && !!state.endTime && calcDuration() > 0;
    }
    return !!state.dateNeeded && !!state.startTime && !!state.endTime && calcDuration() > 0;
  }

  const duration = calcDuration();

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-text-primary">{t("step2Title")}</h2>

      {state.careType === "recurring" ? (
        <div className="space-y-3">
          <label className="text-sm font-medium text-text-primary">{t("selectDays")}</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={cn(
                  "min-w-[44px] border px-3 py-2 text-sm font-medium transition",
                  state.recurringDays.includes(day)
                    ? "border-accent bg-accent text-white"
                    : "border-border-default bg-surface-secondary text-text-secondary hover:border-text-tertiary"
                )}
              >
                {t(`day${day}` as Parameters<typeof t>[0])}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <Input
          label={t("dateNeeded")}
          type="date"
          value={state.dateNeeded}
          onChange={(e) => onChange({ dateNeeded: e.target.value })}
          min={new Date().toISOString().split("T")[0]}
          required
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label={t("startTime")}
          type="time"
          value={state.startTime}
          onChange={(e) => onChange({ startTime: e.target.value })}
          required
        />
        <Input
          label={t("endTime")}
          type="time"
          value={state.endTime}
          onChange={(e) => onChange({ endTime: e.target.value })}
          required
        />
      </div>

      {duration > 0 && (
        <p className="text-sm text-text-secondary">{t("duration", { hours: duration })}</p>
      )}
      {state.endTime && state.startTime && duration <= 0 && (
        <p className="text-sm text-danger">{t("endTimeError")}</p>
      )}

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
