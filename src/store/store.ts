import { combineReducers, configureStore } from "@reduxjs/toolkit";

import CarPropsInputBufferSlice from "./CarPropsInputBufferSlice";
import RaceStatsSlice from "./RaceStatsSlice";
import sliceFactory from "./SliceFactory";

import type { ICar, IWinner } from "../types/ApiTypes";

const [GarageSlice] = sliceFactory<ICar>("GarageSlice", []);
const [WinnersSlice] = sliceFactory<IWinner>("WinnersSlice", []);

const rootReducer = combineReducers({
  garage: GarageSlice.reducer,
  winners: WinnersSlice.reducer,
  carPropsInputBufferSlice: CarPropsInputBufferSlice.reducer,
  raceStatsSlice: RaceStatsSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
export { GarageSlice, WinnersSlice };
