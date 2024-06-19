import React, { useEffect, useState } from "react";
import { Navbar } from "../Recording/recording";

const Popup = () => {
  const [os, setOs] = useState("Loading...");

  //OS check variable =================================
  const osCheck = document.getElementById("opsys");

  useEffect(() => {
    opCheck();
  }, []);

  // OS check ==================================
  function opCheck() {
    navigator.userAgentData
      .getHighEntropyValues(["platformVersion"])
      .then((ua) => {
        const platformVersion = ua.platformVersion.split(".").map(Number);
        if (navigator.userAgentData.platform === "Windows") {
          if (platformVersion[0] >= 13) {
            setOs("Windows 11");
          } else if (platformVersion[0] > 0) {
            setOs("Windows 10");
          } else {
            const windowsVersions = [
              "Windows 8.1",
              "Windows 8",
              "Windows 7",
              "Windows Vista",
              "Windows XP",
              "Windows 2000",
            ];
            let index = 0;
            if (platformVersion[1] === 0 && platformVersion[2] === 0) {
              index = 3; // Windows Vista
            } else if (platformVersion[1] === 1) {
              index = 4; // Windows XP
            } else if (platformVersion[1] === 2) {
              index = 0; // Windows 8.1
            } else if (platformVersion[1] === 3) {
              index = 1; // Windows 8
            } else if (platformVersion[1] === 4) {
              index = 2; // Windows 7
            }
            setOs(windowsVersions[index]);
          }
        } else {
          if (platformVersion[0] === 20) {
            setOs("MacOS");
          } else if (platformVersion[0] === 18) {
            setOs("Linux");
          } else if (
            platformVersion[0] === 11 ||
            platformVersion[0] === 10 ||
            platformVersion[0] === 9 ||
            platformVersion[0] === 8 ||
            platformVersion[0] === 7 ||
            platformVersion[0] === 6 ||
            platformVersion[0] === 5 ||
            platformVersion[0] === 4 ||
            platformVersion[0] === 3 ||
            platformVersion[0] === 2
          ) {
            setOs("UNIX");
          } else {
            setOs("Unknown/Not-supported");
          }
        }
      });
  }
  return (
    <div>
      <Navbar />
      {/* <!-- main content --> */}
      <div class="mx-2">
        {/* <!-- sub header --> */}
        <h5 class="text-lg font-medium">Advanced System Check</h5>
        <h6 class="text-base font-medium" id="opsys">
          {os}
        </h6>
        <p class="text-sm font-medium py-2">
          Our tool is checking to ensure your system is compatible to provide a
          best experience for your exam.
        </p>
        <img class="my-2" src="assets/Group 1000003788.svg" />
      </div>
      <div class="bottom-sec px-2 mt-60 text-center">
        <button
          class="w-full bg-teal-600 text-slate-100 font-semibold rounded p-1 hover:bg-teal-700"
          id="begin-system-check"
          onClick={() => {
            window.location = "systemcheck.html";
            let message = {
              action: "record-tab",
              data: "System Check",
            };
            chrome.runtime.sendMessage(message, (response) => {
              console.log(response);
            });
          }}
        >
          Begin System Check
        </button>
        <a
          class="text-teal-600 underline underline-offset-2 mt-2 hover:text-teal-600 hover:underline underline-offset-2  hover:mt-2 hover:font-medium"
          href="https://erv2dev.examroom.ai/#/auth/login"
          target="_blank"
        >
          Login to start exam
        </a>
      </div>
    </div>
  );
};

export default Popup;
