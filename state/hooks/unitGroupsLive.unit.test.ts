import { UnitGroup } from "../gb/fixtures/generators/unit-groups";
import * as ugl from "./unitGroupsLive";
import { renderHook } from "@testing-library/react-native";

// mock unit groups

jest.mock("../../assets/bmUnits/unitGroups", () => ({
  unitGroups: [
    {
      details: {
        code: "coal1",
        name: "Coal 1",
        coords: {
          lat: 0,
          lng: 0,
        },
        fuelType: "coal",
      },
      units: [
        {
          bmUnit: "coal1a",
        },
        {
          bmUnit: "coal1b",
        },
      ],
    },
    {
      details: {
        code: "gas1",
        name: "Gas 1",
        coords: {
          lat: 0,
          lng: 0,
        },
        fuelType: "gas",
      },
      units: [
        {
          bmUnit: "gas1a",
        },
        {
          bmUnit: "gas1b",
        },
      ],
    },
  ] as UnitGroup[],
}));

jest.mock("./now", () => ({
  useNowQuery: jest.fn().mockReturnValue({
    now: new Date("2021-01-01T00:10:00Z"),
    args: { settlementDate: "2021-01-01", settlementPeriod: 1 },
  }),
}));

jest.mock("../apis/elexon/api", () => ({
  useBoalfQuery: jest.fn().mockReturnValue({ data: null, isLoading: true }),
  usePnQuery: jest.fn().mockReturnValue({ data: null, isLoading: true }),
  useMelsQuery: jest.fn().mockReturnValue({ data: null, isLoading: true }),
}));

describe("state/hooks/unitGroupsLive.unit.test.ts/useUseGroupsLiveQuery", () => {
  test("calls useNowQuery and elexon use api queries and returns initial loading state", () => {
    const { result, unmount } = renderHook(() => ugl.useUseGroupsLiveQuery());
    expect(result.current).toEqual({
      data: {
        foreignMarkets: [],
        generators: [],
      },
      isLoading: true,
      now: new Date("2021-01-01T00:10:00Z"),
    });
    unmount();
  });
});

describe("state/hooks/unitGroupsLive.unit.test.ts/evaluateForeignMarkets", () => {
  test("it output values of 0 for everything if no data is provided", () => {
    const output = ugl.evaluateForeignMarkets({
      data: {},
      now: new Date("2021-01-01T00:10:00Z"),
    });
    for (const foreignMarket of output) {
      for (const interconnector of foreignMarket.interconnectors) {
        expect(interconnector.output).toMatchObject({
          postBm: { actual: 0, delta: 0 },
          preBm: 0,
        });
      }
    }
  });

  test("it can sum the output of two units on IFA", () => {
    const output = ugl.evaluateForeignMarkets({
      data: {
        "I_EAD-FRAN1": {
          pn: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 100,
            },
          ],
          mels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 100,
            },
          ],
          boalf: [],
        },
        "I_EAG-FRAN1": {
          pn: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 100,
            },
          ],
          mels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 100,
            },
          ],
          boalf: [],
        },
      },
      now: new Date("2021-01-01T00:00:00Z"),
    });
    for (const foreignMarket of output) {
      if (foreignMarket.name === "france") {
        expect(foreignMarket).toMatchObject({
          interconnectors: [
            {
              key: "ELEC",
              name: "Eleclink",
              output: {
                postBm: { actual: 0, delta: 0 },
                preBm: 0,
              },
            },
            {
              key: "FRAN",
              name: "IFA",
              output: {
                postBm: { actual: 200, delta: 0 },
                preBm: 200,
              },
            },
            {
              key: "IFA2",
              name: "IFA2",
              output: {
                postBm: { actual: 0, delta: 0 },
                preBm: 0,
              },
            },
          ],
        });
      } else {
        for (const interconnector of foreignMarket.interconnectors) {
          expect(interconnector.output).toMatchObject({
            postBm: { actual: 0, delta: 0 },
            preBm: 0,
          });
        }
      }
    }
  });
});

