import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { updateRequest } from "@/actions/request.actions";

export default async function EditRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAuth();
  const t = await getTranslations("requestDetail");
  const { id } = await params;

  const request = await prisma.childcareRequest.findUnique({
    where: { id },
  });

  if (!request) notFound();
  if (request.parentId !== session.userId) redirect("/requests");
  if (request.status !== "OPEN") redirect(`/requests/${id}`);

  const inputClass =
    "mt-1 block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition focus:border-text-primary focus:outline-none";

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateRequest(id, formData);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/requests/${id}`}
          className="text-sm text-text-secondary hover:text-text-primary"
        >
          &larr; {t("backToRequests")}
        </Link>
        <h1 className="mt-2 font-serif text-2xl text-text-primary">{t("editTitle")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("editSubtitle")}</p>
      </div>

      <form action={handleUpdate} className="space-y-5 border border-border-default bg-surface-secondary p-6">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("time")} — Start
            </label>
            <input
              type="time"
              name="startTime"
              defaultValue={request.startTime}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("time")} — End
            </label>
            <input
              type="time"
              name="endTime"
              defaultValue={request.endTime}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("location")} — City
            </label>
            <input
              type="text"
              name="city"
              defaultValue={request.city}
              required
              className={inputClass}
              placeholder="Berlin"
            />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
              Zip Code
            </label>
            <input
              type="text"
              name="zipCode"
              defaultValue={request.zipCode}
              className={inputClass}
              placeholder="10117"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("maxRate")} (€/hr, optional)
          </label>
          <input
            type="number"
            name="maxHourlyRate"
            defaultValue={request.maxHourlyRate ?? ""}
            min="1"
            max="500"
            step="0.5"
            className={inputClass}
            placeholder="e.g. 18"
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("descriptionLabel")}
          </label>
          <textarea
            name="description"
            defaultValue={request.description}
            rows={4}
            className={inputClass}
            placeholder="Describe your family, any special needs..."
          />
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
            Special Notes (optional)
          </label>
          <textarea
            name="specialNotes"
            defaultValue={request.specialNotes}
            rows={2}
            className={inputClass}
            placeholder="Allergies, instructions, etc."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href={`/requests/${id}`}
            className="flex-1 border border-border-default px-4 py-2.5 text-center text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent"
          >
            {t("saveChanges")}
          </button>
        </div>
      </form>
    </div>
  );
}
