import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

type Code = string;

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
  selectedUnitGroupCode: Code | null;
}

const initialState = (): GbLiveState => {
  return {
    selectedUnitGroupCode: null,
  };
};

// actions

interface SetOutputTotalSolarOrEmbeddedWindActionPayload {
  capacity: number;
  level: number;
  delta: number;
}

export interface SetOutputTotalBmActionPayload
  extends SetOutputTotalSolarOrEmbeddedWindActionPayload {
  balancingVolume: number;
}

export const gbLiveSlice = createSlice({
  name: "gbLive",
  initialState,
  reducers: {
    setSelectedUnitGroupCode: (
      state,
      { payload }: PayloadAction<Code | null>,
    ) => {
      state.selectedUnitGroupCode = payload;
    },
    resetInitialState: () => initialState(),
  },
});

export default gbLiveSlice;

// selectors

export const selectors = {
  // unit groups
  isSelectedUnitGroupCode: (state: RootState, code: Code) =>
    state.live.selectedUnitGroupCode === code,
  selectedUnitGroupCode: (state: RootState) => state.live.selectedUnitGroupCode,
};

export const { setSelectedUnitGroupCode, resetInitialState } =
  gbLiveSlice.actions;
