import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { IRaceStats } from "../types/GlobalConst";

const initialState: IRaceStats = {
  isGlobalRace: false,
  ongoing: false,
  bestTime: 0,
  winnerId: 0,
};

const RaceStatsSlice = createSlice({
  name: "RaceStatsSlice",
  initialState,
  reducers: {
    clearStats(_: IRaceStats, __: PayloadAction) {
      return initialState;
    },
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
    setBestTime(state: IRaceStats, action: PayloadAction<IRaceStats>) {
      if (
        action.payload.bestTime < 0 ||
        action.payload.bestTime >= state.bestTime ||
        action.payload.winnerId < 0
      ) {
        return state;
      }

      return action.payload;
    },
  },
});

export default RaceStatsSlice;
export const { clearStats, setBestTime, setIsOngoing } = RaceStatsSlice.actions;
