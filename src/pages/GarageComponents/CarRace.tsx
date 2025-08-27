import React from "react";

import { useDispatch, useSelector } from "react-redux";

import "../garageStyles.scss";
import CarTrack from "./CarTrack";
import { setGarageListPage } from "../../store/StatePersistenceSlice";

import type { RootState } from "../../store/store";
import type { ICar } from "../../types/ApiTypes";

export default function CarRace(): React.ReactNode {
  const CARS_PER_PAGE = 7;

  const carsList: ICar[] = useSelector((state: RootState) => state.garage);
  const page = useSelector(
    (state: RootState) => state.statePersistenceSlice.garageListPage,
  );
  const dispatch = useDispatch();

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
        {carsList
          .slice(page * CARS_PER_PAGE, (page + 1) * CARS_PER_PAGE)
          .map((car: ICar, i: number) => (
            <CarTrack
              key={car.id}
              color={car.color}
              id={car.id}
              name={car.name}
            />
          ))}
      </div>

      <div
        className={"mt-15 flex-wrap justify-center gap-15"}
        id="paginationControls"
        style={{ display: carsList.length === 0 ? "none" : "flex" }}
      >
        <button
          id="prevPage"
          type={"button"}
          onClick={() =>
            dispatch(setGarageListPage(page - 1 < 0 ? 0 : page - 1))
          }
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
          type={"button"}
          onClick={() =>
            dispatch(
              setGarageListPage(
                page + 1 <= Math.ceil(carsList.length / CARS_PER_PAGE) - 1
                  ? page + 1
                  : Math.ceil(carsList.length / CARS_PER_PAGE) - 1,
              ),
            )
          }
        >
          <span>NEXT PAGE {"=>"}</span>
        </button>
      </div>
    </section>
  );
}
