"use client";

import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function WizardProgress({ currentStep, totalSteps }: WizardProgressProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isCompleted = step < currentStep;
        const isCurrent = step === currentStep;
        return (
          <div
            key={step}
            className={cn(
              "h-1.5 flex-1 transition-all duration-300",
              isCompleted ? "bg-accent" : isCurrent ? "bg-accent/60" : "bg-border-default"
            )}
          />
        );
      })}
    </div>
  );
}
