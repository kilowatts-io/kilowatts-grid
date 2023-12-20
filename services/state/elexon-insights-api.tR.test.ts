import * as tr from "./elexon-insights-api.tR";

const rawResponses = {
  pnAll: {
    empty: {
      data: [],
    },
    withErrors: {
        data: [
            {
                dataset: 'PN',
                settlementDate: '2021-08-01',
                settlementPeriod: 1,
                timeFrom: '2021-08-01T00:00:00Z',
                timeTo: '2021-08-01T00:30:00Z',
                // levelFrom: 0,
                levelTo: 0,
                nationalGridBmUnit: 'NGET-100',
                bmUnit: 'T_DRAXX-1'
            }
        ]
    } as any, // bypass typechecking
    noErrors: {
        data: [
            {
                dataset: 'PN',
                settlementDate: '2021-08-01',
                settlementPeriod: 1,
                timeFrom: '2021-08-01T00:00:00Z',
                timeTo: '2021-08-01T00:30:00Z',
                levelFrom: 0,
                levelTo: 100,
                nationalGridBmUnit: 'NGET-100',
                bmUnit: 'T_DRAXX-1'
            },
            {
                dataset: 'PN',
                settlementDate: '2021-08-01',
                settlementPeriod: 2,
                timeFrom: '2021-08-01T00:30:00Z',
                timeTo: '2021-08-01T01:00:00Z',
                levelFrom: 100,
                levelTo: 150,
                nationalGridBmUnit: 'NGET-100',
                bmUnit: 'T_DRAXX-1'
            }
        ]
    } 
  },
};

describe("services/state/elexon-insights-api.tR/queries.pnAll", () => {
  test("throws error if no data e.g. if not yet published", () => {
    expect(() => tr.queries.pnAll(rawResponses.pnAll.empty)).toThrowError();
  });
  test("yup throws an error if data is missing levelFrom", () => {
    try {
        tr.queries.pnAll(rawResponses.pnAll.withErrors)
        throw new Error('should not reach here')
    } catch(err: any) {
        expect(err.message).toMatch('data[0].levelFrom is a required field')
    }
  });
  test("successfully parses data and combines overlapping PNs", () => {
    const parsed = tr.queries.pnAll(rawResponses.pnAll.noErrors)
    expect(parsed).toHaveProperty('T_DRAXX-1')
    expect(parsed['T_DRAXX-1']).toHaveLength(3)
    expect(parsed).toMatchObject({
        'T_DRAXX-1': [
            {time: '2021-08-01T00:00:00Z', level: 0},
            {time: '2021-08-01T00:30:00Z', level: 100},
            {time: '2021-08-01T01:00:00Z', level: 150},
        ]
    })
  });
});
