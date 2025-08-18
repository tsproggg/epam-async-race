import React, { useState } from "react";

import { useSelector } from "react-redux";

import "../garageStyles.scss";
import CarTrack from "./CarTrack";
import GarageService from "../../services/GarageService";

import type { RootState } from "../../store/store";
import type { ICar } from "../../types/ApiTypes";

export default function CarRace(): React.ReactNode {
  const carsList: ICar[] = useSelector((state: RootState) => state.garage);
  const [page, setPage] = useState<number>(0);

  return (
    <section className="pl-20 pr-20">
      <div className={"flex flex-wrap justify-around mb-15"} id="race-controls">
        <h2 className={"text-center text-2xl font-bold"}>Race track</h2>
        <div className={"flex justify-center gap-10"} id="raceButtons">
          <button
            id="raceStart"
            onClick={() => alert("placeholder")}
            type={"button"}
          >
            <span>START RACE</span>
          </button>
          <button
            id="raceReset"
            onClick={() => alert("placeholder")}
            type={"button"}
          >
            <span>RESET</span>
          </button>
          <button
            id="generateCars"
            onClick={() => GarageService.generateCars(100)}
            type={"button"}
          >
            <span>GENERATE 100 CARS</span>
          </button>
        </div>
      </div>

      <div
        className={"flex-1 flex flex-col justify-center gap-7"}
        id="raceTrack"
      >
        {carsList.map((car: ICar, i: number) => {
          if (i >= page * 7 && i < (page + 1) * 7) {
            return (
              <CarTrack
                key={car.id}
                color={car.color}
                id={car.id}
                name={car.name}
              />
            );
          }

          return null;
        })}
      </div>

      <div
        className={"mt-15 flex flex-wrap justify-center gap-15"}
        id="paginationControls"
      >
        <button
          id="prevPage"
          onClick={() => setPage(page - 1 < 0 ? 0 : page - 1)}
          type={"button"}
        >
          <span>{"<="} PREVIOUS PAGE</span>
        </button>
        <p>
          PAGE {page + 1} / {Math.ceil(carsList.length / 7)}
        </p>
        <button
          id="nextPage"
          type={"button"}
          onClick={() =>
            setPage(
              page + 1 <= Math.ceil(carsList.length / 7) - 1
                ? page + 1
                : Math.ceil(carsList.length / 7) - 1,
            )
          }
        >
          <span>NEXT PAGE {"=>"}</span>
        </button>
      </div>
    </section>
  );
}
