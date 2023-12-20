import * as u from "./utils";

const midnightJuly1st2021 = new Date("2021-07-01T00:00:00.000Z");
const midnightDec1st2021 = new Date("2021-12-01T00:00:00.000Z");

describe("utils/londonTime", () => {
  test("summertime", () => {
    expect(u.londonTime(midnightJuly1st2021)).toEqual("01/07/2021, 01:00:00");
  });
  test("wintertime", () => {
    expect(u.londonTime(midnightDec1st2021)).toEqual("01/12/2021, 00:00:00");
  });
});

describe("utils/getSettlementPeriod", () => {
  test("summertime", () => {
    const midnightJuly1st2021 = new Date("2021-07-01T00:00:00.000Z");
    expect(u.getSettlementPeriod(midnightJuly1st2021.toISOString())).toEqual({
      settlementDate: "2021-07-01",
      settlementPeriod: 3,
    });
  });
  test("wintertime", () => {
    expect(u.getSettlementPeriod(midnightDec1st2021.toISOString())).toEqual({
      settlementDate: "2021-12-01",
      settlementPeriod: 1,
    });
  });
});


describe('utils/getCurrentYear', () => {
    test('should return the current year', () => {
        expect(u.getCurrentYear()).toBe(new Date().getFullYear());
    })
})