import * as n from "./national";

describe("state/apis/sheffield/national/sliceIsoDate", () => {
  test("reduces a longer iso date with seconds/miliseconds and Z and returns truncted to just HH:MM as api required", () => {
    const iso = "2021-01-01T12:00:00.000Z";
    expect(n.sliceIsoDate(iso)).toEqual("2021-01-01T12:00");
  });
});

describe("state/apis/sheffield/national/query", () => {
  test("can generate correct parameters for a query in winter time", () => {
    const start = new Date("2021-01-01T12:00:00Z").toISOString();
    const end = new Date("2021-01-01T13:30:00Z").toISOString();
    expect(n.query({ start, end })).toEqual(
      "/gsp/0?start=2021-01-01T12:00&end=2021-01-01T13:30&extra_fields=installedcapacity_mwp"
    );
  });

  test("generates correct parameters in summer time", () => {
    const start = new Date("2021-07-01T12:00:00Z").toISOString();
    const end = new Date("2021-07-01T12:30:00Z").toISOString();
    expect(n.query({ start, end })).toEqual(
      "/gsp/0?start=2021-07-01T12:00&end=2021-07-01T12:30&extra_fields=installedcapacity_mwp"
    );
  });
});

describe("state/apis/sheffield/national/transformResponse", () => {
  const raw = {
    data: [
      [0, "2023-01-22T15:00:00Z", 1369.07, 15056.025],
      [0, "2023-01-22T14:30:00Z", 1764.2, 15056.025]
    ],
    meta: ["gsp_id", "datetime_gmt", "generation_mw", "installedcapacity_mwp"]
  };

  expect(n.transformResponse(raw)).toEqual([
    {
      start: "2023-01-22T14:30:00Z",
      capacity: 15056.025,
      output: 1764.2
    },
    {
      start: "2023-01-22T15:00:00Z",
      capacity: 15056.025,
      output: 1369.07
    }
  ]);
});
