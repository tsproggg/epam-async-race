import React from "react";

import CarIcon from "./CarIcon";

export default function ControlPanel(): React.ReactNode {
  return (
    <div id="GarageControlPanel">
      Create cars, Edit cars, Race start/end, The number of all cars in the
      garage.
      <CarIcon color={"#fa0"} />
    </div>
  );
}
