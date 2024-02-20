import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../reducer";

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
    selectedUnitGroupCode: null
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
  balancingVolume;
}

export const gbLiveSlice = createSlice({
  name: "gbLive",
  initialState,
  reducers: {
    setSelectedUnitGroupCode: (
      state,
      action: PayloadAction<Code | undefined>
    ) => {
      state.selectedUnitGroupCode = action.payload;
    },
    resetInitialState: () => initialState()
  }
});

// selectors

export const selectors = {
  // unit groups
  isSelectedUnitGroupCode: (state: RootState, code: Code) =>
    state.gbLiveSlice.selectedUnitGroupCode === code,
  selectedUnitGroupCode: (state: RootState) =>
    state.gbLiveSlice.selectedUnitGroupCode
};

export const { setSelectedUnitGroupCode, resetInitialState } =
  gbLiveSlice.actions;
