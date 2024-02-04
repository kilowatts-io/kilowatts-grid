import * as eF from "./embeddedForecasts";
import { renderHook } from "@testing-library/react-native";

jest.mock("../apis/nationalGridEso/api", () => ({
  useEmbeddedSolarAndWindQuery: jest.fn(),
}));

describe("state/hooks/embeddedForecasts/interpolateValue", () => {
  test("if first value is in future, return that", () => {
    const now = new Date("2024-01-02T01:25:00Z");
    const values = [
      {
        time: "2024-01-02T01:30:00Z",
        solar: { capacity: 1, level: 2 },
        wind: { capacity: 3, level: 4 },
      },
      {
        time: "2024-01-02T02:30:00Z",
        solar: { capacity: 5, level: 6 },
        wind: { capacity: 7, level: 8 },
      },
    ];
    const resp = eF.interpolateValue(now, values);
    expect(resp).toMatchObject(values[0]);
  });

  test("will interpolate between two values", () => {
    const now = new Date("2024-01-02T01:35:00Z");
    const values = [
      {
        time: "2024-01-02T01:30:00Z",
        solar: { capacity: 1, level: 2 },
        wind: { capacity: 3, level: 4 },
      },
      {
        time: "2024-01-02T02:30:00Z",
        solar: { capacity: 5, level: 6 },
        wind: { capacity: 7, level: 8 },
      },
    ];
    const resp = eF.interpolateValue(now, values);
    expect(resp).toMatchObject({
      time: now.toISOString(),
      solar: {
        capacity: values[0].solar.capacity,
      },
      wind: {
        capacity: values[0].wind.capacity,
      },
    });
    expect(resp.solar.level).toBeCloseTo(2 + 1 / 3);
    expect(resp.wind.level).toBeCloseTo(4 + 1 / 3);
  });
});


describe("state/hooks/embeddedForecasts/toCurrentOutput", () => {
  test('performs conversion', () => {
    const input = {
      capacity: 1,
      level: 2,
    };
    const resp = eF.toCurrentOutput(input);
    expect(resp).toMatchObject({
      capacity: input.capacity,
      preBm: input.level,
      postBm: { actual: input.level, delta: 0 },
    });
  })
})