import React from "react";
import { render } from "react-dom";
import Systemcheck from "./systemcheck";

render(<Systemcheck />, window.document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
