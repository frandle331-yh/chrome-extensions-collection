const PARENT_ID = "selecttools";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: PARENT_ID,
    title: "SelectTools",
    contexts: ["selection"],
  });

  const items = [
    { id: "char-count", title: "Character Count" },
    { id: "word-count", title: "Word Count" },
    { id: "sep1", type: "separator" },
    { id: "uppercase", title: "UPPERCASE" },
    { id: "lowercase", title: "lowercase" },
    { id: "title-case", title: "Title Case" },
    { id: "camel-case", title: "camelCase" },
    { id: "snake-case", title: "snake_case" },
    { id: "kebab-case", title: "kebab-case" },
    { id: "sep2", type: "separator" },
    { id: "base64-encode", title: "Base64 Encode" },
    { id: "base64-decode", title: "Base64 Decode" },
    { id: "url-encode", title: "URL Encode" },
    { id: "url-decode", title: "URL Decode" },
    { id: "sep3", type: "separator" },
    { id: "hash-md5", title: "MD5 Hash" },
    { id: "hash-sha1", title: "SHA-1 Hash" },
    { id: "hash-sha256", title: "SHA-256 Hash" },
    { id: "sep4", type: "separator" },
    { id: "json-format", title: "Format JSON" },
    { id: "json-minify", title: "Minify JSON" },
    { id: "sep5", type: "separator" },
    { id: "reverse", title: "Reverse Text" },
    { id: "trim", title: "Trim Whitespace" },
    { id: "remove-duplicates", title: "Remove Duplicate Lines" },
    { id: "sort-lines", title: "Sort Lines" },
  ];

  items.forEach((item) => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      type: item.type || "normal",
      parentId: PARENT_ID,
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!info.selectionText) return;

  chrome.tabs.sendMessage(tab.id, {
    action: info.menuItemId,
    text: info.selectionText,
  });
});
