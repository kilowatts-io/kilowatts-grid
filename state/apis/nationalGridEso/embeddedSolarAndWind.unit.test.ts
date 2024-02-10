import * as eSW from "./embeddedSolarAndWind";

describe("state/apis/nationalGridEso/embeddedSolarAndWind/parseDate", () => {
  test("can parse date in winter", () => {
    expect(
      eSW.parseDate({
        _id: 2,
        DATE_GMT: "2024-01-26T00:00:00",
        TIME_GMT: "12:00",
        SETTLEMENT_DATE: "2024-01-26T00:00:00",
        SETTLEMENT_PERIOD: 24,
        EMBEDDED_WIND_FORECAST: 3984,
        EMBEDDED_WIND_CAPACITY: 6488,
        EMBEDDED_SOLAR_FORECAST: 4678,
        EMBEDDED_SOLAR_CAPACITY: 15905
      })
    ).toEqual("2024-01-26T12:00:00.000Z");
  });

  test("can parse date in summer", () => {
    expect(
      eSW.parseDate({
        _id: 2,
        DATE_GMT: "2024-07-26T00:00:00",
        TIME_GMT: "12:00",
        SETTLEMENT_DATE: "2024-07-26T00:00:00",
        SETTLEMENT_PERIOD: 24,
        EMBEDDED_WIND_FORECAST: 3984,
        EMBEDDED_WIND_CAPACITY: 6488,
        EMBEDDED_SOLAR_FORECAST: 4678,
        EMBEDDED_SOLAR_CAPACITY: 15905
      })
    ).toEqual("2024-07-26T12:00:00.000Z");
  });
});

describe("state/apis/nationalGridEso/embeddedSolarAndWind/transformResponse", () => {
  test("can transform response", () => {
    expect(
      eSW.transformResponse({
        result: {
          records: [
            {
              _id: 2,
              DATE_GMT: "2024-07-26T00:00:00",
              TIME_GMT: "12:00",
              SETTLEMENT_DATE: "2024-07-26T00:00:00",
              SETTLEMENT_PERIOD: 24,
              EMBEDDED_WIND_FORECAST: 3984,
              EMBEDDED_WIND_CAPACITY: 6488,
              EMBEDDED_SOLAR_FORECAST: 4678,
              EMBEDDED_SOLAR_CAPACITY: 15905
            }
          ]
        }
      } as any)
    ).toEqual([
      {
        time: "2024-07-26T12:00:00.000Z",
        solar: {
          capacity: 15905,
          level: 4678
        },
        wind: {
          capacity: 6488,
          level: 3984
        }
      }
    ]);
  });
});
