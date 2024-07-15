import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../Recording_Module/module";

function Softconfig() {
  const cardRef = useRef(null);
  const [os, setOs] = useState("Loading...");
  const [browserVersion, setBrowserVersion] = useState("Loading...");
  const [networkStatus, setNetworkStatus] = useState("Loading...");

  useEffect(() => {
    opCheck();
    browserCheck();
    networkCheck();
    const timeout = setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.classList.add("clickcard");
      }
    }, 10000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  //Network status ==============================
  function networkCheck() {
    if (navigator.onLine) {
      setNetworkStatus(`Connected/${navigator.connection.effectiveType}`);
      //   netReq.src = "/assets/loaded.svg";
    } else {
      setNetworkStatus("Not Connected");
      //   netReq.src = "/assets/cross_mark.svg";
    }
  }

  // Browser check ================================
  function browserCheck() {
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let fullVersion = "Unknown";

    if ((userAgent.indexOf("Opera") || userAgent.indexOf("OPR")) !== -1) {
      browserName = "Opera";
      fullVersion = userAgent.substring(userAgent.indexOf("Opera") + 6);
      if (userAgent.indexOf("Version") !== -1) {
        fullVersion = userAgent.substring(userAgent.indexOf("Version") + 8);
      }
    } else if (userAgent.indexOf("Edg") !== -1) {
      browserName = "Microsoft Edge";
      fullVersion = userAgent.substring(userAgent.indexOf("Edg") + 4);
    } else if (userAgent.indexOf("Chrome") !== -1) {
      browserName = "Chrome";
      fullVersion = userAgent.substring(userAgent.indexOf("Chrome") + 7);
    } else if (userAgent.indexOf("Safari") !== -1) {
      browserName = "Safari";
      fullVersion = userAgent.substring(userAgent.indexOf("Safari") + 7);
      if (userAgent.indexOf("Version") !== -1) {
        fullVersion = userAgent.substring(userAgent.indexOf("Version") + 8);
      }
    } else if (userAgent.indexOf("Firefox") !== -1) {
      browserName = "Firefox";
      fullVersion = userAgent.substring(userAgent.indexOf("Firefox") + 8);
    } else if (
      userAgent.indexOf("MSIE") !== -1 ||
      !!document.documentMode === true
    ) {
      browserName = "Internet Explorer";
      fullVersion = userAgent.substring(userAgent.indexOf("MSIE") + 5);
    }

    // Truncate the fullVersion string at the first space or semicolon if any
    fullVersion = fullVersion.split(" ")[0];
    fullVersion = fullVersion.split(";")[0];

    setBrowserVersion(`${browserName} | ${fullVersion}`);
  }

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
      <style>
        {`
          .clickcard {
            animation: blinkingBackground 2s infinite;
          }

          @keyframes blinkingBackground {
            0% { background-color: #fff; }
            25% { background-color: #b9eafa; }
            50% { background-color: #fff; }
            75% { background-color: #b9eafa; }
            100% { background-color: #fff; }
          }
        `}
      </style>
      <Navbar />
      {/* <!-- main content --> */}
      <div class="my-0 mx-2">
        <h6 class="text-base font-medium">System Check</h6>
        <div
          class="border rounded overflow-y-scroll"
          onClick={() => {
            window.location = "browserconfig.html";
          }}
          ref={cardRef}
          id="clickcard"
        >
          <h6 class="text-sm font-medium my-1 mx-2">Software Configurations</h6>
          <hr />
          {/* <!-- info section --> */}
          <div class="mx-1 my-2 text-xs font-medium">
            <div class="my-1 flex flex-wrap">
              <img src="/assets/OS Check.svg" />
              <span class="mx-1 my-auto">OS Check:</span>
              <span class="flex flex-auto"></span>
              <span class="mx-1" id="os-check">
                {os}
              </span>
              <img class="my-auto h-4" id="os-req" src="/assets/loading.gif" />
            </div>
            <div class="my-1 flex flex-wrap">
              <img src="/assets/globe.svg" />
              <span class="mx-1 my-auto">Browser Check:</span>
              <span class="flex flex-auto"></span>
              <span class="mx-1" id="browser-check">
                {browserVersion}
              </span>
              <img
                class="my-auto h-4"
                id="brow-req"
                src="/assets/loading.gif"
              />
            </div>
            <div class="my-1 flex flex-wrap">
              <img src="/assets/globe.svg" />
              <span class="mx-1 my-auto">Network Status:</span>
              <span class="flex flex-auto"></span>
              <span class="mx-1" id="net-stat">
                {networkStatus}
              </span>
              <img class="my-auto h-4" id="net-req" src="/assets/loading.gif" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Softconfig;
