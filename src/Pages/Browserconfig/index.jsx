import React from "react";
import { render } from "react-dom";
import Browserconfig from "./browserconfig";

render(<Browserconfig />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
