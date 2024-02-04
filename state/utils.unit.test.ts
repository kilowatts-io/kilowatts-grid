import { TransformedBoalfSchema } from "./apis/elexon/boalf";
import * as u from "./utils";

describe("state/utils/interpolateLevel", () => {
  test("can extract an exact value", () => {
    const now = new Date("2021-01-01T00:10:00Z");
    const data = [
      { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 1 },
      { time: new Date("2021-01-01T00:10:00Z").toISOString(), level: 2 },
      { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 3 },
    ];
    const interpolated = u.interpolateLevel(now, data);
    expect(interpolated).toEqual({ level: 2, delta: 0 });
  });

  test("it throws an error if now is outside the range of data", () => {
    const now = new Date("2021-01-01T00:21:00Z");
    const data = [
      { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 1 },
      { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 3 },
    ];
    expect(() => u.interpolateLevel(now, data)).toThrow();
  });

  test("it can interpolate between two values and calculates delta as units (i.e. MW)/minute", () => {
    const now = new Date("2021-01-01T00:15:00Z");
    const data = [
      { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 0 },
      { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 20 },
    ];
    const interpolated = u.interpolateLevel(now, data);
    expect(interpolated).toEqual({ level: 15, delta: 1 });
  });
});

describe("state/utils/evaluateBoalfLevel", () => {
  test("it returns the existing level if the boalf is not active", () => {
    const now = new Date("2021-01-01T00:04:00Z");
    const existing = { level: 10, delta: 4.5 };
    const boalf: TransformedBoalfSchema = {
      acceptanceNumber: 1,
      acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
      deemedBoFlag: false,
      soFlag: false,
      amendmentFlag: "A",
      storFlag: false,
      rrFlag: false,
      levels: [
        { time: new Date("2021-01-01T00:05:00Z").toISOString(), level: 1 },
        { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 3 },
      ],
    };
    const interpolated = u.evaluateBoalfLevel(now, existing, boalf);
    expect(interpolated).toEqual(existing);
  });

  test("it replaces the existing level with an exact boalf level if the boalf is active", () => {
    const now = new Date("2021-01-01T00:04:00Z");
    const existing = { level: 10, delta: 4.5 };
    const boalf: TransformedBoalfSchema = {
      acceptanceNumber: 1,
      acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
      deemedBoFlag: false,
      soFlag: false,
      amendmentFlag: "A",
      storFlag: false,
      rrFlag: false,
      levels: [
        { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 1 },
        { time: new Date("2021-01-01T00:04:00Z").toISOString(), level: 2 },
        { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 3 },
      ],
    };
    const interpolated = u.evaluateBoalfLevel(now, existing, boalf);
    expect(interpolated).toEqual({ level: 2, delta: 0 });
  });

  test("it replaces the existing level with an interpolated boalf level if the boalf is active", () => {
    const now = new Date("2021-01-01T00:10:00Z");
    const existing = { level: 10, delta: 0 };
    const boalf: TransformedBoalfSchema = {
      acceptanceNumber: 1,
      acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
      deemedBoFlag: false,
      soFlag: false,
      amendmentFlag: "A",
      storFlag: false,
      rrFlag: false,
      levels: [
        { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 10 },
        { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 30 },
      ],
    };
    const interpolated = u.evaluateBoalfLevel(now, existing, boalf);
    expect(interpolated).toEqual({ level: 20, delta: 1 });
  });
});

describe("state/utils/evaluateBoalfsLevel", () => {
  test("calls evaluateBoalfLevel to change the output level from 10 to 7.5", () => {
    const now = new Date("2021-01-01T00:10:00Z");
    const preBm = { level: 10, delta: 0 };

    const postBm = u.evaluateBoalfsLevel(now, preBm, [
      {
        acceptanceNumber: 1,
        acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
        deemedBoFlag: false,
        soFlag: false,
        amendmentFlag: "A",
        storFlag: false,
        rrFlag: false,
        levels: [
          { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 10 },
          { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 5 },
        ],
      },
    ]);

    expect(postBm).toEqual({ level: 7.5, delta: -0.25 });
  });

  test("calls evaluateBoalfLevel for each boalf in turn - so in this case the first is ignored", () => {
    const now = new Date("2021-01-01T00:10:00Z");
    const preBm = { level: 10, delta: 0 };

    const postBm = u.evaluateBoalfsLevel(now, preBm, [
      {
        acceptanceNumber: 1,
        acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
        deemedBoFlag: false,
        soFlag: false,
        amendmentFlag: "A",
        storFlag: false,
        rrFlag: false,
        levels: [
          { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 10 },
          { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 5 },
        ],
      },
      {
        acceptanceNumber: 2,
        acceptanceTime: new Date("2021-01-01T00:00:00Z").toISOString(),
        deemedBoFlag: false,
        soFlag: false,
        amendmentFlag: "A",
        storFlag: false,
        rrFlag: false,
        levels: [
          { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 10 },
          { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 30 },
        ],
      },
    ]);

    expect(postBm).toEqual({ level: 20, delta: 1 });
  });
});

