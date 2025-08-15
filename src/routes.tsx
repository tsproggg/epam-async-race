import React from "react";

import { Route, Routes } from "react-router";

import { Links } from "./Links";
import Garage from "./pages/Garage";
import Winners from "./pages/Winners";

export default function routes(): React.ReactNode {
  return (
    <Routes>
      <Route path={Links.ROOT}>
        <Route index element={<Garage />} />
        <Route element={<Winners />} path={Links.WINNERS} />
      </Route>
    </Routes>
  );
}
