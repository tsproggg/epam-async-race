import React from "react";

import { useDispatch, useSelector } from "react-redux";

import ColorPicker from "../../components/ColorPicker";
import GarageService from "../../services/GarageService";
import { setName } from "../../store/CarPropsInputBufferSlice";

import type { RootState } from "../../store/store";

export default function ControlPanel(): React.ReactNode {
  const carsAmount: number = useSelector(
    (state: RootState) => state.garage.length,
  );
  const dispatch = useDispatch();

  // TODO: Handle race states for car addition/update requests
  // TODO: GLOBAL: Add error handling popups
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
          onChange={(e) => dispatch(setName(e.target.value))}
          placeholder={"Enter car name..."}
          type="text"
        />
        <ColorPicker />
        <button
          id="addCar"
          type={"button"}
          onClick={() => {
            GarageService.addCarFromStore();
          }}
        >
          <span>Add new car</span>
        </button>
        <button
          id="updateCar"
          type={"button"}
          onClick={() => {
            GarageService.updateCar();
          }}
        >
          <span>Update selected car</span>
        </button>
      </div>
      <h3 className={"text-xl"}>Cars total: {carsAmount}</h3>
    </section>
  );
}
