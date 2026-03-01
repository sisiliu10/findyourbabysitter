"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DAYS_OF_WEEK, TIME_SLOTS } from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { getInitials } from "@/lib/utils";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
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

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((json) => {
        const user: UserProfile = json.data || json;
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setPhone(user.phone || "");
        setAvatarUrl(user.avatarUrl);
        setRole(user.role);

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
      .catch(() => setError("Failed to load profile"))
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
        setError(json.error || "Failed to upload avatar");
      }
    } catch {
      setError("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const body: Record<string, unknown> = {
      firstName,
      lastName,
      phone: phone || undefined,
    };

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
        setError(data.error || "Failed to save profile");
        return;
      }

      setSuccess("Profile updated successfully");
      setTimeout(() => router.push("/profile"), 1200);
    } catch {
      setError("Something went wrong");
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
        <h1 className="font-serif text-2xl text-text-primary">Edit Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Update your personal information and preferences.
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
            Profile Photo
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
                {uploadingAvatar ? "Uploading..." : "Change Photo"}
              </Button>
              <p className="mt-1.5 text-xs text-text-tertiary">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>
        </section>

        {/* Basic Info */}
        <section className="border border-border-default bg-surface-secondary p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
            Basic Information
          </p>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <Input
              label="Phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </section>

        {/* Sitter sections */}
        {isSitter && (
          <>
            {/* About */}
            <section className="border border-border-default bg-surface-secondary p-6">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-text-secondary">
                About You
              </p>
              <div className="space-y-4">
                <Textarea
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell parents about yourself, your experience, and what makes you a great babysitter..."
                  rows={5}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Hourly Rate ($)"
                    type="number"
                    min="1"
                    step="0.50"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                  <Input
                    label="Years of Experience"
                    type="number"
                    min="0"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                  />
                </div>
                <Input
                  label="Languages (comma separated)"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="English, Spanish"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Youngest Age Comfortable"
                    type="number"
                    min="0"
                    max="17"
                    value={ageRangeMin}
                    onChange={(e) => setAgeRangeMin(e.target.value)}
                  />
                  <Input
                    label="Oldest Age Comfortable"
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
                Location
              </p>
              <div className="space-y-4">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="CA"
                  />
                  <Input
                    label="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    placeholder="94102"
                  />
                </div>
                <Input
                  label="Travel Radius (miles)"
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
                Certifications
              </p>
              <div className="flex flex-wrap gap-6">
                {[
                  {
                    label: "First Aid",
                    checked: hasFirstAid,
                    set: setHasFirstAid,
                  },
                  { label: "CPR", checked: hasCPR, set: setHasCPR },
                  {
                    label: "Has Transportation",
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
                Availability
              </p>
              <p className="mb-4 text-sm text-text-secondary">
                Select when you are typically available.
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
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS_OF_WEEK.map((day) => (
                      <tr key={day}>
                        <td className="py-1.5 pr-3 text-sm capitalize text-text-secondary">
                          {day}
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
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
