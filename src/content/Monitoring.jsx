import React, { useEffect, useRef } from "react";

const minRequiredBatt = 95;

function Monitoring() {
  const lowBattFlag = useRef("No");
  const battChargeFlag = useRef("No");
  const extraDisplay = useRef("No");
  const incognitoEnabled = useRef("No");
  const usbFound = useRef("No");

  const batteryMonitoring = () => {
    navigator.getBattery().then((battery) => {
      const battChargeStatus = battery.charging ? "Yes" : "No";
      const battLevel = battery.level * 100;

      if (
        battChargeStatus === "No" &&
        battChargeFlag.current === "No" &&
        lowBattFlag.current === "No"
      ) {
        const flag = {
          flag_type: "WHITE",
          transfer_to: "Don't Transfer",
          reason: "Battery Alert",
          attachments: "",
          object: "",
          comment: "System is not charging",
          timestamp: Date.now(),
        };

        const message = {
          action: "sendFlags",
          data: flag,
        };

        chrome.runtime.sendMessage(message, (response) => {
          console.log(response);
        });

        chrome.storage.local.set({ recTrigger: "playPauseRec" }, function () {
          console.log("Value is set to " + "playPauseRec");
        });

        battChargeFlag.current = "Yes";
      } else if (
        battChargeStatus === "No" &&
        battChargeFlag.current === "Yes" &&
        lowBattFlag.current === "No"
      ) {
        if (lowBattFlag.current === "No" && battLevel < minRequiredBatt) {
          const flag = {
            flag_type: "white",
            transfer_to: "Don't Transfer",
            reason: "Battery Alert",
            attachments: "",
            object: "",
            comment: `low battery ${battLevel}%`,
            timestamp: Date.now(),
          };

          const message = {
            action: "sendFlags",
            data: flag,
          };

          chrome.runtime.sendMessage(message, (response) => {
            console.log(response);
          });
          lowBattFlag.current = "Yes";
        }
        console.log(`Battery level: ${battLevel}%`);
      } else {
        battChargeFlag.current = "No";
      }
    });
  };

  const displayMonitoring = () => {
    const display = `${window.screen.isExtended}`;
    if (display === "true" && extraDisplay.current === "No") {
      const flag = {
        flag_type: "RED",
        transfer_to: "Don't Transfer",
        reason: "Display Alert",
        attachments: "",
        object: "",
        comment: `extra display added or found`,
        timestamp: Date.now(),
      };
      const message = {
        action: "sendFlags",
        data: flag,
      };
      chrome.runtime.sendMessage(message, (response) => {
        console.log(response);
      });
      extraDisplay.current = "Yes";
    } else if (display === "false" && extraDisplay === "Yes") {
      console.log("exta Monitor removed");
      extraDisplay = "No";
    }
  };

  const checkIncognito = () => {
    let message = {
      action: "check-incognito",
    };
    chrome.runtime.sendMessage(message);
    chrome.storage.local.get(["incognitoStatus"], function (result) {
      if (result.incognitoStatus === "Incognito is not Allowed") {
        alert("Incognito is not allowed Please enable it.");
        if (incognitoEnabled.current === "No") {
          const flag = {
            flag_type: "RED",
            transfer_to: "Don't Transfer",
            reason: "Incognito tab Alert",
            attachments: "",
            object: "",
            comment: `Incognito tab functions disabled`,
            timestamp: Date.now(),
          };
          const message = {
            action: "sendFlags",
            data: flag,
          };
          chrome.runtime.sendMessage(message, (response) => {
            console.log(response);
          });
          incognitoEnabled.current = "Yes";
        }
      }
    });
  };

  const checkUSB = () => {
    chrome.storage.local.get(["usbStatus"], function (result) {
      if (result.usbStatus === "No USB") {
        if (usbFound.current === "No") {
          const flag = {
            flag_type: "RED",
            transfer_to: "Don't Transfer",
            reason: "USB Alert",
            attachments: "",
            object: "",
            comment: `USB device connected or found.`,
            timestamp: Date.now(),
          };
          let message = {
            action: "sendFlags",
            data: flag,
          };
          chrome.runtime.sendMessage(message, (response) => {
            console.log(response);
          });
          usbFound.current = "Yes";
        }
      }
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      batteryMonitoring();
      displayMonitoring();
      checkIncognito();
      checkUSB();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <div></div>;
}

export default Monitoring;