describe("state/hooks/unitGroupsLive.unit.test.ts/evaluateGenerators", () => {
  test("it can deal with / ignore a unit with no PNs and return unitGroups that are all offline", () => {
    const now = new Date("2021-01-01T00:10:00Z");
    const output = ugl.evaluateGenerators({
      data: {
        gas1a: {
          pn: [],
          mels: [],
          boalf: [],
        },
      },
      now,
    });
    expect(output).toEqual([
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "coal",
        key: "coal1",
        name: "Coal 1",
        output: { capacity: 0, postBm: { actual: 0, delta: 0 }, preBm: 0 },
      },
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "gas",
        key: "gas1",
        name: "Gas 1",
        output: { capacity: 0, postBm: { actual: 0, delta: 0 }, preBm: 0 },
      },
    ]);
  });
  test("it positively attributes/recognises the output from a coal unit and leaves the gas unit as not running", () => {
    const now = new Date("2021-01-01T00:00:00Z");
    const output = ugl.evaluateGenerators({
      data: {
        coal1a: {
          pn: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 10,
            },
          ],
          mels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 150,
            },
          ],
          boalf: [],
        },
      },
      now,
    });
    expect(output).toEqual([
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "coal",
        key: "coal1",
        name: "Coal 1",
        output: { capacity: 150, postBm: { actual: 10, delta: 0 }, preBm: 10 },
      },
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "gas",
        key: "gas1",
        name: "Gas 1",
        output: { capacity: 0, postBm: { actual: 0, delta: 0 }, preBm: 0 },
      },
    ]);
  });
});

