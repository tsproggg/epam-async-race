import React, { useEffect } from "react";

import WinnersTable from "./WinnersComponents/WinnersTable";
import Header from "../components/Header";
import GarageService from "../services/GarageService";
import WinnersService from "../services/WinnersService";

export default function Winners(): React.ReactNode {
  useEffect(() => {
    GarageService.getGarage().then(() => {});
    WinnersService.getWinners().then(() => {});
  }, []);

  return (
    <React.Fragment>
      <Header />
      <main>
        <WinnersTable />
      </main>
    </React.Fragment>
  );
}
