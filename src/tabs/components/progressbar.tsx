import React from "react";
import "../tabs.css";

const Progressbar = ({ progress }) => {
  return (
    <div className="progress-bar">
      <div
        className="progress-bar-fill"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Progressbar;
