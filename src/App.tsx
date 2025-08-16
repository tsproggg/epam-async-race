import React from "react";

import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import routes from "./routes";
import store from "./store/store";

function App(): React.ReactNode {
  return (
    <BrowserRouter>
      <Provider store={store}>{routes()}</Provider>
    </BrowserRouter>
  );
}

export default App;
