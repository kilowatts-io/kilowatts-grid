import { useNowQuery } from "../gb/hooks/now";
import { usePnQuery, useMelsQuery, useBoalfQuery } from "../apis/elexon/api";
import {
  BmUnitsBoalfsSchema,
  TransformedBoalfSchema,
} from "../apis/elexon/boalf";
import { BmUnitPnsSchema } from "../apis/elexon/pn";
import { unitGroups } from "../gb/fixtures/generators/unit-groups";
import { BmUnitMelsSchema } from "../apis/elexon/mels";
import { BasicLevel } from "../apis/elexon/commonTypes";
import {
  ForeignMarketName,
  foreignMarkets,
  matchInterconnector,
} from "../gb/fixtures/interconnectors/interconnectors";
import { Coords } from "../../components/gb-live/svg-map/tools";
import React from "react";
import { CurrentOutput, calculateUnitOutput } from "../utils";

const POLLING_INTERVAL_BOALFS_SECS = 15;

export type DataFromHooks = {
  pn: BmUnitPnsSchema;
  mels: BmUnitMelsSchema;
  boalf: BmUnitsBoalfsSchema;
};

type BmUnitId = string;

type BmData = Record<
  BmUnitId,
  {
    pn: BasicLevel[];
    mels: BasicLevel[];
    boalf: TransformedBoalfSchema[];
  }
>;

export type GeneratorType =
  | "battery"
  | "gas"
  | "coal"
  | "wind"
  | "solar"
  | "nuclear"
  | "hydro"
  | "biomass"
  | "oil"
  | "other";

export type GeneratorsLiveData = {
  key: string;
  name: string;
  coords: {
    lat: number;
    lng: number;
  };
  generatorType: GeneratorType;
  output: CurrentOutput;
}[];

export type ForeignMarketsLive = {
  key: ForeignMarketName;
  name: string;
  coords: Coords; // coords of the market to plot flag - needs to be vaguely in the right place
  interconnectors: {
    key: string;
    name: string;
    coords: Coords; // coords of the GB end of the interconnector
    output: CurrentOutput;
  }[];
};

export type ForeignMarketsLiveData = ForeignMarketsLive[];

export const evaluateForeignMarkets = ({
  data,
  now,
}: {
  data: BmData;
  now: Date;
}): ForeignMarketsLiveData => {
  const code4Data: Record<string, string[]> = {};

  for (const bmUnit of Object.keys(data)) {
    const interconnector = matchInterconnector(bmUnit);
    if (interconnector) {
      if (!code4Data[interconnector.code4]) {
        code4Data[interconnector.code4] = [];
      }
      code4Data[interconnector.code4].push(bmUnit);
    }
  }

  const output: ForeignMarketsLiveData = [];

  for (const fM of foreignMarkets) {
    const fmOutput = {
      key: fM.name,
      name: fM.name,
      coords: fM.coords,
      interconnectors: [] as ForeignMarketsLive["interconnectors"],
    };

    for (const interconnector of fM.interconnectors) {
      const intOutput = {
        key: interconnector.code4,
        name: interconnector.name,
        coords: interconnector.coords,
        output: {
          capacity: interconnector.capacity,
          preBm: 0,
          postBm: {
            actual: 0,
            delta: 0,
          },
        },
      };

      const bmUnits = code4Data[interconnector.code4];

      if (bmUnits) {
        for (const bmUnit of bmUnits) {
          const unitData = data[bmUnit];
          if (!unitData || unitData.pn.length == 0 || unitData.mels.length == 0)
            continue;
          const unitOutput = calculateUnitOutput({
            data: unitData,
            now,
          });
          intOutput.output.preBm += unitOutput.preBm;
          intOutput.output.postBm.actual += unitOutput.postBm.actual;
          intOutput.output.postBm.delta += unitOutput.postBm.delta;
        }
      }

      fmOutput.interconnectors.push(intOutput);
    }
    output.push(fmOutput);
  }

  return output;
};

export const evaluateGenerators = ({
  data,
  now,
}: {
  data: BmData;
  now: Date;
}): GeneratorsLiveData => {
  const output: GeneratorsLiveData = [];
  for (const unitGroup of unitGroups) {
    const groupOutput = {
      capacity: 0,
      preBm: 0,
      postBm: {
        actual: 0,
        delta: 0,
      },
    };
    for (const { bmUnit } of unitGroup.units) {
      const unitData = data[bmUnit];
      if (!unitData) {
        continue;
      }
      const unitPn = unitData.pn;
      const unitBoalf = unitData.boalf;
      const unitMels = unitData.mels;
      const unitOutput = calculateUnitOutput({
        data: {
          pn: unitPn,
          mels: unitMels,
          boalf: unitBoalf,
        },
        now,
      });
      groupOutput.capacity += unitOutput.capacity;
      groupOutput.preBm += unitOutput.preBm;
      groupOutput.postBm.actual += unitOutput.postBm.actual;
      groupOutput.postBm.delta += unitOutput.postBm.delta;
    }

    output.push({
      key: unitGroup.details.code,
      name: unitGroup.details.name,
      coords: unitGroup.details.coords,
      generatorType: unitGroup.details.fuelType,
      output: groupOutput,
    });
  }
  return output;
};

