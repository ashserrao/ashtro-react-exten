import React from "react";
import { render } from "react-dom";
import Idscan from "./id_scan";

render(<Idscan />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
