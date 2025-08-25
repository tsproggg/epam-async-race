import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import CarIcon from "./CarIcon";
import AutoPopup from "../../components/AutoPopup";
import EngineService from "../../services/EngineService";
import GarageService from "../../services/GarageService";
import {
  setColor,
  setName,
  setSelectedCarId,
} from "../../store/CarPropsInputBufferSlice";
import {
  clearStats,
  setBestTime,
  setIsOngoing,
} from "../../store/RaceStatsSlice";
import "../garageStyles.scss";

import type { RootState } from "../../store/store";
import type { ICar } from "../../types/ApiTypes";

export default function CarTrack(props: ICar): React.ReactNode {
  const carRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const carAnimationRef = useRef<Animation | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null,
  );
  const [popupName, setPopupName] = useState<string | null>(null);

  const selectedCarId: number = useSelector(
    (state: RootState) => state.carPropsInputBufferSlice.id,
  );
  const isRaceOngoing: boolean = useSelector(
    (state: RootState) => state.raceStatsSlice.ongoing,
  );
  const isGlobalRace: boolean = useSelector(
    (state: RootState) => state.raceStatsSlice.isGlobalRace,
  );

  const dispatch = useDispatch();

  const { name, id, color } = props;
  const animateCar = (duration: number): Animation | null => {
    if (!carRef.current || !trackRef.current) return null;

    carRef.current.style.position = "absolute";
    return carRef.current.animate(
      [
        {
          left: 0,
        },
        {
          left: `${trackRef.current.offsetWidth - carRef.current.offsetWidth}px`,
        },
      ],
      {
        duration,
        fill: "forwards",
        easing: "ease-in-out",
        iterations: 1,
      },
    );
  };

  const selectCarHandler = () => {
    dispatch(setSelectedCarId(id));
    dispatch(setName(name));
    dispatch(setColor(color));
  };

  const startCarHandler = async (): Promise<void> => {
    try {
      dispatch(setIsOngoing({ ongoing: true, isGlobalRace: false }));
      abortControllerRef.current = new AbortController();
      const startTimeMs = Date.now();

      const animDuration = await EngineService.startEngine(
        id,
        abortControllerRef.current.signal,
      );
      carAnimationRef.current = animateCar(animDuration);

      const success = await EngineService.drive(
        id,
        abortControllerRef.current.signal,
      );
      const raceTime = Date.now() - startTimeMs;

      if (!success) {
        carAnimationRef.current?.pause();
        setNotificationMessage("Sorry, car broke down :(");
      } else {
        dispatch(
          setBestTime({
            ongoing: false,
            isGlobalRace: false,
            winnerId: id,
            bestTime: raceTime,
          }),
        );

        setNotificationMessage(
          `The car reached finish point in ${raceTime / 1000} seconds`,
        );
      }
    } catch (e) {
      carAnimationRef.current?.pause();

      if (e instanceof Error && e.name === "AbortError") {
        setNotificationMessage("Race was stopped");
      } else {
        setNotificationMessage("Sorry, car broke down :(");
      }
    } finally {
      EngineService.stopEngine(id);
      abortControllerRef.current = null;

      dispatch(setIsOngoing({ ongoing: false, isGlobalRace: false }));
    }
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

    dispatch(clearStats());
    EngineService.stopEngine(id);
  }, [dispatch, id]);

  useEffect(() => {
    setIsSelected(selectedCarId === id);
  }, [selectedCarId, id]);

  useEffect(() => {
    if (notificationMessage) {
      setPopupName(notificationMessage);
      setNotificationMessage(null);
    }
  }, [notificationMessage]);

  // TODO: Handle race states before sending deletion requests
  // TODO: Make animation starting instantly without /start request overhead or an alternative UI sign
  return (
    <React.Fragment>
      <section
        id={"carTrack"}
        className={
          "flex flex-start flex-1 flex-col sm:flex-row border border-black rounded-3xl px-15 py-5"
        }
      >
        <div className={"w-auto sm:w-160 text-center"} id="controls">
          <h4 className={"mb-5"}>
            {name}
            {isSelected ? " - Selected" : ""}
          </h4>
          <div
            id="buttons"
            className={
              "flex justify-center sm:justify-around flex-wrap gap-10 sm:gap-5"
            }
          >
            <button
              disabled={isRaceOngoing}
              id="select"
              onClick={selectCarHandler}
              type={"button"}
            >
              <span>SELECT</span>
            </button>
            <button
              disabled={isRaceOngoing}
              id="delete"
              onClick={() => GarageService.deleteCar(id)}
              type={"button"}
            >
              <span>DELETE</span>
            </button>
            <button
              disabled={isRaceOngoing}
              id="start"
              onClick={startCarHandler}
              type={"button"}
            >
              <span>START</span>
            </button>
            <button
              disabled={(isRaceOngoing && isGlobalRace) || !isRaceOngoing}
              id="stop"
              onClick={stopCarHandler}
              type={"button"}
            >
              <span>STOP</span>
            </button>
          </div>
        </div>
        <div ref={trackRef} className={"flex-1 ml-5"} id="track">
          <div ref={carRef}>
            <CarIcon color={color} />
          </div>
        </div>
      </section>
      {popupName ? (
        <AutoPopup
          popupName={popupName}
          onCloseHandler={() => {
            stopCarHandler();
            setPopupName(null);
          }}
        />
      ) : null}
    </React.Fragment>
  );
}
