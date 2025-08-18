import React from "react";

import CarRace from "./GarageComponents/CarRace";
import ControlPanel from "./GarageComponents/ControlPanel";
import Header from "../components/Header";

export default function Garage(): React.ReactNode {
  return (
    <div id="Garage">
      <Header />
      <main className={"mb-10"}>
        <ControlPanel />
        <CarRace />
      </main>
    </div>
  );
}
