import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Consent from "./Components/consent";
import Idscan from "./Components/id_scan";
import Facescan from "./Components/face_scan";
import Recording from "./Components/recording";

import { Routes, Route } from "react-router-dom";

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

function Module() {
  const navigate = useNavigate();
  useEffect(() => {
    //   const interval = setInterval(() => {
    chrome.storage.local.get(["recTrigger"], function (result) {
      if (result.recTrigger === "startRec" || result.recTrigger === "stopRec") {
        navigate("/recording.html/recordings");
      } else if (result.recTrigger === " ") {
        return true;
      }
    });
    // }, 1000);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="recording.html/" element={<Consent />} />
        <Route exact path="recording.html/id_scan" element={<Idscan />} />
        <Route exact path="recording.html/face_scan" element={<Facescan />} />
        <Route exact path="recording.html/recordings" element={<Recording />} />
      </Routes>
    </div>
  );
}

export default Module;
export { Navbar };
