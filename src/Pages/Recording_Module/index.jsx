import React from "react";
import { render } from "react-dom";
import Module from "./module";
import { BrowserRouter } from "react-router-dom";

// Prevent direct window exit confirmation ========================
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = ""; // This line is necessary for the confirmation dialog to show
});

render(
  <BrowserRouter>
    <Module />
  </BrowserRouter>,
  document.getElementById("app-container") // Corrected querySelector to getElementById
);

if (module.hot) {
  module.hot.accept();
}
