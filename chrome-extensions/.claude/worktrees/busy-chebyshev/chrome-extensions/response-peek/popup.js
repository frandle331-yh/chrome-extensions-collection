const SECURITY_HEADERS = [
  "strict-transport-security",
  "content-security-policy",
  "x-content-type-options",
  "x-frame-options",
  "x-xss-protection",
  "referrer-policy",
  "permissions-policy",
  "cross-origin-opener-policy",
  "cross-origin-resource-policy",
  "cross-origin-embedder-policy",
];

const CACHE_HEADERS = [
  "cache-control",
  "expires",
  "etag",
  "last-modified",
  "age",
  "vary",
  "cdn-cache-control",
  "x-cache",
  "cf-cache-status",
];

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.runtime.sendMessage({ action: "getHeaders", tabId: tab.id }, (data) => {
    if (!data) {
      document.getElementById("loading").textContent = "No headers captured. Reload the page and try again.";
      return;
    }

    const headerMap = {};
    data.headers.forEach((h) => {
      headerMap[h.name.toLowerCase()] = h.value;
    });

    // Status bar
    const statusClass = `s${Math.floor(data.statusCode / 100)}xx`;
    document.getElementById("status-bar").innerHTML = `
      <span class="status-code ${statusClass}">${data.statusCode}</span>
      <span class="status-url">${escapeHtml(data.url)}</span>`;

    // Security headers
    const secSection = document.getElementById("security");
    const secPresent = SECURITY_HEADERS.filter((h) => headerMap[h]);
    const secScore = Math.round((secPresent.length / SECURITY_HEADERS.length) * 100);
    const secBadge = secScore >= 70 ? "good" : secScore >= 40 ? "warn" : "bad";

    secSection.innerHTML = `<div class="section-title">Security Headers <span class="badge ${secBadge}">${secScore}%</span></div>`;
    SECURITY_HEADERS.forEach((name) => {
      const row = document.createElement("div");
      row.className = "row";
      if (headerMap[name]) {
        row.innerHTML = `<div class="row-name">${name}</div><div class="row-value">${escapeHtml(headerMap[name])}</div>`;
      } else {
        row.innerHTML = `<div class="row-name">${name}</div><div class="row-value row-missing">Missing</div>`;
      }
      row.addEventListener("click", () => {
        if (headerMap[name]) {
          navigator.clipboard.writeText(headerMap[name]);
          showToast("Copied!");
        }
      });
      secSection.appendChild(row);
    });

    // Cache headers
    const cacheSection = document.getElementById("caching");
    const cachePresent = CACHE_HEADERS.filter((h) => headerMap[h]);
    cacheSection.innerHTML = `<div class="section-title">Caching <span class="badge ${cachePresent.length > 0 ? "good" : "warn"}">${cachePresent.length} set</span></div>`;
    CACHE_HEADERS.forEach((name) => {
      if (!headerMap[name]) return;
      const row = document.createElement("div");
      row.className = "row";
      row.innerHTML = `<div class="row-name">${name}</div><div class="row-value">${escapeHtml(headerMap[name])}</div>`;
      row.addEventListener("click", () => {
        navigator.clipboard.writeText(headerMap[name]);
        showToast("Copied!");
      });
      cacheSection.appendChild(row);
    });

    // All headers
    const allSection = document.getElementById("all-headers");
    allSection.innerHTML = `<div class="section-title">All Headers <span class="badge good">${data.headers.length}</span></div>`;
    data.headers
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((h) => {
        const row = document.createElement("div");
        row.className = "row";
        row.innerHTML = `<div class="row-name">${escapeHtml(h.name)}</div><div class="row-value">${escapeHtml(h.value)}</div>`;
        row.addEventListener("click", () => {
          navigator.clipboard.writeText(`${h.name}: ${h.value}`);
          showToast("Copied!");
        });
        allSection.appendChild(row);
      });

    document.getElementById("loading").style.display = "none";
    document.getElementById("content").style.display = "block";
  });
}

document.getElementById("copy-all").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ action: "getHeaders", tabId: tab.id }, (data) => {
    if (!data) return;
    const text = data.headers.map((h) => `${h.name}: ${h.value}`).join("\n");
    navigator.clipboard.writeText(text);
    showToast("All headers copied!");
  });
});

function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

init();
