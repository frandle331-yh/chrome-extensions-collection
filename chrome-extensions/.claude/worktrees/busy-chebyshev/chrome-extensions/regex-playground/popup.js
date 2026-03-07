const patternInput = document.getElementById("pattern");
const flagsInput = document.getElementById("flags");
const testInput = document.getElementById("test-string");
const highlighted = document.getElementById("highlighted");
const matchList = document.getElementById("match-list");
const matchCount = document.getElementById("match-count");
const errorDiv = document.getElementById("error");

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function runRegex() {
  const pattern = patternInput.value;
  const flags = flagsInput.value;
  const text = testInput.value;

  errorDiv.style.display = "none";
  highlighted.innerHTML = escapeHtml(text);
  matchList.innerHTML = "";
  matchCount.textContent = "0";

  if (!pattern) return;

  let regex;
  try {
    regex = new RegExp(pattern, flags);
  } catch (e) {
    errorDiv.textContent = e.message;
    errorDiv.style.display = "block";
    return;
  }

  const matches = [];
  let match;
  let lastIndex = -1;

  if (flags.includes("g")) {
    while ((match = regex.exec(text)) !== null) {
      if (match.index === lastIndex) {
        regex.lastIndex++;
        continue;
      }
      lastIndex = match.index;
      matches.push({
        value: match[0],
        index: match.index,
        groups: match.slice(1),
      });
      if (matches.length > 500) break;
    }
  } else {
    match = regex.exec(text);
    if (match) {
      matches.push({
        value: match[0],
        index: match.index,
        groups: match.slice(1),
      });
    }
  }

  matchCount.textContent = matches.length;

  // Highlight
  if (matches.length > 0) {
    let html = "";
    let cursor = 0;

    matches.forEach((m) => {
      html += escapeHtml(text.slice(cursor, m.index));
      html += `<mark>${escapeHtml(m.value)}</mark>`;
      cursor = m.index + m.value.length;
    });
    html += escapeHtml(text.slice(cursor));
    highlighted.innerHTML = html;
  }

  // Match list
  matches.slice(0, 100).forEach((m, i) => {
    const item = document.createElement("div");
    item.className = "match-item";

    let groupsHtml = "";
    if (m.groups.length > 0) {
      groupsHtml = m.groups
        .map((g, gi) => `<span class="match-groups">Group ${gi + 1}: ${escapeHtml(g || "(empty)")}</span>`)
        .join(" ");
    }

    item.innerHTML = `
      <span class="match-index">${i + 1}</span>
      <div>
        <span class="match-value">${escapeHtml(m.value)}</span>
        <span class="match-index">[${m.index}]</span>
        ${groupsHtml ? `<div>${groupsHtml}</div>` : ""}
      </div>`;
    matchList.appendChild(item);
  });
}

// Live update
let timeout;
function debouncedRun() {
  clearTimeout(timeout);
  timeout = setTimeout(runRegex, 150);
}

patternInput.addEventListener("input", debouncedRun);
flagsInput.addEventListener("input", debouncedRun);
testInput.addEventListener("input", debouncedRun);

// Copy matches
document.getElementById("copy-matches").addEventListener("click", () => {
  const items = document.querySelectorAll(".match-value");
  const text = [...items].map((el) => el.textContent).join("\n");
  navigator.clipboard.writeText(text);
  document.getElementById("copy-matches").textContent = "Copied!";
  setTimeout(() => {
    document.getElementById("copy-matches").textContent = "Copy";
  }, 1500);
});

// Cheat sheet
document.getElementById("cheat-toggle").addEventListener("click", () => {
  document.getElementById("cheat-sheet").style.display = "block";
});
document.getElementById("cheat-close").addEventListener("click", () => {
  document.getElementById("cheat-sheet").style.display = "none";
});

// Run on load
runRegex();