describe("state/hooks/unitGroupsLive.unit.test.ts/joinByBmUnit", () => {
  test("returns an empty object if no data is passed", () => {
    const output = ugl.joinByBmUnit({
      pn: [],
      mels: [],
      boalf: [],
    });

    expect(output).toEqual({});
  });

  test("for a single bm unit it can get pn, mels and boalf records", () => {
    const output = ugl.joinByBmUnit({
      pn: [
        {
          bmUnit: "BMU1",
          levels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 10,
            },
          ],
        },
      ],
      mels: [
        {
          bmUnit: "BMU1",
          levels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 100,
            },
          ],
        },
      ],
      boalf: [
        {
          bmUnit: "BMU1",
          boalfs: [
            {
              acceptanceNumber: 1,
              acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
              deemedBoFlag: false,
              soFlag: false,
              amendmentFlag: "A",
              storFlag: false,
              rrFlag: false,
              levels: [
                {
                  time: new Date("2021-01-01T00:00:00Z").toISOString(),
                  level: 10,
                },
              ],
            },
          ],
        },
        // this should be ignored as it has no PN
        {
          bmUnit: "BMU2",
          boalfs: [
            {
              acceptanceNumber: 1,
              acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
              deemedBoFlag: false,
              soFlag: false,
              amendmentFlag: "A",
              storFlag: false,
              rrFlag: false,
              levels: [
                {
                  time: new Date("2021-01-01T00:00:00Z").toISOString(),
                  level: 10,
                },
              ],
            },
          ],
        },
      ],
    });

    expect(output).toEqual({
      BMU1: {
        pn: [
          {
            time: new Date("2021-01-01T00:00:00Z").toISOString(),
            level: 10,
          },
        ],
        mels: [
          {
            time: new Date("2021-01-01T00:00:00Z").toISOString(),
            level: 100,
          },
        ],
        boalf: [
          {
            acceptanceNumber: 1,
            acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
            deemedBoFlag: false,
            soFlag: false,
            amendmentFlag: "A",
            storFlag: false,
            rrFlag: false,
            levels: [
              {
                time: new Date("2021-01-01T00:00:00Z").toISOString(),
                level: 10,
              },
            ],
          },
        ],
      },
    });
  });

  test("can join data for multiple bmUnits", () => {
    const output = ugl.joinByBmUnit({
      pn: [
        {
          bmUnit: "BMU1",
          levels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 10,
            },
          ],
        },
        {
          bmUnit: "BMU2",
          levels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 20,
            },
          ],
        },
      ],
      mels: [
        {
          bmUnit: "BMU1",
          levels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 100,
            },
          ],
        },
        {
          bmUnit: "BMU2",
          levels: [
            {
              time: new Date("2021-01-01T00:00:00Z").toISOString(),
              level: 200,
            },
          ],
        },
      ],
      boalf: [
        {
          bmUnit: "BMU1",
          boalfs: [
            {
              acceptanceNumber: 1,
              acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
              deemedBoFlag: false,
              soFlag: false,
              amendmentFlag: "A",
              storFlag: false,
              rrFlag: false,
              levels: [
                {
                  time: new Date("2021-01-01T00:00:00Z").toISOString(),
                  level: 10,
                },
              ],
            },
          ],
        },
        {
          bmUnit: "BMU2",
          boalfs: [
            {
              acceptanceNumber: 1,
              acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
              deemedBoFlag: false,
              soFlag: false,
              amendmentFlag: "A",
              storFlag: false,
              rrFlag: false,
              levels: [
                {
                  time: new Date("2021-01-01T00:00:00Z").toISOString(),
                  level: 20,
                },
              ],
            },
          ],
        },
      ],
    });

    expect(output).toEqual({
      BMU1: {
        pn: [
          {
            time: new Date("2021-01-01T00:00:00Z").toISOString(),
            level: 10,
          },
        ],
        mels: [
          {
            time: new Date("2021-01-01T00:00:00Z").toISOString(),
            level: 100,
          },
        ],
        boalf: [
          {
            acceptanceNumber: 1,
            acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
            deemedBoFlag: false,
            soFlag: false,
            amendmentFlag: "A",
            storFlag: false,
            rrFlag: false,
            levels: [
              {
                time: new Date("2021-01-01T00:00:00Z").toISOString(),
                level: 10,
              },
            ],
          },
        ],
      },
      BMU2: {
        pn: [
          {
            time: new Date("2021-01-01T00:00:00Z").toISOString(),
            level: 20,
          },
        ],
        mels: [
          {
            time: new Date("2021-01-01T00:00:00Z").toISOString(),
            level: 200,
          },
        ],
        boalf: [
          {
            acceptanceNumber: 1,
            acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
            deemedBoFlag: false,
            soFlag: false,
            amendmentFlag: "A",
            storFlag: false,
            rrFlag: false,
            levels: [
              {
                time: new Date("2021-01-01T00:00:00Z").toISOString(),
                level: 20,
              },
            ],
          },
        ],
      },
    });
  });
});

