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
import { setIsOngoing } from "../../store/RaceStateSlice";
import "../garageStyles.scss";
import createCarAnimation from "./createCarAnimation";
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
  const isRaceOngoing: boolean = useSelector(
    (state: RootState) => state.raceStateSlice.ongoing,
  );
  const isGlobalRace: boolean = useSelector(
    (state: RootState) => state.raceStateSlice.isGlobalRace,
  );

  const dispatch = useDispatch();

  const { name, id, color } = props;

  const selectCarHandler = () => {
    dispatch(setSelectedCarId(id));
    dispatch(setName(name));
    dispatch(setColor(color));
  };

  const stopCarHandler = useCallback(() => {
    carAnimationRef.current?.cancel();
    carAnimationRef.current = null;

    if (carRef.current) {
      carRef.current.style.left = "0px";
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    dispatch(setIsOngoing({ ongoing: false, isGlobalRace: false }));
    EngineService.stopEngine(id);
  }, [dispatch, id]);

  const startCarHandler = async (): Promise<void> => {
    if (!carRef.current || !trackRef.current) return;

    dispatch(setIsOngoing({ ongoing: true, isGlobalRace: false }));
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
      carAnimationRef.current?.play();
      const startTimeMs = Date.now();

      const success = await EngineService.drive(
        id,
        abortControllerRef.current.signal,
      );

      const raceTime = Date.now() - startTimeMs;

      if (!success) {
        carAnimationRef.current?.pause();
        notify("Sorry, the car broke down :(", stopCarHandler);
      } else {
        notify(
          `The car reached finish point in ${(raceTime / 1000).toFixed(3)} seconds`,
          stopCarHandler,
        );
      }
    } catch (e) {
      carAnimationRef.current?.pause();
      if (e instanceof Error && e.name === "AbortError") {
        notify("Race was stopped", stopCarHandler);
      } else {
        notify("Sorry, the car broke down :(", stopCarHandler);
      }
    } finally {
      EngineService.stopEngine(id);
      abortControllerRef.current = null;

      dispatch(setIsOngoing({ ongoing: false, isGlobalRace: false }));
    }
  };

  useEffect(() => {
    setIsSelected(selectedCarId === id);
  }, [selectedCarId, id]);

  // TODO: Handle race states before sending deletion requests
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
            onClick={startCarHandler}
            type="button"
          >
            <span>START</span>
          </button>
          <button
            disabled={(isRaceOngoing && isGlobalRace) || !isRaceOngoing}
            id="stop"
            onClick={stopCarHandler}
            type="button"
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
