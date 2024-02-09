import { log } from "../../../utils/logs";
import { BmUnitPnSchema } from "../../apis/elexon/pn";
import { store } from "../../reducer";
import { getUnitOutput } from "../calcs";
import {
  foreignMarkets,
  matchInterconnector,
  totalInterconnectorCapacity
} from "../fixtures/interconnectors/interconnectors";
import { MelsPnBoalfsUpdateFunction } from "../hooks/melsPnBoalfs";
import {
  setOutputTotalInterconnectors,
  setUnitGroupBalancingVolume,
  setUnitGroupCapacity,
  setUnitGroupCurrentOutput,
  setUpdatedCurrentOutputInterconnectors
} from "../live";

type InterconnectorCode = string;

type InterconnectorOutput = {
  currentOutput: {
    level: number;
    delta: number;
  };
  balancingVolume: number;
};

const nullInterconnectorOutput = () => ({
  currentOutput: {
    level: 0,
    delta: 0
  },
  balancingVolume: 0
});

const nullOutput = () => ({
  capacity: 0,
  level: 0,
  delta: 0,
  balancingVolume: 0
});

export const updateOutputTotalsInterconnectors: MelsPnBoalfsUpdateFunction = (
  now,
  data
) => {
  const interconnectorOutputs: Record<
    InterconnectorCode,
    InterconnectorOutput
  > = {};

  const calculateInterconnectorOutput = (bmUnitPns: BmUnitPnSchema) => {
    const interconnector = matchInterconnector(bmUnitPns.bmUnit);
    if (!interconnector) return null;
    const unitOutput = getUnitOutput(now, data, bmUnitPns.bmUnit);

    // add to interconnectorOutputs
    const interconnectorCode = interconnector.code4;
    if (!interconnectorOutputs[interconnectorCode]) {
      interconnectorOutputs[interconnectorCode] = nullInterconnectorOutput();
    }
    interconnectorOutputs[interconnectorCode].currentOutput.level +=
      unitOutput.postBm.actual;
    interconnectorOutputs[interconnectorCode].currentOutput.delta +=
      unitOutput.postBm.delta;
    interconnectorOutputs[interconnectorCode].balancingVolume +=
      unitOutput.postBm.actual - unitOutput.preBm;

    return {
      balancingVolume: unitOutput.postBm.actual - unitOutput.preBm,
      capacity: interconnector.capacity,
      delta: unitOutput.postBm.delta,
      level: unitOutput.postBm.actual
    };
  };

  const output = data.pn
    .map(calculateInterconnectorOutput)
    .filter(Boolean) // Remove null values
    .reduce(
      (acc, curr) => ({
        capacity: acc.capacity + curr.capacity,
        level: acc.level + curr.level,
        delta: acc.delta + curr.delta,
        balancingVolume: acc.balancingVolume + curr.balancingVolume
      }),
      nullOutput()
    );

  // group by market

  for (const [unitGroupCode, outputs] of Object.entries(
    interconnectorOutputs
  )) {
    store.dispatch(
      setUnitGroupCurrentOutput({
        unitGroupCode,
        currentOutput: outputs.currentOutput
      })
    );
    store.dispatch(
      setUnitGroupBalancingVolume({
        unitGroupCode,
        volume: outputs.balancingVolume
      })
    );
  }

  store.dispatch(
    setOutputTotalInterconnectors({
      ...output,
      capacity: totalInterconnectorCapacity
    })
  );

  store.dispatch(setUpdatedCurrentOutputInterconnectors());
  console.info("updateOutputTotalsInterconnectors complete");
};
