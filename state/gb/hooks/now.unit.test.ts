import * as n from "./now";

describe("state/hooks/now/add29Minutes", () => {
  test("outputs HH:29 when input is HH:00", () => {
    const now = new Date("2020-01-01T12:00:00.000Z");
    expect(n.add29Minutes(now).toISOString()).toEqual(
      "2020-01-01T12:29:00.000Z"
    );
  });

  test("outputs HH:59 when input is HH:30", () => {
    const now = new Date("2020-01-01T12:30:00.000Z");
    expect(n.add29Minutes(now).toISOString()).toEqual(
      "2020-01-01T12:59:00.000Z"
    );
  });
});

describe("state/hooks/now/getSettlementPeriod", () => {
  test("correctly identified winter midnight period 1", () => {
    const now = new Date("2020-01-01T00:00:05.000Z");
    expect(n.getSettlementPeriod(now)).toEqual({
      settlementDate: "2020-01-01",
      settlementPeriod: 1
    });
  });

  test("correctly identifies summer midnight period 1", () => {
    const now = new Date("2020-06-30T23:00:05.000Z");
    expect(n.getSettlementPeriod(now)).toEqual({
      settlementDate: "2020-07-01",
      settlementPeriod: 1
    });
  });
});
