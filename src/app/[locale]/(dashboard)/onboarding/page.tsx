"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { DAYS_OF_WEEK, TIME_SLOTS, CHILDCARE_TYPES, CARE_TIMES_OF_DAY, CARE_FREQUENCIES } from "@/lib/constants";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const tc = useTranslations("common");
  const tn = useTranslations("childcareNeeds");
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

  // Parent childcare needs
  const [childcareTypes, setChildcareTypes] = useState<string[]>([]);
  const [timesOfDay, setTimesOfDay] = useState<string[]>([]);
  const [careFrequency, setCareFrequency] = useState("");

  // Fetch role on mount, redirect if already onboarded
  useEffect(() => {
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
  }, [router]);

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

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const body: Record<string, unknown> = { city, state, zipCode, phone, latitude, longitude, bio };
    if (birthday) body.birthday = birthday;

    // Include parent childcare needs
    if (role === "PARENT") {
      body.childcareTypes = JSON.stringify(childcareTypes);
      body.timesOfDay = JSON.stringify(timesOfDay);
      body.careFrequency = careFrequency;
    }

    // Upload avatar if selected
    if (avatarFile) {
      const avatarData = new FormData();
      avatarData.append("avatar", avatarFile);
      await fetch("/api/profile/avatar", { method: "POST", body: avatarData });
    }

    if (role === "BABYSITTER") {
      Object.assign(body, {
        hourlyRate: parseFloat(hourlyRate),
        languages,
        ageRangeMin: parseInt(ageRangeMin, 10),
        ageRangeMax: parseInt(ageRangeMax, 10),
        availabilityJson: JSON.stringify(availability),
      });
    }

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || t("failedToSave"));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(tc("somethingWentWrong"));
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
        <h1 className="font-serif text-2xl text-text-primary">{t("completeProfile")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("stepOf", { step, total: totalSteps })}</p>
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
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("aboutYou")}</h2>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("birthday")}</label>
            <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className={inputClass} max={new Date().toISOString().split("T")[0]} />
          </div>
          <h2 className="mt-2 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("yourLocation")}</h2>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("city")}</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="Berlin" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("address")}</label>
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
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("zipCode")}</label>
              <input value={zipCode} onChange={(e) => setZipCode(e.target.value)} className={inputClass} placeholder="10117" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("phoneOptional")}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="+49 30 123 4567" />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("bioOptional")}</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className={inputClass} placeholder={t("bioPlaceholderParent")} />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!city || !state || !zipCode || !birthday || loading}
            className="mt-4 w-full bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
          >
            {tc("continue")}
          </button>
        </div>
      )}

      {/* Step 2: Parent - Childcare Needs */}
      {step === 2 && role === "PARENT" && (
        <div className="space-y-6 border border-border-default bg-surface-secondary p-6">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">{tn("childcareType")}</h2>
            <p className="mt-1 text-sm text-text-tertiary">{tn("subtitle")}</p>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">{tn("childcareType")}</p>
            <div className="flex flex-wrap gap-2">
              {CHILDCARE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setChildcareTypes((prev) =>
                    prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                  )}
                  className={`px-3.5 py-2 text-sm transition ${
                    childcareTypes.includes(type)
                      ? "bg-text-primary text-surface-primary"
                      : "bg-surface-tertiary text-text-secondary hover:bg-border-default"
                  }`}
                >
                  {tn(`types.${type}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">{tn("timeOfDay")}</p>
            <div className="flex flex-wrap gap-2">
              {CARE_TIMES_OF_DAY.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setTimesOfDay((prev) =>
                    prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
                  )}
                  className={`px-3.5 py-2 text-sm transition ${
                    timesOfDay.includes(time)
                      ? "bg-text-primary text-surface-primary"
                      : "bg-surface-tertiary text-text-secondary hover:bg-border-default"
                  }`}
                >
                  {tn(`times.${time}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">{tn("frequency")}</p>
            <div className="flex flex-wrap gap-2">
              {CARE_FREQUENCIES.map((freq) => (
                <button
                  key={freq}
                  type="button"
                  onClick={() => setCareFrequency((prev) => prev === freq ? "" : freq)}
                  className={`px-3.5 py-2 text-sm transition ${
                    careFrequency === freq
                      ? "bg-text-primary text-surface-primary"
                      : "bg-surface-tertiary text-text-secondary hover:bg-border-default"
                  }`}
                >
                  {tn(`frequencies.${freq}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary">
              {tc("back")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
            >
              {loading ? tc("saving") : t("completeSetup")}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Sitter - Bio & experience */}
      {step === 2 && role === "BABYSITTER" && (
        <div className="space-y-4 border border-border-default bg-surface-secondary p-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("aboutYou")}</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("profilePicture")} <span className="text-danger">*</span></label>
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
                {t("choosePhoto")}
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
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("bio")}</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={inputClass} placeholder={t("bioPlaceholder")} />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("hourlyRate")}</label>
            <input type="number" min="1" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("languagesLabel")}</label>
            <input value={languages} onChange={(e) => setLanguages(e.target.value)} className={inputClass} placeholder={t("languagesPlaceholder")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("youngestAge")}</label>
              <input type="number" min="0" max="17" value={ageRangeMin} onChange={(e) => setAgeRangeMin(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("oldestAge")}</label>
              <input type="number" min="0" max="17" value={ageRangeMax} onChange={(e) => setAgeRangeMax(e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary">
              {tc("back")}
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!avatarFile || !bio || bio.length < 10}
              className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
            >
              {tc("continue")}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 (sitter): Availability */}
      {step === 3 && role === "BABYSITTER" && (
        <div className="space-y-4 border border-border-default bg-surface-secondary p-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("yourAvailability")}</h2>
          <p className="text-sm text-text-secondary">{t("selectAvailability")}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="pb-2 text-left text-xs font-medium uppercase tracking-wide text-text-secondary" />
                  {TIME_SLOTS.map((slot) => (
                    <th key={slot} className="pb-2 text-center text-xs font-medium uppercase tracking-wide text-text-secondary">{tc(`timeSlots.${slot}`)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DAYS_OF_WEEK.map((day) => (
                  <tr key={day}>
                    <td className="py-1.5 pr-3 text-sm text-text-secondary">{tc(`days.${day}`)}</td>
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

          <div className="mt-4 flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary">
              {tc("back")}
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
            >
              {loading ? tc("saving") : t("completeSetup")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
