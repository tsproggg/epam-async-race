import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

interface INotification {
  message: string | null;
  onCloseHandler: () => void;
}
const initialState: INotification = { message: null, onCloseHandler: () => {} };

const NotificationSlice = createSlice({
  name: "NotificationSlice",
  initialState,
  reducers: {
    showNotification: (
      _: INotification,
      action: PayloadAction<INotification>,
    ) => action.payload,
    clearNotification: (_: INotification, __: PayloadAction) => initialState,
  },
});

export default NotificationSlice;
export const { showNotification, clearNotification } =
  NotificationSlice.actions;
