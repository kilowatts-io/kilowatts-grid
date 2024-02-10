import { TransformedBoalfSchema } from "../../apis/elexon/boalf";

import { InterpolatedLevel, interpolateLevel } from "./interpolate-level";

export const evaluateBoalfLevel = (
  now: Date,
  existing: InterpolatedLevel,
  boalf: TransformedBoalfSchema
): InterpolatedLevel => {
  const start = boalf.levels[0];
  const end = boalf.levels[boalf.levels.length - 1];
  const startTime = new Date(start.time);
  if (startTime > now) return existing;
  const endTime = new Date(end.time);
  if (endTime < now) return existing;
  const interpolated = interpolateLevel(now, boalf.levels as any);
  return interpolated;
};

export const evaluateBoalfsLevel = (
  now: Date,
  preBm: InterpolatedLevel,
  boalfs: TransformedBoalfSchema[]
): InterpolatedLevel => {
  let iL = preBm;
  for (const boalf of boalfs) {
    iL = evaluateBoalfLevel(now, iL, boalf);
  }
  return iL;
};