describe("state/hooks/unitGroupsLive.unit.test.ts/sortGenerators", () => {
  test("will sort generators so that non running ones are last", () => {
    const output = ugl.sortGenerators([
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "coal",
        key: "coal1",
        name: "Coal 1",
        output: { capacity: 0, postBm: { actual: 0, delta: 0 }, preBm: 0 },
      },
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "gas",
        key: "gas1",
        name: "Gas 1",
        output: { capacity: 0, postBm: { actual: 100, delta: 0 }, preBm: 100 },
      },
    ]);
    expect(output).toEqual([
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "gas",
        key: "gas1",
        name: "Gas 1",
        output: { capacity: 0, postBm: { actual: 100, delta: 0 }, preBm: 100 },
      },
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "coal",
        key: "coal1",
        name: "Coal 1",
        output: { capacity: 0, postBm: { actual: 0, delta: 0 }, preBm: 0 },
      },
    ]);
  });

  test("will sort generators so that running ones are sorted in descending order", () => {
    const output = ugl.sortGenerators([
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "coal",
        key: "coal1",
        name: "Coal 1",
        output: { capacity: 0, postBm: { actual: 0, delta: 0 }, preBm: 0 },
      },
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "gas",
        key: "gas2",
        name: "Gas 2",
        output: { capacity: 0, postBm: { actual: 50, delta: 0 }, preBm: 50 },
      },
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "gas",
        key: "gas1",
        name: "Gas 1",
        output: { capacity: 0, postBm: { actual: 100, delta: 0 }, preBm: 100 },
      },
    ]);
    expect(output).toEqual([
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "gas",
        key: "gas1",
        name: "Gas 1",
        output: { capacity: 0, postBm: { actual: 100, delta: 0 }, preBm: 100 },
      },
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "gas",
        key: "gas2",
        name: "Gas 2",
        output: { capacity: 0, postBm: { actual: 50, delta: 0 }, preBm: 50 },
      },
      {
        coords: { lat: 0, lng: 0 },
        generatorType: "coal",
        key: "coal1",
        name: "Coal 1",
        output: { capacity: 0, postBm: { actual: 0, delta: 0 }, preBm: 0 },
      },
    ]);
  });
});

describe("state/hooks/unitGroupsLive.unit.test.ts/joinQueries", () => {
  test("returns null if pn.data is null", () => {
    const output = ugl.joinQueries({
      pn: { data: null, isLoading: false },
      mels: { data: [], isLoading: false },
      boalf: { data: [], isLoading: false },
      now: new Date("2021-01-01T00:10:00Z"),
    } as any);

    expect(output).toEqual({
      data: null,
      isLoading: false,
      now: new Date("2021-01-01T00:10:00Z"),
    });
  });

  test("returns null if mels data is null", () => {
    const output = ugl.joinQueries({
      pn: { data: [], isLoading: false },
      mels: { data: null, isLoading: false },
      boalf: { data: [], isLoading: false },
      now: new Date("2021-01-01T00:10:00Z"),
    } as any);

    expect(output).toEqual({
      data: null,
      isLoading: false,
      now: new Date("2021-01-01T00:10:00Z"),
    });
  });

  test("returns null if boalf data is null", () => {
    const output = ugl.joinQueries({
      pn: { data: [], isLoading: false },
      mels: { data: [], isLoading: false },
      boalf: { data: null, isLoading: false },
      now: new Date("2021-01-01T00:10:00Z"),
    } as any);

    expect(output).toEqual({
      data: null,
      isLoading: false,
      now: new Date("2021-01-01T00:10:00Z"),
    });
  });

  test("returns isLoading if pn.isLoading is true", () => {
    const output = ugl.joinQueries({
      pn: { data: null, isLoading: true },
      mels: { data: null, isLoading: false },
      boalf: { data: null, isLoading: false },
      now: new Date("2021-01-01T00:10:00Z"),
    } as any);

    expect(output).toEqual({
      data: null,
      isLoading: true,
      now: new Date("2021-01-01T00:10:00Z"),
    });
  });

  test("returns isLoading if mels.isLoading is true", () => {
    const output = ugl.joinQueries({
      pn: { data: [], isLoading: false },
      mels: { data: null, isLoading: true },
      boalf: { data: null, isLoading: false },
      now: new Date("2021-01-01T00:10:00Z"),
    } as any);

    expect(output).toEqual({
      data: null,
      isLoading: true,
      now: new Date("2021-01-01T00:10:00Z"),
    });
  });

  test("returns isLoading if boalf.isLoading is true", () => {
    const output = ugl.joinQueries({
      pn: { data: [], isLoading: false },
      mels: { data: [], isLoading: false },
      boalf: { data: null, isLoading: true },
      now: new Date("2021-01-01T00:10:00Z"),
    } as any);

    expect(output).toEqual({
      data: null,
      isLoading: true,
      now: new Date("2021-01-01T00:10:00Z"),
    });
  });
});
