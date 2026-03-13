"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createRequest } from "@/actions/request.actions";
import { WizardProgress } from "./WizardProgress";
import { Step1CareType } from "./steps/Step1CareType";
import { Step2Schedule } from "./steps/Step2Schedule";
import { Step3Children } from "./steps/Step3Children";
import { Step4Category } from "./steps/Step4Category";
import { Step5Details } from "./steps/Step5Details";
import { Step6Review } from "./steps/Step6Review";

export interface WizardState {
  careType: "recurring" | "occasional" | null;
  recurringDays: string[];
  dateNeeded: string;
  startTime: string;
  endTime: string;
  numberOfChildren: number;
  childrenAgeRanges: string[];
  careCategory: string | null;
  description: string;
  city: string;
  zipCode: string;
  maxHourlyRate: string;
}

const TOTAL_STEPS = 6;

export function RequestWizard() {
  const t = useTranslations("requestWizard");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [state, setState] = useState<WizardState>({
    careType: null,
    recurringDays: [],
    dateNeeded: "",
    startTime: "09:00",
    endTime: "17:00",
    numberOfChildren: 1,
    childrenAgeRanges: ["3-5"],
    careCategory: null,
    description: "",
    city: "",
    zipCode: "",
    maxHourlyRate: "",
  });

  function update(patch: Partial<WizardState>) {
    setState((prev) => ({ ...prev, ...patch }));
  }

  function calcDuration(): number {
    if (!state.startTime || !state.endTime) return 1;
    const [sh, sm] = state.startTime.split(":").map(Number);
    const [eh, em] = state.endTime.split(":").map(Number);
    return Math.max(0.5, Math.round(((eh + em / 60) - (sh + sm / 60)) * 100) / 100);
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("careType", state.careType!);
    if (state.careType === "recurring") {
      formData.set("recurringDays", JSON.stringify(state.recurringDays));
    } else {
      formData.set("dateNeeded", state.dateNeeded);
    }
    formData.set("startTime", state.startTime);
    formData.set("endTime", state.endTime);
    formData.set("durationHours", String(calcDuration()));
    formData.set("numberOfChildren", String(state.numberOfChildren));
    formData.set("childrenJson", JSON.stringify(
      state.childrenAgeRanges.slice(0, state.numberOfChildren).map((r) => ({ ageRange: r }))
    ));
    if (state.careCategory) formData.set("careCategory", state.careCategory);
    if (state.description) formData.set("description", state.description);
    formData.set("city", state.city);
    formData.set("zipCode", state.zipCode);
    if (state.maxHourlyRate) formData.set("maxHourlyRate", state.maxHourlyRate);

    try {
      const result = await createRequest(formData);
      if (result && !result.success) {
        setError(result.error || t("failedToCreate"));
      }
      // On success the server action redirects — execution never reaches here
    } catch {
      // Next.js redirect throws; this is expected behavior on success
    } finally {
      setLoading(false);
    }
  }

  function next() { setStep((s) => Math.min(s + 1, TOTAL_STEPS)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); }

  const stepProps = { state, onChange: update, onNext: next, onBack: back };

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("subtitle")}</p>
      </div>

      <div className="mb-6 space-y-2">
        <p className="text-xs text-text-tertiary">{t("stepOf", { step })}</p>
        <WizardProgress currentStep={step} totalSteps={TOTAL_STEPS} />
      </div>

      <div className="min-h-[280px]">
        {step === 1 && <Step1CareType {...stepProps} />}
        {step === 2 && <Step2Schedule {...stepProps} />}
        {step === 3 && <Step3Children {...stepProps} />}
        {step === 4 && <Step4Category {...stepProps} />}
        {step === 5 && <Step5Details {...stepProps} />}
        {step === 6 && (
          <Step6Review
            state={state}
            onSubmit={handleSubmit}
            onBack={back}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
}
