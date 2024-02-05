import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bmUnits, unitGroupCodes } from "./fixtures/generators/unit-groups";
import { RootState } from "../reducer";

type Code = string;

type BalancingVolume = Record<Code, number>;
type CurrentOutput = Record<
  Code,
  {
    delta: number;
    level: number;
  }
>;
type Capacity = Record<Code, number>;

type SortedOrUnitGroupOutput = {
  i: number;
  code: Code;
}[];

interface LiveUnitOrUnitGroup {
  balancingVolume: BalancingVolume;
  currentOutput: CurrentOutput;
  capacity: Capacity;
  sortedOutput: SortedOrUnitGroupOutput;
}

type OutputTotal = {
  delta: number;
  level: number;
  capacity: number;
  balancingVolume: number;
};

export interface OutputTotalsWind {
  embedded?: OutputTotal;
  bm?: OutputTotal;
}

export interface OutputTotals {
  solar?: OutputTotal;
  coal?: OutputTotal;
  gas?: OutputTotal;
  nuclear?: OutputTotal;
  biomass?: OutputTotal;
  wind: OutputTotalsWind;
  hydro?: OutputTotal;
  battery?: OutputTotal;
  interconnectors?: OutputTotal;
}

interface GbLiveState {
  lastUpdated: {
    capacities: Date | null;
    outputGenerators: Date | null;
    outputInterconnectors: Date | null;
    embeddedForecasts: Date | null;
  };
  selectedUnitGroupCode: Code | null;
  unitGroups: LiveUnitOrUnitGroup;
  bmUnits: LiveUnitOrUnitGroup;
  totals: {
    balancing: {
      bid?: number;
      offer?: number;
    };
    output: OutputTotals;
  };
}

const initialState = (): GbLiveState => {
  const ugB: BalancingVolume = {} as BalancingVolume;
  const ugO: CurrentOutput = {} as CurrentOutput;
  const ugC: Capacity = {} as Capacity;

  for (const unitGroupCode of unitGroupCodes) {
    ugB[unitGroupCode] = 0;
    ugO[unitGroupCode] = { delta: 0, level: 0 };
    ugC[unitGroupCode] = 0;
  }

  const uB: BalancingVolume = {} as BalancingVolume;
  const uO: CurrentOutput = {} as CurrentOutput;
  const uC: Capacity = {} as Capacity;

  for (const bmUnit of bmUnits) {
    uB[bmUnit] = 0;
    uO[bmUnit] = { delta: 0, level: 0 };
    uC[bmUnit] = 0;
  }

  return {
    lastUpdated: {
      capacities: null,
      outputGenerators: null,
      outputInterconnectors: null,
      embeddedForecasts: null,
    },
    selectedUnitGroupCode: null,
    unitGroups: {
      balancingVolume: ugB,
      currentOutput: ugO,
      capacity: ugC,
      sortedOutput: [],
    },
    bmUnits: {
      balancingVolume: uB,
      currentOutput: uO,
      capacity: uC,
      sortedOutput: [],
    },
    totals: {
      balancing: {},
      output: {
        wind: {},
      },
    },
  };
};

// actions

//  unit groups

interface SetUnitGroupBalancingVolumeActionPayload {
  unitGroupCode: Code;
  volume: number;
}

interface SetUnitGroupCurrentOutputActionPayload {
  unitGroupCode: Code;
  currentOutput: {
    delta: number;
    level: number;
  };
}

interface SetUnitGroupCapacityActionPayload {
  unitGroupCode: Code;
  capacity: number;
}

interface SetUnitGroupSortedOutputActionPayload {
  sortedOutput: SortedOrUnitGroupOutput;
}

// units

interface SetUnitBalancingVolumeActionPayload {
  bmUnit: string;
  volume: number;
}

interface SetUnitCurrentOutputActionPayload {
  bmUnit: string;
  currentOutput: {
    delta: number;
    level: number;
  };
}

interface SetUnitCapacityActionPayload {
  bmUnit: string;
  capacity: number;
}

// output totals

interface SetOutputTotalSolarOrEmbeddedWindActionPayload {
  capacity: number;
  level: number;
  delta: number;
}

