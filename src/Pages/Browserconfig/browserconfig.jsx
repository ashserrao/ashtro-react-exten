import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../Recording/recording";

function Browserconfig() {
  const cardRef = useRef(null);
  const [cookieSrc, setCookieSrc] = useState("/assets/loading.gif");
  const [screenSrc, setScreenSrc] = useState("/assets/loading.gif");

  useEffect(() => {
    checkCookies();
    screenShare();
    const timeout = setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.classList.add("clickcard");
      }
    }, 10000);
    clearTimeout(timeout);
  }, []);

  function checkCookies() {
    if (navigator.cookieEnabled === true) {
      setCookieSrc("/assets/loaded.svg");
    } else {
      setCookieSrc("/assets/cross_mark.svg");
    }
  }

  function screenShare() {
    if (
      navigator.mediaDevices &&
      "getDisplayMedia" in navigator.mediaDevices === true
    ) {
      setScreenSrc("/assets/loaded.svg");
    } else {
      setScreenSrc("/assets/cross_mark.svg");
    }
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
          ref={cardRef}
          id="clickcard"
          onClick={() => {
            window.location = './networkconfig.html'
          }}
        >
          <h6 class="text-sm font-medium my-1 mx-2">Browser Configurations</h6>
          <hr />
          {/* <!-- info section --> */}
          <div class="mx-1 my-2 text-xs font-medium">
            <div class="my-1 flex flex-wrap">
              <img src="/assets/globe.svg" alt="globe" />
              <span class="mx-1 my-auto">Cookies:</span>
              <span class="flex flex-auto"></span>
              <img
                class="my-auto h-4"
                id="cookie-req"
                src={cookieSrc}
                alt="cookie-loader"
              />
            </div>
            <div class="my-1 flex flex-wrap">
              <img src="/assets/Screen Share.svg" alt="screen-share-icon" />
              <span class="mx-1 my-auto">Screen Share:</span>
              <span class="flex flex-auto"></span>
              <img
                class="my-auto h-4"
                id="ss-req"
                src={screenSrc}
                alt="screen-share-loader"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Browserconfig;
