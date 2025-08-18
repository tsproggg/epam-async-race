import { createSlice } from "@reduxjs/toolkit";

import binarySearch from "../utils/binarySearch";

import type { Draft, PayloadAction } from "@reduxjs/toolkit";

import type { IndexedObject } from "../types/IndexedObject";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function sliceFactory<T extends IndexedObject>(
  name: string,
  initialState: T[],
) {
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      setItems(_, action: PayloadAction<T[]>) {
        return action.payload.sort((a: T, b: T) => a.id - b.id);
      },

      clearItems(_, __: PayloadAction<null>) {
        return [];
      },

      addItem(state: Draft<T[]>, action: PayloadAction<T>): T[] {
        if (state.length === 0) return [action.payload];

        const additionId = binarySearch<T>(action.payload.id, state as T[]);

        // since object is null => id is free
        if (additionId && additionId.object === null) {
          return [
            ...state.slice(0, additionId.index),
            action.payload as Draft<T>,
            ...state.slice(additionId.index),
          ] as T[];
        }

        // requested id is already busy, (obj as T) was returned
        const payload = { ...action.payload };
        payload.id = state[state.length - 1].id + 1;

        return [...state, payload] as T[];
      },

      updateItem(state: Draft<T[]>, action: PayloadAction<T>): T[] {
        const objectToUpdate = binarySearch<T>(action.payload.id, state as T[]);

        // object doesn't exist
        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (objectToUpdate === null || objectToUpdate.object === null) {
          return state as T[];
        }

        return [
          ...state.slice(0, objectToUpdate.index),
          action.payload as Draft<T>,
          ...state.slice(objectToUpdate.index + 1),
        ] as T[];
      },

      removeItem(state: Draft<T[]>, action: PayloadAction<number>): T[] {
        const objectToRemove = binarySearch<T>(action.payload, state as T[]);

        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
        if (objectToRemove === null || objectToRemove.object === null) {
          return state as T[];
        }

        return [
          ...state.slice(0, objectToRemove.index),
          ...state.slice(objectToRemove.index + 1),
        ] as T[];
      },
    },
  });

  return [slice, { ...slice.actions }] as const;
}
