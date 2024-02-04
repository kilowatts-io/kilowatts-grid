import { object, string, number, InferType, array, lazy } from "yup";
import { BasicLevel, basicLevelSchema } from "./commonTypes";

export const query = (p: { from: string; to: string }) =>
  `/datasets/mels?from=${p.from}&to=${p.to}`;

export const rawMelsSchema = object({
  dataset: string().required().equals(["MELS"]),
  settlementDate: string().required(),
  settlementPeriod: number().required(),
  timeFrom: string().required(),
  timeTo: string().required(),
  levelFrom: number().required(),
  levelTo: number().required(),
  notificationTime: string().required(),
  notificationSequence: number().required(),
  nationalGridBmUnit: string().required(),
  bmUnit: string().nullable(),
});

export type RawMels = Required<InferType<typeof rawMelsSchema>>

export const rawMelsResponseSchema = object({
  data: array(rawMelsSchema).required(),
});

type RawMelsResponse = {
  data: RawMels[];
}

const bmUnitMelSchema = object({
  bmUnit: string().nonNullable(),
  levels: array(basicLevelSchema).nonNullable(),
})

export type BmUnitMelSchema = {
  bmUnit: string;
  levels: BasicLevel[];
}

export const bmUnitMelsSchema = array(bmUnitMelSchema).nonNullable()

export type BmUnitMelsSchema = BmUnitMelSchema[]

export const transformResponse = (
  response: RawMelsResponse
): BmUnitMelsSchema => {
  try {
    rawMelsResponseSchema.validateSync(response);
  } catch (e) {
    console.error(e);
    throw e;
  }

  let bmUnits = new Set<string>();
  for (const mels of response.data) {
    if (mels.bmUnit) {
      bmUnits.add(mels.bmUnit);
    }
  }
  const output: BmUnitMelsSchema = [];
  for (const bmUnit of bmUnits) {
    let levelsDict: Record<string, number> = {};
    for (const mels of response.data) {
      if (mels.bmUnit === bmUnit) {
        levelsDict[mels.timeFrom] = mels.levelFrom;
        levelsDict[mels.timeTo] = mels.levelTo;
      }
    }
    output.push({
      bmUnit,
      levels: Object.keys(levelsDict)
        .map((time) => ({
          time,
          level: levelsDict[time],
        }))
        .sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        ),
    });
  }

  try {
    bmUnitMelsSchema.validateSync(output);
  } catch (e) {
    console.error(e);
    throw e;
  }

  return output;
};
