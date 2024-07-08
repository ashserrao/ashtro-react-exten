let Images = [];
let previousTabId = null;
let recStatus = false;
let Flags = [];

console.log("background.js is working");

// On message actions ================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "recording-page") {
    recordTabId();
    openRecPage();
    sendResponse("page triggered");
  } else if (
    message.action === "id-cards" ||
    message.action === "face-capture"
  ) {
    let temparray = message.data;
    temparray.forEach((element) => {
      Images.push(element);
    });
    console.log(Images);
    sendResponse(
      "received " + (message.action === "id-cards" ? "ID's" : "Face photo")
    );
  } else if (message.action === "record-tab") {
    recordTabId();
    sendResponse("recorded-tab");
  } else if (message.action === "switch-tab") {
    switchBackToPreviousTab();
    sendResponse("switched-tab");
  } else if (message.action === "check-recording-status") {
    // recStatus = message.data;
    sendResponse(recStatus);
  } else if (message.action === "switch-recording-status") {
    openRecPage();
    // recStatus = message.data;
    console.log(recStatus);
  } else if (message.action === "getFlags") {
    if (Flags) {
      sendResponse(Flags[0]);
      Flags.shift();
    }
  } else if (message.action === "sendFlags") {
    Flags.push(message.data);
    sendResponse("Flag received.");
  } else if (message.action === "content-blocked") {
    openContPage();
  }
});

// Record the active tab when the popup is loaded
function recordTabId() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length > 0) {
      previousTabId = tabs[0].id;
      console.log("Recorded active Tab ID: ", previousTabId);
    }
  });
  return true;
}

// Function to switch back to the previous tab
function switchBackToPreviousTab() {
  if (previousTabId !== null) {
    chrome.tabs.update(previousTabId, { active: true }, function (tab) {
      if (chrome.runtime.lastError) {
        console.error(
          "Error switching back to the previous tab: ",
          chrome.runtime.lastError
        );
      } else {
        console.log("Switched back to Tab ID: ", previousTabId);
      }
    });
  }
}

//Trigger recording page =====================================
function openRecPage() {
  const url = `chrome-extension://${chrome.runtime.id}/recording.html`;

  chrome.tabs.query({ url: url }, function (tabs) {
    if (tabs.length > 0) {
      // If the tab is found, make it the active tab
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      // If the tab is not found, create a new tab
      chrome.tabs.create({ url: url });
    }
  });
}

//Trigger contact page ======================================
function openContPage() {
  const url = `chrome-extension://${chrome.runtime.id}/contact.html`;

  chrome.tabs.query({ url: url }, function (tabs) {
    if (tabs.length > 0) {
      // If the tab is found, make it the active tab
      chrome.tabs.update(tabs[0].id, { active: true });
    } else {
      // If the tab is not found, create a new tab
      chrome.tabs.create({ url: url });
    }
  });
}
