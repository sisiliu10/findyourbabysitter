export const ROLES = {
  PARENT: "PARENT",
  BABYSITTER: "BABYSITTER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const BOOKING_STATUS = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  DECLINED: "DECLINED",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REVIEWED: "REVIEWED",
} as const;

export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

export const REQUEST_STATUS = {
  OPEN: "OPEN",
  MATCHED: "MATCHED",
  CLOSED: "CLOSED",
} as const;

export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const TIME_SLOTS = ["morning", "afternoon", "evening"] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const CHILDCARE_TYPES = [
  "after_school",
  "evening",
  "weekend",
  "emergency",
  "baby_toddler",
  "homework",
] as const;

export type ChildcareType = (typeof CHILDCARE_TYPES)[number];

export const CARE_TIMES_OF_DAY = [
  "morning",
  "midday",
  "afternoon",
  "evening",
  "night",
] as const;

export type CareTimeOfDay = (typeof CARE_TIMES_OF_DAY)[number];

export const CARE_FREQUENCIES = [
  "one_time",
  "occasional",
  "weekly",
  "multiple_weekly",
] as const;

export type CareFrequency = (typeof CARE_FREQUENCIES)[number];

export const SITTER_TYPES = [
  "student",
  "schueler",
  "erzieher_azubi",
  "other",
] as const;

export type SitterType = (typeof SITTER_TYPES)[number];

export const LANGUAGE_OPTIONS: { value: string; flag: string }[] = [
  { value: "English", flag: "\uD83C\uDDEC\uD83C\uDDE7" },
  { value: "German", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
  { value: "Spanish", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
  { value: "French", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
  { value: "Turkish", flag: "\uD83C\uDDF9\uD83C\uDDF7" },
  { value: "Russian", flag: "\uD83C\uDDF7\uD83C\uDDFA" },
  { value: "Arabic", flag: "\uD83C\uDDF8\uD83C\uDDE6" },
  { value: "Polish", flag: "\uD83C\uDDF5\uD83C\uDDF1" },
  { value: "Italian", flag: "\uD83C\uDDEE\uD83C\uDDF9" },
  { value: "Portuguese", flag: "\uD83C\uDDF5\uD83C\uDDF9" },
  { value: "Ukrainian", flag: "\uD83C\uDDFA\uD83C\uDDE6" },
  { value: "Romanian", flag: "\uD83C\uDDF7\uD83C\uDDF4" },
  { value: "Chinese", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
  { value: "Korean", flag: "\uD83C\uDDF0\uD83C\uDDF7" },
  { value: "Japanese", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
  { value: "Hindi", flag: "\uD83C\uDDEE\uD83C\uDDF3" },
  { value: "Persian", flag: "\uD83C\uDDEE\uD83C\uDDF7" },
  { value: "Vietnamese", flag: "\uD83C\uDDFB\uD83C\uDDF3" },
  { value: "Greek", flag: "\uD83C\uDDEC\uD83C\uDDF7" },
  { value: "Bulgarian", flag: "\uD83C\uDDE7\uD83C\uDDEC" },
];

// Allowed booking status transitions: { [currentStatus]: { [newStatus]: allowedRole[] } }
export const STATUS_TRANSITIONS: Record<string, Record<string, string[]>> = {
  PENDING: {
    ACCEPTED: ["BABYSITTER"],
    DECLINED: ["BABYSITTER"],
    CANCELLED: ["PARENT"],
  },
  ACCEPTED: {
    CONFIRMED: ["PARENT"],
    CANCELLED: ["PARENT", "BABYSITTER"],
  },
  CONFIRMED: {
    COMPLETED: ["PARENT"],
    CANCELLED: ["PARENT", "BABYSITTER"],
  },
};
