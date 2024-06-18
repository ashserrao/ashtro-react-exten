import React, { useEffect, useState, useRef } from "react";
import { Navbar } from "../Recording/recording";
import Progressbar from "./Progressbar";

function Systemcheck() {
  const cardRef = useRef(null);
  const [cpuModel, setCpuModel] = useState("Loading...");
  const [cpuCores, setCpuCores] = useState(navigator.hardwareConcurrency);
  const [cpuUsed, setCpuUsed] = useState(40);
  const [coreUsage, setCoreUsage] = useState([]);
  const [ramUsed, setRamUsage] = useState(40);
  const [ramCapacity, setRamCapacity] = useState("4");
  let previousCPU = null;

  useEffect(() => {
    const interval = setInterval(SysStat, 2000);
    const timeout = setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.classList.add("clickcard");
      }
    }, 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  function SysStat() {
    // CPU Load ==================================
    chrome.system.cpu.getInfo(function (info) {
      let usedPers = 0;
      let core_usage = [];
      for (let i = 0; i < info.numOfProcessors; i++) {
        let usage = info.processors[i].usage;
        let usedInPercentage;
        if (previousCPU !== null) {
          let oldUsage = previousCPU.processors[i].usage;
          usedInPercentage = Math.floor(
            ((usage.kernel + usage.user - oldUsage.kernel - oldUsage.user) /
              (usage.total - oldUsage.total)) *
              100
          );
        } else {
          usedInPercentage = Math.floor(
            ((usage.kernel + usage.user) / usage.total) * 100
          );
        }
        usedPers += usedInPercentage;
        core_usage.push(Math.round(usedInPercentage));
      }
      setCoreUsage(core_usage);
      setCpuUsed(Math.round(usedPers / info.numOfProcessors));
      setCpuModel(info.modelName);
      previousCPU = info;
    });

    // RAM Load ================================
    chrome.system.memory.getInfo(function (info) {
      setRamCapacity(parseInt(info.capacity / 1000000000));
      const ram_usage =
        100 - Math.round((info.availableCapacity / info.capacity) * 100);
      setRamUsage(ram_usage);
    });
  }

  return (
    <div>
      <style>
        {`
          .clickcard {
            animation: blinkingBackground 2s infinite;
          }

          @keyframes blinkingBackground {
            0% { background-color: #fff; }
            25% { background-color: #b9eafa; }
            50% { background-color: #fff; }
            75% { background-color: #b9eafa; }
            100% { background-color: #fff; }
          }
        `}
      </style>
      <Navbar />
      <div className="my-0 mx-2">
        <h6 className="text-base font-medium">System Check</h6>
        <div
          className="h-5/6 border rounded overflow-y-scroll"
          onClick={() => {
            window.location = "softconfig.html";
          }}
          ref={cardRef}
          id="clickcard"
        >
          <h6 className="text-sm font-medium my-1 mx-2">
            Hardware Configurations
          </h6>
          <hr />
          <div className="my-1 mx-2 text-sm font-normal">
            <div className="text-xs font-medium">
              <div className="flex flex-wrap align-center">
                <img
                  className="h-fit mr-1"
                  src="./assets/ram.svg"
                  alt="ram-icon"
                />
                RAM :{" "}
                <span className="mx-1" id="ram-capacity">
                  {ramCapacity} GB
                </span>
                <img
                  className="h-4 mx-1 my-auto"
                  id="ram-reqimg"
                  src="/assets/loading.gif"
                  alt="loading"
                />
              </div>
              <div className="text-xs font-medium my-1 whitespace-nowrap">
                <p className="w-full flex flex-wrap">
                  Overall RAM Usage
                  <span className="flex flex-auto"></span>
                  <span className="mx-1" id="ram-usage">
                    {ramUsed}%
                  </span>
                  <img
                    className="h-4 my-auto"
                    id="ram-usedimg"
                    src="/assets/loading.gif"
                    alt="loading"
                  />
                </p>
              </div>
              <div className="ram-container w-full my-2">
                <div className="ram-progress">
                  <Progressbar progress={ramUsed} />
                </div>
              </div>
            </div>
            <div className="my-1">
              <div className="text-xs font-medium flex flex-wrap my-2">
                <div className="my-1 flex flex-wrap items-center">
                  <img
                    className="mr-1"
                    src="/assets/memory.svg"
                    alt="memory-icon"
                  />
                  <span>Processor:</span>
                </div>
                <span className="flex flex-auto"></span>
                <span
                  className="text-xs text-right my-1 w-auto max-w-44 font-semibold mx-1"
                  id="cpu-model"
                >
                  {cpuModel}
                </span>
                <img
                  id="cpu-name"
                  className="my-auto h-4"
                  src="/assets/loading.gif"
                  alt="loading"
                />
              </div>
              <div className="text-xs font-medium flex flex-wrap align-center my-2">
                <div className="my-1 flex flex-wrap">
                  <img
                    className="mr-1"
                    src="/assets/memory.svg"
                    alt="memory-icon"
                  />
                  CPU Cores:
                </div>
                <span className="flex flex-auto"></span>
                <span
                  className="my-1 text-right w-auto max-w-44 font-semibold mx-1"
                  id="cpu-core"
                >
                  {cpuCores}
                </span>
                <img
                  id="core-number"
                  className="h-4 my-auto"
                  src="/assets/loading.gif"
                  alt="loading"
                />
              </div>
            </div>
            <div className="cpu-chart my-2">
              <div className="text-xs font-medium">
                <p className="w-full flex flex-wrap whitespace-nowrap my-2">
                  <span>Overall CPU Usage</span>
                  <span className="flex flex-auto"></span>
                  <span className="mx-1" id="cpu-usage">
                    {cpuUsed}%
                  </span>
                  <img
                    id="cpu-req"
                    className="my-auto h-4"
                    src="/assets/loading.gif"
                    alt="loading"
                  />
                </p>
                <div className="cpu-container">
                  <div className="pb-4">
                    <Progressbar progress={cpuUsed} />
                  </div>
                </div>
                <div className="border rounded p-1">
                  <div id="core-chart" className="grid grid-cols-2 gap-2">
                    {coreUsage.map((usage, index) => (
                      <div key={index}>
                        <span>
                          CPU{index + 1}
                          <span className="pl-28"></span> {usage}%
                        </span>
                        <Progressbar progress={usage} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Systemcheck;
