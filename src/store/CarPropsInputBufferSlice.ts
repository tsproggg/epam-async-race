import { createSlice } from "@reduxjs/toolkit";

import { hexColorRegex } from "../types/GlobalConst";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { ICar } from "../types/ApiTypes";

const initialState: ICar = {
  id: 0, // represents selected car, is NOT a part of car addition request
  name: "",
  color: "#000000",
};

const CarPropsInputBufferSlice = createSlice({
  name: "CarPropInputBufferSlice",
  initialState,
  reducers: {
    clearBuffer(_: ICar, __: PayloadAction) {
      return initialState;
    },
    setSelectedCarId(state: ICar, action: PayloadAction<number>) {
      if (action.payload < 0) return state;
      return { ...state, id: action.payload };
    },
    setName(state: ICar, action: PayloadAction<string>) {
      if (!action.payload) {
        return state;
      }
      return { ...state, name: action.payload };
    },
    setColor(state: ICar, action: PayloadAction<string>) {
      if (!action.payload || !hexColorRegex.test(action.payload)) {
        return state;
      }
      return { ...state, color: action.payload };
    },
  },
});

export default CarPropsInputBufferSlice;
export const { clearBuffer, setSelectedCarId, setName, setColor } =
  CarPropsInputBufferSlice.actions;
