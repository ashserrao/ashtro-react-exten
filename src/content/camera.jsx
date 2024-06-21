import React, { useEffect, useState, useRef, useContext } from "react";
import { PopupContext } from "./Contentstate";

function Camera() {
  const { isOpen, isRec, toggleRec } = useContext(PopupContext);

  const [recStatus, setRecStatus] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDeviceId, setVideoDeviceId] = useState("");
  const [audioDeviceId, setAudioDeviceId] = useState("");
  let recordings = [];

  const screenRecorderRef = useRef(null);
  const webcamRecorderRef = useRef(null);
  const screenStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);

  useEffect(() => {
    getDevices();
  }, []);

  const updateDevice = () => {
    const videoSelect = document.getElementById("videoDevices");
    const audioSelect = document.getElementById("audioDevices");

    setVideoDeviceId(videoSelect.value);
    setAudioDeviceId(audioSelect.value);
  };

  const getDevices = () => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoInputs = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setVideoDevices(videoInputs);
        setAudioDevices(audioInputs);
      })
      .catch((err) => console.error("Error getting media devices: ", err));
  };

  const saveVideos = () => {
    let message = {
      action: "save-video",
      recording: recordings,
    };
    if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(message, (response) => {
        console.log(response);
      });
    } else {
      console.log("Chrome runtime not available");
    }
  };

  const startVideo = () => {
    getPermissions();
  };

  const stopVideo = () => {
    toggleRec();
    if (screenRecorderRef.current) screenRecorderRef.current.stop();
    if (webcamRecorderRef.current) webcamRecorderRef.current.stop();

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
    }

    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
    }
  };

  const onAccessApproved = (screenStream, webcamStream) => {
    toggleRec();
    screenStreamRef.current = screenStream;
    webcamStreamRef.current = webcamStream;

    screenRecorderRef.current = new MediaRecorder(screenStream);
    webcamRecorderRef.current = new MediaRecorder(webcamStream);

    let videoPreview = document.getElementById("videoPreview");
    videoPreview.srcObject = webcamStream;

    screenRecorderRef.current.start();
    webcamRecorderRef.current.start();

    const blobs = {
      screen: [],
      webcam: [],
    };

    screenRecorderRef.current.ondataavailable = function (event) {
      blobs.screen.push(event.data);
    };

    webcamRecorderRef.current.ondataavailable = function (event) {
      blobs.webcam.push(event.data);
    };

    screenRecorderRef.current.onstop = function () {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
      console.log(blobs.screen);
      recordings.push(blobs.screen);
    };

    webcamRecorderRef.current.onstop = function () {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
      console.log(blobs.webcam);
      recordings.push(blobs.webcam);
      setTimeout(() => {
        saveVideos();
      }, 5000);
    };
  };

  const getPermissions = () => {
    navigator.mediaDevices
      .getDisplayMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 2,
        },
        video: {
          width: 999999999,
          height: 999999999,
          displaySurface: "monitor",
        },
      })
      .then((screenStream) => {
        const constraints = {
          video: {
            deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
          },
          audio: {
            deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
          },
        };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then((webcamStream) => {
            onAccessApproved(screenStream, webcamStream);
            setTimeout(() => {
              console.log(
                `${
                  screenStream.getVideoTracks()[0].getSettings().displaySurface
                }`
              );
              console.log(
                `webcam audio: ${webcamStream.getAudioTracks().length}`
              );
              console.log(
                `screen audio: ${screenStream.getAudioTracks().length}`
              );
            }, 2000);
          })
          .catch((error) => {
            console.log("error accessing webcam", error);
          });
      })
      .catch((error) => {
        console.log("error starting screen recording", error);
      });
  };

  return (
    <div
      className={isOpen ? "content-open" : "content-close"}
      style={{
        width: isOpen ? "300px" : "0",
        height: isOpen ? "400px" : "0",
        overflow: "hidden",
        transition: "width 0.4s ease, height 0.4s ease",
      }}
    >
      <style>{`
        .videoDevices, .audioDevices {
          margin: 10px 0 10px 20px;
          width: 85%;
          padding: 5px;
          font-size: 12px;
          border: 1px solid #ccc;
          border-radius: 5px;
          background-color: #fff;
          color: #333;
          outline: none;
        }
        .videoDevices:focus, .audioDevices:focus {
          border-color: #ccc;
        }
        .videoDevices option, .audioDevices option {
          font-size: 12px;
          background-color: #fff;
          color: #333;
        }
        #videoPreview {
          border-radius: 10px;
        }
        .start-button {
          margin: 10px 0 20px 30px;
          color: #fff;
          background-color: #0d9488;
          padding: 5px;
          font-size: 16px;
          font-weight: 500;
          border-width: 0;
          border-radius: 5px;
          width: 80%;
        }
        .start-button:focus{
         outline: none;
        }
        .close-button {
          margin: 10px 0 20px 30px;
          color: #fff;
          background-color: #F13939;
          padding: 5px;
          font-size: 16px;
          font-weight: 500;
          border-width: 0;
          border-radius: 5px;
          width: 80%;
          outline: none
        }
        .close-button:focus{
         outline: none;
        }
        .-content-close {
          display: none;
          height: 0;
          width: 0;
          overflow: hidden; /* Ensure the content does not overflow during transition */
          transition: height 0.4s ease, width 0.4s ease;
        }
        .content-open{
          display: block; /* Display the container */
          height: 200px; /* Replace with the actual height */
          width: 300px; /* Replace with the actual width */
        }
      `}</style>
      <video id="videoPreview" muted autoPlay width={300}></video>
      <select
        id="videoDevices"
        className="videoDevices"
        disabled={recStatus}
        onChange={updateDevice}
      >
        {videoDevices.map((device, index) => (
          <option key={index} value={device.deviceId}>
            {device.label || `Camera ${index + 1}`}
          </option>
        ))}
      </select>
      <select
        id="audioDevices"
        className="audioDevices"
        disabled={recStatus}
        onChange={updateDevice}
      >
        {audioDevices.map((device, index) => (
          <option key={index} value={device.deviceId}>
            {device.label || `Mic ${index + 1}`}
          </option>
        ))}
      </select>
      <button className="start-button" onClick={isRec ? stopVideo : startVideo}>
        {isRec ? "Stop Proctoring" : "Start Proctoring"}
      </button>
    </div>
  );
}

export default Camera;
