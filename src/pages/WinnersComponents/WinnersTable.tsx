import React, { useState } from "react";

import { useSelector } from "react-redux";

import WinnerRow from "./WinnerRow";

import type { RootState } from "../../store/store";
import type { ICar, IWinner } from "../../types/ApiTypes";

export default function WinnersTable(): React.ReactNode {
  const winnersList: IWinner[] = useSelector(
    (state: RootState) => state.winners,
  );
  const carsList: ICar[] = useSelector((state: RootState) => state.garage);
  const [page, setPage] = useState<number>(0);

  return (
    <section id="WinnersTable">
      <table className={"w-8/10 mx-auto my-15 text-center"}>
        <thead>
          <tr className={"border-b [&>th]:not-last-of-type:border-r"}>
            <th>ID</th>
            <th>Icon</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Best time</th>
          </tr>
        </thead>
        <tbody>
          {winnersList.map((winner, i) => {
            if (i >= page * 10 && i < (page + 1) * 10) {
              const car: ICar | undefined = carsList.find(
                (e) => e.id === winner.id,
              );

              if (car) {
                return (
                  <WinnerRow
                    key={winner.id}
                    color={car.color}
                    id={winner.id}
                    name={car.name}
                    time={winner.time}
                    wins={winner.wins}
                  />
                );
              }
            }

            return null;
          })}
        </tbody>
      </table>
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
          {page + 1 <= Math.ceil(winnersList.length / 10)
            ? page + 1
            : Math.ceil(winnersList.length / 10)}{" "}
          / {Math.ceil(winnersList.length / 10)}
        </p>
        <button
          id="nextPage"
          type={"button"}
          onClick={() =>
            setPage(
              page + 1 <= Math.ceil(winnersList.length / 10) - 1
                ? page + 1
                : Math.ceil(winnersList.length / 10) - 1,
            )
          }
        >
          <span>NEXT PAGE {"=>"}</span>
        </button>
      </div>
    </section>
  );
}
