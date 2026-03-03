"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { createRequest } from "@/actions/request.actions";

export default function CreateRequestPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl animate-pulse"><div className="h-8 w-48 bg-surface-tertiary mb-8" /><div className="h-96 bg-surface-secondary border border-border-default" /></div>}>
      <CreateRequestForm />
    </Suspense>
  );
}

function CreateRequestForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sitterId = searchParams.get("sitterId");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [dateNeeded, setDateNeeded] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [maxHourlyRate, setMaxHourlyRate] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [children, setChildren] = useState([{ name: "", age: "" }]);

  function addChild() {
    setChildren((prev) => [...prev, { name: "", age: "" }]);
  }

  function removeChild(index: number) {
    setChildren((prev) => prev.filter((_, i) => i !== index));
  }

  function updateChild(index: number, field: "name" | "age", value: string) {
    setChildren((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c))
    );
  }

  function calculateDuration(): number {
    if (!startTime || !endTime) return 0;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    const start = sh + sm / 60;
    const end = eh + em / 60;
    return Math.max(0, Math.round((end - start) * 100) / 100);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validChildren = children
      .filter((c) => c.name || c.age)
      .map((c) => ({
        name: c.name,
        age: parseInt(c.age, 10) || 0,
      }));

    const durationHours = calculateDuration();
    if (durationHours <= 0) {
      setError("End time must be after start time");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("title", title);
    formData.set("dateNeeded", dateNeeded);
    formData.set("startTime", startTime);
    formData.set("endTime", endTime);
    formData.set("durationHours", String(durationHours));
    formData.set("numberOfChildren", String(Math.max(validChildren.length, 1)));
    formData.set("childrenJson", JSON.stringify(validChildren));
    formData.set("city", city);
    formData.set("state", state);
    formData.set("zipCode", zipCode);
    if (maxHourlyRate) formData.set("maxHourlyRate", maxHourlyRate);
    if (specialNotes) formData.set("specialNotes", specialNotes);

    try {
      const result = await createRequest(formData);
      if (!result.success) {
        setError(result.error || "Failed to create request");
      }
      // On success, the server action redirects to /requests/[id]
    } catch {
      // Redirect from server action throws; this is expected on success
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">
          Create a Childcare Request
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          Describe what you need and we will match you with the best babysitters.
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-danger/30 bg-danger-muted p-3 text-sm text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Request Details */}
        <section className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Request Details
          </h2>
          <div className="mt-4 space-y-4">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Evening babysitter for two kids"
              required
            />
            <Input
              label="Date Needed"
              type="date"
              value={dateNeeded}
              onChange={(e) => setDateNeeded(e.target.value)}
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start Time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <Input
                label="End Time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
            {calculateDuration() > 0 && (
              <p className="text-sm text-text-secondary">
                Duration: {calculateDuration()} hours
              </p>
            )}
          </div>
        </section>

        {/* Children */}
        <section className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Children
          </h2>
          <div className="mt-4 space-y-3">
            {children.map((child, i) => (
              <div key={i} className="flex items-end gap-3">
                <div className="flex-1">
                  <Input
                    label={i === 0 ? "Name" : undefined}
                    value={child.name}
                    onChange={(e) => updateChild(i, "name", e.target.value)}
                    placeholder="Child's name"
                  />
                </div>
                <div className="w-24">
                  <Input
                    label={i === 0 ? "Age" : undefined}
                    type="number"
                    min="0"
                    max="17"
                    value={child.age}
                    onChange={(e) => updateChild(i, "age", e.target.value)}
                    placeholder="Age"
                  />
                </div>
                {children.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeChild(i)}
                    className="mb-1 p-1.5 text-text-muted transition hover:text-danger"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addChild}
            className="mt-3 text-sm font-medium text-accent hover:underline"
          >
            + Add another child
          </button>
        </section>

        {/* Location */}
        <section className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Location
          </h2>
          <div className="mt-4 space-y-4">
            <Input
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="San Francisco"
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="CA"
                required
              />
              <Input
                label="Zip Code"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="94102"
                required
              />
            </div>
          </div>
        </section>

        {/* Additional Options */}
        <section className="border border-border-default bg-surface-secondary p-6">
          <h2 className="mb-1 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Additional Options
          </h2>
          <div className="mt-4 space-y-4">
            <Input
              label="Max Hourly Rate (optional)"
              type="number"
              min="1"
              step="0.50"
              value={maxHourlyRate}
              onChange={(e) => setMaxHourlyRate(e.target.value)}
              placeholder="e.g. 30"
            />
            <Textarea
              label="Special Notes (optional)"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="Any special instructions, dietary needs, allergies, etc."
              rows={4}
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pb-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {loading ? "Creating..." : "Create Request"}
          </Button>
        </div>
      </form>
    </div>
  );

  // Suppress unused variable warning
  void sitterId;
}
