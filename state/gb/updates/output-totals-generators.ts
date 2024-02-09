import { log } from "../../../utils/logs";
import { store } from "../../reducer";
import { getUnitOutput } from "../calcs/unit-output";
import { unitGroups } from "../fixtures/generators/unit-groups";
import {
  MelsPnBoalfsData,
  MelsPnBoalfsUpdateFunction
} from "../hooks/melsPnBoalfs";
import {
  setOutputTotalBattery,
  setOutputTotalBiomass,
  setOutputTotalBmWind,
  setOutputTotalCoal,
  setOutputTotalGas,
  setOutputTotalHydro,
  setOutputTotalNuclear,
  setUpdatedCurrentOutputGenerators
} from "../live";

const createActionPayload = () => ({
  level: 0,
  delta: 0,
  capacity: 0,
  balancingVolume: 0
});

const calculateGroupTotals = (
  now: Date,
  data: MelsPnBoalfsData,
  fuelType: string
) =>
  unitGroups
    .filter((group) => group.details.fuelType === fuelType)
    .flatMap((group) =>
      group.units.map((unit) => getUnitOutput(now, data, unit.bmUnit))
    )
    .reduce(
      (acc, totals) => ({
        level: acc.level + totals.postBm.actual,
        delta: acc.delta + totals.postBm.delta,
        capacity: acc.capacity + totals.capacity,
        balancingVolume:
          acc.balancingVolume + (totals.postBm.actual - totals.preBm)
      }),
      createActionPayload()
    );

const updateOutputTotalsGenerators: MelsPnBoalfsUpdateFunction = (
  now,
  data
) => {
  const fuelTypes = {
    wind: setOutputTotalBmWind,
    gas: setOutputTotalGas,
    nuclear: setOutputTotalNuclear,
    coal: setOutputTotalCoal,
    hydro: setOutputTotalHydro,
    battery: setOutputTotalBattery,
    biomass: setOutputTotalBiomass
  };

  Object.keys(fuelTypes).forEach((fuelType) => {
    const total = calculateGroupTotals(now, data, fuelType);
    store.dispatch(fuelTypes[fuelType](total));
  });

  store.dispatch(setUpdatedCurrentOutputGenerators());
  console.info("updateOutputTotalsGenerators complete");
};

export { updateOutputTotalsGenerators };
