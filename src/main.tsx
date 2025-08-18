import React from "react";

import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "./App";
import "./index.css";
import store from "./store/store";

const root: HTMLElement | null = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
  );
} else {
  throw new Error("Could not find the root element");
}
