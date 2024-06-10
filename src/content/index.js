import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import Content from "./Content";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "trigger") {
    let rootElement = document.getElementById("root");

    // Create the root element if it doesn't exist
    if (!rootElement) {
      rootElement = document.createElement("div");
      rootElement.id = "root";
      document.body.appendChild(rootElement);
    }

    const root = ReactDOM.createRoot(rootElement);

    root.render(
      <React.StrictMode>
        <Content />
      </React.StrictMode>
    );

    console.log("working");
  }
});