export const joinByBmUnit = ({ pn, mels, boalf }: DataFromHooks) => {
  let output: BmData = {};
  for (const bmUnit of pn) {
    output[bmUnit.bmUnit] = {
      pn: bmUnit.levels as BasicLevel[],
      mels: mels.find((x) => x.bmUnit === bmUnit.bmUnit)?.levels || [],
      boalf: boalf.find((x) => x.bmUnit === bmUnit.bmUnit)?.boalfs || [],
    };
  }
  return output;
};

export const sortForeignMarkets = (foreignMarkets: ForeignMarketsLiveData) => {
  return foreignMarkets.sort((a, b) => {
    const totalOutputA = a.interconnectors.reduce(
      (acc, x) => acc + x.output.postBm.actual,
      0
    );
    const totalOutputB = b.interconnectors.reduce(
      (acc, x) => acc + x.output.postBm.actual,
      0
    );
    if (totalOutputA === 0 && totalOutputB !== 0) return 1; // Sort A after B if A is zero and B
    if (totalOutputB === 0 && totalOutputA !== 0) return -1; // Sort B after A if B is zero and A is not

    if (totalOutputA > totalOutputB) return -1;

    return 0;
  });
};

export const sortGenerators = (generators: GeneratorsLiveData) => {
  return generators.sort((a, b) => {
    if (a.output.postBm.actual > b.output.postBm.actual) return -1;
    if (a.output.postBm.actual < b.output.postBm.actual) return 1;
    // When output.postBm.actual is 0 for both, sort by balancing volume
    if (a.output.postBm.actual === 0 && b.output.postBm.actual === 0) {
      const balancingVolumeA = Math.abs(a.output.postBm.actual - a.output.preBm);
      const balancingVolumeB = Math.abs( b.output.postBm.actual - b.output.preBm)
      if (balancingVolumeA > balancingVolumeB) return -1;
      if (balancingVolumeA < balancingVolumeB) return 1;
      
    }
    // sort by capacity descending order
    if (a.output.capacity > b.output.capacity) return -1;
    return 0;
  });
};

export const joinData = (data: DataFromHooks, now: Date) => {
  const bmUnits = joinByBmUnit(data);
  const foreignMarkets = evaluateForeignMarkets({ data: bmUnits, now });
  const generators = evaluateGenerators({ data: bmUnits, now });

  const output = {
    generators: sortGenerators(generators),
    foreignMarkets: sortForeignMarkets(foreignMarkets),
  };
  return output;
};

const tryJoinData = (data: DataFromHooks, now: Date) => {
  try {
    return joinData(data, now);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const joinQueries = ({
  pn,
  mels,
  boalf,
  now,
}: {
  pn: ReturnType<typeof usePnQuery>;
  mels: ReturnType<typeof useMelsQuery>;
  boalf: ReturnType<typeof useBoalfQuery>;
  now: Date;
}) => {
  return {
    isLoading: pn.isLoading || mels.isLoading || boalf.isLoading,
    data:
      pn.data && mels.data && boalf.data
        ? tryJoinData(
            {
              pn: pn.data,
              mels: mels.data,
              boalf: boalf.data,
            },
            now
          )
        : null,
    now,
  };
};

type UseGroupsLiveQueryResponse = {
  isLoading: boolean;
  data: {
    generators: GeneratorsLiveData;
    foreignMarkets: ForeignMarketsLiveData;
  };
  now: Date;
};

/* re-used as starting point for fuelTypeLiveQuery*/
export const useUnitsLiveQuery = () => {
  const { args, now } = useNowQuery();
  const queries = {
    pn: usePnQuery(args.settlementPeriod),
    mels: useMelsQuery(args.fromTo),
    boalf: useBoalfQuery(args.fromTo, {
      pollingInterval: 1000 * POLLING_INTERVAL_BOALFS_SECS,
    }),
  };
  return { queries, now };
};

export const useUseGroupsLiveQuery = (): UseGroupsLiveQueryResponse => {
  const { queries, now } = useUnitsLiveQuery();
  const [response, setResponse] = React.useState<UseGroupsLiveQueryResponse>({
    isLoading: true,
    data: {
      generators: [],
      foreignMarkets: [],
    },
    now,
  });

  React.useEffect(() => {
    try {
      const data = joinQueries({
        pn: queries.pn,
        mels: queries.mels,
        boalf: queries.boalf,
        now,
      });
      // fail if no data or no generators
      if (
        !data.data ||
        !data.data.generators ||
        data.data.generators.length == 0
      ) {
        // throw new Error("No generators");
      } else {
        setResponse({
          isLoading: data.isLoading,
          data: data.data,
          now: data.now,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [queries.pn.data, queries.mels.data, queries.boalf.data]);

  return response;
};
