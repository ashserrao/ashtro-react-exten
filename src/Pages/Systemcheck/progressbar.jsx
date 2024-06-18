import React from "react";
import "./stylar/progress.css";

function Progressbar({ progress }) {
  return (
    <div>
      <progress value={progress} max="100"></progress>
    </div>
  );
}

export default Progressbar;
