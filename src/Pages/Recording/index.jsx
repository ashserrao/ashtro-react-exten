import React from "react";
import { render } from "react-dom";
import Recording from "./recording";

// // Evade direct window exit =====================================
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  e.returnValue = ""; // This line is necessary for the confirmation dialog to show
});

render(<Recording />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