export interface SetOutputTotalBmActionPayload
  extends SetOutputTotalSolarOrEmbeddedWindActionPayload {
  balancingVolume;
}

export const gbLiveSlice = createSlice({
  name: "gbLive",
  initialState,
  reducers: {
    // unit groups
    setUnitGroupBalancingVolume: (
      state,
      action: PayloadAction<SetUnitGroupBalancingVolumeActionPayload>
    ) => {
      const { unitGroupCode, volume } = action.payload;
      state.unitGroups.balancingVolume[unitGroupCode] = volume;
    },
    setUnitGroupCurrentOutput: (
      state,
      action: PayloadAction<SetUnitGroupCurrentOutputActionPayload>
    ) => {
      const { unitGroupCode, currentOutput } = action.payload;
      state.unitGroups.currentOutput[unitGroupCode] = currentOutput;
    },
    setUnitGroupCapacity: (
      state,
      action: PayloadAction<SetUnitGroupCapacityActionPayload>
    ) => {
      const { unitGroupCode, capacity } = action.payload;
      state.unitGroups.capacity[unitGroupCode] = capacity;
    },
    setSelectedUnitGroupCode: (
      state,
      action: PayloadAction<Code | undefined>
    ) => {
      state.selectedUnitGroupCode = action.payload;
    },
    setUnitGroupSortedOutput: (
      state,
      action: PayloadAction<SetUnitGroupSortedOutputActionPayload>
    ) => {
      state.unitGroups.sortedOutput = action.payload.sortedOutput;
    },
    // units
    setUnitBalancingVolume: (
      state,
      action: PayloadAction<SetUnitBalancingVolumeActionPayload>
    ) => {
      const { bmUnit, volume } = action.payload;
      state.bmUnits.balancingVolume[bmUnit] = volume;
    },
    setUnitCurrentOutput: (
      state,
      action: PayloadAction<SetUnitCurrentOutputActionPayload>
    ) => {
      const { bmUnit, currentOutput } = action.payload;
      state.bmUnits.currentOutput[bmUnit] = currentOutput;
    },
    setUnitCapacity: (
      state,
      action: PayloadAction<SetUnitCapacityActionPayload>
    ) => {
      const { bmUnit, capacity } = action.payload;
      state.bmUnits.capacity[bmUnit] = capacity;
    },
    // balancingTotals
    setBalancingTotalsBid: (state, action: PayloadAction<number>) => {
      state.totals.balancing.bid = action.payload;
    },
    setBalancingTotalsOffer: (state, action: PayloadAction<number>) => {
      state.totals.balancing.offer = action.payload;
    },
    // outputTotals
    setOutputTotalSolar: (
      state,
      action: PayloadAction<SetOutputTotalSolarOrEmbeddedWindActionPayload>
    ) => {
      state.totals.output.solar = {
        ...action.payload,
        balancingVolume: 0,
      };
    },
    setOutputTotalEmbeddedWind: (
      state,
      action: PayloadAction<SetOutputTotalSolarOrEmbeddedWindActionPayload>
    ) => {
      state.totals.output.wind.embedded = {
        ...action.payload,
        balancingVolume: 0,
      };
    },
    setOutputTotalGas: (
      state,
      action: PayloadAction<SetOutputTotalBmActionPayload>
    ) => {
      state.totals.output.gas = action.payload;
    },
    setOutputTotalNuclear: (
      state,
      action: PayloadAction<SetOutputTotalBmActionPayload>
    ) => {
      state.totals.output.nuclear = action.payload;
    },
    setOutputTotalCoal: (
      state,
      action: PayloadAction<SetOutputTotalBmActionPayload>
    ) => {
      state.totals.output.coal = action.payload;
    },
    setOutputTotalBmWind: (
      state,
      action: PayloadAction<SetOutputTotalBmActionPayload>
    ) => {
      state.totals.output.wind.bm = action.payload;
    },
    setOutputTotalHydro: (
      state,
      action: PayloadAction<SetOutputTotalBmActionPayload>
    ) => {
      state.totals.output.hydro = action.payload;
    },
    setOutputTotalBiomass: (
      state,
      action: PayloadAction<SetOutputTotalBmActionPayload>
    ) => {
      state.totals.output.biomass = action.payload;
    },
    setOutputTotalBattery: (
      state,
      action: PayloadAction<SetOutputTotalBmActionPayload>
    ) => {
      state.totals.output.battery = action.payload;
    },
    setOutputTotalInterconnectors: (
      state,
      action: PayloadAction<SetOutputTotalBmActionPayload>
    ) => {
      state.totals.output.interconnectors = action.payload;
    },
    // lastUpdatedFlags
    setUpdatedCapacities: (state) => {
      state.lastUpdated.capacities = new Date();
    },
    setUpdatedCurrentOutputGenerators: (state) => {
      state.lastUpdated.outputGenerators = new Date();
    },
    setUpdatedCurrentOutputInterconnectors: (state) => {
      state.lastUpdated.outputInterconnectors = new Date();
    },
    setUpdatedEmbeddedForecasts: (state) => {
      state.lastUpdated.embeddedForecasts = new Date();
    },
    // reset initial load
    resetInitialState: () => initialState(),
  },
});

