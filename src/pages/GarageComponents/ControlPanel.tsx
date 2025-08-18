import React from "react";

import { useSelector } from "react-redux";

import type { RootState } from "../../store/store";

export default function ControlPanel(): React.ReactNode {
  const carsAmount: number = useSelector(
    (state: RootState) => state.garage.length,
  );

  // TODO: Add color picker
  return (
    <section
      className={"my-15 pb-15 border-b flex justify-around flex-wrap"}
      id="GarageControlPanel"
    >
      <div
        className={"flex justify-center items-center flex-wrap gap-10"}
        id="controlPanel"
      >
        <input
          className={"border-b-1"}
          id={"carNameInput"}
          placeholder={"Enter car name..."}
          type="text"
        />
        <p id={"colorPickerPlaceholder"}>CP</p>
        <button id="addCar" type={"button"}>
          <span>Add new car</span>
        </button>
        <button id="updateCar" type={"button"}>
          <span>Update selected car</span>
        </button>
      </div>
      <h3 className={"text-xl"}>Cars total: {carsAmount}</h3>
    </section>
  );
}
