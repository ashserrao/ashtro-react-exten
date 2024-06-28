import React, { useEffect, useState, useRef, useContext } from "react";
import { PopupContext } from "./Contentstate";

function Camera() {
  const { isOpen, isRec, togglePopup, toggleRec } = useContext(PopupContext);
  const recStatus = useRef("isNotRec");
  const [Preview, setPreview] = useState(false);
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
    chrome.storage.local.set({timerStatus: " "}, function(){
      console.log("Value is set to " + " ");
    })
  }, []);

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

  const startRecording = () => {
    toggleRec();
    // Trigger to start video in rec page =============================
    chrome.storage.local.set(
      { recTrigger: "startRec", recStatus: "isNotRec" },
      function () {
        console.log("Value is set to " + "startRec");
      }
    );
    // Trigger for rec page=============================
    let message = {
      action: "recording-page",
      data: true,
    };
    chrome.runtime.sendMessage(message, (response) => {
      console.log(response);
    });
  };

  const stopRecording = () => {
    chrome.storage.local.set(
      { recTrigger: "stopRec" },
      function () {
        console.log("Value is set to " + "stopRec");
      }
    );
    toggleRec();
    let message = {
      action: "recording-page",
      data: true,
    };
    chrome.runtime.sendMessage(message, (response) => {
      console.log(response);
    });
  };

  const startVideo = () => {
    getPermissions();
  };

  const stopVideo = () => {
    setPreview(!Preview);
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

  const onAccessApproved = (webcamStream) => {
    setPreview(!Preview);
    webcamStreamRef.current = webcamStream;

    webcamRecorderRef.current = new MediaRecorder(webcamStream);

    let videoPreview = document.getElementById("videoPreview");
    videoPreview.srcObject = webcamStream;

    webcamRecorderRef.current.start();

    const blobs = {
      screen: [],
      webcam: [],
    };

    webcamRecorderRef.current.ondataavailable = function (event) {
      blobs.webcam.push(event.data);
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
        onAccessApproved(webcamStream);
      })
      .catch((error) => {
        console.log("error accessing webcam", error);
      });
  };

    // const handleRecordingStatus = () => {
    //   chrome.storage.local.get(["timerStatus"], function (result) {
    //     if (result.timerStatus === "start") {
    //       toggleRec();
    //       chrome.storage.local.set({ timerStatus: " " }, function () {
    //         console.log("Value is set to " + " ");
    //       });
    //     } else if (result.timerStatus === "stop") {
    //       toggleRec();
    //     }
    //   });
    // };

    // setInterval(() => {
    //   handleRecordingStatus();
    // }, 1000);

  return (
    <div
      className={isOpen ? "content-open" : "content-close"}
      style={{
        width: isOpen ? "300px" : "0",
        height: isOpen ? "350px" : "0",
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
        .prv-button {
          margin: 20px 0 10px 30px;
          color: #fff;
          background-color: #0d9488;
          padding: 5px;
          font-size: 16px;
          font-weight: 500;
          border-width: 0;
          border-radius: 5px;
          width: 80%;
        }
        .prv-button:focus{
         outline: none;
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
          outline: none
        }
        .start-button:focus{
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
      <button className="prv-button" onClick={Preview ? stopVideo : startVideo}>
        {Preview ? "Stop Preview" : "Check Camera Preview"}
      </button>
      <button
        className="start-button"
        onClick={isRec ? stopRecording : startRecording}
      >
        {isRec ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}

export default Camera;
