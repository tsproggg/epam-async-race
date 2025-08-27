import React, { useState } from "react";

import { useSelector } from "react-redux";

import "../garageStyles.scss";
import CarTrack from "./CarTrack";

import type { RootState } from "../../store/store";
import type { ICar } from "../../types/ApiTypes";

export default function CarRace(): React.ReactNode {
  const carsList: ICar[] = useSelector((state: RootState) => state.garage);
  const [page, setPage] = useState<number>(0);

  // TODO: Handle race states before car generation
  return (
    <section className="pl-20 pr-20">
      <div
        className="h-60 my-25 text-xl text-center"
        style={{ display: carsList.length === 0 ? "block" : "none" }}
      >
        <h3>No cars added</h3>
      </div>
      <div
        className={"flex-1 flex-col justify-center gap-7"}
        id="raceTrack"
        style={{ display: carsList.length === 0 ? "none" : "flex" }}
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
        className={"mt-15 flex-wrap justify-center gap-15"}
        id="paginationControls"
        style={{ display: carsList.length === 0 ? "none" : "flex" }}
      >
        <button
          id="prevPage"
          onClick={() => setPage(page - 1 < 0 ? 0 : page - 1)}
          type={"button"}
        >
          <span>{"<="} PREVIOUS PAGE</span>
        </button>
        <p>
          PAGE{" "}
          {page + 1 <= Math.ceil(carsList.length / 7)
            ? page + 1
            : Math.ceil(carsList.length / 7)}{" "}
          / {Math.ceil(carsList.length / 7)}
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
