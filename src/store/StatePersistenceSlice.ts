import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { WinnersSorting } from "../types/GlobalConst";
import type { IStatePersistance } from "../types/Interfaces";

const initialState: IStatePersistance = {
  garageListPage: 0,
  winnersListPage: 0,
  winnersSorting: "w-desc",
};

const StatePersistenceSlice = createSlice({
  name: "StatePersistenceSlice",
  initialState,
  reducers: {
    setGarageListPage(state: IStatePersistance, action: PayloadAction<number>) {
      if (action.payload < 0) return state;
      return {
        ...state,
        garageListPage: action.payload,
      };
    },
    setWinnersListPage(
      state: IStatePersistance,
      action: PayloadAction<number>,
    ) {
      if (action.payload < 0) return state;
      return {
        ...state,
        winnersListPage: action.payload,
      };
    },
    setWinnersSorting(
      state: IStatePersistance,
      action: PayloadAction<WinnersSorting>,
    ) {
      return {
        ...state,
        winnersSorting: action.payload,
      };
    },
  },
});

export default StatePersistenceSlice;
export const { setGarageListPage, setWinnersListPage, setWinnersSorting } =
  StatePersistenceSlice.actions;
