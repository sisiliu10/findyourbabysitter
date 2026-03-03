"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/constants";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

export default function OnboardingPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sitter fields
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("20");
  const [languages, setLanguages] = useState("English");
  const [ageRangeMin, setAgeRangeMin] = useState("0");
  const [ageRangeMax, setAgeRangeMax] = useState("17");
  const [availability, setAvailability] = useState<Record<string, string[]>>({});

  // Profile picture
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Shared fields
  const [birthday, setBirthday] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Parent fields
  const [children, setChildren] = useState([{ name: "", age: "" }]);

  // Fetch role on mount, redirect if already onboarded
  useState(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((u) => {
        if (u?.data?.onboarded) {
          router.replace("/dashboard");
          return;
        }
        setRole(u?.data?.role || "PARENT");
      })
      .catch(() => setRole("PARENT"));
  });

  function toggleAvailability(day: string, slot: string) {
    setAvailability((prev) => {
      const current = prev[day] || [];
      return {
        ...prev,
        [day]: current.includes(slot)
          ? current.filter((s) => s !== slot)
          : [...current, slot],
      };
    });
  }

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

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const body: Record<string, unknown> = { city, state, zipCode, phone, latitude, longitude };
    if (birthday) body.birthday = birthday;

    // Upload avatar if selected
    if (avatarFile) {
      const avatarData = new FormData();
      avatarData.append("avatar", avatarFile);
      await fetch("/api/profile/avatar", { method: "POST", body: avatarData });
    }

    if (role === "BABYSITTER") {
      Object.assign(body, {
        bio,
        hourlyRate: parseFloat(hourlyRate),
        languages,
        ageRangeMin: parseInt(ageRangeMin, 10),
        ageRangeMax: parseInt(ageRangeMax, 10),
        availabilityJson: JSON.stringify(availability),
      });
    } else {
      body.childrenJson = JSON.stringify(
        children.filter((c) => c.name || c.age).map((c) => ({ name: c.name, age: parseInt(c.age, 10) || 0 }))
      );
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save profile");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = role === "BABYSITTER" ? 3 : 2;

  const inputClass =
    "mt-1 block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition focus:border-text-primary focus:outline-none";

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">Complete your profile</h1>
        <p className="mt-1 text-sm text-text-secondary">Step {step} of {totalSteps}</p>
        <div className="mt-4 flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 transition ${i < step ? "bg-text-primary" : "bg-surface-tertiary"}`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 border border-danger/30 bg-danger-muted p-3 text-sm text-danger">{error}</div>
      )}

      {/* Step 1: Location (both roles) */}
      {step === 1 && (
        <div className="space-y-4 border border-border-default bg-surface-secondary p-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">About you</h2>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Birthday</label>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className={inputClass} max={new Date().toISOString().split("T")[0]} />
          </div>
          <h2 className="mt-2 text-xs font-medium uppercase tracking-wide text-text-secondary">Your location</h2>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Berlin" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Address</label>
              <AddressAutocomplete
                value={state}
                onChange={setState}
                onSelect={(result) => {
                  setState(result.address);
                  setCity(result.city);
                  setZipCode(result.zipCode);
                  setLatitude(result.latitude);
                  setLongitude(result.longitude);
                }}
                placeholder="Friedrichstraße 123"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Zip code</label>
              <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={inputClass} placeholder="10117" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Phone (optional)</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+49 30 123 4567" />
          </div>

          {role === "PARENT" && (
            <>
              <h2 className="mt-6 text-xs font-medium uppercase tracking-wide text-text-secondary">Your children</h2>
              {children.map((child, i) => (
                <div key={i} className="flex items-end gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Name</label>
                    <input value={child.name} onChange={(e) => updateChild(i, "name", e.target.value)} className={inputClass} />
                  </div>
                  <div className="w-20">
                    <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Age</label>
                    <input type="number" min="0" max="17" value={child.age} onChange={(e) => updateChild(i, "age", e.target.value)} className={inputClass} />
                  </div>
                  {children.length > 1 && (
                    <button onClick={() => removeChild(i)} className="mb-1 p-1 text-text-muted hover:text-danger">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  )}
                </div>
              ))}
              <button onClick={addChild} className="text-sm font-medium text-accent hover:underline">
                + Add another child
              </button>
            </>
          )}

          <button
            onClick={() => setStep(2)}
            disabled={!city || !state || !zipCode || !birthday}
            className="mt-4 w-full bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      )}

      {/* Step 2: Sitter - Bio & experience */}
      {step === 2 && role === "BABYSITTER" && (
        <div className="space-y-4 border border-border-default bg-surface-secondary p-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">About you</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Profile picture</label>
            <div className="mt-1 flex items-center gap-4">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="h-16 w-16 object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center bg-surface-tertiary text-text-muted">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                </div>
              )}
              <label className="cursor-pointer border border-border-default px-3 py-2 text-sm text-text-secondary transition hover:border-text-primary hover:text-text-primary">
                Choose photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setAvatarFile(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={inputClass} placeholder="Tell parents about yourself, your experience, and what makes you a great babysitter..." />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Hourly rate (&euro;)</label>
            <input type="number" min="1" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Languages (comma separated)</label>
            <input value={languages} onChange={(e) => setLanguages(e.target.value)} className={inputClass} placeholder="English, German" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Youngest age comfortable</label>
              <input type="number" min="0" max="17" value={ageRangeMin} onChange={(e) => setAgeRangeMin(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">Oldest age comfortable</label>
              <input type="number" min="0" max="17" value={ageRangeMax} onChange={(e) => setAgeRangeMax(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary">
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!bio || bio.length < 10}
              className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3 (sitter) or Step 2 (parent): Availability / Final */}
      {((step === 3 && role === "BABYSITTER") || (step === 2 && role === "PARENT")) && (
        <div className="space-y-4 border border-border-default bg-surface-secondary p-6">
          {role === "BABYSITTER" && (
            <>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">Your availability</h2>
              <p className="text-sm text-text-secondary">Select when you&apos;re typically available</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left text-xs font-medium uppercase tracking-wide text-text-secondary" />
                      {TIME_SLOTS.map((slot) => (
                        <th key={slot} className="pb-2 text-center text-xs font-medium uppercase tracking-wide text-text-secondary">{slot}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS_OF_WEEK.map((day) => (
                      <tr key={day}>
                        <td className="py-1.5 pr-3 text-sm capitalize text-text-secondary">{day}</td>
                        {TIME_SLOTS.map((slot) => (
                          <td key={slot} className="py-1.5 text-center">
                            <button
                              onClick={() => toggleAvailability(day, slot)}
                              className={`h-8 w-8 text-xs transition ${
                                (availability[day] || []).includes(slot)
                                  ? "bg-text-primary text-surface-primary"
                                  : "bg-surface-tertiary text-text-muted hover:bg-border-default"
                              }`}
                            >
                              {(availability[day] || []).includes(slot) ? "\u2713" : ""}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {role === "PARENT" && (
            <>
              <h2 className="font-serif text-lg text-text-primary">All set!</h2>
              <p className="text-sm text-text-secondary">
                You can start searching for babysitters and creating childcare requests.
              </p>
            </>
          )}

          <div className="mt-4 flex gap-3">
            <button onClick={() => setStep(step - 1)} className="flex-1 border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
            >
              {loading ? "Saving..." : "Complete setup"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
