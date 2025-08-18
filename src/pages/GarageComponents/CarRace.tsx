import React from "react";

import CarTrack from "./CarTrack";
import "../garageStyles.scss";

export default function CarRace(): React.ReactNode {
  return (
    <div className="CarRace pl-20 pr-20">
      <div className={"flex flex-wrap justify-around mb-15"} id="race-controls">
        <h2 className={"text-center text-2xl font-bold"}>Race track</h2>
        <div className={"flex justify-center gap-10"} id="raceButtons">
          <button id="raceStart" type={"button"}>
            <span>START RACE</span>
          </button>
          <button id="raceReset" type={"button"}>
            <span>RESET</span>
          </button>
          <button id="generateCars" type={"button"}>
            <span>GENERATE 100 CARS</span>
          </button>
        </div>
      </div>
      <div
        className={"flex-1 flex flex-col justify-center gap-7"}
        id="raceTrack"
      >
        <CarTrack />
        <CarTrack />
        <CarTrack />
        <CarTrack />
        <CarTrack />
        <CarTrack />
        <CarTrack />
      </div>
      <div
        className={"mt-15 flex flex-wrap justify-center gap-15"}
        id="paginationControls"
      >
        <button id="prevPage" type={"button"}>
          <span>{"<="} PREVIOUS PAGE</span>
        </button>
        <p>PAGE 20 / 20</p>
        <button id="nextPage" type={"button"}>
          <span>NEXT PAGE {"=>"}</span>
        </button>
      </div>
    </div>
  );
}
