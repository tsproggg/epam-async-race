import React from "react";

import { useDispatch, useSelector } from "react-redux";

import ColorPicker from "../../components/ColorPicker";
import GarageService from "../../services/GarageService";
import { setName } from "../../store/CarPropsInputBufferSlice";
import { setIsOngoing } from "../../store/RaceStateSlice";
import { notify } from "../../utils/NotificationManager";

import type { RootState } from "../../store/store";

export default function ControlPanel(): React.ReactNode {
  const carsAmount: number = useSelector(
    (state: RootState) => state.garage.length,
  );
  const carPropsName: string = useSelector(
    (state: RootState) => state.carPropsInputBufferSlice.name,
  );

  const isRaceOngoing: boolean = useSelector(
    (state: RootState) => state.raceStateSlice.ongoing,
  );
  const isGlobalRace: boolean = useSelector(
    (state: RootState) => state.raceStateSlice.isGlobalRace,
  );

  const dispatch = useDispatch();

  const resetRaceHandler = () => {
    if (!isGlobalRace) {
      dispatch(setIsOngoing({ ongoing: false, isGlobalRace: false }));
      return;
    }

    alert("placeholder");
  };

  // TODO: GLOBAL: Add full error handling
  return (
    <section>
      <div
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
        <h3 className="text-xl">Cars total: {carsAmount}</h3>
      </div>
      <div className="flex flex-wrap justify-around mb-15" id="race-controls">
        <h2 className="text-center text-2xl font-bold">Race track</h2>
        <div className="flex justify-center gap-10" id="raceButtons">
          <button
            disabled={isRaceOngoing}
            id="raceStart"
            onClick={() => alert("placeholder")}
            type="button"
          >
            <span>START RACE</span>
          </button>
          <button
            disabled={!isRaceOngoing}
            id="raceReset"
            onClick={resetRaceHandler}
            type="button"
          >
            <span>RESET</span>
          </button>
          <button
            disabled={isRaceOngoing}
            id="generateCars"
            onClick={async () => GarageService.generateCars(100)}
            type="button"
          >
            <span>GENERATE 100 CARS</span>
          </button>
        </div>
      </div>
    </section>
  );
}
