import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatTime,
  formatCurrency,
  cn,
  getInitials,
  getTimeBucket,
} from "@/lib/utils";

describe("formatDate", () => {
  it("formats date in English by default", () => {
    const result = formatDate("2026-03-15");
    expect(result).toContain("Mar");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });

  it("formats date in German when locale is de", () => {
    const result = formatDate("2026-03-15", "de");
    expect(result).toContain("2026");
    // German uses "März" or "Mär" for March
    expect(result).toMatch(/M(ä|a)r/);
  });

  it("handles Date objects", () => {
    const result = formatDate(new Date(2026, 0, 1));
    expect(result).toContain("Jan");
    expect(result).toContain("2026");
  });
});

describe("formatTime", () => {
  it("converts morning time to 12h format", () => {
    expect(formatTime("09:30")).toBe("9:30 AM");
  });

  it("converts afternoon time to 12h format", () => {
    expect(formatTime("14:00")).toBe("2:00 PM");
  });

  it("handles noon", () => {
    expect(formatTime("12:00")).toBe("12:00 PM");
  });

  it("handles midnight", () => {
    expect(formatTime("00:00")).toBe("12:00 AM");
  });

  it("handles 11 PM", () => {
    expect(formatTime("23:45")).toBe("11:45 PM");
  });
});

describe("formatCurrency", () => {
  it("formats amount as EUR", () => {
    const result = formatCurrency(25);
    // German locale uses comma separator and EUR symbol
    expect(result).toContain("€");
    expect(result).toMatch(/25/);
  });

  it("formats decimal amounts", () => {
    const result = formatCurrency(12.5);
    expect(result).toContain("€");
    expect(result).toMatch(/12,50|12\.50/);
  });
});

describe("cn", () => {
  it("joins class names with spaces", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", null, undefined, false, "bar")).toBe("foo bar");
  });

  it("returns empty string for all falsy", () => {
    expect(cn(false, null, undefined)).toBe("");
  });
});

describe("getInitials", () => {
  it("returns uppercase initials", () => {
    expect(getInitials("John", "Doe")).toBe("JD");
  });

  it("handles lowercase names", () => {
    expect(getInitials("jane", "smith")).toBe("JS");
  });
});

describe("getTimeBucket", () => {
  it("returns morning for times before 12:00", () => {
    expect(getTimeBucket("08:00")).toBe("morning");
    expect(getTimeBucket("11:59")).toBe("morning");
  });

  it("returns afternoon for times 12:00-16:59", () => {
    expect(getTimeBucket("12:00")).toBe("afternoon");
    expect(getTimeBucket("16:59")).toBe("afternoon");
  });

  it("returns evening for times 17:00+", () => {
    expect(getTimeBucket("17:00")).toBe("evening");
    expect(getTimeBucket("21:00")).toBe("evening");
  });
});
