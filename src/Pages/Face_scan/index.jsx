import React from "react";
import { render } from "react-dom";
import Facescan from "./face_scan";

render(<Facescan />, document.querySelector("#app-container"));

if (module.hot) module.hot.accept();
