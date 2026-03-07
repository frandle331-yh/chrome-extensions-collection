function toTitleCase(str) {
  return str.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase());
}

function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function toSnakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

async function hashText(text, algorithm) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Simple MD5 implementation (Web Crypto doesn't support MD5)
function md5(string) {
  function md5cycle(x, k) {
    let a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);  d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);   b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);   d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);  b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);   d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);      b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);  d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);   d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);  b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);   d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);  b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);  b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);      d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);  d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);  b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);   d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);  b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);   d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);  b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);   d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);  d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);   b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);   d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);   d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);   b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) { a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b); }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function add32(a, b) { return (a + b) & 0xFFFFFFFF; }

  const n = string.length;
  let state = [1732584193, -271733879, -1732584194, 271733878];
  let tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  let i, lo;
  for (i = 64; i <= n; i += 64) {
    const block = [];
    for (let j = 0; j < 64; j += 4) {
      block.push(string.charCodeAt(i - 64 + j) | (string.charCodeAt(i - 64 + j + 1) << 8) | (string.charCodeAt(i - 64 + j + 2) << 16) | (string.charCodeAt(i - 64 + j + 3) << 24));
    }
    md5cycle(state, block);
  }
  for (lo = 0; i + lo < n; lo++) {
    tail[lo >> 2] |= string.charCodeAt(i + lo) << ((lo % 4) << 3);
  }
  tail[lo >> 2] |= 0x80 << ((lo % 4) << 3);
  if (lo > 55) { md5cycle(state, tail); tail = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; }
  tail[14] = n * 8;
  md5cycle(state, tail);

  const hex_chr = "0123456789abcdef";
  let s = "";
  for (i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      s += hex_chr.charAt((state[i] >> (j * 8 + 4)) & 0x0f) + hex_chr.charAt((state[i] >> (j * 8)) & 0x0f);
    }
  }
  return s;
}

async function processAction(action, text) {
  switch (action) {
    case "char-count": {
      const chars = text.length;
      const noSpace = text.replace(/\s/g, "").length;
      const bytes = new Blob([text]).size;
      return { display: `Characters: ${chars} (no spaces: ${noSpace})\nBytes: ${bytes}`, copy: `${chars}` };
    }
    case "word-count": {
      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const lines = text.split("\n").length;
      return { display: `Words: ${words}\nLines: ${lines}`, copy: `${words}` };
    }
    case "uppercase":
      return { result: text.toUpperCase() };
    case "lowercase":
      return { result: text.toLowerCase() };
    case "title-case":
      return { result: toTitleCase(text) };
    case "camel-case":
      return { result: toCamelCase(text) };
    case "snake-case":
      return { result: toSnakeCase(text) };
    case "kebab-case":
      return { result: toKebabCase(text) };
    case "base64-encode":
      return { result: btoa(unescape(encodeURIComponent(text))) };
    case "base64-decode":
      try {
        return { result: decodeURIComponent(escape(atob(text))) };
      } catch {
        return { error: "Invalid Base64 string" };
      }
    case "url-encode":
      return { result: encodeURIComponent(text) };
    case "url-decode":
      try {
        return { result: decodeURIComponent(text) };
      } catch {
        return { error: "Invalid URL-encoded string" };
      }
    case "hash-md5":
      return { result: md5(text) };
    case "hash-sha1":
      return { result: await hashText(text, "SHA-1") };
    case "hash-sha256":
      return { result: await hashText(text, "SHA-256") };
    case "json-format":
      try {
        return { result: JSON.stringify(JSON.parse(text), null, 2) };
      } catch {
        return { error: "Invalid JSON" };
      }
    case "json-minify":
      try {
        return { result: JSON.stringify(JSON.parse(text)) };
      } catch {
        return { error: "Invalid JSON" };
      }
    case "reverse":
      return { result: [...text].reverse().join("") };
    case "trim":
      return { result: text.trim().replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n") };
    case "remove-duplicates": {
      const lines = text.split("\n");
      const unique = [...new Set(lines)];
      return { result: unique.join("\n"), display: `Removed ${lines.length - unique.length} duplicate lines` };
    }
    case "sort-lines":
      return { result: text.split("\n").sort().join("\n") };
    default:
      return { error: "Unknown action" };
  }
}

function showResultPopup(data) {
  // Remove existing popup
  const existing = document.getElementById("selecttools-popup");
  if (existing) existing.remove();

  const popup = document.createElement("div");
  popup.id = "selecttools-popup";

  if (data.error) {
    popup.innerHTML = `
      <div class="st-header">
        <span class="st-title">SelectTools</span>
        <button class="st-close">&times;</button>
      </div>
      <div class="st-error">${data.error}</div>`;
  } else if (data.display) {
    const copyText = data.copy || data.result || data.display;
    popup.innerHTML = `
      <div class="st-header">
        <span class="st-title">SelectTools</span>
        <button class="st-close">&times;</button>
      </div>
      <pre class="st-result">${escapeHtml(data.display)}</pre>
      <button class="st-copy">Copy</button>`;
    popup.querySelector(".st-copy").addEventListener("click", () => {
      navigator.clipboard.writeText(copyText);
      popup.querySelector(".st-copy").textContent = "Copied!";
      setTimeout(() => popup.remove(), 800);
    });
  } else if (data.result) {
    popup.innerHTML = `
      <div class="st-header">
        <span class="st-title">SelectTools</span>
        <button class="st-close">&times;</button>
      </div>
      <pre class="st-result">${escapeHtml(data.result)}</pre>
      <button class="st-copy">Copy</button>`;
    popup.querySelector(".st-copy").addEventListener("click", () => {
      navigator.clipboard.writeText(data.result);
      popup.querySelector(".st-copy").textContent = "Copied!";
      setTimeout(() => popup.remove(), 800);
    });
  }

  popup.querySelector(".st-close").addEventListener("click", () => popup.remove());

  document.body.appendChild(popup);

  // Close on outside click
  const handler = (e) => {
    if (!popup.contains(e.target)) {
      popup.remove();
      document.removeEventListener("click", handler);
    }
  };
  setTimeout(() => document.addEventListener("click", handler), 100);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

chrome.runtime.onMessage.addListener((msg) => {
  if (!msg.action || !msg.text) return;
  processAction(msg.action, msg.text).then(showResultPopup);
});
