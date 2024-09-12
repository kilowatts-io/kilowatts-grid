import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  unitGroup?: string;
  fuelType?: FuelType
}

const search = createSlice({
  name: "search",
  initialState: {} as SearchState,
  reducers: {
    setUnitGroup: (state, action: PayloadAction<string | undefined>) => {
      state.unitGroup = action.payload;
    },
    setFuelType: (state, action: PayloadAction<FuelType | undefined>) => {
      state.fuelType = action.payload;
    },
  },
});

export const actions = search.actions;

export default search;