describe("state/utils/calculateUnitOutput", () => {
  test("expect output to remain unchanged (at 15) both preBm and postBm", () => {
    const now = new Date("2021-01-01T00:10:00Z");
    const data = {
      pn: [
        {
          time: new Date("2021-01-01T00:00:00Z").toISOString(),
          level: 10,
        },
        {
          time: new Date("2021-01-01T00:20:00Z").toISOString(),
          level: 20,
        },
      ],

      mels: [
        {
          time: new Date("2021-01-01T00:00:00Z").toISOString(),
          level: 100,
        },
        {
          time: new Date("2021-01-01T00:29:00Z").toISOString(),
          level: 100,
        },
      ],
      boalf: [],
    };

    expect(u.calculateUnitOutput({ data, now })).toMatchObject({
      capacity: 100,
      preBm: 15,
      postBm: { actual: 15, delta: 0.5 },
    });
  });
});

describe("state/utils/calculateUnitOutput", () => {
  test("expect output to remain unchanged (at 15) both preBm and postBm", () => {
    const now = new Date("2021-01-01T00:10:00Z");
    const data = {
      pn: [
        {
          time: new Date("2021-01-01T00:00:00Z").toISOString(),
          level: 10,
        },
        {
          time: new Date("2021-01-01T00:20:00Z").toISOString(),
          level: 20,
        },
      ],

      mels: [
        {
          time: new Date("2021-01-01T00:00:00Z").toISOString(),
          level: 100,
        },
        {
          time: new Date("2021-01-01T00:29:00Z").toISOString(),
          level: 100,
        },
      ],
      boalf: [],
    };

    expect(u.calculateUnitOutput({ data, now })).toMatchObject({
      capacity: 100,
      preBm: 15,
      postBm: { actual: 15, delta: 0.5 },
    });
  });

  test("expect output to increase to a flat (delta = 0) 20 as a result of acceptance ", () => {
    const now = new Date("2021-01-01T00:10:00Z");

    const data = {
      pn: [
        {
          time: new Date("2021-01-01T00:00:00Z").toISOString(),
          level: 10,
        },
        {
          time: new Date("2021-01-01T00:20:00Z").toISOString(),
          level: 20,
        },
      ],

      mels: [
        {
          time: new Date("2021-01-01T00:00:00Z").toISOString(),
          level: 100,
        },
        {
          time: new Date("2021-01-01T00:29:00Z").toISOString(),
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
            {
              time: new Date("2021-01-01T00:09:00Z").toISOString(),
              level: 20,
            },
            {
              time: new Date("2021-01-01T00:20:00Z").toISOString(),
              level: 20,
            },
          ],
        },
      ],
    };

    expect(u.calculateUnitOutput({ data, now })).toMatchObject({
      capacity: 100,
      preBm: 15,
      postBm: { actual: 20, delta: 0 },
    });
  });
});

describe("state/utils", () => {
  test("it returns 0 if there is no mels value", () => {
    const now = new Date("2021-01-01T00:10:00Z");
    const mels = [
      { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 3 },
    ];
    expect(u.getMostRecentMels(now, mels)).toBe(0);
  });

  test("it returns the most recent mels value before now", () => {
    const now = new Date("2021-01-01T00:13:00Z");
    const mels = [
      { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 1 },
      { time: new Date("2021-01-01T00:10:00Z").toISOString(), level: 2 },
      { time: new Date("2021-01-01T00:20:00Z").toISOString(), level: 3 },
    ];
    const mostRecent = u.getMostRecentMels(now, mels);
    expect(mostRecent).toEqual(2);
  });

  test("it can deal with an exact MELS value", () => {
    const now = new Date("2021-01-01T00:00:00Z");
    const mels = [
      { time: new Date("2021-01-01T00:00:00Z").toISOString(), level: 1 },
    ];
    const mostRecent = u.getMostRecentMels(now, mels);
    expect(mostRecent).toEqual(1);
  });
});


describe("state/utils/getStartofCurrentHalfHour", () => {
  test("works for minutes > 30", () => {
    const now = new Date("2020-01-01T12:34:56.789Z");
    expect(u.getStartOfCurrentHalfHour(now).toISOString()).toEqual(
      "2020-01-01T12:30:00.000Z"
    );
  });

  test("works for minutes< 30", () => {
    const now = new Date("2020-01-01T12:24:56.789Z");
    expect(u.getStartOfCurrentHalfHour(now).toISOString()).toEqual(
      "2020-01-01T12:00:00.000Z"
    );
  });
});