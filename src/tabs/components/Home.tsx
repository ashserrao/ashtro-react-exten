import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";
import Progressbar from "./progressbar";
import "../tabs.css";

function Home() {
  const [cpuModel, setCpuModel] = useState("Loading...");
  const [cpuCores, setCpuCores] = useState(navigator.hardwareConcurrency);
  const [cpuUsed, setCpuUsed] = useState(40);
  const [coreUsage, setCoreUsage] = useState(Array(cpuCores).fill(0));
  const [updatedUsage, setUpdatedUsage] = useState(Array(cpuCores).fill(0));
  const [previousCPU, setPreviousCPU] = useState(null);
  const [ramUsage, setRamUsage] = useState(0);
  const [ramCapacity, setRamCapacity] = useState(0);

  useEffect(() => {
    // CPU Load ==================================
    const getSysInfo = () => {
      chrome.system.cpu.getInfo((info) => {
        let usedPers = 0;
        let newCoreUsage = [];

        for (let i = 0; i < info.numOfProcessors; i++) {
          const usage = info.processors[i].usage;
          let usedInPercentage = 0;

          if (previousCPU !== null) {
            const oldUsage = previousCPU.processors[i].usage;
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
          newCoreUsage.push(Math.round(usedInPercentage));
        }

        usedPers = Math.round(usedPers / info.numOfProcessors);
        newCoreUsage.splice(0, cpuCores);
        setCoreUsage(newCoreUsage.slice(0, cpuCores));
        setUpdatedUsage(newCoreUsage.slice(0, cpuCores));
        setCpuUsed(usedPers);
        setPreviousCPU(info);
        setCpuModel(info.modelName);
      });
        chrome.system.memory.getInfo((info) => {
          const usage =
            100 - Math.round((info.availableCapacity / info.capacity) * 100);
          const capacity = Math.round(info.capacity / 1000000000);
          setRamUsage(usage);
          setRamCapacity(capacity);
        });
    };

    const interval = setInterval(getSysInfo, 2000); // Fetch CPU info every second

    return () => clearInterval(interval); // Clean up on component unmount
  }, [previousCPU, cpuCores]);

  return (
    <div>
      <Navbar />
      <div className="my-0 mx-2">
        <h6 className="text-base font-medium">System Check</h6>
        <div className="h-5/6 border rounded overflow-y-scroll" id="clickcard">
          <h6 className="text-sm font-medium my-1 mx-2">
            Hardware Configurations
          </h6>
          <hr />
          <div className="my-1 mx-2 text-sm font-normal">
            <div className="text-xs font-medium">
              <div className="flex flex-wrap align-center">
                <img
                  className="h-fit mr-1"
                  src="/static/ram.svg"
                  alt="ram-icon"
                />
                RAM:
                <span className="mx-1" id="ram-capacity"></span>
                {/* <img
                  className="h-4 mx-1 my-auto"
                  id="ram-reqimg"
                  src="/static/loading.gif"
                /> */}
              </div>
              <div className="text-xs font-medium my-1 whitespace-nowrap">
                <p className=" w-full flex flex-wrap">
                  Overall RAM Usage<span className="flex flex-auto"></span>
                  <span className="mx-1" id="ram-usage">
                    {ramUsage}%
                  </span>
                  {/* minimum requirement addition */}
                  {/* <img
                    className="h-4 my-auto"
                    id="ram-usedimg"
                    src="/static/loading.gif"
                  /> */}
                </p>
              </div>
              <div className="w-full my-2">
                <Progressbar progress={ramUsage} />
              </div>
            </div>
          </div>
          <h1>CPU Information</h1>
          <p>Model: {cpuModel}</p>
          <p>Cores: {cpuCores}</p>
          <p>CPU Used: {cpuUsed}%</p>
          <Progressbar progress={cpuUsed} />
        </div>
      </div>
    </div>
  );
}

export default Home;
