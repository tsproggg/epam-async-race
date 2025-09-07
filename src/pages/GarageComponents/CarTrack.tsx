import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CarIcon from "./CarIcon";
import EngineService from "../../services/EngineService";
import GarageService from "../../services/GarageService";
import {
  setColor,
  setName,
  setSelectedCarId,
} from "../../store/CarPropsInputBufferSlice";
import {
  pauseAnimations,
  resetAnimations,
  setIsOngoing,
} from "../../store/RaceStateSlice";
import "../garageStyles.scss";
import createCarAnimation from "./createCarAnimation";
import calculateCarRaceTime from "../../utils/calculateCarRaceTime";
import { notify } from "../../utils/NotificationManager";

import type { RootState } from "../../store/store";
import type { ICar } from "../../types/ApiTypes";

export default function CarTrack(props: ICar): React.ReactNode {
  const carRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const carAnimationRef = useRef<Animation | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isSelected, setIsSelected] = useState<boolean>(false);

  const selectedCarId: number = useSelector(
    (state: RootState) => state.carPropsInputBufferSlice.id,
  );

  const {
    ongoing: isRaceOngoing,
    isGlobalRace,
    racingCarId,
    pauseAnimations: isAnimationPaused,
    resetAnimations: isAnimationReset,
  } = useSelector((state: RootState) => state.raceStateSlice);

  const dispatch = useDispatch();

  const { name, id, color } = props;

  const selectCarHandler = () => {
    dispatch(setSelectedCarId(id));
    dispatch(setName(name));
    dispatch(setColor(color));
  };

  const stopCarHandler = useCallback(() => {
    if (!isGlobalRace && racingCarId !== id) return;

    if (!isGlobalRace) {
      dispatch(resetAnimations(true));
    }

    if (carRef.current) {
      carRef.current.style.left = "0px";
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    EngineService.stopEngine(id);

    if (!isGlobalRace) {
      dispatch(
        setIsOngoing({ ongoing: false, isGlobalRace: false, racingCarId: -1 }),
      );
    }
  }, [id, isGlobalRace, racingCarId, dispatch]);

  const startCarHandler = useCallback(async (): Promise<void> => {
    if (!isGlobalRace && racingCarId !== id) return;
    if (!carRef.current || !trackRef.current) return;

    abortControllerRef.current = new AbortController();
    try {
      const animDuration = await EngineService.startEngine(
        id,
        abortControllerRef.current.signal,
      );

      carAnimationRef.current = createCarAnimation(
        carRef.current,
        trackRef.current,
        animDuration,
      );
      carAnimationRef.current.play();

      if (isGlobalRace) return;

      const { hasFinished: success, time: raceTime } =
        await calculateCarRaceTime(id, abortControllerRef.current.signal);

      if (!success) {
        dispatch(pauseAnimations(true));

        notify("Sorry, the car broke down :(");
      } else {
        notify(
          `The car reached finish point in ${(raceTime / 1000).toFixed(3)} seconds`,
        );
      }
    } catch (e) {
      dispatch(pauseAnimations(true));

      if (e instanceof Error && e.name === "AbortError" && !isGlobalRace) {
        notify("Race was stopped");
      } else {
        notify("Sorry, the car broke down :(");
      }
    } finally {
      if (!isGlobalRace) {
        EngineService.stopEngine(id);
      }
      abortControllerRef.current = null;

      stopCarHandler();
    }
  }, [id, isGlobalRace, racingCarId, dispatch, stopCarHandler]);

  useEffect(() => {
    setIsSelected(selectedCarId === id);
  }, [selectedCarId, id]);

  useEffect(() => {
    if (isRaceOngoing) {
      startCarHandler();
    } else {
      stopCarHandler();
    }
  }, [isRaceOngoing, isGlobalRace, startCarHandler, stopCarHandler]);

  useEffect(() => {
    if (isAnimationPaused) {
      carAnimationRef.current?.pause();
      dispatch(pauseAnimations(false));
    }
  }, [isAnimationPaused, dispatch]);

  useEffect(() => {
    if (isAnimationReset) {
      carAnimationRef.current?.cancel();
      carAnimationRef.current = null;
      dispatch(resetAnimations(false));
    }
  }, [isAnimationReset, dispatch]);

  // TODO: Make animation starting instantly without /start request overhead or use an alternative UI sign
  return (
    <section
      className="relative flex flex-start flex-1 flex-col sm:flex-row border border-black rounded-3xl px-15 py-5"
      id="carTrack"
    >
      <div className="w-auto sm:w-160 text-center" id="controls">
        <h4 className="mb-5">
          {name}
          {isSelected ? " - Selected" : ""}
        </h4>
        <div
          className="flex justify-center sm:justify-around flex-wrap gap-10 sm:gap-5"
          id="buttons"
        >
          <button
            disabled={isRaceOngoing}
            id="select"
            onClick={selectCarHandler}
            type="button"
          >
            <span>SELECT</span>
          </button>
          <button
            disabled={isRaceOngoing}
            id="delete"
            onClick={() => GarageService.deleteCar(id)}
            type="button"
          >
            <span>DELETE</span>
          </button>
          <button
            disabled={isRaceOngoing}
            id="start"
            type="button"
            onClick={() => {
              dispatch(
                setIsOngoing({
                  ongoing: true,
                  isGlobalRace: false,
                  racingCarId: id,
                }),
              );
            }}
          >
            <span>START</span>
          </button>
          <button
            id="stop"
            type="button"
            disabled={
              (isRaceOngoing && isGlobalRace) ||
              !isRaceOngoing ||
              (isRaceOngoing && !isGlobalRace && racingCarId !== id)
            }
            onClick={() => {
              dispatch(
                setIsOngoing({
                  ongoing: false,
                  isGlobalRace: false,
                  racingCarId: id,
                }),
              );
            }}
          >
            <span>STOP</span>
          </button>
        </div>
      </div>
      <div ref={trackRef} className="flex-1 ml-5" id="track">
        <div ref={carRef}>
          <CarIcon color={color} />
        </div>
      </div>
    </section>
  );
}
