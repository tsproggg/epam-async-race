import React from "react";

import CarTrack from "./CarTrack.tsx";

export default function CarRace(): React.ReactNode {
  return (
    <div className="CarRace">
      Shows 7 cars
      <CarTrack />
      <CarTrack />
      <CarTrack />
      <CarTrack />
      <CarTrack />
      <CarTrack />
      <CarTrack />
    </div>
  );
}
