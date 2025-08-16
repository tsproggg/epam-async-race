import React from "react";

import WinnersLabel from "./WinnersComponents/WinnersLabel";
import WinnersTable from "./WinnersComponents/WinnersTable";
import Header from "../components/Header";

export default function Winners(): React.ReactNode {
  return (
    <div id="Winners">
      <Header />
      <main>
        <WinnersLabel />
        <WinnersTable />
      </main>
    </div>
  );
}
