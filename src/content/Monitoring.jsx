import React, { useEffect } from "react";
let battChargeStatus;
let battLevel;

function Monitoring() {
  const batteryMonitoring = () => {
    navigator.getBattery().then((battery) => {
      battChargeStatus = battery.charging;
      battLevel = battery.level * 100;
      console.log(`${battChargeStatus} & ${battLevel}%`);
      if (battChargeStatus === false) {
        console.log("low battery !");
        chrome.storage.local.set({ batteryStatus: "low" });
      } else if (battChargeStatus === true) {
        chrome.storage.local.set({ batteryStatus: " " });
      }
    });
  };

//   // Function to make the tab full screen
//   const makeTabFullScreen = () => {
//     const docElm = document.documentElement;
//     if (loginStatus === true && e_Status === "exam-ongoing") {
//       if (docElm.requestFullscreen) {
//         docElm.requestFullscreen();
//       } else if (docElm.mozRequestFullScreen) {
//         // Firefox
//         docElm.mozRequestFullScreen();
//       } else if (docElm.webkitRequestFullscreen) {
//         // Chrome, Safari and Opera
//         docElm.webkitRequestFullscreen();
//       } else if (docElm.msRequestFullscreen) {
//         // IE/Edge
//         docElm.msRequestFullscreen();
//         disabledEvent(docElm); // This function call should be placed correctly
//       }
//       console.log("fullscreen");
//     } else {
//       console.log("exam is not running!");
//     }
//   };

  useEffect(() => {
    // makeTabFullScreen();
    setInterval(() => {
      batteryMonitoring();
    }, 1000);
  }, []);

  return <div></div>;
}

export default Monitoring;
