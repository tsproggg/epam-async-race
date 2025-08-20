import React, { useEffect } from "react";

import CarRace from "./GarageComponents/CarRace";
import ControlPanel from "./GarageComponents/ControlPanel";
import Header from "../components/Header";
import GarageService from "../services/GarageService";

export default function Garage(): React.ReactNode {
  useEffect(() => {
    GarageService.getGarage().then(() => {});
  }, []);

  return (
    <React.Fragment>
      <Header />
      <main>
        <ControlPanel />
        <CarRace />
      </main>
    </React.Fragment>
  );
}
