import React from "react";

import { BrowserRouter } from "react-router";

import "./common.scss";
import routes from "./routes";

function App(): React.ReactNode {
  return <BrowserRouter>{routes()}</BrowserRouter>;
}

export default App;
