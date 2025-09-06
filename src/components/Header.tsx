import React from "react";

import { Links } from "../Links";
import NavLink from "./NavLink";

export default function Header(): React.ReactNode {
  return (
    <header className="bg-red-300 h-64 flex justify-around" id="header">
      <h1 className="flex items-center justify-around font-bold text-xl">
        {window.location.pathname === Links.GARAGE ? "Garage" : "Winners"}
      </h1>
      <nav id="navbar">
        <ul className="h-64 flex items-center text-xl gap-15">
          <li>
            <NavLink text="Garage" to={Links.GARAGE} />
          </li>
          <li>
            <NavLink text="Winners" to={Links.WINNERS} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
