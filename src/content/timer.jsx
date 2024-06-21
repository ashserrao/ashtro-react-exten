// Filename - Timer.js

import React, { useState, useRef, useEffect, useContext } from "react";
import { PopupContext } from "./Contentstate";

const Timer = () => {
  const { isRec } = useContext(PopupContext);
  const intervalRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  const [timer, setTimer] = useState("00:00:00");
  const [isRunning, setIsRunning] = useState(false);

  const startTimer = () => {
    // Clear any existing interval to avoid multiple intervals running
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const startTime = Date.now();

    const id = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const seconds = Math.floor((elapsedTime / 1000) % 60);
      const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
      const hours = Math.floor(elapsedTime / 1000 / 60 / 60);

      setTimer(
        `${hours > 9 ? hours : "0" + hours}:${
          minutes > 9 ? minutes : "0" + minutes
        }:${seconds > 9 ? seconds : "0" + seconds}`
      );
    }, 1000);

    intervalRef.current = id;
    setIsRunning(true);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);

    // Clear any existing reset timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }

    // Set timeout to reset timer after 5 seconds
    resetTimeoutRef.current = setTimeout(() => {
      resetTimer();
    }, 10000);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTimer("00:00:00");
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRec && !isRunning) {
      startTimer();
    } else if (!isRec && isRunning) {
      stopTimer();
    }
    // Cleanup interval on component unmount
    return () => {
      clearInterval(intervalRef.current);
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }
    };
  }, [isRec]); // Only re-run if isRec changes

  return (
    <div style={{ textAlign: "center", margin: "auto" }}>
      <h2
        style={{
          padding: "0 0.2rem",
          marginTop: "0.4rem",
          fontSize: "1rem",
          color: "black",
          fontFamily: "'Roboto', sans-serif",
        }}
      >
        {timer}
      </h2>
    </div>
  );
};

export default Timer;
