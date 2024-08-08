import React from "react";
import { render } from "react-dom";
import Devtools from "./devtools";

render(<Devtools />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
