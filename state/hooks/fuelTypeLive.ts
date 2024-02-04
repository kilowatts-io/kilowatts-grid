import {
  DataFromHooks,
  GeneratorType,
  useUnitsLiveQuery,
} from "./unitGroupsLive";
import { bmUnitFuelType } from "../gb/fixtures/generators/unit-groups";
import {
  isInterconnectorUnit,
  matchInterconnector,
  totalInterconnectorCapacity,
} from "../gb/fixtures/interconnectors/interconnectors";
import { formatGeneratorType } from "../../utils/generatorType";
import { EmbeddedData, useEmbeddedForecasts } from "./embeddedForecasts";
import {
  CurrentOutput,
  calculateUnitOutput,
  evaluateBoalfsLevel,
  interpolateLevel,
} from "../utils";

type CurrentOutputTotals = CurrentOutput & {
  balancing: {
    bids: number;
    offers: number;
  };
};

export const nullOutput = (): CurrentOutputTotals => ({
  capacity: 0,
  preBm: 0,
  postBm: { actual: 0, delta: 0 },
  balancing: { bids: 0, offers: 0 },
});

export const updateOutput = (
  output: CurrentOutputTotals,
  unitOutput: CurrentOutputTotals
) => {
  output.capacity += unitOutput.capacity;
  output.preBm += unitOutput.preBm;
  output.postBm.actual += unitOutput.postBm.actual;
  output.postBm.delta += unitOutput.postBm.delta;
};

export const isSpecialType = (bmUnit, types) =>
  types.some((type) => bmUnit.startsWith(type));

export const extractGenerators = (
  { pn, mels, boalf }: DataFromHooks,
  now: Date,
  embeddedWind: CurrentOutput
) => {
  const totals = nullOutput();
  const categories = {
    gas: nullOutput(),
    coal: nullOutput(),
    wind: { ...embeddedWind, balancing: { bids: 0, offers: 0 } },
    nuclear: nullOutput(),
    biomass: nullOutput(),
    hydro: nullOutput(),
    other: nullOutput(),
    battery: nullOutput(),
    oil: nullOutput(),
  };
  for (let [knownBmUnit, fuelType] of Object.entries(bmUnitFuelType)) {
    if (!knownBmUnit.startsWith("T_") || knownBmUnit.startsWith("E_")) continue;

    const unitPns = pn.find((unit) => unit.bmUnit === knownBmUnit);
    const unitMels = mels.find((unit) => unit.bmUnit === knownBmUnit);
    const unitBoalf = boalf.find((unit) => unit.bmUnit === knownBmUnit);

    const unitOutput = calculateUnitOutput({
      now,
      data: {
        pn: unitPns ? unitPns.levels : [],
        mels: unitMels ? unitMels.levels : [],
        boalf: unitBoalf ? unitBoalf.boalfs : [],
      },
    });

    const balancing = unitOutput.postBm.actual - unitOutput.preBm;
    totals.capacity += unitOutput.capacity;
    totals.preBm += unitOutput.preBm;

    totals.postBm.actual += unitOutput.postBm.actual;
    totals.postBm.delta += unitOutput.postBm.delta;

    if (balancing > 0) totals.balancing.offers += balancing;
    else totals.balancing.bids += balancing;
    const bids = balancing < 0 ? -balancing : 0;
    const offers = balancing > 0 ? balancing : 0;

    updateOutput(categories[fuelType], {
      ...unitOutput,
      balancing: { bids, offers },
    });
  }
  return { categories, totals };
};

export const extractInterconnectors = (
  data: DataFromHooks,
  now: Date
): CurrentOutputTotals => {
  const output = {
    ...nullOutput(),
    capacity: totalInterconnectorCapacity,
  };
  for (const pnData of data.pn) {
    const { bmUnit } = pnData;
    if (!bmUnit || !isInterconnectorUnit(bmUnit)) continue;
    const interconnector = matchInterconnector(bmUnit);
    if (interconnector) {
      const preBm = interpolateLevel(now, pnData.levels);
      output.preBm += preBm.level;

      const boalfs = data.boalf.find((x) => x.bmUnit === bmUnit)?.boalfs || [];
      const postBm = evaluateBoalfsLevel(now, preBm, boalfs);
      output.postBm.actual += postBm.level;
      output.postBm.delta += postBm.delta;

      const balancing = postBm.level - preBm.level;
      if (balancing > 0) output.balancing.offers += balancing;
      else output.balancing.bids += balancing;
    }
  }
  return output;
};

export const calculateTotalBalancing = (units: DataFromHooks, now: Date) => {
  const output = {
    bids: 0,
    offers: 0,
  }
  for (const bmUnitBoalfs of units.boalf) {
    const boalfs = bmUnitBoalfs.boalfs;
    const pns = units.pn.find((x) => x.bmUnit === bmUnitBoalfs.bmUnit)?.levels || [];
    const preBm = interpolateLevel(now, pns);
    const postBm = evaluateBoalfsLevel(now, preBm, boalfs);
    const balancing = postBm.level - preBm.level;
    if (balancing > 0) output.offers += balancing;
    else output.bids += balancing;
  }
  return output;
}

const joinData = (units: DataFromHooks, embedded: EmbeddedData, now: Date) => {
  const generators = extractGenerators(units, now, embedded.wind);
  const interconnector = extractInterconnectors(units, now);
  const output: Record<GeneratorType | "interconnector", CurrentOutput> = {
    ...generators.categories,
    interconnector,
    solar: embedded.solar,
  };

  if (output.solar.postBm.actual === 0 && output.solar.preBm === 0)
    delete (output as any).solar;
  if (output.coal.postBm.actual === 0 && output.coal.preBm === 0 && output.coal)
    delete (output as any).coal;
  if (output.other.postBm.actual === 0 && output.other.preBm === 0)
    delete (output as any).other;
  if (output.oil.postBm.actual === 0 && output.oil.preBm === 0)
    delete (output as any).oil;

  return {
    totals: {
      balancing: calculateTotalBalancing(units, now),
    },
    categories: Object.entries(output)
      .map(([fuelType, data]) => ({
        key: fuelType,
        generatorType: fuelType as GeneratorType,
        output: data,
        name: formatGeneratorType(fuelType as GeneratorType),
      }))
      .sort((a, b) => b.output.postBm.actual - a.output.postBm.actual),
  };
};

export const useFuelTypeLive = () => {
  const units = useUnitsLiveQuery();
  const embedded = useEmbeddedForecasts(units.now);
  if (
    !units.queries.pn.data ||
    !units.queries.boalf.data ||
    !units.queries.mels.data ||
    !embedded.data
  )
    return {
      data: null,
      isError: false,
    };
  try {
    return {
      data: joinData(
        {
          pn: units.queries.pn.data,
          mels: units.queries.mels.data,
          boalf: units.queries.boalf.data,
        },
        embedded.data,
        units.now
      ),
      isError: false,
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      isError: true,
    };
  }
};
