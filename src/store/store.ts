import { combineReducers, configureStore } from "@reduxjs/toolkit";

import sliceFactory from "./SliceFactory";

import type { ICar, IWinner } from "../types/ApiTypes";

const [GarageSlice] = sliceFactory<ICar>("GarageSlice", []);
const [WinnersSlice] = sliceFactory<IWinner>("WinnersSlice", []);

const rootReducer = combineReducers({
  garage: GarageSlice.reducer,
  winners: WinnersSlice.reducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
