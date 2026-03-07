let colors = [];
let currentFormat = "hex";

function rgbToHex(r, g, b) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function formatColor(r, g, b, format) {
  switch (format) {
    case "hex": return rgbToHex(r, g, b);
    case "rgb": return `rgb(${r}, ${g}, ${b})`;
    case "hsl": return rgbToHsl(r, g, b);
    default: return rgbToHex(r, g, b);
  }
}

async function extractColors() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const colorMap = {};

      function parseColor(str) {
        if (!str || str === "transparent" || str === "rgba(0, 0, 0, 0)") return null;
        const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (m) return { r: parseInt(m[1]), g: parseInt(m[2]), b: parseInt(m[3]) };
        return null;
      }

      const elements = document.querySelectorAll("*");
      elements.forEach((el) => {
        const style = getComputedStyle(el);
        const props = [
          "color", "backgroundColor", "borderTopColor", "borderBottomColor",
          "borderLeftColor", "borderRightColor", "outlineColor",
          "textDecorationColor", "boxShadow",
        ];
        props.forEach((prop) => {
          const val = style[prop];
          if (!val) return;
          // Handle box-shadow which can have multiple colors
          const colorStrings = val.match(/rgba?\(\d+,\s*\d+,\s*\d+(?:,\s*[\d.]+)?\)/g) || [];
          if (colorStrings.length === 0 && val.match(/rgba?\(/)) return;
          if (colorStrings.length === 0) {
            const c = parseColor(val);
            if (c) {
              const key = `${c.r},${c.g},${c.b}`;
              colorMap[key] = (colorMap[key] || 0) + 1;
            }
          } else {
            colorStrings.forEach((cs) => {
              const c = parseColor(cs);
              if (c) {
                const key = `${c.r},${c.g},${c.b}`;
                colorMap[key] = (colorMap[key] || 0) + 1;
              }
            });
          }
        });
      });

      return Object.entries(colorMap)
        .map(([key, count]) => {
          const [r, g, b] = key.split(",").map(Number);
          return { r, g, b, count };
        })
        .sort((a, b) => b.count - a.count);
    },
  });

  return results[0].result || [];
}

function renderPalette() {
  const palette = document.getElementById("palette");
  palette.innerHTML = "";

  colors.forEach((c, i) => {
    const card = document.createElement("div");
    card.className = "color-card";
    card.innerHTML = `
      <div class="color-swatch" style="background: rgb(${c.r},${c.g},${c.b})"></div>
      <div class="color-info">
        <div class="color-value">${formatColor(c.r, c.g, c.b, currentFormat)}</div>
        <div class="color-count">Used ${c.count}x</div>
      </div>`;

    card.addEventListener("click", () => {
      const value = formatColor(c.r, c.g, c.b, currentFormat);
      navigator.clipboard.writeText(value);
      card.classList.add("copied");
      card.querySelector(".color-value").textContent = "Copied!";
      setTimeout(() => {
        card.classList.remove("copied");
        card.querySelector(".color-value").textContent = value;
      }, 1000);
    });

    palette.appendChild(card);
  });
}

async function init() {
  try {
    colors = await extractColors();
    document.getElementById("loading").style.display = "none";
    document.getElementById("content").style.display = "block";
    renderPalette();
  } catch {
    document.getElementById("loading").textContent = "Cannot scan this page";
  }
}

// Format change
document.getElementById("format").addEventListener("change", (e) => {
  currentFormat = e.target.value;
  renderPalette();
});

// Refresh
document.getElementById("refresh").addEventListener("click", () => {
  document.getElementById("loading").style.display = "block";
  document.getElementById("content").style.display = "none";
  document.getElementById("loading").textContent = "Scanning colors...";
  init();
});

// Copy all
document.getElementById("copy-all").addEventListener("click", () => {
  const text = colors.map((c) => formatColor(c.r, c.g, c.b, currentFormat)).join("\n");
  navigator.clipboard.writeText(text);
  showToast("All colors copied!");
});

// Copy as CSS variables
document.getElementById("copy-css").addEventListener("click", () => {
  const lines = colors.map((c, i) => `  --color-${i + 1}: ${formatColor(c.r, c.g, c.b, currentFormat)};`);
  const css = `:root {\n${lines.join("\n")}\n}`;
  navigator.clipboard.writeText(css);
  showToast("CSS variables copied!");
});

function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

init();
