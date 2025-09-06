import React from "react";

import { Link } from "react-router";

import { Links } from "../Links";

export default function Header(): React.ReactNode {
  return (
    <header className="bg-red-300 h-64 flex justify-around" id="header">
      <h1 className="flex items-center justify-around font-bold text-xl">
        {window.location.pathname === Links.GARAGE ? "Garage" : "Winners"}
      </h1>
      <nav id="navbar">
        <ul className="h-64 flex items-center text-xl gap-15 [&>li]:hover:underline">
          <li>
            <Link to={Links.GARAGE}>Garage</Link>
          </li>
          <li>
            <Link to={Links.WINNERS}>Winners</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
