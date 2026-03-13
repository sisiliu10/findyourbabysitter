"use client";

import { useTranslations } from "next-intl";
import type { WizardState } from "../RequestWizard";

interface Props {
  state: WizardState;
  onSubmit: () => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

const DAY_LABELS: Record<string, string> = {
  MON: "Mon", TUE: "Tue", WED: "Wed", THU: "Thu", FRI: "Fri", SAT: "Sat", SUN: "Sun",
};

const CAT_LABELS: Record<string, string> = {
  after_school: "After school",
  full_day: "Full day",
  overnight: "Overnight",
  date_night: "Date night / Evening",
  other: "Other",
};

export function Step6Review({ state, onSubmit, onBack, loading, error }: Props) {
  const t = useTranslations("requestWizard");

  function formatSchedule(): string {
    if (state.careType === "recurring") {
      const days = state.recurringDays.map((d) => DAY_LABELS[d] ?? d).join(", ");
      return `${days} · ${state.startTime}–${state.endTime}`;
    }
    if (state.dateNeeded) {
      const date = new Date(state.dateNeeded + "T00:00:00").toLocaleDateString("en-DE", {
        weekday: "short", year: "numeric", month: "short", day: "numeric",
      });
      return `${date} · ${state.startTime}–${state.endTime}`;
    }
    return `${state.startTime}–${state.endTime}`;
  }

  function formatChildren(): string {
    return state.childrenAgeRanges
      .map((r, i) => `Child ${i + 1}: ${r} yrs`)
      .join(", ");
  }

  const rows: { label: string; value: string }[] = [
    { label: t("careTypeSummary"), value: state.careType === "recurring" ? t("recurring") : t("occasional") },
    { label: t("scheduleSummary"), value: formatSchedule() },
    { label: t("childrenSummary"), value: formatChildren() },
    { label: t("categorySummary"), value: state.careCategory ? (CAT_LABELS[state.careCategory] ?? state.careCategory) : "—" },
    { label: t("descriptionSummary"), value: state.description || t("noDescription") },
    { label: t("locationSummary"), value: `${state.city} · ${state.zipCode}` },
    { label: t("budgetSummary"), value: state.maxHourlyRate ? `€${state.maxHourlyRate}/h` : t("noBudget") },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl text-text-primary">{t("step6Title")}</h2>

      <div className="divide-y divide-border-default border border-border-default bg-surface-secondary">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex gap-4 px-4 py-3">
            <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-text-tertiary">{label}</span>
            <span className="text-sm text-text-primary">{value}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="border border-danger/30 bg-danger-muted p-3 text-sm text-danger">{error}</div>
      )}

      <div className="flex justify-between pt-2">
        <button type="button" onClick={onBack} className="text-sm text-text-secondary hover:text-text-primary">
          {t("back")}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="bg-accent px-8 py-2.5 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? t("submitting") : t("submit")}
        </button>
      </div>
    </div>
  );
}
