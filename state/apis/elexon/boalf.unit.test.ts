import * as boalf from "./boalf";

describe("state/api/elexon/boalf.unit.test.ts", () => {
  test("can correctly create query string", () => {
    const from = new Date("2021-01-01").toISOString();
    const to = new Date("2021-01-02").toISOString();
    expect(boalf.query({ from, to })).toEqual(
      "/datasets/boalf?from=2021-01-01T00:00:00.000Z&to=2021-01-02T00:00:00.000Z"
    );
  });

  test("can correctly transform response", () => {
    const raw = {
      data: [
        {
          dataset: "BOALF",
          settlementDate: "2021-01-01",
          settlementPeriodFrom: 1,
          settlementPeriodTo: 2,
          timeFrom: "2021-01-01T00:00:00.000Z",
          timeTo: "2021-01-01T00:30:00.000Z",
          levelFrom: 1,
          levelTo: 2,
          acceptanceNumber: 1,
          acceptanceTime: "2021-01-01T00:00:00.000Z",
          deemedBoFlag: false,
          soFlag: false,
          amendmentFlag: "A",
          storFlag: false,
          rrFlag: false,
          nationalGridBmUnit: "NGET-100",
          bmUnit: "NGET-100",
        },
        {
          dataset: "BOALF",
          settlementDate: "2021-01-01",
          settlementPeriodFrom: 1,
          settlementPeriodTo: 2,
          timeFrom: "2021-01-01T00:30:00.000Z",
          timeTo: "2021-01-01T01:00:00.000Z",
          levelFrom: 2,
          levelTo: 3,
          acceptanceNumber: 1,
          acceptanceTime: "2021-01-01T00:00:00.000Z",
          deemedBoFlag: false,
          soFlag: false,
          amendmentFlag: "A",
          storFlag: false,
          rrFlag: false,
          nationalGridBmUnit: "NGET-100",
          bmUnit: "NGET-100",
        },
      ],
    };
    const transformed = boalf.transformResponse(raw);
    expect(transformed).toEqual([
      {
        bmUnit: "NGET-100",
        boalfs: [
          {
            acceptanceNumber: 1,
            acceptanceTime: "2021-01-01T00:00:00.000Z",
            deemedBoFlag: false,
            soFlag: false,
            amendmentFlag: "A",
            storFlag: false,
            rrFlag: false,
            levels: [
              {
                time: "2021-01-01T00:00:00.000Z",
                level: 1,
              },
              {
                time: "2021-01-01T00:30:00.000Z",
                level: 2,
              },
              {
                time: "2021-01-01T01:00:00.000Z",
                level: 3,
              },
            ],
          }
        ],
      },
    ]);
  });
});
