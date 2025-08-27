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
