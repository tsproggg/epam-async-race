import React, { useCallback, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import ColorPicker from "../../components/ColorPicker";
import EngineService from "../../services/EngineService";
import GarageService from "../../services/GarageService";
import WinnersService from "../../services/WinnersService";
import { setName } from "../../store/CarPropsInputBufferSlice";
import { resetAnimations, setIsOngoing } from "../../store/RaceStateSlice";
import { CARS_PER_PAGE } from "../../types/GlobalConst";
import calculateCarRaceTime from "../../utils/calculateCarRaceTime";
import { notify } from "../../utils/NotificationManager";

import type { RootState } from "../../store/store";
import type { ICar } from "../../types/ApiTypes";
import type { IGlobalRaceCarStats } from "../../types/Interfaces";

export default function ControlPanel(): React.ReactNode {
  const abortController = useRef<AbortController | null>(null);

  const carsList: ICar[] = useSelector((state: RootState) => state.garage);
  const carPropsName: string = useSelector(
    (state: RootState) => state.carPropsInputBufferSlice.name,
  );
  const page: number = useSelector(
    (state: RootState) => state.statePersistenceSlice.garageListPage,
  );

  const {
    ongoing: isRaceOngoing,
    isGlobalRace,
    racingCarId,
  } = useSelector((state: RootState) => state.raceStateSlice);

  const dispatch = useDispatch();

  const endRace = useCallback(() => {
    carsList.forEach((car, index) => {
      if (index >= page * CARS_PER_PAGE && index < (page + 1) * CARS_PER_PAGE) {
        EngineService.stopEngine(car.id);
      }
    });

    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }

    dispatch(resetAnimations(true));
    dispatch(setIsOngoing({ ongoing: false, isGlobalRace, racingCarId }));
  }, [carsList, isGlobalRace, racingCarId, page, dispatch]);

  const startRaceHandler = async () => {
    dispatch(
      setIsOngoing({ ongoing: true, isGlobalRace: true, racingCarId: -1 }),
    );

    abortController.current = new AbortController();

    const racingCarPromises: Promise<IGlobalRaceCarStats>[] = carsList
      .filter(
        (_, index) =>
          index >= page * CARS_PER_PAGE && index < (page + 1) * CARS_PER_PAGE,
      )
      .map(async (car) =>
        EngineService.startEngine(
          car.id,
          // @ts-expect-error abortController is non-null
          abortController.current.signal,
        ).then(async () => {
          const raceStats = await calculateCarRaceTime(
            car.id,

            // @ts-expect-error abortController is non-null
            abortController.current.signal,
          );

          if (!raceStats.hasFinished) {
            await Promise.reject(new Error("Car broke down"));
          }
          return raceStats;
        }),
      );

    try {
      const results: PromiseSettledResult<IGlobalRaceCarStats>[] =
        await Promise.allSettled(racingCarPromises);

      let winner: IGlobalRaceCarStats | null = null;
      results.forEach((res) => {
        if (res.status === "fulfilled") {
          if (winner === null || winner.time > res.value.time) {
            winner = res.value;
          }
        }
      });

      if (winner) {
        // @ts-expect-error winner is not never
        await WinnersService.addWin(winner.id, winner.time);

        // @ts-expect-error winner is not null
        const wCar: ICar | undefined = carsList.find((c) => c.id === winner.id);
        notify(
          // @ts-expect-error winner is not never
          `The ${wCar?.name ?? "unknown car"} won the race in ${(winner.time / 1000).toFixed(3)} seconds!`,
        );
      } else {
        notify(
          "The race was either aborted, or no car finished successfully :(",
        );
      }
    } catch (e) {
      notify("No car finished successfully :(");
    } finally {
      endRace();
    }
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
        <h3 className="text-xl">Cars total: {carsList.length}</h3>
      </div>
      <div className="flex flex-wrap justify-around mb-15" id="race-controls">
        <h2 className="text-center text-2xl font-bold">Race track</h2>
        <div className="flex justify-center gap-10" id="raceButtons">
          <button
            disabled={isRaceOngoing}
            id="raceStart"
            onClick={startRaceHandler}
            type="button"
          >
            <span>
              {isRaceOngoing && isGlobalRace
                ? "Cars are racing..."
                : `START RACE`}
            </span>
          </button>
          <button
            disabled={!isRaceOngoing}
            id="raceReset"
            type="button"
            onClick={() => {
              if (isGlobalRace) {
                notify("Global race was aborted");
              }

              endRace();
            }}
          >
            <span>{isRaceOngoing ? "STOP RACE" : "RESET"}</span>
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
