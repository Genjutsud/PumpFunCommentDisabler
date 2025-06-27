chrome.action.onClicked.addListener((tab) => {
  console.log("Extension icon clicked. Tab URL:", tab.url); // Log the URL immediately

  if (tab.url.startsWith("vivaldi://")) {
    console.warn("Can't run extension on Vivaldi internal browser pages.");
    return;
  }

  if (tab.url.startsWith("chrome://")) {
    console.warn("Can't run extension on Chrome internal browser pages.");
    return;
  }

  // Also consider other non-injectable schemes if applicable, e.g., file://
  if (!tab.url.startsWith("http://") && !tab.url.startsWith("https://")) {
      console.warn("Can't run extension on non-HTTP/HTTPS pages:", tab.url);
      return;
  }

  chrome.storage.local.get(["commentsEnabled"], (res) => {
    const newState = !(res.commentsEnabled ?? true);
    chrome.storage.local.set({ commentsEnabled: newState }, () => {
      // It's good practice to wrap executeScript in a try/catch or use .catch() for promises
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"]
      })
      .then(() => console.log("Content script injected successfully."))
      .catch(error => console.error("Error injecting content script:", error));
    });
  });
});