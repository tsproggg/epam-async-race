import React from "react";

import { BrowserRouter } from "react-router";

import routes from "./routes";

function App(): React.ReactNode {
  return (
    <BrowserRouter>
      <div id="App">{routes()}</div>
    </BrowserRouter>
  );
}

export default App;
