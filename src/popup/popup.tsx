import React from "react";
import "./popup.css";
import Navbar from "../tabs/components/navbar";

const Popup = () => {
  function redirect() {
    chrome.windows.create({
      url: "chrome-extension://" + chrome.runtime.id + "/newTab.html",
      type: "popup",
      width: 690,
      height: 750,
    });
  }
  return (
    <div>
      <Navbar />
      <div className="flex justify-center">
        <a
          className="text-teal-600 underline underline-offset-2 mt-2 hover:text-teal-600 hover:underline underline-offset-2  hover:mt-2 hover:font-medium"
          onClick={redirect}
          target="_blank"
        >
          sign in
        </a>
      </div>
    </div>
  );
};

export default Popup;
