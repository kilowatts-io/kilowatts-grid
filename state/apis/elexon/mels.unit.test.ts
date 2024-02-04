import * as mels from "./mels";

describe("state/apis/elexon/mels", () => {
  test("query parameters are correctly formed", () => {
    const from = new Date("2021-01-01").toISOString();
    const to = new Date("2021-01-02").toISOString();
    expect(mels.query({ from, to })).toEqual(
      "/datasets/mels?from=2021-01-01T00:00:00.000Z&to=2021-01-02T00:00:00.000Z"
    );
  });

  test("can transform response", () => {
    const raw = {
      data: [
        {
          dataset: "MELS",
          settlementDate: "2021-01-01",
          settlementPeriod: 1,
          timeFrom: "2021-01-01T00:00:00Z",
          timeTo: "2021-01-01T00:30:00Z",
          levelFrom: 0,
          levelTo: 40,
          notificationTime: "2021-01-01T00:00:00Z",
          notificationSequence: 1,
          nationalGridBmUnit: "ABTHP-1",
          bmUnit: "T_ABTHP-1",
        },
      ],
    };

    const transformed = mels.transformResponse(raw);
    expect(transformed).toEqual([
      {
        bmUnit: "T_ABTHP-1",
        levels: [
          {
            time: "2021-01-01T00:00:00Z",
            level: 0,
          },
          {
            time: "2021-01-01T00:30:00Z",
            level: 40,
          },
        ],
      },
    ]);
  });
});
