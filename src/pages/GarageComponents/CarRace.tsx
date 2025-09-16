import React, { useCallback, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import "../garageStyles.scss";
import CarTrack from "./CarTrack";
import EngineService from "../../services/EngineService";
import GarageService from "../../services/GarageService";
import WinnersService from "../../services/WinnersService";
import { setIsOngoing } from "../../store/RaceStateSlice";
import { setGarageListPage } from "../../store/StatePersistenceSlice";
import { CARS_PER_PAGE } from "../../types/GlobalConst";
import calculateCarRaceTime from "../../utils/calculateCarRaceTime";
import { notify } from "../../utils/NotificationManager";

import type { RootState } from "../../store/store";
import type { ICar } from "../../types/ApiTypes";
import type { IGlobalRaceCarStats } from "../../types/Interfaces";
import type AnimationController from "../../utils/AnimationController";

export default function CarRace(): React.ReactNode {
  const carsList: ICar[] = useSelector((state: RootState) => state.garage);
  const page = useSelector(
    (state: RootState) => state.statePersistenceSlice.garageListPage,
  );

  const abortController = useRef<AbortController | null>(null);
  const trackAnimRefs = useRef<Record<number, AnimationController>>({});

  const {
    ongoing: isRaceOngoing,
    isGlobalRace,
    racingCarId,
  } = useSelector((state: RootState) => state.raceStateSlice);

  const dispatch = useDispatch();

  const resetAnimations = (): void => {
    Object.values(trackAnimRefs.current).forEach((anim) => {
      if (anim) {
        anim.resetAnimation();
      }
    });
  };

  const driveAllCars = async (
    carIds: number[],
    abortSignal: AbortSignal,
  ): Promise<IGlobalRaceCarStats | null> => {
    let winner: IGlobalRaceCarStats | null = null;
    await Promise.all(
      carIds.map(async (id) => {
        const raceStats = await calculateCarRaceTime(id, abortSignal);

        if (!winner && raceStats.hasFinished) {
          winner = raceStats;
        } else if (
          winner &&
          raceStats.hasFinished &&
          raceStats.time < winner.time
        ) {
          winner = raceStats;
        }
      }),
    );

    return winner;
  };

  const endRace = useCallback(async () => {
    await EngineService.stopAllEngines(
      carsList
        .slice(page * CARS_PER_PAGE, (page + 1) * CARS_PER_PAGE)
        .map((car: ICar) => car.id),
    );

    if (abortController.current) {
      abortController.current.abort();
      abortController.current = null;
    }

    Object.values(trackAnimRefs.current).forEach((anim) => {
      anim.pauseAnimation();
    });

    dispatch(setIsOngoing({ ongoing: false, isGlobalRace, racingCarId }));
  }, [carsList, isGlobalRace, racingCarId, page, dispatch]);

  const startRaceHandler = async () => {
    dispatch(
      setIsOngoing({ ongoing: true, isGlobalRace: true, racingCarId: -1 }),
    );

    abortController.current = new AbortController();
    resetAnimations();

    const racingCars: number[] = carsList
      .filter(
        (_, index) =>
          index >= page * CARS_PER_PAGE && index < (page + 1) * CARS_PER_PAGE,
      )
      .map((car: ICar) => car.id);

    const animTimes = await EngineService.startAllEngines(
      racingCars,
      abortController.current.signal,
    );

    Object.entries(animTimes).forEach(([id, animTime]) => {
      trackAnimRefs.current[parseInt(id, 10)].createAnimation(animTime);
    });

    Object.values(trackAnimRefs.current).forEach((anim) => {
      anim.playAnimation();
    });

    try {
      const winner: IGlobalRaceCarStats | null = await driveAllCars(
        racingCars,
        abortController.current.signal,
      );

      if (winner) {
        await WinnersService.addWin(winner.id, winner.time);

        const wCar: ICar | undefined = carsList.find((c) => c.id === winner.id);
        notify(
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
      await endRace();
    }
  };

  useEffect(() => {
    trackAnimRefs.current = {};
  }, [page]);

  return (
    <section className="pl-20 pr-20">
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
            id="raceReset"
            type="button"
            onClick={async () => {
              if (!isRaceOngoing) {
                resetAnimations();
                return;
              }

              if (isGlobalRace) {
                notify("Global race was aborted");
              }

              await endRace();
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
      <div>
        <div
          className="h-60 my-25 text-xl text-center"
          style={{ display: carsList.length === 0 ? "block" : "none" }}
        >
          <h3>No cars added</h3>
        </div>
        <div
          className="flex-1 flex-col justify-center gap-7"
          id="raceTrack"
          style={{ display: carsList.length === 0 ? "none" : "flex" }}
        >
          {carsList
            .slice(page * CARS_PER_PAGE, (page + 1) * CARS_PER_PAGE)
            .map((car: ICar) => (
              <CarTrack
                key={car.id}
                ref={(element: AnimationController) => {
                  trackAnimRefs.current[car.id] = element;
                }}
                color={car.color}
                id={car.id}
                name={car.name}
              />
            ))}
        </div>

        <div
          className="mt-15 flex-wrap justify-center gap-15"
          id="paginationControls"
          style={{ display: carsList.length === 0 ? "none" : "flex" }}
        >
          <button
            id="prevPage"
            type="button"
            onClick={() => {
              dispatch(setGarageListPage(page - 1 < 0 ? 0 : page - 1));
            }}
          >
            <span>{"<="} PREVIOUS PAGE</span>
          </button>
          <p>
            PAGE{" "}
            {page + 1 <= Math.ceil(carsList.length / CARS_PER_PAGE)
              ? page + 1
              : Math.ceil(carsList.length / CARS_PER_PAGE)}{" "}
            / {Math.ceil(carsList.length / CARS_PER_PAGE)}
          </p>
          <button
            id="nextPage"
            type="button"
            onClick={() => {
              dispatch(
                setGarageListPage(
                  page + 1 <= Math.ceil(carsList.length / CARS_PER_PAGE) - 1
                    ? page + 1
                    : Math.ceil(carsList.length / CARS_PER_PAGE) - 1,
                ),
              );
            }}
          >
            <span>NEXT PAGE {"=>"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
