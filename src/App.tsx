import React from "react";

import { BrowserRouter } from "react-router";

import "./common.scss";
import routes from "./routes";
import NotificationManager from "./utils/NotificationManager";

function App(): React.ReactNode {
  return (
    <BrowserRouter>
      {routes()}
      <NotificationManager />
    </BrowserRouter>
  );
}

export default App;
