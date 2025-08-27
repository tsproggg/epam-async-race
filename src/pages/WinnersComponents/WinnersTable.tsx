import React, { useMemo, useState } from "react";

import { useSelector } from "react-redux";

import WinnerRow from "./WinnerRow";

import type { RootState } from "../../store/store";
import type { ICar, IWinner } from "../../types/ApiTypes";

export default function WinnersTable(): React.ReactNode {
  const [page, setPage] = useState<number>(0);
  const [sorting, setSorting] = useState<string>("w-desc");

  const winnersList: IWinner[] = useSelector(
    (state: RootState) => state.winners,
  );
  const carsList: ICar[] = useSelector((state: RootState) => state.garage);

  const winnersRenderList = useMemo(() => {
    const winnerSorted: IWinner[] = [...winnersList];
    switch (sorting) {
      case "bt-asc":
        winnerSorted.sort((a: IWinner, b: IWinner) => a.time - b.time);
        break;
      case "bt-desc":
        winnerSorted.sort((a: IWinner, b: IWinner) => b.time - a.time);
        break;
      case "w-asc":
        winnerSorted.sort((a: IWinner, b: IWinner) => a.wins - b.wins);
        break;
      case "w-desc":
        winnerSorted.sort((a: IWinner, b: IWinner) => b.wins - a.wins);
        break;
      default:
        // Invalid values => sorting by id
        winnerSorted.sort((a: IWinner, b: IWinner) => a.id - b.id);
    }

    return winnerSorted.flatMap((el: IWinner) => {
      const car: ICar | undefined = carsList.find((c) => el.id === c.id);

      return car ? [{ ...el, ...car }] : [];
    });
  }, [sorting, winnersList, carsList]);

  return (
    <section
      className={"w-8/10 mx-auto my-20 flex flex-col justify-center items-end"}
      id="WinnersTable"
    >
      <div className="sortDropdown">
        <label htmlFor="sortingOptions">
          Sort by:{" "}
          <select
            className={"border"}
            id="sortingOptions"
            name="sortingOptions"
            onChange={(e) => setSorting(e.target.value)}
            value={sorting}
          >
            <option value="bt-asc">Best time - ascending</option>
            <option value="bt-desc">Best time - descending</option>
            <option value="w-asc">Wins - ascending</option>
            <option value="w-desc">Wins - descending</option>
          </select>
        </label>
      </div>
      <table className={"mt-20 text-center w-10/10"}>
        <thead>
          <tr className={"border-b [&>th]:not-last-of-type:border-r"}>
            <th>#</th>
            <th>Icon</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Best time</th>
          </tr>
        </thead>
        <tbody>
          {winnersRenderList
            .slice(page * 10, (page + 1) * 10)
            .map((winner, i: number) => (
              <WinnerRow
                key={winner.id}
                color={winner.color}
                id={winner.id}
                name={winner.name}
                rowNumber={i + 1}
                time={winner.time}
                wins={winner.wins}
              />
            ))}
        </tbody>
      </table>
      <div
        className={"mt-15 w-10/10 flex-wrap justify-center gap-15"}
        id="paginationControls"
        style={{ display: winnersList.length === 0 ? "none" : "flex" }}
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
