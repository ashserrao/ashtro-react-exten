let Images = [];
let previousTabId = null;

console.log("background.js is working");

// Uncomment this section if you want to add an action when the browser icon is clicked
// chrome.action.onClicked.addListener((tab) => {
//   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//     let activeTab = tabs[0];
//     let message = {
//       action: "trigger",
//     };
//     chrome.tabs.sendMessage(activeTab.id, message, (response) => {
//       console.log("bg working");
//     });
//   });
// });

// On message actions ================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "recording-page") {
    // chrome.windows.create({
    //   url: "chrome-extension://" + chrome.runtime.id + "/recording.html",
    //   type: "popup",
    //   width: 690,
    //   height: 750,
    // });
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
