import React from "react";
import { render } from "react-dom";
import Recording from "./recording";

render(<Recording />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
