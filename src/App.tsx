import React from "react";

import { BrowserRouter } from "react-router";

import routes from "./routes";

function App(): React.ReactNode {
  return <BrowserRouter>{routes()}</BrowserRouter>;
}

export default App;
