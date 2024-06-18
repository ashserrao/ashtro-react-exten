import React from "react";
import { render } from "react-dom";
import Softconfig from "./softconfig";

render(<Softconfig />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
