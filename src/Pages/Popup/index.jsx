import React from "react";
import { render } from "react-dom";
import Popup from "./popup";

render(<Popup />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
