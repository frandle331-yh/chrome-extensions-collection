let snapshots = [];
let compareData = null;

async function loadSnapshots() {
  const result = await chrome.storage.local.get("snapdiff");
  snapshots = (result.snapdiff || {}).snapshots || [];
}

async function saveSnapshots() {
  await chrome.storage.local.set({ snapdiff: { snapshots } });
}

function showView(id) {
  document.getElementById("main-view").style.display = id === "main" ? "" : "none";
  document.getElementById("compare-view").style.display = id === "compare" ? "" : "none";
}

function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

// === MAIN VIEW ===
function renderSnapshots() {
  const container = document.getElementById("snapshots");
  const empty = document.getElementById("empty");
  container.innerHTML = "";

  if (snapshots.length === 0) {
    empty.style.display = "";
    return;
  }
  empty.style.display = "none";

  snapshots.forEach((snap, i) => {
    const card = document.createElement("div");
    card.className = "snap-card";
    card.innerHTML = `
      <img class="snap-thumb" src="${snap.dataUrl}" alt="snapshot">
      <div class="snap-info">
        <div class="snap-url">${esc(snap.url)}</div>
        <div class="snap-date">${new Date(snap.timestamp).toLocaleString()}</div>
        <div class="snap-actions">
          <button class="compare">Compare with Current</button>
          <button class="delete">Delete</button>
        </div>
      </div>`;

    card.querySelector(".compare").addEventListener("click", () => compareWithCurrent(i));
    card.querySelector(".delete").addEventListener("click", async () => {
      snapshots.splice(i, 1);
      await saveSnapshots();
      renderSnapshots();
      showToast("Deleted");
    });

    container.appendChild(card);
  });
}

// === CAPTURE ===
document.getElementById("capture").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const dataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });

    snapshots.unshift({
      url: tab.url,
      title: tab.title,
      dataUrl,
      timestamp: Date.now(),
    });

    // Limit to 20 snapshots to manage storage
    if (snapshots.length > 20) snapshots = snapshots.slice(0, 20);

    await saveSnapshots();
    renderSnapshots();
    showToast("Captured!");
  } catch (e) {
    showToast("Cannot capture this page");
  }
});

// === COMPARE ===
async function compareWithCurrent(index) {
  const baseline = snapshots[index];

  try {
    const currentDataUrl = await chrome.tabs.captureVisibleTab(null, { format: "png" });

    compareData = {
      baseline: baseline.dataUrl,
      current: currentDataUrl,
      url: baseline.url,
    };

    showView("compare");
    renderCompare("diff");
  } catch {
    showToast("Cannot capture this page");
  }
}

async function renderCompare(mode) {
  const container = document.getElementById("compare-container");
  const statsDiv = document.getElementById("diff-stats");
  container.innerHTML = "";
  statsDiv.innerHTML = "";

  if (!compareData) return;

  if (mode === "side") {
    container.innerHTML = `
      <div class="side-by-side">
        <div>
          <div class="side-label">Baseline</div>
          <img src="${compareData.baseline}">
        </div>
        <div>
          <div class="side-label">Current</div>
          <img src="${compareData.current}">
        </div>
      </div>`;
    return;
  }

  // Load images for pixel comparison
  const [baseImg, currImg] = await Promise.all([
    loadImage(compareData.baseline),
    loadImage(compareData.current),
  ]);

  const w = Math.max(baseImg.width, currImg.width);
  const h = Math.max(baseImg.height, currImg.height);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  // Draw baseline
  const baseCanvas = document.createElement("canvas");
  baseCanvas.width = w;
  baseCanvas.height = h;
  const baseCtx = baseCanvas.getContext("2d");
  baseCtx.drawImage(baseImg, 0, 0);
  const baseData = baseCtx.getImageData(0, 0, w, h);

  // Draw current
  const currCanvas = document.createElement("canvas");
  currCanvas.width = w;
  currCanvas.height = h;
  const currCtx = currCanvas.getContext("2d");
  currCtx.drawImage(currImg, 0, 0);
  const currData = currCtx.getImageData(0, 0, w, h);

  // Pixel diff
  const diffData = ctx.createImageData(w, h);
  let changedPixels = 0;
  const totalPixels = w * h;
  const threshold = 30;

  for (let i = 0; i < baseData.data.length; i += 4) {
    const dr = Math.abs(baseData.data[i] - currData.data[i]);
    const dg = Math.abs(baseData.data[i + 1] - currData.data[i + 1]);
    const db = Math.abs(baseData.data[i + 2] - currData.data[i + 2]);
    const diff = dr + dg + db;

    if (diff > threshold) {
      changedPixels++;
      if (mode === "diff") {
        // Highlight in red
        diffData.data[i] = 255;
        diffData.data[i + 1] = 50;
        diffData.data[i + 2] = 80;
        diffData.data[i + 3] = 200;
      }
    } else {
      if (mode === "diff") {
        // Show dimmed original
        diffData.data[i] = currData.data[i];
        diffData.data[i + 1] = currData.data[i + 1];
        diffData.data[i + 2] = currData.data[i + 2];
        diffData.data[i + 3] = 80;
      }
    }
  }

  const changePercent = ((changedPixels / totalPixels) * 100).toFixed(2);

  statsDiv.innerHTML = `
    <div class="stat"><span class="dot changed"></span> Changed: ${changePercent}%</div>
    <div class="stat"><span class="dot same"></span> Unchanged: ${(100 - parseFloat(changePercent)).toFixed(2)}%</div>
    <div class="stat">${changedPixels.toLocaleString()} pixels differ</div>`;

  if (mode === "diff") {
    ctx.putImageData(diffData, 0, 0);
    container.appendChild(canvas);
  } else if (mode === "slider") {
    // Slider mode
    const wrapper = document.createElement("div");
    wrapper.className = "slider-container";
    wrapper.style.position = "relative";

    const currImgEl = document.createElement("img");
    currImgEl.src = compareData.current;
    currImgEl.style.width = "100%";
    currImgEl.style.display = "block";

    const overlay = document.createElement("div");
    overlay.className = "slider-overlay";
    overlay.style.width = "50%";

    const baseImgEl = document.createElement("img");
    baseImgEl.src = compareData.baseline;
    overlay.appendChild(baseImgEl);

    wrapper.appendChild(currImgEl);
    wrapper.appendChild(overlay);
    container.appendChild(wrapper);

    // Make slider draggable
    let dragging = false;
    wrapper.addEventListener("mousedown", () => { dragging = true; });
    document.addEventListener("mouseup", () => { dragging = false; });
    wrapper.addEventListener("mousemove", (e) => {
      if (!dragging) return;
      const rect = wrapper.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const pct = (x / rect.width) * 100;
      overlay.style.width = pct + "%";
    });

    // Set image width to match container once loaded
    currImgEl.onload = () => {
      baseImgEl.style.width = currImgEl.offsetWidth + "px";
    };
  }
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = src;
  });
}

// Compare mode change
document.getElementById("compare-mode").addEventListener("change", (e) => {
  renderCompare(e.target.value);
});

document.getElementById("compare-back").addEventListener("click", () => {
  showView("main");
});

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Init
loadSnapshots().then(renderSnapshots);
