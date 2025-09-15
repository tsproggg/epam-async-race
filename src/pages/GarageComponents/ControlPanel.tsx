import React from "react";

import { useDispatch, useSelector } from "react-redux";

import ColorPicker from "../../components/ColorPicker";
import GarageService from "../../services/GarageService";
import { setName } from "../../store/CarPropsInputBufferSlice";
import { notify } from "../../utils/NotificationManager";

import type { RootState } from "../../store/store";
import type { ICar } from "../../types/ApiTypes";

export default function ControlPanel(): React.ReactNode {
  const carsList: ICar[] = useSelector((state: RootState) => state.garage);
  const carPropsName: string = useSelector(
    (state: RootState) => state.carPropsInputBufferSlice.name,
  );
  const isRaceOngoing = useSelector(
    (state: RootState) => state.raceStateSlice.ongoing,
  );

  const dispatch = useDispatch();

  return (
    <section
      className="my-15 pb-15 border-b flex justify-around flex-wrap"
      id="GarageControlPanel"
    >
      <div
        className="flex justify-center items-center flex-wrap gap-10"
        id="controlPanel"
      >
        <input
          className="border-b-1"
          id="carNameInput"
          onChange={(e) => dispatch(setName(e.target.value))}
          placeholder="Enter car name..."
          type="text"
          value={carPropsName}
        />
        <ColorPicker />
        <button
          disabled={isRaceOngoing}
          id="addCar"
          type="button"
          onClick={() => {
            GarageService.addCarFromStore().catch(() => {
              // no need to mention color since it can't be invalid
              notify(
                `Car name should be in range of ${GarageService.MIN_CAR_NAME_LENGTH} - ${GarageService.MAX_CAR_NAME_LENGTH} symbols`,
              );
            });
          }}
        >
          <span>Add new car</span>
        </button>
        <button
          disabled={isRaceOngoing}
          id="updateCar"
          type="button"
          onClick={() => {
            GarageService.updateCar().catch(() => {
              // no need to mention color since it can't be invalid
              notify(
                `Car name should be in range of ${GarageService.MIN_CAR_NAME_LENGTH} - ${GarageService.MAX_CAR_NAME_LENGTH} symbols`,
              );
            });
          }}
        >
          <span>Update selected car</span>
        </button>
      </div>
      <h3 className="text-xl">Cars total: {carsList.length}</h3>
    </section>
  );
}
