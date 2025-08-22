import React, { useState } from "react";

import { HexColorPicker } from "react-colorful";

import Popup from "./Popup";

export default function ColorPicker(): React.ReactNode {
  const [color, setColor] = useState<string>("#000000");

  return (
    <Popup
      openPopupComponent={<span>Open Color Picker</span>}
      popupName={"Color picker"}
      popupChildren={
        <React.Fragment>
          <p>Color: {color}</p>
          <HexColorPicker onChange={(e) => setColor(e)} />
        </React.Fragment>
      }
      position={{
        x: 0,
        y: 0,
        center: true,
      }}
    />
  );
}
