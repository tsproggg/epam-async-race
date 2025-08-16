import React from "react";

import { Link } from "react-router";

import { Links } from "../Links";

export default function Header(): React.ReactNode {
  return (
    <header className={"bg-red-300 h-64"} id="header">
      <nav id="navbar">
        <ul
          className={
            "h-64 flex justify-around items-center text-xl font-bold [&>li]:hover:underline"
          }
        >
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
