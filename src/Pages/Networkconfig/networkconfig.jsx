import React, { useState, useEffect } from "react";
import { Navbar } from "../Recording/recording"; // Adjust the import according to your file structure

function Network() {
  const [isWebRTCSupported, setIsWebRTCSupported] = useState(null);

  const checkWebRTCSupport = () => {
    const hasWebRTCSupport = !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia &&
      window.RTCPeerConnection &&
      window.RTCSessionDescription &&
      window.RTCIceCandidate
    );

    setIsWebRTCSupported(hasWebRTCSupport);
  };

  useEffect(() => {
    checkWebRTCSupport();
  }, []);

  const nextWindow = () => {
    const url = `chrome-extension://${chrome.runtime.id}/consent.html`;
    chrome.tabs.create({
      url: url,
    });
  };

  return (
    <div>
      <Navbar />
      <div className="my-0 mx-2">
        <h6 className="text-base font-medium">System Check</h6>
        <div
          className="border rounded overflow-y-scroll"
          onClick={nextWindow}
          id="clickcard"
        >
          <h6 className="text-sm font-medium my-1 mx-2">
            Network Configurations
          </h6>
          <hr />
          <div className="mx-1 my-2 text-xs font-medium">
            <div className="my-1 flex flex-wrap">
              <img src="/assets/globe.svg" alt="globe" />
              <span className="mx-1 my-auto">Download Speed:</span>
              <span className="flex flex-auto"></span>
              <span className="mx-1" id="download-speed">
                Loading...
              </span>
              <img
                className="my-auto h-4"
                id="download-req"
                src="/assets/loading.gif"
                alt="speed-loader"
              />
            </div>
            <div className="my-1 flex flex-wrap">
              <img src="/assets/globe.svg" alt="globe" />
              <span className="mx-1 my-auto">Upload Speed:</span>
              <span className="flex flex-auto"></span>
              <span className="mx-1" id="upload-speed">
                Loading...
              </span>
              <img
                className="my-auto h-4"
                id="upload-req"
                src="/assets/loading.gif"
                alt="speed-loader"
              />
            </div>
            <div className="my-1 flex flex-wrap">
              <img src="/assets/Screen Share.svg" alt="screen-logo" />
              <span className="mx-1 my-auto">WebRTC adapter:</span>
              <span className="flex flex-auto"></span>
              <span className="mx-1" id="RTC-stat">
                {isWebRTCSupported === null ? (
                  <span>Loading...</span>
                ) : isWebRTCSupported ? (
                  <span>Compatible</span>
                ) : (
                  <span>Not compatible</span>
                )}
              </span>
              <img
                className="my-auto h-4"
                id="RTC-req"
                src="/assets/loading.gif"
                alt="webrtc-loader"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Network;
