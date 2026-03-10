const headerStore = {};

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    if (details.type === "main_frame") {
      headerStore[details.tabId] = {
        url: details.url,
        statusCode: details.statusCode,
        statusLine: details.statusLine,
        headers: details.responseHeaders || [],
        timestamp: Date.now(),
      };
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// Clean up on tab close
chrome.tabs.onRemoved.addListener((tabId) => {
  delete headerStore[tabId];
});

// Listen for popup requests
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getHeaders") {
    const data = headerStore[msg.tabId] || null;
    sendResponse(data);
  }
  return true;
});
