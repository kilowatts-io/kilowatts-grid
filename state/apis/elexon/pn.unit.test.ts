import { query, RawPnResponse, rawPnSchema, transformResponse } from "./pn";

describe("state/apis/elexon/pn.test.ts", () => {
  test("can create valid query", () => {
    const params = {
      settlementDate: "2022-07-01",
      settlementPeriod: 3
    };
    const result = query(params);
    expect(result).toEqual(
      "/datasets/pn?settlementDate=2022-07-01&settlementPeriod=3"
    );
  });

  test("can validate PN", () => {
    const pn: any = {
      dataset: "PN",
      settlementDate: "2022-07-01",
      settlementPeriod: 3,
      timeFrom: "2022-07-01T13:34:00Z",
      timeTo: "2022-07-01T13:34:00Z",
      levelFrom: 5,
      levelTo: 46,
      nationalGridBmUnit: "ABRBO-1",
      bmUnit: "T_ABRBO-1"
    };

    rawPnSchema.validateSync(pn);
  });

  test("can transform response", () => {
    const response: RawPnResponse = {
      data: [
        {
          dataset: "PN",
          settlementDate: "2022-07-01",
          settlementPeriod: 3,
          timeFrom: "2022-07-01T13:34:00Z",
          timeTo: "2022-07-01T13:35:00Z",
          levelFrom: 5,
          levelTo: 46,
          nationalGridBmUnit: "ABRBO-1",
          bmUnit: "T_ABRBO-1"
        }
      ]
    };

    const transformed = transformResponse(response);

    expect(transformed).toEqual([
      {
        bmUnit: "T_ABRBO-1",
        levels: [
          {
            time: "2022-07-01T13:34:00Z",
            level: 5
          },
          {
            time: "2022-07-01T13:35:00Z",
            level: 46
          }
        ]
      }
    ]);
  });
});
