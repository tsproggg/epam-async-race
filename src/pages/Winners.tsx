import React from "react";

import WinnersTable from "./WinnersComponents/WinnersTable";
import Header from "../components/Header";

export default function Winners(): React.ReactNode {
  return (
    <div id="Winners">
      <Header />
      <main>
        <WinnersTable />
      </main>
    </div>
  );
}
