import { useDispatch, useSelector } from "react-redux";

import AutoPopup from "../components/AutoPopup";
import {
  clearNotification,
  showNotification,
} from "../store/NotificationSlice";
import store from "../store/store";

import type React from "react";

import type { RootState } from "../store/store";

export default function NotificationManager(): React.ReactNode {
  const notificationMessage = useSelector(
    (state: RootState) => state.notificationSlice.message,
  );
  const notificationCloseCallback = useSelector(
    (state: RootState) => state.notificationSlice.onCloseHandler,
  );
  const dispatch = useDispatch();

  if (!notificationMessage) return null;

  return (
    <AutoPopup
      popupName={notificationMessage ?? ""}
      onCloseHandler={() => {
        notificationCloseCallback();
        dispatch(clearNotification());
      }}
    />
  );
}

export function notify(
  message: string,
  onCloseHandler: () => void = () => {},
): void {
  store.dispatch(
    showNotification({
      message,
      onCloseHandler,
    }),
  );
}
