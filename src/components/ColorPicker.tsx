import React from "react";

import { HexColorPicker } from "react-colorful";
import { useDispatch, useSelector } from "react-redux";

import Popup from "./Popup";
import { setColor } from "../store/CarPropsInputBufferSlice";

import type { RootState } from "../store/store";

export default function ColorPicker(): React.ReactNode {
  const color: string = useSelector(
    (state: RootState) => state.carPropsInputBufferSlice.color,
  );
  const dispatch = useDispatch();

  return (
    <Popup
      popupName={"Color picker"}
      openPopupComponent={
        <div
          className="grow-1 w-30 h-30 rounded-2xl"
          id={"coloredBox"}
          style={{ backgroundColor: color }}
        />
      }
      popupChildren={
        <div className={"flex justify-center gap-15"} id={"colorPicker"}>
          <HexColorPicker
            color={color}
            onChange={(newColor: string) => {
              dispatch(setColor(newColor));
            }}
          />
          <div
            className="grow-1 w-30 rounded-2xl"
            id={"coloredBox"}
            style={{ backgroundColor: color }}
          />
        </div>
      }
      position={{
        x: 0,
        y: 0,
        center: true,
      }}
    />
  );
}
