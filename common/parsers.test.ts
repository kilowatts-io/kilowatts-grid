import * as p from "./parsers";
import { BmUnitLevelPairs } from "./types";

describe("parsers/shouldIncludeUnit", () => {
  test("should include T_ prefix", () => {
    expect(p.shouldIncludeUnit("T_")).toBe(true);
  });
  test("should ignore an A_ prefix", () => {
    expect(p.shouldIncludeUnit("A_")).toBe(false);
  });
});

describe("parsers/getBmUnits", () => {
  test("should return a unique list of BM units", () => {
    const input = [
      {
        bmUnit: "T_1",
      },
      {
        bmUnit: "T_2",
      },
      {
        bmUnit: "T_1",
      },
    ];
    const output = ["T_1", "T_2"];
    expect(p.getBmUnits(input)).toEqual(output);
  });

  test("it should exclude A_ units if filterUnits is true", () => {
    const input = [
      {
        bmUnit: "T_1",
      },
      {
        bmUnit: "A_1",
      },
      {
        bmUnit: "T_1",
      },
    ];
    const output = ["T_1"];
    expect(p.getBmUnits(input, true)).toEqual(output);
  });

  test("it should include A_ units if filterUnits is false", () => {
    const input = [
      {
        bmUnit: "T_1",
      },
      {
        bmUnit: "A_1",
      },
      {
        bmUnit: "T_1",
      },
    ];
    const output = ["A_1", "T_1"];
    expect(p.getBmUnits(input, false)).toEqual(output);
  });
});

describe("parsers/levelDictToLevelPairs", () => {
  test("should turn a dict with key: time, value: number into a basic array", () => {
    const input = {
      "2021-01-01T00:00": 1,
      "2021-01-01T00:30": 2,
    };
    const output = [
      {
        time: "2021-01-01T00:00",
        level: 1,
      },
      {
        time: "2021-01-01T00:30",
        level: 2,
      },
    ];
    expect(p.levelDictToLevelPairs(input)).toEqual(output);
  });

  test("if input is not in date order should sort by time", () => {
    const input = {
      "2021-01-01T00:30": 2,
      "2021-01-01T00:00": 1,
    };
    const output = [
      {
        time: "2021-01-01T00:00",
        level: 1,
      },
      {
        time: "2021-01-01T00:30",
        level: 2,
      },
    ];
    expect(p.levelDictToLevelPairs(input)).toEqual(output);
  });
});

describe("parsers/intervalRecordToLevelDict", () => {
  test("should unwind the interval record into a dict with key: time, value: number", () => {
    const input: p.IntervalRecord[] = [
      {
        timeFrom: "2021-01-01T00:00",
        timeTo: "2021-01-01T00:30",
        levelFrom: 1,
        levelTo: 2,
      },
      {
        timeFrom: "2021-01-01T00:45",
        timeTo: "2021-01-01T01:00",
        levelFrom: 3,
        levelTo: 4,
      },
    ];
    const output = {
      "2021-01-01T00:00": 1,
      "2021-01-01T00:30": 2,
      "2021-01-01T00:45": 3,
      "2021-01-01T01:00": 4,
    };
    expect(p.intervalRecordToLevelDict(input)).toEqual(output);
  });

  test("in event of duplicates should take the last stated value", () => {
    const input: p.IntervalRecord[] = [
      {
        timeFrom: "2021-01-01T00:00",
        timeTo: "2021-01-01T00:30",
        levelFrom: 1,
        levelTo: 2,
      },
      {
        timeFrom: "2021-01-01T00:30",
        timeTo: "2021-01-01T01:00",
        levelFrom: 3,
        levelTo: 4,
      },
    ];
    const output = {
      "2021-01-01T00:00": 1,
      "2021-01-01T00:30": 3,
      "2021-01-01T01:00": 4,
    };
    expect(p.intervalRecordToLevelDict(input)).toEqual(output);
  });
});

describe("parsers/interpolateLevelPair", () => {
  test("for an exact response should return the exact level", () => {
    const input = { time: "2021-01-01T00:00", level: 1 };
    const output = 1;
    expect(p.interpolateLevelPair(input.time, [input])).toBe(output);
  });

  test("should perform simple linear interpolation", () => {
    const inputs = [
      { time: "2021-01-01T00:00", level: 1 },
      { time: "2021-01-01T00:30", level: 5 },
    ];
    const halfWay = "2021-01-01T00:15";
    const output = 3;
    expect(p.interpolateLevelPair(halfWay, inputs)).toBe(output);
  });

  test("should throw an error if the requested point is outside of the range", () => {
    const inputs = [
      { time: "2021-01-01T00:00", level: 1 },
      { time: "2021-01-01T00:30", level: 5 },
    ];
    const halfWay = "2021-01-01T01:15";
    try {
      p.interpolateLevelPair(halfWay, inputs);
      throw new Error("Should not get here");
    } catch (e: any) {
      expect(e.message).toBe(
        "interpolateLevelPair: no before or after found for 2021-01-01T01:15"
      );
    }
  });
});

describe("parsers/interpolateBmUnitLevelPairs", () => {
  test("can perform simple interpolation for a single unit", () => {
    const bmUnitLevelPairs: BmUnitLevelPairs = {
      "T_DRAXX-1": [
        { time: "2021-01-01T00:00", level: 1 },
        { time: "2021-01-01T00:30", level: 5 },
      ],
    };

    const time = "2021-01-01T00:15";
    const omitZero = true;
    expect(
      p.interpolateBmUnitLevelPairs({
        time,
        bmUnitLevelPairs,
        omitZero,
      })
    ).toEqual({
      "T_DRAXX-1": 3,
    });
  });

  test("can perform simple interpolation for two simple units", () => {
    const bmUnitLevelPairs: BmUnitLevelPairs = {
      "T_DRAXX-1": [
        { time: "2021-01-01T00:00", level: 1 },
        { time: "2021-01-01T00:30", level: 5 },
      ],
      "T_DRAXX-2": [
        { time: "2021-01-01T00:00", level: 5 },
        { time: "2021-01-01T00:30", level: 9 },
      ],
    };

    const time = "2021-01-01T00:15";
    const omitZero = true;
    expect(
      p.interpolateBmUnitLevelPairs({
        time,
        bmUnitLevelPairs,
        omitZero,
      })
    ).toEqual({
      "T_DRAXX-1": 3,
      "T_DRAXX-2": 7,
    });
  });

  test("will omit a unit if the output rounds to 0", () => {
    const bmUnitLevelPairs: BmUnitLevelPairs = {
      "T_DRAXX-1": [
        { time: "2021-01-01T00:00", level: 1 },
        { time: "2021-01-01T00:30", level: 5 },
      ],
      "T_DRAXX-2": [
        { time: "2021-01-01T00:00", level: 5 },
        { time: "2021-01-01T00:30", level: 9 },
      ],
      // new smaller unit to ignore
      "T_DRAXX-23": [
        { time: "2021-01-01T00:00", level: 0.1 },
        { time: "2021-01-01T00:30", level: 0.3 },
      ],
    };

    const time = "2021-01-01T00:15";
    const omitZero = true;
    expect(
      p.interpolateBmUnitLevelPairs({
        time,
        bmUnitLevelPairs,
        omitZero,
      })
    ).toEqual({
      "T_DRAXX-1": 3,
      "T_DRAXX-2": 7,
    });
  });
});
