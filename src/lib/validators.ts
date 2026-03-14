import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  role: z.enum(["PARENT", "BABYSITTER"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const parentOnboardingSchema = z.object({
  phone: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid zip code required"),
  childrenJson: z.string(),
});

export const sitterOnboardingSchema = z.object({
  bio: z.string().min(10, "Bio must be at least 10 characters").max(2000),
  hourlyRate: z.number().min(1).max(500),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Valid zip code required"),
  radiusMiles: z.number().min(1).max(100).default(10),
  yearsExperience: z.number().min(0).max(50).default(0),
  languages: z.string().default("English"),
  ageRangeMin: z.number().min(0).max(17).default(0),
  ageRangeMax: z.number().min(0).max(17).default(17),
  hasFirstAid: z.boolean().default(false),
  hasCPR: z.boolean().default(false),
  hasTransportation: z.boolean().default(false),
  availabilityJson: z.string().default("{}"),
  phone: z.string().min(1, "Phone number is required"),
  sitterType: z.string().optional(),
  gender: z.string().optional(),
});

export const createRequestSchema = z
  .object({
    careType: z.enum(["recurring", "occasional"]),
    careCategory: z
      .enum(["after_school", "full_day", "overnight", "date_night", "other"])
      .optional(),
    recurringDays: z.string().optional(), // JSON array e.g. '["MON","WED"]'
    dateNeeded: z.string().optional(),    // ISO date, only for occasional
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
    durationHours: z.number().positive(),
    numberOfChildren: z.number().int().min(1).max(10),
    childrenJson: z.string(), // JSON array of { ageRange: string }
    city: z.string().min(1).refine((v) => v.toLowerCase().includes("berlin"), "Must be a Berlin location"),
    zipCode: z.string().regex(/^(10|12|13|14)\d{3}$/, "Must be a valid Berlin zip code"),
    description: z.string().max(2000).optional(),
    maxHourlyRate: z.number().positive().optional(),
  })
  .refine((d) => d.careType === "recurring" || !!d.dateNeeded, {
    message: "Date is required for one-time care",
    path: ["dateNeeded"],
  })
  .refine((d) => d.careType === "occasional" || !!d.recurringDays, {
    message: "Please select at least one day",
    path: ["recurringDays"],
  });

export const createBookingSchema = z.object({
  requestId: z.string().min(1),
  sitterId: z.string().min(1),
  agreedRate: z.number().positive(),
  parentNotes: z.string().max(1000).optional(),
});

export const reviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(200).optional(),
  comment: z.string().max(2000).optional(),
});

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty").max(5000),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  phone: z.string().optional(),
  bio: z.string().max(2000).optional(),
  hourlyRate: z.number().min(1).max(500).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  radiusMiles: z.number().min(1).max(100).optional(),
  yearsExperience: z.number().min(0).max(50).optional(),
  languages: z.string().optional(),
  ageRangeMin: z.number().min(0).max(17).optional(),
  ageRangeMax: z.number().min(0).max(17).optional(),
  hasFirstAid: z.boolean().optional(),
  hasCPR: z.boolean().optional(),
  hasTransportation: z.boolean().optional(),
  availabilityJson: z.string().optional(),
  sitterType: z.string().optional(),
  gender: z.string().optional(),
});
