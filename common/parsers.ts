import * as t from "./types";
import log from "../services/log";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export const getBmUnits = (records: { bmUnit: string }[]): string[] => {
  let set = new Set<string>();
  records.forEach((r) => set.add(r.bmUnit));
  const output = Array.from(set);
  log.debug(
    `getBmUnits: ${output.length} units found from ${records.length} records`
  );
  return output;
};

export const levelDictToLevelPairs = (
  levelDict: t.LevelDict
): t.LevelPair[] => {
  let output: t.LevelPair[] = [];
  for (const time of Object.keys(levelDict)) {
    output.push({ time, level: levelDict[time] });
  }
  return output.sort((a, b) => a.time.localeCompare(b.time));
};

type IntervalRecord = {
  timeFrom: string;
  timeTo: string;
  levelFrom: number;
  levelTo: number;
};

export const intervalRecordToLevelDict = (r: IntervalRecord[]): t.LevelDict => {
  let levelDict: t.LevelDict = {};
  for (const x of r) {
    levelDict[x.timeFrom] = x.levelFrom;
    levelDict[x.timeTo] = x.levelTo;
  }
  return levelDict;
};

export const intervalRecordToLevelPairs = (
  r: IntervalRecord[]
): t.LevelPair[] => {
  const levelDict = intervalRecordToLevelDict(r);
  return levelDictToLevelPairs(levelDict);
};

export const interpolateLevelPair = (
  time: string,
  levelPairs: t.LevelPair[]
): number => {
  const exact = levelPairs.find((x) => x.time === time);
  if (exact) {
    log.debug(`interpolateLevelPair: exact match found for ${time}`);
  }
  const befores = levelPairs.filter((x) => x.time < time);
  const afters = levelPairs.filter((x) => x.time > time);
  if (befores.length === 0 || afters.length === 0) {
    log.debug(`interpolateLevelPair: no before or after found for ${time}`);
  }
  // interpolate on a linear basis
  const before = befores[befores.length - 1];
  const after = afters[0];
  const times = {
    before: new Date(before.time).getTime(),
    after: new Date(after.time).getTime(),
    output: new Date(time).getTime(),
  };
  const timeDiffs = {
    before: times.output - times.before,
    total: times.after - times.before,
    after: times.after - times.output,
  };
  const weights = {
    before: timeDiffs.before / timeDiffs.total,
    after: timeDiffs.after / timeDiffs.total,
  };
  const interp = before.level * weights.before + after.level * weights.after;
  return Math.round(interp);
};

type InterpolateBmUnitLevelPairsParams = {
  time: string;
  bmUnitLevelPairs: t.BmUnitLevelPairs;
  omitZero: boolean;
};

export const interpolateBmUnitLevelPairs = ({
  time,
  bmUnitLevelPairs,
  omitZero,
}: InterpolateBmUnitLevelPairsParams): t.BmUnitValues => {
  log.debug(`interpolateBmUnitLevelPairs: interpolating for ${time}`);
  let output: t.BmUnitValues = {};
  for (const bmUnit of Object.keys(bmUnitLevelPairs)) {
    const level = interpolateLevelPair(time, bmUnitLevelPairs[bmUnit]);
    if (level !== 0 || !omitZero) {
      output[bmUnit] = level;
    }
  }
  log.debug(
    `interpolateBmUnitLevelPairs: ${
      Object.keys(output).length
    } units found for ${time}`
  );
  return output;
};

export const sortDescendingBmUnitValues = (v: t.BmUnitValues) => {
  let bmUnits: { id: string; level: number }[] = [];
  for (const id of Object.keys(v)) {
    bmUnits.push({ id, level: v[id] });
  }
  return bmUnits.sort((a, b) => b.level - a.level);
};

export const getAcceptancesNoLevels = (
  x: t.ElexonInsightsAcceptancesDataRecord[]
): t.ElexonInsightsAcceptancesParsedNoLevels[] => {
  let output: Record<string, t.ElexonInsightsAcceptancesParsedNoLevels> = {};
  for (const a of x) {
    output[a.acceptanceNumber] = {
      bmUnit: a.bmUnit,
      acceptanceNumber: a.acceptanceNumber,
      acceptanceTime: a.acceptanceTime,
      deemedBoFlag: a.deemedBoFlag,
      soFlag: a.soFlag,
      storFlag: a.storFlag,
      rrFlag: a.rrFlag,
    };
  }
  return Object.values(output);
};

export const parseAcceptancesWithLevels = (
  x: t.ElexonInsightsAcceptancesDataRecord[]
): t.ElexonInsightsAcceptancesParsed[] =>
  getAcceptancesNoLevels(x).map((a) => {
    return {
      ...a,
      levels: intervalRecordToLevelPairs(
        x.filter((y) => y.acceptanceNumber === a.acceptanceNumber)
      ),
    };
  });


type CombinePnsAndAccsParams = {
  pns: t.ElexonInsightsPnResponseParsed;
  accs: t.ElexonInsightsAcceptancesResponseParsed;
}

export const combinePnsAndAccs = ({pns, accs}: CombinePnsAndAccsParams): t.BmUnitLevelPairs => {
  log.debug(`combinePnsAndAccs`)
  let output: t.BmUnitLevelPairs = {}
  console.log(accs)
  for (const bmUnit of Object.keys(pns)) {
    log.debug(`combinePnsAndAccs: combining ${bmUnit}`)
    if(!Object.keys(accs).includes(bmUnit)) {
      // log.debug(`combinePnsAndAccs: no acceptances found for ${bmUnit}`)
      output[bmUnit] = pns[bmUnit]
    } else {
      log.debug(`combinePnsAndAccs: acceptances found for ${bmUnit}`)
      let schedule: t.LevelPair[] = pns[bmUnit]
      for (const acc of accs[bmUnit]) {
        log.info(`combinePnsAndAccs: ${bmUnit} combining acceptance ${acc.acceptanceNumber}`)
        schedule = [
          ...schedule.filter(x => x.time < acc.levels[0].time),
          ...acc.levels,
          ...schedule.filter(x => x.time > acc.levels[acc.levels.length - 1].time)
        ]
      }
      log.debug(`updating schedule for ${bmUnit} from ${pns[bmUnit].length} to ${schedule.length} levels`)
      output[bmUnit] = schedule
    }
  }
  return output
}