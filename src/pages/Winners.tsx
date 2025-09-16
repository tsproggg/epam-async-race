import React, { useEffect } from "react";

import { useSelector } from "react-redux";

import WinnersTable from "./WinnersComponents/WinnersTable";
import Header from "../components/Header";
import GarageService from "../services/GarageService";
import WinnersService from "../services/WinnersService";

import type { RootState } from "../store/store";

export default function Winners(): React.ReactNode {
  const winnersListLength: number = useSelector(
    (state: RootState) => state.winners.length,
  );

  useEffect(() => {
    GarageService.getGarage().then(() => {});
    WinnersService.getWinners().then(() => {});
  }, []);

  return (
    <React.Fragment>
      <Header />
      <main>
        {winnersListLength === 0 ? (
          <h2 className="mt-20 text-center text-xl">No winners yet</h2>
        ) : (
          <WinnersTable />
        )}
      </main>
    </React.Fragment>
  );
}
