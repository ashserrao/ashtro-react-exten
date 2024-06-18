import React, { useState } from "react";
import ReactDOM from "react-dom";
import "../index.css";
import Content from "./Content";

let togglepopup = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "trigger") {
    Trigger();
  }
});

function Trigger() {
  togglepopup = !togglepopup;
  let rootElement = document.getElementById("root");
  // Create the root element if it doesn't exist
  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  }

  ReactDOM.render(
    <React.StrictMode>
      <div style={{ visibility: togglepopup ? "visible" : "hidden" }}>
        <Content togglepopup={togglepopup} />
      </div>
    </React.StrictMode>,
    rootElement
  );
  return true;
}
