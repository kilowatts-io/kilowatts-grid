import * as ftl from "./fuelTypeLive";

jest.mock("./embeddedForecasts", () => ({
  useEmbeddedForecasts: jest.fn(),
}));

jest.mock("./unitGroupsLive", () => ({
  useUnitsLiveQuery: jest.fn(),
}));

jest.mock("../../assets/bmUnits/unitGroups", () => ({
  bmUnitFuelType: {
    "T_DRAXX-1": "coal",
    "T_CARR-1": "gas",
  },
}));

describe("state/hooks/fuelTypeLive", () => {
  test("can update output", () => {
    const output = {
      capacity: 0,
      preBm: 0,
      postBm: { actual: 0, delta: 0 },
      balancing: { bids: 0, offers: 0 },
    };
    const unitOutput = {
      capacity: 10,
      preBm: 5,
      postBm: { actual: 100, delta: 0 },
      balancing: { bids: 0, offers: 0 },
    };
    ftl.updateOutput(output, unitOutput);
    expect(output).toEqual({
      capacity: 10,
      preBm: 5,
      postBm: { actual: 100, delta: 0 },
      balancing: { bids: 0, offers: 0 },
    });
  });
});

describe("state/hooks/isSpecialType", () => {
  test("can detect special type", () => {
    expect(ftl.isSpecialType("I_1", ["I_"])).toBe(true);
  });

  test("can detect when not type", () => {
    expect(ftl.isSpecialType("T_", ["I_"])).toBe(false);
  });
});

describe("state/hooks/extractGenerators", () => {
  test("will extract a simple T_ generator", () => {
    const now = "2021-01-01T00:00:00.000Z";
    const embeddedWind = ftl.nullOutput();
    const output = ftl.extractGenerators(
      {
        pn: [
          {
            bmUnit: "T_DRAXX-1",
            levels: [
              {
                time: now,
                level: 100,
              },
            ],
          },
        ],
        mels: [
          {
            bmUnit: "T_DRAXX-1",
            levels: [
              {
                time: now,
                level: 150,
              },
            ],
          },
        ],
        boalf: [],
      },
      new Date(now),
      embeddedWind
    );
    expect(output.categories.coal.postBm.actual).toBe(100);
    expect(output.categories.coal.capacity).toBe(150);
  });

  test("can extract two T_ generators", () => {
    const now = "2021-01-01T00:00:00.000Z";
    const output = ftl.extractGenerators(
      {
        pn: [
          {
            bmUnit: "T_DRAXX-1",
            levels: [
              {
                time: now,
                level: 100,
              },
            ],
          },
          {
            bmUnit: "T_CARR-1",
            levels: [
              {
                time: now,
                level: 50,
              },
            ],
          },
        ],
        mels: [
          {
            bmUnit: "T_DRAXX-1",
            levels: [
              {
                time: now,
                level: 150,
              },
            ],
          },
          {
            bmUnit: "T_CARR-1",
            levels: [
              {
                time: now,
                level: 75,
              },
            ],
          },
        ],
        boalf: [],
      },
      new Date(now),
      ftl.nullOutput()
    );

    expect(output.categories.coal.postBm.actual).toBe(100);
    expect(output.categories.coal.capacity).toBe(150);
    expect(output.categories.gas.postBm.actual).toBe(50);
    expect(output.categories.gas.capacity).toBe(75);
  });
});
//

describe("state/hooks/fuelTypeLive/calculateTotalBalancing", () => {
  test("will return zero when there are no boalfs", () => {
    const units = {
      pn: [
        {
          bmUnit: "T_DRAXX-1",
          levels: [
            {
              time: "2021-01-01T00:00:00.000Z",
              level: 100,
            },
          ],
        },
        {
          bmUnit: "T_CARR-1",
          levels: [
            {
              time: "2021-01-01T00:00:00.000Z",
              level: 50,
            },
          ],
        },
      ],
      mels: [],
      boalf: [],
    };
    const now = new Date("2021-01-01T00:00:00.000Z");
    const output = ftl.calculateTotalBalancing(units, now);
    expect(output.bids).toBe(0);
    expect(output.offers).toBe(0);
  });

  test('can calculate total balancing for "bids"', () => {
    const units = {
      pn: [
        {
          bmUnit: "T_DRAXX-1",
          levels: [
            {
              time: "2021-01-01T00:00:00.000Z",
              level: 50,
            },
            {
              time: "2021-01-01T00:30:00.000Z",
              level: 50,
            },
          ],
        },
      ],
      mels: [],
      boalf: [
        {
          bmUnit: "T_DRAXX-1",
          boalfs: [
            {
              levels: [
                {
                  time: "2021-01-01T00:00:00.000Z",
                  level: 200,
                },
                {
                  time: "2021-01-01T00:30:00.000Z",
                  level: 200,
                },
              ]
            }
          ],
        },
      ]
    } as any;

    const now = new Date("2021-01-01T00:15:00.000Z");
    const output = ftl.calculateTotalBalancing(units, now);
    expect(output.bids).toBe(0);
    expect(output.offers).toBe(150);
  })

  test('can calculate total balancing for "offers"', () => {
    const units = {
      pn: [
        {
          bmUnit: "T_DRAXX-1",
          levels: [
            {
              time: "2021-01-01T00:00:00.000Z",
              level: 250,
            },
            {
              time: "2021-01-01T00:30:00.000Z",
              level: 250,
            },
          ],
        },
      ],
      mels: [],
      boalf: [
        {
          bmUnit: "T_DRAXX-1",
          boalfs: [
            {
              levels: [
                {
                  time: "2021-01-01T00:00:00.000Z",
                  level: 225,
                },
                {
                  time: "2021-01-01T00:30:00.000Z",
                  level: 225,
                },
              ]
            }
          ],
        },
      ]
    } as any;

    const now = new Date("2021-01-01T00:15:00.000Z");
    const output = ftl.calculateTotalBalancing(units, now);
    expect(output.bids).toBe(-25);
    expect(output.offers).toBe(0);
  })

  test('if there is no PN - will effectively assume 0', () => {
    const units = {
      pn: [],
      mels: [],
      boalf: [
        {
          bmUnit: "T_DRAXX-1",
          boalfs: [
            {
              levels: [
                {
                  time: "2021-01-01T00:00:00.000Z",
                  level: 225,
                },
                {
                  time: "2021-01-01T00:30:00.000Z",
                  level: 225,
                },
              ]
            }
          ],
        },
      ]
    } as any;

    const now = new Date("2021-01-01T00:15:00.000Z");
    const output = ftl.calculateTotalBalancing(units, now);
    expect(output.bids).toBe(0);
    expect(output.offers).toBe(225);
  })
});
