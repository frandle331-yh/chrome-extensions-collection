let currentUrl = "";
let saveTimeout;

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentUrl = tab.url || "";

  // Show URL
  document.getElementById("url-bar").textContent = currentUrl;

  // Load note for current URL
  const data = await chrome.storage.local.get("notes");
  const notes = data.notes || {};
  const note = notes[currentUrl];

  if (note) {
    document.getElementById("note").value = note.text;
  }

  updateCount(notes);
}

function updateCount(notes) {
  const count = Object.keys(notes).filter((k) => notes[k].text.trim()).length;
  document.getElementById("count").textContent = count;
}

// Auto-save on input
document.getElementById("note").addEventListener("input", () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveNote, 300);
  document.getElementById("status").textContent = "...";
});

async function saveNote() {
  const text = document.getElementById("note").value;
  const data = await chrome.storage.local.get("notes");
  const notes = data.notes || {};

  if (text.trim()) {
    notes[currentUrl] = {
      text,
      updatedAt: new Date().toISOString(),
      title: document.title || currentUrl,
    };
  } else {
    delete notes[currentUrl];
  }

  await chrome.storage.local.set({ notes });
  document.getElementById("status").textContent = "Saved";
  updateCount(notes);
  setTimeout(() => {
    document.getElementById("status").textContent = "";
  }, 2000);
}

// Delete note
document.getElementById("delete").addEventListener("click", async () => {
  const data = await chrome.storage.local.get("notes");
  const notes = data.notes || {};
  delete notes[currentUrl];
  await chrome.storage.local.set({ notes });
  document.getElementById("note").value = "";
  document.getElementById("status").textContent = "Deleted";
  updateCount(notes);
});

// Export all notes
document.getElementById("export").addEventListener("click", async () => {
  const data = await chrome.storage.local.get("notes");
  const notes = data.notes || {};
  const entries = Object.entries(notes);

  if (entries.length === 0) {
    document.getElementById("status").textContent = "No notes to export";
    return;
  }

  let md = "# QuickNote Export\n\n";
  entries
    .sort((a, b) => (b[1].updatedAt || "").localeCompare(a[1].updatedAt || ""))
    .forEach(([url, note]) => {
      md += `## ${url}\n`;
      md += `*${new Date(note.updatedAt).toLocaleString()}*\n\n`;
      md += `${note.text}\n\n---\n\n`;
    });

  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quicknote-export-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
});

// All notes list
document.getElementById("all-notes").addEventListener("click", async () => {
  const data = await chrome.storage.local.get("notes");
  const notes = data.notes || {};
  const entries = Object.entries(notes).filter(([, n]) => n.text.trim());

  const list = document.getElementById("notes-list");
  const items = document.getElementById("notes-items");
  items.innerHTML = "";

  if (entries.length === 0) {
    items.innerHTML = '<div class="empty-state">No notes yet</div>';
  } else {
    entries
      .sort((a, b) => (b[1].updatedAt || "").localeCompare(a[1].updatedAt || ""))
      .forEach(([url, note]) => {
        const div = document.createElement("div");
        div.className = "note-item";
        div.innerHTML = `
          <div class="note-item-url">${escapeHtml(url)}</div>
          <div class="note-item-text">${escapeHtml(note.text.slice(0, 100))}</div>
          <div class="note-item-date">${new Date(note.updatedAt).toLocaleString()}</div>
        `;
        div.addEventListener("click", () => {
          chrome.tabs.create({ url });
        });
        items.appendChild(div);
      });
  }

  list.style.display = "flex";
});

document.getElementById("back-to-note").addEventListener("click", () => {
  document.getElementById("notes-list").style.display = "none";
});

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

init();
