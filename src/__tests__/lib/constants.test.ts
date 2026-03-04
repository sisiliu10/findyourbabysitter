import { describe, it, expect } from "vitest";
import {
  STATUS_TRANSITIONS,
  BOOKING_STATUS,
  ROLES,
  REQUEST_STATUS,
  DAYS_OF_WEEK,
  TIME_SLOTS,
} from "@/lib/constants";

describe("STATUS_TRANSITIONS", () => {
  describe("PENDING transitions", () => {
    it("allows BABYSITTER to ACCEPT", () => {
      expect(STATUS_TRANSITIONS.PENDING.ACCEPTED).toContain("BABYSITTER");
    });

    it("allows BABYSITTER to DECLINE", () => {
      expect(STATUS_TRANSITIONS.PENDING.DECLINED).toContain("BABYSITTER");
    });

    it("allows PARENT to CANCEL", () => {
      expect(STATUS_TRANSITIONS.PENDING.CANCELLED).toContain("PARENT");
    });

    it("does NOT allow PARENT to ACCEPT", () => {
      expect(STATUS_TRANSITIONS.PENDING.ACCEPTED).not.toContain("PARENT");
    });

    it("does NOT allow BABYSITTER to CANCEL from PENDING", () => {
      expect(STATUS_TRANSITIONS.PENDING.CANCELLED).not.toContain("BABYSITTER");
    });
  });

  describe("ACCEPTED transitions", () => {
    it("allows PARENT to CONFIRM", () => {
      expect(STATUS_TRANSITIONS.ACCEPTED.CONFIRMED).toContain("PARENT");
    });

    it("allows both PARENT and BABYSITTER to CANCEL", () => {
      expect(STATUS_TRANSITIONS.ACCEPTED.CANCELLED).toContain("PARENT");
      expect(STATUS_TRANSITIONS.ACCEPTED.CANCELLED).toContain("BABYSITTER");
    });
  });

  describe("CONFIRMED transitions", () => {
    it("allows PARENT to COMPLETE", () => {
      expect(STATUS_TRANSITIONS.CONFIRMED.COMPLETED).toContain("PARENT");
    });

    it("allows both PARENT and BABYSITTER to CANCEL", () => {
      expect(STATUS_TRANSITIONS.CONFIRMED.CANCELLED).toContain("PARENT");
      expect(STATUS_TRANSITIONS.CONFIRMED.CANCELLED).toContain("BABYSITTER");
    });
  });

  describe("terminal states", () => {
    it("DECLINED has no transitions", () => {
      expect(STATUS_TRANSITIONS.DECLINED).toBeUndefined();
    });

    it("COMPLETED has no transitions", () => {
      expect(STATUS_TRANSITIONS.COMPLETED).toBeUndefined();
    });

    it("CANCELLED has no transitions", () => {
      expect(STATUS_TRANSITIONS.CANCELLED).toBeUndefined();
    });

    it("REVIEWED has no transitions", () => {
      expect(STATUS_TRANSITIONS.REVIEWED).toBeUndefined();
    });
  });
});

describe("constants consistency", () => {
  it("BOOKING_STATUS contains all expected statuses", () => {
    expect(Object.values(BOOKING_STATUS)).toEqual(
      expect.arrayContaining([
        "PENDING", "ACCEPTED", "DECLINED", "CONFIRMED",
        "COMPLETED", "CANCELLED", "REVIEWED",
      ])
    );
  });

  it("REQUEST_STATUS contains expected values", () => {
    expect(Object.values(REQUEST_STATUS)).toEqual(["OPEN", "MATCHED", "CLOSED"]);
  });

  it("ROLES contains PARENT, BABYSITTER, ADMIN", () => {
    expect(ROLES.PARENT).toBe("PARENT");
    expect(ROLES.BABYSITTER).toBe("BABYSITTER");
    expect(ROLES.ADMIN).toBe("ADMIN");
  });

  it("DAYS_OF_WEEK has 7 days", () => {
    expect(DAYS_OF_WEEK).toHaveLength(7);
    expect(DAYS_OF_WEEK[0]).toBe("monday");
    expect(DAYS_OF_WEEK[6]).toBe("sunday");
  });

  it("TIME_SLOTS has 3 slots", () => {
    expect(TIME_SLOTS).toEqual(["morning", "afternoon", "evening"]);
  });
});