// selectors

export const selectors = {
  // unit groups
  unitGroupCapacity: (state: RootState, code: Code) =>
    state.gbLiveSlice.unitGroups.capacity[code],
  unitGroupCurrentOutput: (state: RootState, code: Code) =>
    state.gbLiveSlice.unitGroups.currentOutput[code],
  unitGroupBalancingVolume: (state: RootState, code: Code) =>
    state.gbLiveSlice.unitGroups.balancingVolume[code],
  unitGroupBalancingDirection: (state: RootState, code: Code) => {
    const b = state.gbLiveSlice.unitGroups.balancingVolume[code];
    if (b === 0) return "none";
    return b > 0 ? "offer" : "bid";
  },
  unitGroupCapacityFactor: (state: RootState, code: Code) => {
    const c = state.gbLiveSlice.unitGroups.capacity[code];
    const o = state.gbLiveSlice.unitGroups.currentOutput[code];
    return c === 0 ? 0 : o.level / c;
  },
  isSelectedUnitGroupCode: (state: RootState, code: Code) =>
    state.gbLiveSlice.selectedUnitGroupCode === code,
  selectedUnitGroupCode: (state: RootState) =>
    state.gbLiveSlice.selectedUnitGroupCode,
  unitGroupSorted: (state: RootState) =>
    state.gbLiveSlice.unitGroups.sortedOutput,
  // balancingTotals
  balancingTotalsBid: (state: RootState) =>
    state.gbLiveSlice.totals.balancing.bid,
  balancingTotalsOffer: (state: RootState) =>
    state.gbLiveSlice.totals.balancing.offer,
  // outputTotals
  outputTotals: (state: RootState) => state.gbLiveSlice.totals.output,
  // lastUpdated
  lastUpdatedCapacities: (state: RootState) => state.gbLiveSlice.lastUpdated,
  initialLoadComplete: (state: RootState): boolean => {
    const { lastUpdated } = state.gbLiveSlice;
    return (
      lastUpdated.capacities !== null &&
      lastUpdated.outputGenerators !== null &&
      lastUpdated.outputInterconnectors !== null //&&
    );
  },
};

export const {
  // unit groups
  setUnitGroupBalancingVolume,
  setUnitGroupCurrentOutput,
  setUnitGroupCapacity,
  setSelectedUnitGroupCode,
  setUnitGroupSortedOutput,
  // balancingTotals
  setBalancingTotalsBid,
  setBalancingTotalsOffer,
  // outputTotals
  setOutputTotalSolar,
  setOutputTotalEmbeddedWind,
  setOutputTotalGas,
  setOutputTotalBiomass,
  setOutputTotalNuclear,
  setOutputTotalBmWind,
  setOutputTotalHydro,
  setOutputTotalInterconnectors,
  setOutputTotalCoal,
  setOutputTotalBattery,
  // lastUpdated
  setUpdatedCapacities,
  setUpdatedCurrentOutputGenerators,
  setUpdatedCurrentOutputInterconnectors,
  setUpdatedEmbeddedForecasts,
} = gbLiveSlice.actions;
