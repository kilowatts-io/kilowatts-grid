import { useNationalQuery } from "../apis/sheffield/api";
import * as sN from "./solarNationalLive";

jest.mock("../apis/sheffield/api", () => ({
  useNationalQuery: jest.fn(),
}));

describe("state/hooks/solarNationalLive/add30Minutes", () => {
  test("can accurately add 30 minutes to the start of a settlement period", () => {
    const date = new Date("2021-01-01T12:00:00Z");
    const expected = new Date("2021-01-01T12:30:00Z");
    expect(sN.add30Minutes(date)).toEqual(expected);
  });
});

describe("state/hooks/solarNationalLive/generateQueryParams", () => {
  test("can accurately generate query parameters for a date in winter time", () => {
    const date = new Date("2021-01-01T12:13:00Z");
    expect(sN.generateQueryParams(date)).toEqual({
      start: "2021-01-01T12:00:00.000Z",
      end: "2021-01-01T12:30:00.000Z",
    });
  });

  test("can accurately generate query parameters when date is exactly on the hour", () => {
    const date = new Date("2021-01-01T12:00:00Z");
    expect(sN.generateQueryParams(date)).toEqual({
      start: "2021-01-01T12:00:00.000Z",
      end: "2021-01-01T12:30:00.000Z",
    });
  });
});



