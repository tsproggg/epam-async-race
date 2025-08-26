import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { IRaceStats } from "../types/GlobalConst";

const initialState: IRaceStats = {
  isGlobalRace: false,
  ongoing: false,
};

const RaceStateSlice = createSlice({
  name: "RaceStatsSlice",
  initialState,
  reducers: {
    setIsOngoing(
      state: IRaceStats,
      action: PayloadAction<{ ongoing: boolean; isGlobalRace: boolean }>,
    ) {
      return {
        ...state,
        ongoing: action.payload.ongoing,
        isGlobalRace: action.payload.isGlobalRace,
      };
    },
  },
});

export default RaceStateSlice;
export const { setIsOngoing } = RaceStateSlice.actions;
