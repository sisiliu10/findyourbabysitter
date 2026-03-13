import { Suspense } from "react";
import { RequestWizard } from "./RequestWizard";

export default function CreateRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg animate-pulse">
          <div className="mb-8 space-y-2">
            <div className="h-7 w-48 bg-surface-tertiary" />
            <div className="h-4 w-64 bg-surface-tertiary" />
          </div>
          <div className="h-2 bg-surface-tertiary" />
          <div className="mt-8 h-64 bg-surface-secondary border border-border-default" />
        </div>
      }
    >
      <RequestWizard />
    </Suspense>
  );
}
