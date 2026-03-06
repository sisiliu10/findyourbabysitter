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
