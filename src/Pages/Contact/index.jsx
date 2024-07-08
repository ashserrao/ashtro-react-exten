import React from "react";
import { render } from "react-dom";
import Contact from "./contact";

render(<Contact />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
