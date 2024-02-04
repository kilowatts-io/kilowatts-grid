import { BasicLevel } from "../../apis/elexon/commonTypes";

export type InterpolatedLevel = {
  level: number;
  delta: number;
};

export const interpolateLevel = (
  now: Date,
  levels: BasicLevel[]
): InterpolatedLevel => {
  if (levels.length == 0) {
    return {
      level: 0,
      delta: 0,
    };
  }
  const exact = levels.find((x) => x.time === now.toISOString());
  if (exact) {
    return {
      level: exact.level,
      delta: 0,
    };
  }

  let befores: BasicLevel[] = [];
  let afters: BasicLevel[] = [];

  for (const level of levels) {
    const time = new Date(level.time);
    if (time < now) {
      befores.push(level);
    } else {
      afters.push(level);
    }
  }

  const previous = befores[befores.length - 1];
  const subsequent = afters[0];

  if (!previous || !subsequent) {
    throw new Error(
      `No previous or subsequent level for ${now} from ${levels}`
    );
  }

  const totalChange = subsequent.level - previous.level;
  const times = {
    previous: new Date(previous.time),
    interpolated: now,
    subsequent: new Date(subsequent.time),
  };
  const totalTime = times.subsequent.getTime() - times.previous.getTime();
  const timeDiffs = {
    previous: times.subsequent.getTime() - times.interpolated.getTime(),
    subsequent: times.interpolated.getTime() - times.previous.getTime(),
  };
  const timeWeights = {
    previous: timeDiffs.previous / totalTime,
    subsequent: timeDiffs.subsequent / totalTime,
  };
  const levelComponents = {
    previous: previous.level * timeWeights.previous,
    subsequent: subsequent.level * timeWeights.subsequent,
  };
  const level = levelComponents.previous + levelComponents.subsequent;
  const delta = (totalChange / totalTime) * 1000 * 60;

  return {
    level,
    delta,
  };
};
