import React, { useEffect, useRef, useState } from "react";
import { openDB } from "idb";

const Navbar = () => {
  return (
    <div>
      <div className="w-full p-2.5 flex flex-wrap text-lg font-medium">
        <img src="/assets/icon.svg" alt="icon" />
        ExamLock Lite
        <span className="flex-auto"></span>
        <button id="profile">
          <img
            className="h-8"
            src="https://www.svgrepo.com/show/23012/profile-user.svg"
            alt="profile-icon"
          />
        </button>
      </div>
      <hr />
    </div>
  );
};

function Recording() {
  const accessApproval = useRef(false);
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
    chrome.storage.local.set(
      { recTrigger: " ", recStatus: "isRec", timerStatus: "start" },
      function () {
        console.log("Value is set to " + "startRec");
      }
    );
    accessApproval.current = false;
    screenStreamRef.current = screenStream;
    webcamStreamRef.current = webcamStream;

    screenRecorderRef.current = new MediaRecorder(screenStream);
    webcamRecorderRef.current = new MediaRecorder(webcamStream);

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
      save(`screen-recording - ${Date()}`, screenBlobs);
    };

    webcamRecorderRef.current.onstop = function () {
      if (webcamStreamRef.current) {
        webcamStreamRef.current.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
      save(`webcam-recording - ${Date()}`, webcamBlobs);
    };
  };

  const startVideo = () => {
    getPermissions();
    chrome.storage.local.set(
      { recTrigger: "startRec", recStatus: "isNotRec", timerStatus: "stop" },
      function () {
        console.log("Value is set to " + "startRec");
      }
    );
    accessApproval.current = true;
  };

  const stopVideo = () => {
    chrome.storage.local.set(
      { recTrigger: "stopRec", recStatus: "isNotRec",  },
      function () {
        console.log("Value is set to " + "stopRec");
      }
    );
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
          })
          .catch((err) => {
            console.log(err);
            setIsRec(false);
          });
      })
      .catch((err) => {
        console.log(err);
        setIsRec(false);
      });
  };

  useEffect(() => {
    loadRecordings();
    window.addEventListener("beforeunload", stopVideo);
  }, []);

  const handleRecordingStatus = () => {
    chrome.storage.local.get(["recTrigger", "recStatus"], function (result) {
      if (
        result.recTrigger === "startRec" &&
        result.recStatus === "isNotRec" &&
        accessApproval.current === false
      ) {
        startVideo();
        console.log("case 1");
      } else if (
        result.recTrigger === "startRec" &&
        result.recStatus === "isNotRec" &&
        accessApproval.current === true
      ) {
        console.log("To be approved");
      } else if (result.recTrigger === " " && result.recStatus === "isRec") {
        console.log("rec ongoing");
        console.log("case 3");
      } else if (
        result.recTrigger === "stopRec" &&
        result.recStatus === "isRec"
      ) {
        stopVideo();
      }
    });
  };

  setInterval(() => {
    handleRecordingStatus();
  }, 1000);

  return (
    <div>
      <style>{`
      #recording-list li {
      padding: 0 5px;
      font-size: medium;
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
        {/* <button
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
        </button> */}
        <button className="mx-3 px-3 py-2 rounded bg-teal-600 font-semibold text-slate-50">
          Resync
        </button>
      </div>
      <div className="w-full"></div>
    </div>
  );
}

export default Recording;

export { Navbar };
