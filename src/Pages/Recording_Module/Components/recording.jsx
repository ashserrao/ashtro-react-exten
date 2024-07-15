import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { openDB } from "idb";

function Recording() {
  const [consent, setConsent] = useState(false);
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);
  const currentTime = useRef(null);
  const backupTime = useRef(null);
  const accessApproval = useRef(false);
  const [recordings, setRecordings] = useState([]);
  const battChargeStatusRef = useRef(null);
  const screenRecorderRef = useRef(null);
  const webcamRecorderRef = useRef(null);
  const screenStreamRef = useRef(null);
  const webcamStreamRef = useRef(null);
  const backduration = useRef(300000);

  const dbVideoPromise = openDB("recordings-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("recordings")) {
        db.createObjectStore("recordings", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

  const dbFlagPromise = openDB("Flags-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("Flags")) {
        db.createObjectStore("Flags", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    },
  });

  const handleCheckboxChange = () => {
    setConsent(!consent);
  };

  const saveFlag = async (response) => {
    const db = await dbFlagPromise;
    await db.add("Flags", {
      response,
    });
  };

  const addFlags = () => {
    const message = {
      action: "getFlags",
      data: "",
    };
    chrome.runtime.sendMessage(message, (response) => {
      console.log("flags received");
      if (response) {
        saveFlag(response);
        console.log(response);
      }
    });
  };

  const save = async (filename, filedata) => {
    const db = await dbVideoPromise;
    const blob = new Blob(filedata, { type: "video/webm" });
    await db.add("recordings", {
      name: filename,
      video: blob,
      timestamp: new Date(),
    });
    loadRecordings();
  };

  const loadRecordings = async () => {
    const db = await dbVideoPromise;
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

  // Timer for video backups ===========================
  const getCurrentDateTime = () => {
    function addLeadingZero(value) {
      return value < 10 ? "0" + value : value;
    }

    let currentDate = new Date();

    let date = addLeadingZero(currentDate.getDate());
    let month = addLeadingZero(currentDate.getMonth() + 1); // Months are zero-based
    let year = currentDate.getFullYear();
    let hours = addLeadingZero(currentDate.getHours());
    let minutes = addLeadingZero(currentDate.getMinutes());
    let seconds = addLeadingZero(currentDate.getSeconds());

    return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const addDateTime = (additionalTime) => {
    function addLeadingZero(value) {
      return value < 10 ? "0" + value : value;
    }

    let newCurrentDate = new Date();
    newCurrentDate.setMilliseconds(
      newCurrentDate.getMilliseconds() + additionalTime
    );

    let date = addLeadingZero(newCurrentDate.getDate());
    let month = addLeadingZero(newCurrentDate.getMonth() + 1); // Months are zero-based
    let year = newCurrentDate.getFullYear();
    let hours = addLeadingZero(newCurrentDate.getHours());
    let minutes = addLeadingZero(newCurrentDate.getMinutes());
    let seconds = addLeadingZero(newCurrentDate.getSeconds());

    return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const onAccessApproved = (screenStream, webcamStream) => {
    chrome.storage.local.set(
      { recTrigger: " ", recStatus: "isRec", timerStatus: "start" },
      function () {
        // console.log("Value is set to " + "startRec");
      }
    );
    let flag = {
      flag_type: "GREEN",
      transfer_to: "Don''t Transfer",
      reason: "Video log",
      attachments: "",
      object: "",
      comment: "Recording started",
      timestamp: Date.now(),
    };
    saveFlag(flag);
    // Trigger for rec page=============================
    let message = {
      action: "switch-tab",
      data: true,
    };
    chrome.runtime.sendMessage(message, (response) => {
      console.log(response);
    });
    backupTime.current = addDateTime(backduration.current); // Assuming you want to add 1 hour (3600000 ms)
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
      save(`screen-recording - ${Date()}`, screenBlobs);
    };

    webcamRecorderRef.current.onstop = function () {
      save(`webcam-recording - ${Date()}`, webcamBlobs);
    };
  };

  const startVideo = () => {
    getPermissions();
    chrome.storage.local.set(
      { recTrigger: "startRec", recStatus: "isNotRec", timerStatus: "start" },
      function () {
        // console.log("Value is set to " + "startRec");
      }
    );
    accessApproval.current = true;
  };

  const consentHandle = () => {
    setIsConsentModalOpen(false);
    startVideo();
  };

  const stopVideo = () => {
    currentTime.current = null;
    chrome.storage.local.set(
      { recTrigger: "stopRec", recStatus: "isNotRec", timerStatus: "stop" },
      function () {
        // console.log("Value is set to " + "stopRec");
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
    let flag = {
      flag_type: "GREEN",
      transfer_to: "Don''t Transfer",
      reason: "Video log",
      attachments: "",
      object: "",
      comment: "Recording stopped",
      timestamp: Date.now(),
    };
    saveFlag(flag);
  };

  const pausePlay = () => {
    if (screenRecorderRef.current) screenRecorderRef.current.stop();
    if (webcamRecorderRef.current) webcamRecorderRef.current.stop();

    const timeout = setTimeout(() => {
      screenRecorderRef.current.start();
      webcamRecorderRef.current.start();
      let flag = {
        flag_type: "white",
        transfer_to: "Don''t Transfer",
        reason: "Video log",
        attachments: "",
        object: "",
        comment: "session backup alert",
        timestamp: Date.now(),
      };
      saveFlag(flag);
      currentTime.current = getCurrentDateTime();
    }, 2000);

    return () => clearTimeout(timeout);
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
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // handling accidental page unload issue ===============================
  useEffect(() => {
    loadRecordings();
    const handleBeforeUnload = () => {
      stopVideo();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleRecordingStatus = () => {
    chrome.storage.local.get(["recTrigger", "recStatus"], function (result) {
      if (
        result.recTrigger === "startRec" &&
        result.recStatus === "isNotRec" &&
        accessApproval.current === false
      ) {
        // startVideo();
        setIsConsentModalOpen(true);
      } else if (
        result.recTrigger === "startRec" &&
        result.recStatus === "isNotRec" &&
        accessApproval.current === true
      ) {
      } else if (result.recTrigger === " " && result.recStatus === "isRec") {
      } else if (
        result.recTrigger === "playPauseRec" &&
        result.recStatus === "isRec"
      ) {
        chrome.storage.local.set({ recTrigger: " " }, function () {
          console.log("Value is set to " + " ");
        });
        console.log("session backup triggered");
        pausePlay();
      } else if (
        result.recTrigger === "stopRec" &&
        result.recStatus === "isRec"
      ) {
        stopVideo();
      }
    });
  };

  const handleBatteryStatus = () => {
    // chrome.storage.local.get(["batteryStatus"], function (result) {
    //   if (result.batteryStatus !== battChargeStatusRef.current) {
    //     if (result.batteryStatus === "low") {
    //       alert("Battery is low, please charge your device");
    //       result.backupStatus = battChargeStatusRef.current;
    //     } else if (result.batteryStatus === "medium") {
    //       alert("Battery is medium, please charge your device");
    //     } else if (result.backupStatus === " ") {
    //       result.backupStatus = battChargeStatusRef.current;
    //     }
    //   }
    // });
  };

  const sessionBackup = () => {
    currentTime.current = getCurrentDateTime();
    // console.log(`${currentTime.current}, ${backupTime.current}`);
    if (currentTime.current === backupTime.current) {
      console.log("session backup triggered");
      pausePlay();
      backupTime.current = addDateTime(backduration.current);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleRecordingStatus();
      handleBatteryStatus();
      addFlags();
      sessionBackup();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

      li {
        list-style-type: circle;
        padding-bottom: 1% ;
      }

    `}</style>
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
        <button
          className="mx-3 px-3 py-2 rounded bg-teal-600 font-semibold text-slate-50"
          onClick={pausePlay}
        >
          Resync
        </button>
      </div>
      <Modal isOpen={isConsentModalOpen}>
        <div className="h-48 pt-52 flex flex-col items-center justify-center">
          <h1 className="font-bold text-lg">Consent Form</h1>
          <hr />
          <div className="py-1 px-6">
            <ol>
              <li>
                We strive to provide a more efficient and streamlined remote
                proctoring service for all users, both administrators, and
                candidates. By utilizing APIs and LTIs to create an automated
                system integrating with most LMS and databases, we can support a
                single sign-on system. Ensuring exam integrity by providing live
                person onboarding agents to verify identity and environment
                scans. Proctoring can be delivered by a live person, with AI
                assistance, or a standalone AI proctoring service.
              </li>
              <li>
                We strive to provide a more efficient and streamlined remote
                proctoring service for all users, both administrators, and
                candidates. By utilizing APIs and LTIs to create an automated
                system integrating with most LMS and databases, we can support a
                single sign-on system. Ensuring exam integrity by providing live
                person onboarding agents to verify identity and environment
                scans. Proctoring can be delivered by a live person, with AI
                assistance, or a standalone AI proctoring service.
              </li>
              <li>
                We strive to provide a more efficient and streamlined remote
                proctoring service for all users, both administrators, and
                candidates. By utilizing APIs and LTIs to create an automated
                system integrating with most LMS and databases, we can support a
                single sign-on system. Ensuring exam integrity by providing live
                person onboarding agents to verify identity and environment
                scans. Proctoring can be delivered by a live person, with AI
                assistance, or a standalone AI proctoring service.
              </li>
              <li>
                We strive to provide a more efficient and streamlined remote
                proctoring service for all users, both administrators, and
                candidates. By utilizing APIs and LTIs to create an automated
                system integrating with most LMS and databases, we can support a
                single sign-on system. Ensuring exam integrity by providing live
                person onboarding agents to verify identity and environment
                scans. Proctoring can be delivered by a live person, with AI
                assistance, or a standalone AI proctoring service.
              </li>
            </ol>
          </div>
          <div className="flex flex-wrap px-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={handleCheckboxChange}
            />
            <span className="p-2">
              I have read and accepted the terms and conditions
            </span>
            <span className="flex flex-auto"></span>
            <button
              disabled={!consent}
              style={{ marginLeft: "77rem" }}
              className={`bg-teal-600 text-slate-100 font-semibold rounded p-2 hover:bg-teal-700 ${
                !consent ? "cursor-not-allowed opacity-50" : ""
              }`}
              onClick={consentHandle}
            >
              Start Recording
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Recording;
