import { londonDateYYYYMMDD, londonTimeHHMMSS } from "./dateTime";

describe("utils/dateTime/londonDateYYMMDD", () => {
  test("will get a summer midnight correct", () => {
    const date = new Date("2021-06-01T00:00:00.000Z");
    const result = londonDateYYYYMMDD(date);
    expect(result).toEqual("2021-05-31");
  });
});

describe("utils/dateTime/londonTimeHHMMSS", () => {
  test("will not change HH for winter", () => {
    const date = new Date("2021-01-01T12:00:00.000Z");
    const result = londonDateYYYYMMDD(date);
    expect(result).toEqual("12:00:00");
  });

  test("will +1 HH for summer", () => {
    const date = new Date("2021-07-01T12:00:00.000Z");
    const result = londonDateYYYYMMDD(date);
    expect(result).toEqual("13:00:00");
  });

  test("will ignore miliseconds ", () => {
    const date = new Date("2021-07-01T12:00:00.123Z");
    const result = londonDateYYYYMMDD(date);
    expect(result).toEqual("13:00:00");
  });
});
