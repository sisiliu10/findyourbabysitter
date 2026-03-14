"use client";

import { useState, useEffect } from "react";
import { useRouter, Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { DAYS_OF_WEEK, TIME_SLOTS, CHILDCARE_TYPES, CARE_TIMES_OF_DAY, CARE_FREQUENCIES, SITTER_TYPES, GENDER_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants";
import { AddressAutocomplete } from "@/components/ui/AddressAutocomplete";
import { getDistrictFromZip } from "@/lib/berlin-districts";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const t = useTranslations("onboarding");
  const tc = useTranslations("common");
  const tn = useTranslations("childcareNeeds");
  const [role, setRole] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profileLive, setProfileLive] = useState(false);

  // Sitter fields
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("20");
  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [ageRangeMin, setAgeRangeMin] = useState("0");
  const [ageRangeMax, setAgeRangeMax] = useState("17");
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [sitterType, setSitterType] = useState("");
  const [gender, setGender] = useState("");
  const [availAttempted, setAvailAttempted] = useState(false);
  const [hasFirstAid, setHasFirstAid] = useState(false);
  const [hasCPR, setHasCPR] = useState(false);
  const [hasTransportation, setHasTransportation] = useState(false);

  // Profile picture
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Shared fields — "streetAddress" replaces the old misnamed "state" variable
  const [birthday, setBirthday] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Step 1 validation
  const [step1Attempted, setStep1Attempted] = useState(false);

  // Parent childcare needs
  const [childcareTypes, setChildcareTypes] = useState<string[]>([]);
  const [timesOfDay, setTimesOfDay] = useState<string[]>([]);
  const [careFrequency, setCareFrequency] = useState("");
  const [needsAttempted, setNeedsAttempted] = useState(false);

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
        if (u?.data?.id) setUserId(u.data.id);
        if (u?.data?.avatarUrl) setAvatarPreview(u.data.avatarUrl);
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

  function handleStep1Continue() {
    setStep1Attempted(true);
    const valid =
      !!(avatarFile || avatarPreview) &&
      !!gender &&
      languages.length > 0 &&
      !!birthday &&
      !!city &&
      !!zipCode &&
      (role !== "BABYSITTER" || !!phone);
    if (valid) setStep(2);
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const district = getDistrictFromZip(zipCode);
    // API key stays "state" to keep backend contract intact
    const body: Record<string, unknown> = {
      city,
      state: streetAddress,
      zipCode,
      district,
      phone,
      latitude,
      longitude,
      bio,
    };
    if (birthday) body.birthday = birthday;

    body.gender = gender;
    body.languages = languages.join(", ");

    if (role === "PARENT") {
      body.childcareTypes = JSON.stringify(childcareTypes);
      body.timesOfDay = JSON.stringify(timesOfDay);
      body.careFrequency = careFrequency;
    }

    if (avatarFile) {
      const avatarData = new FormData();
      avatarData.append("avatar", avatarFile);
      const avatarRes = await fetch("/api/profile/avatar", { method: "POST", body: avatarData });
      if (!avatarRes.ok) {
        const avatarErr = await avatarRes.json();
        setError(avatarErr.error || t("failedToSave"));
        setLoading(false);
        return;
      }
    }

    if (role === "BABYSITTER") {
      Object.assign(body, {
        hourlyRate: parseFloat(hourlyRate),
        languages: languages.join(", "),
        ageRangeMin: parseInt(ageRangeMin, 10),
        ageRangeMax: parseInt(ageRangeMax, 10),
        availabilityJson: JSON.stringify(availability),
        sitterType,
        gender,
        hasFirstAid,
        hasCPR,
        hasTransportation,
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

      if (role === "BABYSITTER") {
        setProfileLive(true);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError(tc("somethingWentWrong"));
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = role === "BABYSITTER" ? 3 : 2;

  const inputClass =
    "mt-1 block w-full border border-border-default bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition focus:border-text-primary focus:outline-none";

  const inputErrorClass =
    "mt-1 block w-full border border-danger bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition focus:border-danger focus:outline-none";

  function FieldError({ show, message }: { show: boolean; message: string }) {
    if (!show) return null;
    return <p className="mt-1 text-xs text-danger">{message}</p>;
  }

  if (profileLive) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="border border-success/30 bg-success-muted p-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-success/10">
            <svg className="h-7 w-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl text-text-primary">{t("profileLiveTitle")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t("profileLiveSubtitle")}</p>
          <div className="mt-8 flex flex-col gap-3">
            {userId && (
              <Link
                href={`/sitter/${userId}`}
                className="w-full border border-text-primary bg-text-primary px-4 py-3 text-xs font-medium uppercase tracking-widest text-surface-primary transition hover:bg-accent hover:border-accent text-center block"
              >
                {t("previewProfile")}
              </Link>
            )}
            <button
              onClick={() => { router.push("/dashboard"); router.refresh(); }}
              className="w-full border border-border-default px-4 py-3 text-xs font-medium uppercase tracking-widest text-text-primary transition hover:border-text-primary"
            >
              {t("goToDashboard")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">{t("completeProfile")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("stepOf", { step, total: totalSteps })}</p>
        <div className="mt-4 flex gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 transition-colors duration-300 ${i < step ? "bg-text-primary" : "bg-surface-tertiary"}`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-4 border border-danger/30 bg-danger-muted p-3 text-sm text-danger">{error}</div>
      )}

      {/* Step 1: About You + Location (both roles) */}
      {step === 1 && (
        <div className="space-y-5 border border-border-default bg-surface-secondary p-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("aboutYou")}</h2>

          {/* Profile picture — required for all */}
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("profilePicture")} <span className="text-danger">*</span>
            </label>
            <div
              className={`mt-2 flex flex-col items-center gap-3 border-2 border-dashed p-5 transition ${
                step1Attempted && !avatarFile && !avatarPreview
                  ? "border-danger bg-danger-muted"
                  : avatarPreview
                  ? "border-success"
                  : "border-border-default hover:border-text-muted"
              }`}
            >
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="h-20 w-20 object-cover" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center bg-surface-tertiary text-text-muted">
                  <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                  </svg>
                </div>
              )}
              <label className="cursor-pointer border border-border-default px-4 py-2 text-sm text-text-secondary transition hover:border-text-primary hover:text-text-primary">
                {avatarPreview ? t("changePhoto") : t("choosePhoto")}
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
              {!avatarPreview && (
                <p className="text-xs text-text-tertiary">{t("profilePictureHint")}</p>
              )}
            </div>
            <FieldError show={step1Attempted && !avatarFile && !avatarPreview} message={t("profilePictureRequired")} />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("birthday")} <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className={step1Attempted && !birthday ? inputErrorClass : inputClass}
              max={new Date().toISOString().split("T")[0]}
            />
            {!step1Attempted && (
              <p className="mt-1.5 text-xs text-text-tertiary">{t("birthdayHint")}</p>
            )}
            <FieldError show={step1Attempted && !birthday} message={t("birthdayRequired")} />
          </div>

          <h2 className="pt-1 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("yourIdentity")}</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">
              {t("genderLabel")} <span className="text-danger">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`px-3.5 py-2 text-sm transition ${
                    gender === g
                      ? "bg-text-primary text-surface-primary"
                      : step1Attempted && !gender
                      ? "border border-danger bg-surface-tertiary text-text-secondary hover:bg-border-default"
                      : "bg-surface-tertiary text-text-secondary hover:bg-border-default"
                  }`}
                >
                  {t(`genders.${g}`)}
                </button>
              ))}
            </div>
            <FieldError show={step1Attempted && !gender} message={t("genderRequired")} />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-0.5">
              {t("languagesLabel")} <span className="text-danger">*</span>
            </label>
            <p className="mb-1.5 text-xs text-text-tertiary">{t("languagesHint")}</p>
            <div className="grid grid-cols-3 gap-1.5">
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() =>
                    setLanguages((prev) =>
                      prev.includes(lang.value)
                        ? prev.filter((l) => l !== lang.value)
                        : [...prev, lang.value]
                    )
                  }
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium text-left transition-colors border",
                    languages.includes(lang.value)
                      ? "border-text-primary bg-text-primary text-surface-primary"
                      : "border-border-default bg-surface-tertiary text-text-secondary hover:border-text-primary hover:text-text-primary"
                  )}
                >
                  {lang.flag} {lang.value}
                </button>
              ))}
            </div>
          </div>

          <h2 className="pt-1 text-xs font-medium uppercase tracking-wide text-text-secondary">{t("yourLocation")}</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("city")} <span className="text-danger">*</span>
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={step1Attempted && !city ? inputErrorClass : inputClass}
              placeholder="Berlin"
            />
            <FieldError show={step1Attempted && !city} message={t("cityRequired")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("address")}</label>
              <AddressAutocomplete
                value={streetAddress}
                onChange={setStreetAddress}
                onSelect={(result) => {
                  setStreetAddress(result.address);
                  setCity(result.city);
                  setZipCode(result.zipCode);
                  setLatitude(result.latitude);
                  setLongitude(result.longitude);
                }}
                placeholder="Friedrichstraße 123"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
                {t("zipCode")} <span className="text-danger">*</span>
              </label>
              <input
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className={step1Attempted && !zipCode ? inputErrorClass : inputClass}
                placeholder="10117"
              />
              <FieldError show={step1Attempted && !zipCode} message={t("zipRequired")} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">
              {role === "BABYSITTER" ? t("phoneRequired") : t("phoneOptional")}
              {role === "BABYSITTER" && <span className="text-danger"> *</span>}
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={step1Attempted && role === "BABYSITTER" && !phone ? inputErrorClass : inputClass}
              placeholder="+49 30 123 4567"
            />
            {role === "BABYSITTER" && !phone && step1Attempted ? (
              <FieldError show message={t("phoneRequired2")} />
            ) : role === "BABYSITTER" ? (
              <p className="mt-1.5 text-xs text-text-tertiary">{t("phoneVerificationHint")}</p>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("bioOptional")}</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className={inputClass} placeholder={t("bioPlaceholderParent")} />
          </div>

          <button
            onClick={handleStep1Continue}
            disabled={loading}
            className="mt-2 w-full bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
          >
            {tc("continue")}
          </button>
        </div>
      )}

      {/* Step 2: Parent - Childcare Needs */}
      {step === 2 && role === "PARENT" && (() => {
        const typesOk = childcareTypes.length > 0;
        const timesOk = timesOfDay.length > 0;
        const freqOk = !!careFrequency;
        const canSubmit = typesOk && timesOk && freqOk;

        function SectionLabel({ label, done }: { label: string; done: boolean }) {
          return (
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center transition-colors duration-200 ${
                  done ? "text-success" : needsAttempted ? "text-danger" : "text-text-muted"
                }`}
              >
                {done ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                )}
              </span>
              <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
            </div>
          );
        }

        return (
          <div className="space-y-6 border border-border-default bg-surface-secondary p-6">
            <div>
              <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">{tn("childcareType")}</h2>
              <p className="mt-1 text-sm text-text-tertiary">{tn("subtitle")}</p>
            </div>

            <div>
              <SectionLabel label={tn("childcareType")} done={typesOk} />
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
              <SectionLabel label={tn("timeOfDay")} done={timesOk} />
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
              <SectionLabel label={tn("frequency")} done={freqOk} />
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

            {needsAttempted && !canSubmit && (
              <p className="text-xs text-danger">{t("selectAllSections")}</p>
            )}

            {/* "What happens next" hint */}
            <div className="flex items-start gap-2.5 border border-border-default bg-surface-primary px-4 py-3">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs leading-relaxed text-text-secondary">{t("afterSetupHint")}</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary">
                {tc("back")}
              </button>
              <button
                onClick={() => {
                  setNeedsAttempted(true);
                  if (canSubmit) handleSubmit();
                }}
                disabled={loading}
                className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
              >
                {loading ? tc("saving") : t("completeSetup")}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Step 2: Sitter - Bio & experience */}
      {step === 2 && role === "BABYSITTER" && (
        <div className="space-y-4 border border-border-default bg-surface-secondary p-6">
          <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("aboutYou")}</h2>

          <div>
            <div className="flex items-baseline justify-between">
              <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("bio")} <span className="text-danger">*</span></label>
              <span className={`text-xs tabular-nums ${bio.length >= 10 ? "text-success" : "text-text-tertiary"}`}>
                {bio.length >= 10 ? `${bio.length} ✓` : `${bio.length} / 10`}
              </span>
            </div>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className={inputClass} placeholder={t("bioPlaceholder")} />
            {bio.length > 0 && bio.length < 10 && (
              <p className="mt-1 text-xs text-text-tertiary">
                {t("bioMinHint", { remaining: 10 - bio.length })}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary">{t("hourlyRate")}</label>
            <input type="number" min="1" max="500" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">{t("sitterTypeLabel")}</label>
            <div className="flex flex-wrap gap-2">
              {SITTER_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSitterType(sitterType === type ? "" : type)}
                  className={`px-3.5 py-2 text-sm transition ${
                    sitterType === type
                      ? "bg-text-primary text-surface-primary"
                      : "bg-surface-tertiary text-text-secondary hover:bg-border-default"
                  }`}
                >
                  {t(`sitterTypes.${type}`)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-2">
              {t("certificationsLabel")}
            </label>
            <p className="mb-3 text-xs text-text-tertiary">{t("certificationsHint")}</p>
            <div className="flex flex-col gap-2.5">
              {[
                { key: "hasFirstAid", label: t("firstAid"), checked: hasFirstAid, set: setHasFirstAid },
                { key: "hasCPR", label: t("cpr"), checked: hasCPR, set: setHasCPR },
                { key: "hasTransportation", label: t("transportLabel"), checked: hasTransportation, set: setHasTransportation },
              ].map((cert) => (
                <button
                  key={cert.key}
                  type="button"
                  onClick={() => cert.set(!cert.checked)}
                  className={`flex items-center gap-3 border px-4 py-3 text-left text-sm transition ${
                    cert.checked
                      ? "border-success bg-success-muted text-success"
                      : "border-border-default bg-surface-tertiary text-text-secondary hover:border-text-muted"
                  }`}
                >
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center border transition ${cert.checked ? "border-success bg-success text-white" : "border-border-default bg-transparent"}`}>
                    {cert.checked && (
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </span>
                  {cert.label}
                </button>
              ))}
            </div>
          </div>
          {(() => {
            const minVal = parseInt(ageRangeMin, 10);
            const maxVal = parseInt(ageRangeMax, 10);
            const ageInvalid = !isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal;
            const canContinue = bio.length >= 10 && !ageInvalid;
            return (
              <>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-1">{t("ageRangeLabel")}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-text-tertiary mb-1">{t("youngestAge")}</label>
                      <input
                        type="number"
                        min="0"
                        max="17"
                        value={ageRangeMin}
                        onChange={(e) => setAgeRangeMin(e.target.value)}
                        className={ageInvalid ? inputErrorClass : inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-text-tertiary mb-1">{t("oldestAge")}</label>
                      <input
                        type="number"
                        min="0"
                        max="17"
                        value={ageRangeMax}
                        onChange={(e) => setAgeRangeMax(e.target.value)}
                        className={ageInvalid ? inputErrorClass : inputClass}
                      />
                    </div>
                  </div>
                  {ageInvalid && (
                    <p className="mt-1.5 text-xs text-danger">{t("ageRangeError")}</p>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary">
                    {tc("back")}
                  </button>
                  <button
                    onClick={() => { if (canContinue) setStep(3); }}
                    disabled={!canContinue}
                    className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
                  >
                    {tc("continue")}
                  </button>
                </div>
              </>
            );
          })()}
        </div>
      )}


      {/* Step 3 (sitter): Availability */}
      {step === 3 && role === "BABYSITTER" && (() => {
        const totalSlots = Object.values(availability).reduce((sum, slots) => sum + slots.length, 0);
        const hasAvailability = totalSlots > 0;

        const isDayFull = (day: string) => (availability[day]?.length ?? 0) === TIME_SLOTS.length;
        const isDayPartial = (day: string) => { const n = availability[day]?.length ?? 0; return n > 0 && n < TIME_SLOTS.length; };
        const isColFull = (slot: string) => DAYS_OF_WEEK.every((d) => (availability[d] || []).includes(slot));

        function toggleDay(day: string) {
          setAvailability((prev) => ({ ...prev, [day]: isDayFull(day) ? [] : [...TIME_SLOTS] }));
        }
        function toggleCol(slot: string) {
          const full = isColFull(slot);
          setAvailability((prev) => {
            const next = { ...prev };
            DAYS_OF_WEEK.forEach((d) => {
              const cur = next[d] || [];
              next[d] = full ? cur.filter((s) => s !== slot) : cur.includes(slot) ? cur : [...cur, slot];
            });
            return next;
          });
        }

        return (
          <div className="space-y-4 border border-border-default bg-surface-secondary p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xs font-medium uppercase tracking-wide text-text-secondary">{t("yourAvailability")}</h2>
                <p className="mt-1 text-sm text-text-secondary">{t("selectAvailabilityShort")}</p>
              </div>
              {hasAvailability && (
                <span className="shrink-0 pl-3 text-xs text-success tabular-nums">
                  {t("slotsSelected", { count: totalSlots })}
                </span>
              )}
            </div>

            {/* Hint */}
            <p className="text-xs text-text-tertiary">{t("availabilityHint")}</p>

            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full min-w-[280px] text-sm">
                <thead>
                  <tr>
                    <th className="w-[30%] pb-2 text-left" />
                    {TIME_SLOTS.map((slot) => (
                      <th key={slot} className="pb-2 text-center">
                        <button
                          type="button"
                          onClick={() => toggleCol(slot)}
                          className={`w-full px-1 py-1 text-xs font-medium uppercase tracking-wide transition ${
                            isColFull(slot)
                              ? "text-text-primary underline underline-offset-2"
                              : "text-text-muted hover:text-text-secondary"
                          }`}
                          title={t("selectAllColumn")}
                        >
                          {tc(`timeSlots.${slot}`)}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS_OF_WEEK.map((day) => (
                    <tr key={day}>
                      <td className="py-1 pr-2">
                        <button
                          type="button"
                          onClick={() => toggleDay(day)}
                          title={t("selectAllDay")}
                          className={`w-full px-2 py-2.5 text-left text-sm font-medium transition ${
                            isDayFull(day)
                              ? "bg-text-primary text-surface-primary"
                              : isDayPartial(day)
                              ? "border-l-2 border-accent bg-surface-tertiary text-text-primary"
                              : "text-text-secondary hover:bg-surface-tertiary"
                          }`}
                        >
                          <span className="hidden sm:inline">{tc(`days.${day}`)}</span>
                          <span className="sm:hidden">{tc(`days.${day}`).substring(0, 2)}</span>
                        </button>
                      </td>
                      {TIME_SLOTS.map((slot) => {
                        const selected = (availability[day] || []).includes(slot);
                        return (
                          <td key={slot} className="py-1 text-center">
                            <button
                              type="button"
                              onClick={() => toggleAvailability(day, slot)}
                              className={`h-11 w-full min-w-[44px] text-sm transition ${
                                selected
                                  ? "bg-text-primary text-surface-primary"
                                  : "bg-surface-tertiary text-text-muted hover:bg-border-default"
                              }`}
                            >
                              {selected ? "✓" : ""}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {availAttempted && !hasAvailability && (
              <p className="text-xs text-danger">{t("availabilityRequired")}</p>
            )}

            <div className="mt-4 flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border border-border-default px-4 py-2.5 text-sm font-medium text-text-secondary transition hover:border-text-primary hover:text-text-primary">
                {tc("back")}
              </button>
              <button
                onClick={() => {
                  setAvailAttempted(true);
                  if (hasAvailability) handleSubmit();
                }}
                disabled={loading}
                className="flex-1 bg-text-primary px-4 py-2.5 text-sm font-medium text-surface-primary transition hover:bg-accent disabled:opacity-50"
              >
                {loading ? tc("saving") : t("completeSetup")}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
