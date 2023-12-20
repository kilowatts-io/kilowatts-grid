import * as p from "./parsers";

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
