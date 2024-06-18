import React from "react";
import { render } from "react-dom";
import Network from "./networkconfig";

render(<Network />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
