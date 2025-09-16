import React, { useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";

import WinnerRow from "./WinnerRow";
import WinnersService from "../../services/WinnersService.ts";
import {
  setWinnersListPage,
  setWinnersSorting,
} from "../../store/StatePersistenceSlice";
import { WinnersSlice } from "../../store/store";
import {
  WINNERS_PER_PAGE as ROWS_PER_PAGE,
  WinnersSorting,
} from "../../types/GlobalConst";

import type { RootState } from "../../store/store";
import type { ICar, IWinner } from "../../types/ApiTypes";

export default function WinnersTable(): React.ReactNode {
  const page = useSelector(
    (state: RootState) => state.statePersistenceSlice.winnersListPage,
  );
  const sorting: WinnersSorting = useSelector(
    (state: RootState) => state.statePersistenceSlice.winnersSorting,
  );
  const winnersList: IWinner[] = useSelector(
    (state: RootState) => state.winners,
  );
  const carsList: ICar[] = useSelector((state: RootState) => state.garage);

  const dispatch = useDispatch();

  const winnersRenderList = useMemo(() => {
    const winnerSorted: IWinner[] = [...winnersList];
    switch (sorting) {
      case WinnersSorting.TIME_ASC:
        winnerSorted.sort((a: IWinner, b: IWinner) => a.time - b.time);
        break;
      case WinnersSorting.TIME_DESC:
        winnerSorted.sort((a: IWinner, b: IWinner) => b.time - a.time);
        break;
      case WinnersSorting.WINS_ASC:
        winnerSorted.sort((a: IWinner, b: IWinner) => a.wins - b.wins);
        break;
      case WinnersSorting.WINS_DESC:
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

  const clearLeaderboardHandler = () => {
    winnersList.forEach((el) => {
      WinnersService.removeWinner(el.id);
      dispatch(WinnersSlice.actions.clearItems());
    });
  };

  return (
    <section
      className="w-8/10 mx-auto my-20 flex flex-col justify-center items-end"
      id="WinnersTable"
    >
      <div
        className="flex justify-between items-center mb-10 w-10/10 my-10"
        id="toolbar"
      >
        <label htmlFor="sortingOptions">
          Sort by:{" "}
          <select
            className="border rounded-2xl px-5"
            id="sortingOptions"
            name="sortingOptions"
            value={sorting}
            onChange={(e) =>
              dispatch(setWinnersSorting(e.target.value as WinnersSorting))
            }
          >
            <option value={WinnersSorting.TIME_ASC}>
              Best time - ascending
            </option>
            <option value={WinnersSorting.TIME_DESC}>
              Best time - descending
            </option>
            <option value={WinnersSorting.WINS_ASC}>Wins - ascending</option>
            <option value={WinnersSorting.WINS_DESC}>Wins - descending</option>
          </select>
        </label>
        <button
          id="clearLeaderboard"
          onClick={clearLeaderboardHandler}
          type="button"
        >
          Clear leaderboard
        </button>
      </div>
      <table className="mt-20 text-center w-10/10">
        <thead>
          <tr className="border-b [&>th]:not-last-of-type:border-r">
            <th>#</th>
            <th>Icon</th>
            <th>Name</th>
            <th>Wins</th>
            <th>Best time</th>
          </tr>
        </thead>
        <tbody>
          {winnersRenderList
            .slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE)
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
        className="mt-15 w-10/10 flex-wrap justify-center gap-15"
        id="paginationControls"
        style={{ display: winnersList.length === 0 ? "none" : "flex" }}
      >
        <button
          id="prevPage"
          type="button"
          onClick={() =>
            dispatch(setWinnersListPage(page - 1 < 0 ? 0 : page - 1))
          }
        >
          <span>{"<="} PREVIOUS PAGE</span>
        </button>
        <p>
          PAGE{" "}
          {page + 1 <= Math.ceil(winnersList.length / ROWS_PER_PAGE)
            ? page + 1
            : Math.ceil(winnersList.length / ROWS_PER_PAGE)}{" "}
          / {Math.ceil(winnersList.length / ROWS_PER_PAGE)}
        </p>
        <button
          id="nextPage"
          type="button"
          onClick={() =>
            dispatch(
              setWinnersListPage(
                page + 1 <= Math.ceil(winnersList.length / ROWS_PER_PAGE) - 1
                  ? page + 1
                  : Math.ceil(winnersList.length / ROWS_PER_PAGE) - 1,
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
