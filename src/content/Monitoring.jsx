import React, { useState, useEffect, useRef } from "react";
let minRequiredBatt = 95;

function Monitoring() {
  const lowBattFlag = useRef("No");
  const battChargeFlag = useRef("No");

  const batteryMonitoring = () => {
    navigator.getBattery().then((battery) => {
      const battChargeStatus = battery.charging ? "Yes" : "No";
      const battLevel = battery.level * 100;
      if (
        battChargeStatus === "No" &&
        battChargeFlag.current === "No" &&
        lowBattFlag.current === "No"
      ) {
        let flag = {
          flag_type: "white",
          transfer_to: "Don''t Transfer",
          reason: "Battery Alert",
          attachments: "",
          object: "",
          comment: "System is not charging",
          timestamp: Date.now(),
        };

        let message = {
          action: "sendFlags",
          data: flag,
        };
        chrome.runtime.sendMessage(message, (response) => {
          console.log(response);
        });
        battChargeFlag.current = "Yes";
        // console.log("low battery and flagging");
      } else if (
        battChargeStatus === "No" &&
        battChargeFlag.current === "Yes" &&
        lowBattFlag.current === "No"
      ) {
        console.log(`No charger battery level ${battLevel}%`);
      } else {
        console.log("battery back online");
        battChargeFlag.current = "No";
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(batteryMonitoring, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div></div>;
}

export default Monitoring;
