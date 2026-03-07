async function extractMeta() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const getMeta = (name) => {
        const el =
          document.querySelector(`meta[property="${name}"]`) ||
          document.querySelector(`meta[name="${name}"]`);
        return el ? el.getAttribute("content") : "";
      };

      const headings = [...document.querySelectorAll("h1,h2,h3,h4")].map(
        (h) => ({ tag: h.tagName.toLowerCase(), text: h.textContent.trim().slice(0, 100) })
      );

      const allMeta = [...document.querySelectorAll("meta")].map((m) => ({
        name: m.getAttribute("name") || m.getAttribute("property") || m.getAttribute("http-equiv") || "",
        content: m.getAttribute("content") || "",
      })).filter((m) => m.name && m.content);

      return {
        url: location.href,
        title: document.title,
        description: getMeta("description"),
        canonical: document.querySelector('link[rel="canonical"]')?.href || "",
        charset: document.characterSet,
        lang: document.documentElement.lang || "",
        ogTitle: getMeta("og:title"),
        ogDescription: getMeta("og:description"),
        ogImage: getMeta("og:image"),
        ogUrl: getMeta("og:url"),
        ogType: getMeta("og:type"),
        ogSiteName: getMeta("og:site_name"),
        twCard: getMeta("twitter:card"),
        twTitle: getMeta("twitter:title"),
        twDescription: getMeta("twitter:description"),
        twImage: getMeta("twitter:image"),
        twSite: getMeta("twitter:site"),
        headings,
        allMeta,
      };
    },
  });

  return results[0].result;
}

function createRow(label, value) {
  const row = document.createElement("div");
  row.className = "row";
  row.innerHTML = `<div class="label">${label}</div><div class="value ${value ? "" : "empty"}">${value || "未設定"}</div>`;
  row.querySelector(".value").addEventListener("click", () => {
    if (value) copyToClipboard(value);
  });
  return row;
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
  const el = document.createElement("div");
  el.className = "copied";
  el.textContent = "Copied!";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

async function render() {
  const loading = document.getElementById("loading");
  const content = document.getElementById("content");

  try {
    const data = await extractMeta();

    // Basic
    const basic = document.getElementById("basic");
    basic.innerHTML = '<div class="section-title">Basic Info</div>';
    basic.appendChild(createRow("title", data.title));
    basic.appendChild(createRow("description", data.description));
    basic.appendChild(createRow("canonical", data.canonical));
    basic.appendChild(createRow("charset", data.charset));
    basic.appendChild(createRow("lang", data.lang));
    basic.appendChild(createRow("url", data.url));

    // OGP
    const ogp = document.getElementById("ogp");
    ogp.innerHTML = '<div class="section-title">Open Graph (OGP)</div>';
    if (data.ogImage || data.ogTitle) {
      const preview = document.createElement("div");
      preview.className = "ogp-preview";
      preview.innerHTML = `
        ${data.ogImage ? `<img src="${data.ogImage}" onerror="this.style.display='none'">` : ""}
        <div class="ogp-preview-text">
          <div class="ogp-preview-title">${data.ogTitle || data.title || ""}</div>
          <div class="ogp-preview-desc">${data.ogDescription || data.description || ""}</div>
          <div class="ogp-preview-url">${data.ogUrl || data.url}</div>
        </div>`;
      ogp.appendChild(preview);
    }
    ogp.appendChild(createRow("og:title", data.ogTitle));
    ogp.appendChild(createRow("og:description", data.ogDescription));
    ogp.appendChild(createRow("og:image", data.ogImage));
    ogp.appendChild(createRow("og:url", data.ogUrl));
    ogp.appendChild(createRow("og:type", data.ogType));
    ogp.appendChild(createRow("og:site_name", data.ogSiteName));

    // Twitter
    const twitter = document.getElementById("twitter");
    twitter.innerHTML = '<div class="section-title">Twitter Card</div>';
    twitter.appendChild(createRow("twitter:card", data.twCard));
    twitter.appendChild(createRow("twitter:title", data.twTitle));
    twitter.appendChild(createRow("twitter:description", data.twDescription));
    twitter.appendChild(createRow("twitter:image", data.twImage));
    twitter.appendChild(createRow("twitter:site", data.twSite));

    // Headings
    const headings = document.getElementById("headings");
    headings.innerHTML = `<div class="section-title">Headings (${data.headings.length})</div>`;
    data.headings.slice(0, 50).forEach((h) => {
      const item = document.createElement("div");
      item.className = `heading-item ${h.tag}`;
      item.textContent = `<${h.tag}> ${h.text}`;
      headings.appendChild(item);
    });

    // All Meta
    const meta = document.getElementById("meta");
    meta.innerHTML = `<div class="section-title">All Meta Tags (${data.allMeta.length})</div>`;
    data.allMeta.forEach((m) => {
      meta.appendChild(createRow(m.name, m.content));
    });

    loading.style.display = "none";
    content.style.display = "block";
  } catch (e) {
    loading.textContent = "このページでは使用できません";
  }
}

document.getElementById("refresh").addEventListener("click", () => {
  document.getElementById("loading").style.display = "block";
  document.getElementById("content").style.display = "none";
  render();
});

render();
