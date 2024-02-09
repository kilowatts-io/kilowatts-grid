import { TransformedBoalfSchema } from "./apis/elexon/boalf";
import { BasicLevel } from "./apis/elexon/commonTypes";
import {
  evaluateBoalfsLevel,
  InterpolatedLevel,
  interpolateLevel
} from "./gb/calcs";

export const getMostRecentMels = (now: Date, levels: BasicLevel[]): number => {
  let latest: BasicLevel | undefined = undefined;
  for (const level of levels) {
    const date = new Date(level.time);
    // not sure why conversion to number is required here.
    if (Number(date) === Number(now)) {
      return level.level;
    }
    if (date < now) latest = level;
    if (date > now) break;
  }
  if (!latest) {
    // throw new Error(`No MELS available prior to ${now}`);
    return 0;
  }
  return latest.level;
};

export const getMels = (
  now: Date,
  levels: BasicLevel[],
  outputLevels: InterpolatedLevel[]
): number => {
  const mostRecent = getMostRecentMels(now, levels);
  // sometimes stations put out a lower mels than their expected output, e.g. nuclear stations
  const maxOutput = outputLevels.reduce((acc, x) => Math.max(acc, x.level), 0);
  return Math.max(mostRecent, maxOutput);
};

export type CurrentOutput = {
  capacity: number;
  preBm: number;
  postBm: {
    actual: number;
    delta: number;
  };
};

export const getStartOfCurrentHalfHour = (now: Date) => {
  const start = new Date(now);
  start.setSeconds(0);
  start.setMilliseconds(0);
  if (start.getMinutes() >= 30) {
    start.setMinutes(30);
  } else {
    start.setMinutes(0);
  }
  return start;
};

export const getStartOfCurrentHour = (now: Date) => {
  const start = new Date(now);
  start.setSeconds(0);
  start.setMilliseconds(0);
  start.setMinutes(0);
  return start;
};
