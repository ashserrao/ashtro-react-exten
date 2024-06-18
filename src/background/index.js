console.log("background.js is working");

chrome.action.onClicked.addListener((tab) => {
  // Query the active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    let message = {
      action: "trigger",
    };
    // Send a message to the active tab
    // chrome.tabs.sendMessage(activeTab.id, message, (response) => {
    //   console.log("bg working");
    // });
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "recording-page") {
    chrome.windows.create({
      url: "chrome-extension://" + chrome.runtime.id + "/recording.html",
      type: "popup",
      width: 690,
      height: 750,
    });
  }
});
