import React, { useEffect, useState } from "react";

function Camera() {
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [stream, setStream] = useState(null);
  const [recStatus, setRecStatus] = useState(false);

  useEffect(() => {
    const getMediaDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoSelect = devices.filter(
          (device) => device.kind === "videoinput"
        );
        const audioSelect = devices.filter(
          (device) => device.kind === "audioinput"
        );
        setVideoDevices(videoSelect);
        setAudioDevices(audioSelect);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getMediaDevices();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const requestAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setStream(stream);
    } catch (error) {
      console.error("Error accessing media devices.", error);
    }
  };

  useEffect(() => {
    if (!stream) {
      requestAccess();
    }
  }, [stream]);

  const startVideo = async () => {
    setRecStatus(!recStatus);
    const videoElement = document.getElementById("videoPreview");
    const videoSelect = document.getElementById("videoDevices");
    const audioSelect = document.getElementById("audioDevices");
    const videoDeviceId = videoSelect.value;
    const audioDeviceId = audioSelect.value;

    if (window.stream) {
      window.stream.getTracks().forEach((track) => track.stop());
    }

    const constraints = {
      video: {
        deviceId: videoDeviceId ? { exact: videoDeviceId } : undefined,
      },
      audio: {
        deviceId: audioDeviceId ? { exact: audioDeviceId } : undefined,
      },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      window.stream = stream;
      videoElement.srcObject = stream;
    } catch (error) {
      console.error("Error starting video stream.", error);
    }
  };

  const stopVideo = () => {
    setRecStatus(!recStatus);
    if (window.stream) {
      window.stream.getTracks().forEach((track) => track.stop());
      let message = {
        action: "recording-page",
      };
      chrome.runtime.sendMessage(message, (response) => {
        console.log("recording page opened", response);
      });
    }
  };

  useEffect(() => {
    const videoSelect = document.getElementById("videoDevices");
    videoSelect.addEventListener("change", recStatus ? startVideo : null);

    const audioSelect = document.getElementById("audioDevices");
    audioSelect.addEventListener("change", recStatus ? startVideo : null);

    return () => {
      videoSelect.removeEventListener("change", recStatus ? startVideo : null);
      audioSelect.removeEventListener("change", recStatus ? startVideo : null);
    };
  }, []);

  return (
    <div>
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
          margin: 10px 0 0px 30px;
          color: #fff;
          background-color: #0d9488;
          padding: 5px;
          font-size: 16px;
          font-weight: 500;
          border-width: 0;
          border-radius: 5px;
          width: 80%;
        }
      `}</style>
      <video id="videoPreview" autoPlay width={300}></video>
      <select id="videoDevices" className="videoDevices" disabled={recStatus}>
        {videoDevices.map((device, index) => (
          <option key={index} value={device.deviceId}>
            {device.label || `Camera ${index + 1}`}
          </option>
        ))}
      </select>
      <select id="audioDevices" className="audioDevices" disabled={recStatus}>
        {audioDevices.map((device, index) => (
          <option key={index} value={device.deviceId}>
            {device.label || `Mic ${index + 1}`}
          </option>
        ))}
      </select>
      <button
        className="start-button"
        onClick={recStatus ? stopVideo : startVideo}
      >
        {recStatus ? "Stop Proctoring" : "Start Proctoring"}
      </button>
    </div>
  );
}

export default Camera;
