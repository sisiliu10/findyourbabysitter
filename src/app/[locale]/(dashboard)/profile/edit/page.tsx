"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { DAYS_OF_WEEK, TIME_SLOTS, CHILDCARE_TYPES, CARE_TIMES_OF_DAY, CARE_FREQUENCIES } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { getInitials } from "@/lib/utils";
import { getDistrictFromZip } from "@/lib/berlin-districts";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  birthday: string | null;
  instagram: string | null;
  bio: string;
  childcareTypes: string;
  timesOfDay: string;
  careFrequency: string;
  zipCode: string;
  district: string;
  babysitterProfile: {
    bio: string;
    hourlyRate: number;
    city: string;
    state: string;
    zipCode: string;
    radiusMiles: number;
    yearsExperience: number;
    languages: string;
    ageRangeMin: number;
    ageRangeMax: number;
    hasFirstAid: boolean;
    hasCPR: boolean;
    hasTransportation: boolean;
    availabilityJson: string;
  } | null;
}

export default function ProfileEditPage() {
  const router = useRouter();
  const t = useTranslations("profileEdit");
  const tc = useTranslations("common");
  const tn = useTranslations("childcareNeeds");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // User fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [instagram, setInstagram] = useState("");
  const [role, setRole] = useState("");

  // Sitter fields
  const [bio, setBio] = useState("");
  const [hourlyRate, setHourlyRate] = useState("20");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [radiusMiles, setRadiusMiles] = useState("10");
  const [yearsExperience, setYearsExperience] = useState("0");
  const [languages, setLanguages] = useState("English");
  const [ageRangeMin, setAgeRangeMin] = useState("0");
  const [ageRangeMax, setAgeRangeMax] = useState("17");
  const [hasFirstAid, setHasFirstAid] = useState(false);
  const [hasCPR, setHasCPR] = useState(false);
  const [hasTransportation, setHasTransportation] = useState(false);
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    {}
  );

  // Parent childcare needs
  const [childcareTypes, setChildcareTypes] = useState<string[]>([]);
  const [timesOfDay, setTimesOfDay] = useState<string[]>([]);
  const [careFrequency, setCareFrequency] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        const user: UserProfile = json.data || json;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setPhone(user.phone || "");
        setBirthday(user.birthday ? user.birthday.slice(0, 10) : "");
        setAvatarUrl(user.avatarUrl);
        setInstagram(user.instagram || "");
        setRole(user.role);
        setBio(user.bio || "");

        // Load childcare needs
        try { setChildcareTypes(JSON.parse(user.childcareTypes || "[]")); } catch { /* empty */ }
        try { setTimesOfDay(JSON.parse(user.timesOfDay || "[]")); } catch { /* empty */ }
        setCareFrequency(user.careFrequency || "");

        // Load user-level zip for parents
        if (user.zipCode) setZipCode(user.zipCode);

        if (user.babysitterProfile) {
          const p = user.babysitterProfile;
          setBio(p.bio);
          setHourlyRate(String(p.hourlyRate));
          setCity(p.city);
          setState(p.state);
          setZipCode(p.zipCode);
          setRadiusMiles(String(p.radiusMiles));
          setYearsExperience(String(p.yearsExperience));
          setLanguages(p.languages);
          setAgeRangeMin(String(p.ageRangeMin));
          setAgeRangeMax(String(p.ageRangeMax));
          setHasFirstAid(p.hasFirstAid);
          setHasCPR(p.hasCPR);
          setHasTransportation(p.hasTransportation);
          try {
            setAvailability(JSON.parse(p.availabilityJson));
          } catch {
            setAvailability({});
          }
        }
      })
      .catch(() => setError(t("failedToLoad")))
      .finally(() => setLoading(false));
  }, []);

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

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok) {
        setAvatarUrl(json.data?.avatarUrl || json.avatarUrl);
      } else {
        setError(json.error || t("failedToUpload"));
      }
    } catch {
      setError(t("failedToUpload"));
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const district = getDistrictFromZip(zipCode);

    const body: Record<string, unknown> = {
      firstName,
      lastName,
      phone: phone || undefined,
      birthday: birthday || undefined,
      instagram: instagram || "",
      bio,
      zipCode,
      district,
    };

    if (role === "PARENT") {
      body.childcareTypes = JSON.stringify(childcareTypes);
      body.timesOfDay = JSON.stringify(timesOfDay);
      body.careFrequency = careFrequency;
    }

    if (role === "BABYSITTER") {
      Object.assign(body, {
        bio,
        hourlyRate: parseFloat(hourlyRate),
        city,
        state,
        zipCode,
        radiusMiles: parseInt(radiusMiles, 10),
        yearsExperience: parseInt(yearsExperience, 10),
        languages,
        ageRangeMin: parseInt(ageRangeMin, 10),
        ageRangeMax: parseInt(ageRangeMax, 10),
        hasFirstAid,
        hasCPR,
        hasTransportation,
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

      setSuccess(t("profileUpdated"));
      setTimeout(() => router.push("/profile"), 1200);
    } catch {
      setError(tc("somethingWentWrong"));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" className="text-accent" />
      </div>
    );
  }

  const initials = getInitials(firstName || "U", lastName || "U");
  const isSitter = role === "BABYSITTER";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-text-primary">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {t("subtitle")}
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-danger/30 bg-danger-muted p-3 text-sm text-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 border border-success/30 bg-success-muted p-3 text-sm text-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Section */}
        <section className="border border-border-default bg-surface-secondary p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("profilePhoto")}
          </p>
          <div className="flex items-center gap-5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="h-20 w-20 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center bg-accent-muted text-xl font-semibold text-accent">
                {initials}
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={uploadingAvatar}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadingAvatar ? t("uploading") : t("changePhoto")}
              </Button>
              <p className="mt-1.5 text-xs text-text-tertiary">
                {t("photoHint")}
              </p>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="border border-border-default bg-surface-secondary p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            {t("basicInfo")}
          </p>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label={t("firstName")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label={t("lastName")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <Input
              label={t("birthday")}
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
            <Input
              label={t("phoneOptional")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
            <Input
              label={t("instagramOptional")}
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@yourusername"
            />
          </div>
        </section>

        {/* Bio section for parents */}
        {!isSitter && (
          <section className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("aboutYou")}
            </p>
            <Textarea
              label={t("bio")}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t("bioPlaceholderParent")}
              rows={4}
            />
          </section>
        )}

        {/* Location (Parents) */}
        {!isSitter && (
          <section className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {t("location")}
            </p>
            <Input
              label={t("zipCode")}
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="10117"
            />
            {zipCode && getDistrictFromZip(zipCode) && (
              <p className="mt-2 text-sm text-text-secondary">
                {getDistrictFromZip(zipCode)}, Berlin
              </p>
            )}
          </section>
        )}

        {/* Childcare Needs (Parents) */}
        {!isSitter && (
          <section className="border border-border-default bg-surface-secondary p-6">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
              {tn("title")}
            </p>
            <div className="space-y-5">
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">{tn("childcareType")}</p>
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
                      {tn(`types.${type}` as any)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">{tn("timeOfDay")}</p>
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
                      {tn(`times.${time}` as any)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-tertiary">{tn("frequency")}</p>
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
                      {tn(`frequencies.${freq}` as any)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Sitter sections */}
        {isSitter && (
          <>
            {/* About */}
            <section className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
                {t("aboutYou")}
              </p>
              <div className="space-y-4">
                <Textarea
                  label={t("bio")}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t("bioPlaceholder")}
                  rows={5}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label={t("hourlyRate")}
                    type="number"
                    min="1"
                    step="0.50"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                  <Input
                    label={t("yearsExperience")}
                    type="number"
                    min="0"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                  />
                </div>
                <Input
                  label={t("languagesLabel")}
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="English, Spanish"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label={t("youngestAge")}
                    type="number"
                    min="0"
                    max="17"
                    value={ageRangeMin}
                    onChange={(e) => setAgeRangeMin(e.target.value)}
                  />
                  <Input
                    label={t("oldestAge")}
                    type="number"
                    min="0"
                    max="17"
                    value={ageRangeMax}
                    onChange={(e) => setAgeRangeMax(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
                {t("location")}
              </p>
              <div className="space-y-4">
                <Input
                  label={t("city")}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Berlin"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label={t("state")}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Berlin"
                  />
                  <Input
                    label={t("zipCode")}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="10117"
                  />
                </div>
                <Input
                  label={t("travelRadius")}
                  type="number"
                  min="1"
                  max="100"
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(e.target.value)}
                />
              </div>
            </section>

            {/* Certifications */}
            <section className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
                {t("certifications")}
              </p>
              <div className="flex flex-wrap gap-6">
                {[
                  {
                    label: t("firstAid"),
                    checked: hasFirstAid,
                    set: setHasFirstAid,
                  },
                  { label: t("cpr"), checked: hasCPR, set: setHasCPR },
                  {
                    label: t("hasTransportation"),
                    checked: hasTransportation,
                    set: setHasTransportation,
                  },
                ].map((cert) => (
                  <label
                    key={cert.label}
                    className="flex items-center gap-2.5 text-sm text-text-secondary"
                  >
                    <input
                      type="checkbox"
                      checked={cert.checked}
                      onChange={(e) => cert.set(e.target.checked)}
                      className="h-4 w-4 border-border-default text-accent focus:ring-accent"
                    />
                    {cert.label}
                  </label>
                ))}
              </div>
            </section>

            {/* Availability */}
            <section className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-secondary">
                {t("availability")}
              </p>
              <p className="mb-4 text-sm text-text-secondary">
                {t("selectAvailability")}
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2 text-left text-xs font-medium uppercase tracking-wide text-text-secondary" />
                      {TIME_SLOTS.map((slot) => (
                        <th
                          key={slot}
                          className="pb-2 text-center text-xs font-medium uppercase tracking-wide text-text-secondary"
                        >
                          {tc(`timeSlots.${slot}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS_OF_WEEK.map((day) => (
                      <tr key={day}>
                        <td className="py-1.5 pr-3 text-sm text-text-secondary">
                          {tc(`days.${day}`)}
                        </td>
                        {TIME_SLOTS.map((slot) => (
                          <td key={slot} className="py-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => toggleAvailability(day, slot)}
                              className={`h-8 w-8 text-xs transition ${
                                (availability[day] || []).includes(slot)
                                  ? "bg-accent text-white"
                                  : "bg-surface-tertiary text-text-muted hover:bg-surface-elevated"
                              }`}
                            >
                              {(availability[day] || []).includes(slot)
                                ? "\u2713"
                                : ""}
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/profile")}
          >
            {tc("cancel")}
          </Button>
          <Button type="submit" loading={saving}>
            {saving ? tc("saving") : t("saveChanges")}
          </Button>
        </div>
      </form>
    </div>
  );
}
