import {
  object,
  string,
  number,
  InferType,
  array,
  boolean,

} from "yup";
import { BasicLevel, basicLevelSchema } from "./commonTypes";

export const query = (p: { from: string; to: string }) =>
  `/datasets/boalf?from=${p.from}&to=${p.to}`;

export const rawBoalfSchema = object({
  dataset: string().required().equals(["BOALF"]),
  settlementDate: string().required(),
  settlementPeriodFrom: number().required(),
  settlementPeriodTo: number().required(),
  timeFrom: string().required(),
  timeTo: string().required(),
  levelFrom: number().required(),
  levelTo: number().required(),
  acceptanceNumber: number().required(),
  acceptanceTime: string().required(),
  deemedBoFlag: boolean().required(),
  soFlag: boolean().required(),
  amendmentFlag: string().required(),
  storFlag: boolean().required(),
  rrFlag: boolean().required(),
  nationalGridBmUnit: string().required(),
  bmUnit: string().nullable(),
}).required();

export type RawBoalf = Required<InferType<typeof rawBoalfSchema>>

const rawBoalfResponseSchema = object({
  data: array(rawBoalfSchema).required()
});

export type RawBoalfResponse = {
  data: RawBoalf[]
}

export const transformedBoalfSchema = object({
  acceptanceNumber: number(),
  acceptanceTime: string().nonNullable(),
  deemedBoFlag: boolean().nonNullable(),
  soFlag: boolean().nonNullable(),
  amendmentFlag: string().nonNullable(),
  storFlag: boolean().required(),
  rrFlag: boolean().nonNullable(),
  levels: array(basicLevelSchema),
})

export type TransformedBoalfSchema = {
  acceptanceNumber: number;
  acceptanceTime: string;
  deemedBoFlag: boolean;
  soFlag: boolean;
  amendmentFlag: string;
  storFlag: boolean;
  rrFlag: boolean;
  levels: BasicLevel[];
}

export const bmUnitBoalfsSchema = object({
  bmUnit: string().nonNullable(),
  boalfs: array(transformedBoalfSchema).nonNullable(),
})

export type BmUnitBoalfsSchema = {
  bmUnit: string;
  boalfs: TransformedBoalfSchema[];
}
export const bmUnitsBoalfsSchema = array(bmUnitBoalfsSchema)

export type BmUnitsBoalfsSchema = BmUnitBoalfsSchema[]

export const transformResponse = (r: RawBoalfResponse): BmUnitsBoalfsSchema => {
  try {
    rawBoalfResponseSchema.validateSync(r);
  } catch (e) {
    console.error(e);
    throw e;
  }

  let bmUnits = new Set<string>();
  for (const boalf of r.data) {
    if (boalf.bmUnit) {
      bmUnits.add(boalf.bmUnit);
    }
  }

  const output: BmUnitsBoalfsSchema = [];

  for (const bmUnit of bmUnits) {
    let acceptancesNumbers = new Set<number>();
    for (const boalf of r.data) {
      if (boalf.bmUnit === bmUnit) {
        acceptancesNumbers.add(boalf.acceptanceNumber);
      }
    }

    output.push({
      bmUnit,
      boalfs: Array.from(acceptancesNumbers).sort(
        (a, b) => a - b
      ).map((acceptanceNumber) => {
        const first = r.data.find(
          (boalf) =>
            boalf.bmUnit === bmUnit &&
            boalf.acceptanceNumber === acceptanceNumber
        )!;
        let levelsDict: Record<string, number> = {};
        for (const boalf of r.data) {
          if (
            boalf.bmUnit === bmUnit &&
            boalf.acceptanceNumber === acceptanceNumber
          ) {
            levelsDict[boalf.timeFrom] = boalf.levelFrom;
            levelsDict[boalf.timeTo] = boalf.levelTo;
          }
        }
        return {
          acceptanceNumber,
          acceptanceTime: first.acceptanceTime,
          deemedBoFlag: first.deemedBoFlag,
          soFlag: first.soFlag,
          amendmentFlag: first.amendmentFlag,
          storFlag: first.storFlag,
          rrFlag: first.rrFlag,
          levels: Object.keys(levelsDict)
            .map((time) => ({
              time,
              level: levelsDict[time],
            }))
            .sort((a, b) => a.time.localeCompare(b.time)),
        };
      }),
    });
  }
  return output;
};
