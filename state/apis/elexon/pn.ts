import { object, string, number, InferType, array } from "yup";
import { basicLevelSchema } from "./commonTypes";

export const query = (p: {
  settlementDate: string;
  settlementPeriod: number;
}) => `/datasets/pn?settlementDate=${p.settlementDate}&settlementPeriod=${p.settlementPeriod}`

export const rawPnSchema = object({
  dataset: string().required().equals(["PN"]),
  settlementDate: string().required(),
  settlementPeriod: number().required(),
  timeFrom: string().required(),
  timeTo: string().required(),
  levelFrom: number().required(),
  levelTo: number().required(),
  nationalGridBmUnit: string().required(),
  bmUnit: string().nullable(),
});

export type RawPn = Required<InferType<typeof rawPnSchema>>

export const rawPnResponse = object({
  data: array(rawPnSchema).required(),
});

export type RawPnResponse = {
  data: RawPn[];
}

const transformedPnLevelsSchema = array(basicLevelSchema)

export type TransformedPnLevelsSchema = InferType<
  typeof transformedPnLevelsSchema
>;

export const bmUnitPnsSchema = array(
  object().shape({
    bmUnit: string().required(),
    levels: array(basicLevelSchema).required(),
  })
).required();

export type BmUnitPnSchema = {
  bmUnit: string;
  levels: {
    time: string;
    level: number;
  }[];
}

export type BmUnitPnsSchema = BmUnitPnSchema[]

const identifyBmUnits = (response: RawPnResponse) => {
  let bmUnits = new Set<string>();
  for (const pn of response.data) {
    if (pn.bmUnit) {
      bmUnits.add(pn.bmUnit);
    }
  }
  return bmUnits
}

const createOutput = (bmUnits: string[], response: RawPnResponse) => {
  let output: BmUnitPnsSchema = [];
  for (const bmUnit of bmUnits) {
    let levelsDict: Record<string, number> = {};
    for (const pn of response.data) {
      if (pn.bmUnit === bmUnit) {
        levelsDict[pn.timeFrom] = pn.levelFrom;
        levelsDict[pn.timeTo] = pn.levelTo;
      }
    }
    output.push({
      bmUnit,
      levels: Object.entries(levelsDict)
        .map(([time, level]) => ({
          time,
          level,
        }))
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        ),
    });
  }
  return output
}

export const transformResponse = (response: RawPnResponse): BmUnitPnsSchema => {  
  let bmUnits = identifyBmUnits(response);
  let output = createOutput(Array.from(bmUnits), response);
  try {
    bmUnitPnsSchema.validateSync(output);
  } catch (e) {
    console.error(e);
    throw e;
  }

  return output;
};
