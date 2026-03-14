"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { deleteRequest } from "@/actions/request.actions";

export function RequestActions({ requestId, status }: { requestId: string; status: string }) {
  const t = useTranslations("requestDetail");
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteRequest(requestId);
    });
  }

  return (
    <div className="flex items-center gap-2">
      {status === "OPEN" && (
        <Link
          href={`/requests/${requestId}/edit`}
          className="border border-border-default px-4 py-2 text-xs font-medium uppercase tracking-widest text-text-secondary transition hover:border-text-primary hover:text-text-primary"
        >
          {t("editRequest")}
        </Link>
      )}

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="border border-danger/40 px-4 py-2 text-xs font-medium uppercase tracking-widest text-danger transition hover:border-danger hover:bg-danger-muted"
        >
          {t("deleteRequest")}
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">{t("deleteConfirm")}</span>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="border border-danger bg-danger px-3 py-2 text-xs font-medium uppercase tracking-widest text-white transition hover:bg-danger/90 disabled:opacity-50"
          >
            {isPending ? t("deleting") : t("confirmDelete")}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={isPending}
            className="border border-border-default px-3 py-2 text-xs font-medium uppercase tracking-widest text-text-secondary transition hover:border-text-primary disabled:opacity-50"
          >
            {t("cancelDelete")}
          </button>
        </div>
      )}
    </div>
  );
}
