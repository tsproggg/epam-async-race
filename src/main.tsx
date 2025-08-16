import React from "react";

import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

const root: HTMLElement | null = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  throw new Error("Could not find the root element");
}
