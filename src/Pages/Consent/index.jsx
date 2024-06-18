import React from "react";
import { render } from "react-dom";
import Consent from "./consent";

render(<Consent />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
