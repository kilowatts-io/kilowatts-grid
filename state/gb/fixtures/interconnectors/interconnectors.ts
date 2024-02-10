import { Coords } from "../../../../components/gb-live/svg-map/types";

export type ForeignMarketName =
  | "france"
  | "netherlands"
  | "ireland"
  | "belgium"
  | "norway"
  | "denmark";

export type Interconnector = {
  code4: string; // the XXXX in I_III-XXXXI
  code2: string[]; // the XX in I_XXI-III
  name: string;
  coords: Coords;
  capacity: number;
  market: ForeignMarketName;
};

export type ForeignMarket = {
  name: ForeignMarketName;
  coords: Coords;
  interconnectors: Interconnector[];
};

const brtn: Interconnector = {
  code4: "BRTN",
  code2: ["IB"],
  name: "Britned",
  coords: {
    lat: 51.44298,
    lng: 0.70782
  },
  market: "netherlands",
  capacity: 1000
};

const ifa2: Interconnector = {
  name: "IFA2",
  code4: "IFA2",
  code2: ["I2"],
  coords: {
    lat: 50.81031,
    lng: -1.193889
  },
  market: "france",
  capacity: 1000
};

const nemo: Interconnector = {
  name: "Nemo",
  code4: "NEMO",
  code2: ["IN"],
  coords: {
    lat: 51.3113,
    lng: 1.3456
  },
  market: "belgium",
  capacity: 1000
};

const ewic: Interconnector = {
  name: "Republic of Ireland",
  code4: "EWIC",
  code2: ["IE", "II"],
  coords: {
    lat: 53.227222,
    lng: -3.072778
  },

  market: "ireland",
  capacity: 500
};

const moyl: Interconnector = {
  name: "Moyle",
  code4: "MOYL",
  code2: ["IM"],
  coords: {
    lat: 54.65,
    lng: -4.9
  },

  market: "ireland",
  capacity: 500
};

const vikl: Interconnector = {
  name: "Viking",
  code4: "VKL",
  code2: ["IV"],
  coords: {
    lat: 53.35,
    lng: 0.2
  },
  market: "denmark",
  capacity: 1400
};

const nsl: Interconnector = {
  name: "NSL",
  code4: "NSL1",
  code2: ["IS"],
  coords: {
    lat: 55.145,
    lng: -1.521
  },
  market: "norway",
  capacity: 1400
};

// the two below have very similar paths so need an elbow

const ifa1: Interconnector = {
  name: "IFA",
  code4: "FRAN",
  code2: ["IF"],
  coords: {
    lat: 51.104,
    lng: 1.35
  },
  market: "france",
  capacity: 2000
};

const elec: Interconnector = {
  name: "Eleclink",
  code4: "ELEC",
  code2: ["IL"],
  coords: {
    lat: 51,
    lng: 1
  },
  market: "france",
  capacity: 1000
};

export const foreignMarkets: ForeignMarket[] = [
  {
    name: "france",
    coords: {
      lat: 50,
      lng: 2.5
    },
    interconnectors: [elec, ifa1, ifa2]
  },
  {
    name: "belgium",
    coords: {
      lat: 50.85,
      lng: 3
    },
    interconnectors: [nemo]
  },
  {
    name: "netherlands",
    coords: {
      lat: 51.5,
      lng: 3
    },
    interconnectors: [brtn]
  },
  {
    name: "denmark",
    coords: {
      lat: 54.5,
      lng: 1.5
    },
    interconnectors: [vikl]
  },
  {
    name: "norway",
    coords: {
      lat: 55.6,
      lng: 0.5
    },
    interconnectors: [nsl]
  },
  {
    name: "ireland",
    coords: {
      lat: 53.7,
      lng: -5
    },
    interconnectors: [ewic, moyl]
  }
];

export const interconnectors: Interconnector[] = [
  brtn,
  ifa1,
  ifa2,
  nemo,
  ewic,
  moyl,
  vikl,
  nsl,
  elec
];

export const extractCode4 = (fullCode: string): string => {
  return fullCode.split("-")[1].slice(0, 4);
};

export const matchByCode4 = (fullCode: string): Interconnector | undefined => {
  const code4 = extractCode4(fullCode);
  return interconnectors.find((x) => x.code4 === code4);
};

export const extractCode2 = (fullCode: string): string => {
  return fullCode.split("_")[1].slice(0, 2);
};

export const matchByCode2 = (fullCode: string): Interconnector | undefined => {
  const code2 = extractCode2(fullCode);
  for (const interconnector of interconnectors) {
    if (interconnector.code2.includes(code2)) {
      return interconnector;
    }
  }
  return undefined;
};

export const isInterconnectorUnit = (fullCode: string): boolean => {
  return fullCode.startsWith("I_");
};

export const interconnectorUnitCodes = interconnectors.map((x) => x.code4);

export const totalInterconnectorCapacity = interconnectors.reduce(
  (acc, cur) => acc + cur.capacity,
  0
);

export const matchInterconnector = (
  fullCode?: string
): Interconnector | null => {
  if (!isInterconnectorUnit(fullCode)) return null;
  const match4 = matchByCode4(fullCode);
  if (match4) return match4;
  const match2 = matchByCode2(fullCode);
  if (match2) return match2;
  return null;
};
