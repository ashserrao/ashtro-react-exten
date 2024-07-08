console.log("content.js is injected");
// import statements =======================================
import React from "react";
import ReactDOM from "react-dom";
import "../index.css";
import Content from "./content";
import { StateProvider } from "./Contentstate";
// Declarations ===================================
const loginStatus = true;
const liveLink = " ";
const e_Status = "exam-ongoing";

//Trigger popup =====================================
setTimeout(() => {
  Trigger();
}, 3000);

function Trigger() {
  let rootElement = document.getElementById("root");
  // Create the root element if it doesn't exist
  if (!rootElement) {
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  }

  ReactDOM.render(
    <React.StrictMode>
      <StateProvider>
        <Content />
      </StateProvider>
    </React.StrictMode>,
    rootElement
  );
  return true;
}

// Key Blocker functions======================================
document.addEventListener("DOMContentLoaded", function (e) {
  let spaceCount = 0;
  const body = document.querySelector("body");

  // block content function ----------------------
  const blockContent = () => {
    if (
      loginStatus === true &&
      liveLink !== "https://testdeliveryconsole.examroom.ai/#/auth/login"
    ) {
      // body.style.opacity = "0";
      console.log("content blocked");
      let message = {
        action: "content-blocked",
      };
      chrome.runtime.sendMessage(message, (response) => {
        console.log("Check if working:", response);
      });
    } else {
      console.log("content block failed since user is not logged in");
    }
  };

  // unblock content function ----------------------
  const unBlockContent = () => {
    let value = {
      remark: `Content was unblocked in the url ${window.location.href}`,
    };
    disabledEvent(e);
    actionLogger(JSON.stringify(value));
    body.style.opacity = "1";
  };

  //fullscreen exit detection======================
  document.addEventListener("fullscreenchange", exitHandler, false);
  document.addEventListener("mozfullscreenchange", exitHandler, false);
  document.addEventListener("MSFullscreenChange", exitHandler, false);
  document.addEventListener("webkitfullscreenchange", exitHandler, false);

  function exitHandler() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      let value = {
        remark: `Candidate has exited the full screen ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
      blockContent();
    }
  }

  document.addEventListener("keydown", function (e) {
    if (e.altKey && "tab".indexOf(e.key) !== -1) {
      blockContent();
      let value = {
        remark: `Content blocked since the candidate pressed alt and ${e.key} key which is not allowed in the url ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
    } else if (
      (e.metaKey && e.key == "PrintScreen") ||
      e.key == "PrintScreen"
    ) {
      blockContent();
      let value = {
        remark: `Content blocked since the candidate tried to print the screen in the url ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
    } else if (e.ctrlKey && e.shiftKey) {
      blockContent();
      let value = {
        remark: `Content blocked since the candidate pressed ctrl and ${e.key} in the url ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
    } else if (e.shiftKey && e.metaKey) {
      let value = {
        remark: `Content blocked since the candidate pressed shift and ${e.metaKey} in the url ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
    } else if (e.ctrlKey && e.shiftKey && "34".indexOf(e.key)) {
      blockContent();
      let value = {
        remark: `Pressed ctrl key, shift key and ${e.key} key in the url ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
    } else if (e.ctrlKey && e.shiftKey) {
      blockContent();
      let value = {
        remark: `Pressed ctrl key, shift key and ${e.key} key in the url ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
      blockContent();
    } else if (
      [
        // "Shift",
        "Control",
        "Alt",
        "Meta",
        "meta",
        "control",
        "alt",
        // "shift",
        "Escape",
        "escape",
      ].includes(e.key)
    ) {
      blockContent();
      let value = {
        remark: `Content blocked since the candidate pressed ${e.key} key which is not allowed in the url ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
    } else if (
      [
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
      ].includes(e.key)
    ) {
      let value = {
        remark: `Content blocked since the candidate pressed ${e.key} key which is not allowed in the url ${window.location.href}`,
      };
      actionLogger(JSON.stringify(value));
    } else if (e.ctrlKey && "cvxspwuaz".indexOf(e.key) !== -1) {
      let value = {
        remark: `Content blocked since the candidate pressed ctrl key and ${e.key} in the url ${window.location.href}`,
      };
      disabledEvent(e);
      actionLogger(JSON.stringify(value));
    } else if (e.key === " ") {
      spaceCount++;
      if (spaceCount === 2) {
        unBlockContent();
        spaceCount = 0;
        makeTabFullScreen();
      }
    } else {
      console.log("Keydown event failed", e);
    }
  });

  //logging trigger===================================
  function actionLogger(cmt) {
    let flag = {
      flag_type: "red",
      transfer_to: "Don''t Transfer",
      reason: "Extension Restricted activity",
      attachments: "",
      object: "",
      comment: cmt,
      timestamp: Date.now()
    };
    let message = {
      action: "sendFlags",
      data: flag,
    };
    chrome.runtime.sendMessage(message, (response) => {
      console.log(response);
    });
    console.log("Flag triggered");
    // setTimeout(() => {
    //   makeTabFullScreen();
    // }, 1000);
  }

  // Function to make the tab full screen====================
  function makeTabFullScreen() {
    const docElm = document.documentElement;
    if (loginStatus === true && e_Status === "exam-ongoing") {
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        // Firefox
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullscreen) {
        // Chrome, Safari and Opera
        docElm.webkitRequestFullscreen();
      } else if (docElm.msRequestFullscreen) {
        // IE/Edge
        docElm.msRequestFullscreen();
        disabledEvent(docElm); // This function call should be placed correctly
      }
      console.log("fullscreen");
    } else {
      console.log("exam is not running!");
    }
  }
});

// disabled event function =============================
function disabledEvent(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  } else if (window.event) {
    window.event.cancelBubble = true;
  } else {
    e.preventDefault();
    return false;
  }
}
