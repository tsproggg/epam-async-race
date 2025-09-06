import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { IRaceState } from "../types/Interfaces";

const initialState: IRaceState = {
  isGlobalRace: false,
  ongoing: false,
  racingCarId: -1,
  resetAnimations: false,
};

const RaceStateSlice = createSlice({
  name: "RaceStateSlice",
  initialState,
  reducers: {
    setIsOngoing(
      state: IRaceState,
      action: PayloadAction<{
        isGlobalRace: boolean;
        ongoing: boolean;
        racingCarId: number;
      }>,
    ) {
      return { ...state, ...action.payload };
    },
    resetAnimations(state: IRaceState, action: PayloadAction<boolean>) {
      return { ...state, resetAnimations: action.payload };
    },
  },
});

export default RaceStateSlice;
export const { setIsOngoing, resetAnimations } = RaceStateSlice.actions;
