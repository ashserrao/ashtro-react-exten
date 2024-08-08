import React, { useEffect } from "react";

function Devtools() {
  useEffect(() => {
    // Establish a connection with the background script
    const backgroundPort = chrome.runtime.connect({ name: "devtools" });

    backgroundPort.postMessage({ name: "openDevTools" });

    backgroundPort.onMessage.addListener((message) => {
      console.log("Received message from background script:", message);
    });

    return () => {
      backgroundPort.disconnect();
    };
  }, []);

  return;
}

export default Devtools;
