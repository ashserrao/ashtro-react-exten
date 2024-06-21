import React, { useEffect, useRef, useState } from "react";
import { Navbar } from "./Pages/Recording/recording";
import "./App.css"; // Import your CSS file for styles
import { openDB } from "idb";

function App() {
  const [recordings, setRecordings] = useState([]);
  const screenRecorderRef = useRef(null);
  const webcamRecorderRef = useRef(null);
  const screenStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);

  const dbPromise = openDB("recordings-db", 1, {
    upgrade(db) {
      db.createObjectStore("recordings", {
        keyPath: "id",
        autoIncrement: true,
      });
    },
  });

  const save = async (filename, filedata) => {
    const db = await dbPromise;
    const blob = new Blob(filedata, { type: "video/webm" });
    await db.add("recordings", {
      name: filename,
      video: blob,
      timestamp: new Date(),
    });
    console.log(`Saved recording: ${filename}`);
    loadRecordings();
  };

  const loadRecordings = async () => {
    const db = await dbPromise;
    const tx = db.transaction("recordings", "readonly");
    const store = tx.objectStore("recordings");
    const allRecordings = await store.getAll();
    setRecordings(allRecordings);
  };

  const downloadRecording = (recording) => {
    const url = URL.createObjectURL(recording.video);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${recording.name}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onAccessApproved = (screenStream, webcamStream) => {
    screenStreamRef.current = screenStream;
    webcamStreamRef.current = webcamStream;

    screenRecorderRef.current = new MediaRecorder(screenStream);
    webcamRecorderRef.current = new MediaRecorder(webcamStream);

    let videoPreview = document.getElementById("videoPreview");
    videoPreview.srcObject = webcamStream;

    screenRecorderRef.current.start();
    webcamRecorderRef.current.start();

    const screenBlobs = [];
    const webcamBlobs = [];

    screenRecorderRef.current.ondataavailable = function (event) {
      screenBlobs.push(event.data);
    };

    webcamRecorderRef.current.ondataavailable = function (event) {
      webcamBlobs.push(event.data);
    };

    screenRecorderRef.current.onstop = function () {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
      // const timestamp = new Date().toISOString();
      save(`screen-recording-${Date()}`, screenBlobs);
    };

    webcamRecorderRef.current.onstop = function () {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
      // const timestamp = new Date().toISOString();
      save(`webcam-recording-${Date()}`, webcamBlobs);
    };
  };

  const startVideo = () => {
    getPermissions();
  };

  const stopVideo = () => {
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
        navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: true,
          })
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
          });
      });
  };

  useEffect(() => {
    loadRecordings();
  }, []);

  return (
    <div>
      <style>{`
      #recording-list li {
      padding: 0 5px;
      color: #4f4f4f;
      }

      #recording-list li:hover {
        color: #209e91;
        font-weight: 500;
        text-decoration: none;
        cursor: pointer;
      }
    `}</style>
      <Navbar />
      <div className="flex justify-center my-3 content">
        <div className="h-60 overflow-hidden w-10/12 border rounded">
          <h6
            className="flex flex-start text-lg font-semibold px-1 py-1"
            id="rec-header"
          >
            Your Recordings
          </h6>
          <hr />
          <div className="h-52 overflow-scroll">
            <ul className="px-1 text-center" id="recording-list">
              {recordings.map((recording, index) => (
                <li key={index} onClick={() => downloadRecording(recording)}>
                  {recording.name}
                  <hr />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center my-6">
        <button
          className="mx-3 px-3 py-2 rounded bg-teal-600 font-semibold text-slate-50"
          onClick={startVideo}
        >
          Start Rec
        </button>
        <button
          className="mx-3 px-3 py-2 rounded bg-teal-600 font-semibold text-slate-50"
          onClick={stopVideo}
        >
          Stop Rec
        </button>
        <button className="mx-3 px-3 py-2 rounded bg-teal-600 font-semibold text-slate-50">
          Resync
        </button>
      </div>
      <div className="w-full">
        {/* <video id="videoPreview" muted autoPlay width={300}></video> */}
      </div>
    </div>
  );
}

export default App;
