console.log("content.js is injected");

import React, { useContext } from "react";
import ReactDOM from "react-dom";
import "../index.css";
import Content from "./content";
import { StateProvider } from "./Contentstate";

setTimeout(() => {
  Trigger();
}, 3000);

function Trigger() {
  let rootElement = document.getElementById("root");
  // Create the root element if it doesn't exist
  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  }

  ReactDOM.render(
    <React.StrictMode>
      <StateProvider>
        <Content />
      </StateProvider>
    </React.StrictMode>,
    rootElement
  );
  return true;
}

//disable content selection=================================
function disableSelection() {
  document.addEventListener("selectstart", disableEvent);
  document.addEventListener("mousedown", disableEvent);
}

function disableEvent(event) {
  event.preventDefault();
}

disableSelection();
