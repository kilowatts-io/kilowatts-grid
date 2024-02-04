import {
  UnitGroupBmUnits,
  unitGroupBmUnits,
} from "../fixtures/generators/unit-groups";
import {
  setUnitGroupCurrentOutput,
  setUnitGroupSortedOutput,
  setUnitGroupBalancingVolume,
} from "../live";
import { store } from "../../reducer";
import { log } from "../../../utils/logs";
import { getUnitOutput } from "../calcs";
import { MelsPnBoalfsData, MelsPnBoalfsUpdateFunction } from "../hooks/melsPnBoalfs";

type UpdateUnitGroupOutputResult = {
  code: string;
  postBmLevel: number;
  balancingVolume: number;
};

const updateUnitGroupOutput = (
  now: Date,
  data: MelsPnBoalfsData,
  ug: UnitGroupBmUnits
): UpdateUnitGroupOutputResult => {
  const unitOutputs = ug.bmUnits.map((bmUnit) =>
    getUnitOutput(now, data, bmUnit)
  );

  let postBmLevel = 0;
  let postBmDelta = 0;
  let balancingVolume = 0;
  for (const uo of unitOutputs) {
    postBmDelta += uo.postBm.delta;
    postBmLevel += uo.postBm.actual;
    balancingVolume += uo.postBm.actual - uo.preBm;
  }

  store.dispatch(
    setUnitGroupCurrentOutput({
      unitGroupCode: ug.unitGroupCode,
      currentOutput: {
        delta: postBmDelta,
        level: postBmLevel,
      },
    })
  );
  store.dispatch(
    setUnitGroupBalancingVolume({
      unitGroupCode: ug.unitGroupCode,
      volume: balancingVolume,
    })
  );

  return { code: ug.unitGroupCode, postBmLevel, balancingVolume  };
};

const compareOutputs = (
  a: UpdateUnitGroupOutputResult,
  b: UpdateUnitGroupOutputResult
) => {
  if (a.postBmLevel !== b.postBmLevel) return b.postBmLevel - a.postBmLevel;
  const bal = Math.abs(b.balancingVolume) - Math.abs(a.balancingVolume);
  if (bal !== 0) return bal;
};

export const updateUnitGroupsOutput: MelsPnBoalfsUpdateFunction = (now, data) => {
  const sortedOutput = unitGroupBmUnits
    .map((ug) => updateUnitGroupOutput(now, data, ug))
    .filter(x => x.balancingVolume !== 0 || x.postBmLevel !== 0)
    .sort(compareOutputs)
    .map((x, i) => ({ code: x.code, i }))
    

  store.dispatch(setUnitGroupSortedOutput({ sortedOutput }));
  log.info("updateUnitGroupsOutput complete");
};
