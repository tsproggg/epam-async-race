import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { IRaceState } from "../types/Interfaces";

const initialState: IRaceState = {
  isGlobalRace: false,
  ongoing: false,
  racingCarId: -1,
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
  },
});

export default RaceStateSlice;
export const { setIsOngoing } = RaceStateSlice.actions;
