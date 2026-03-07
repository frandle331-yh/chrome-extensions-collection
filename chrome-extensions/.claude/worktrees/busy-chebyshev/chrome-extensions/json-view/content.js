(() => {
  // Only process if the page content looks like JSON
  const body = document.body;
  const pre = body?.querySelector("pre") || body;
  if (!pre) return;

  const raw = pre.textContent.trim();
  if (!raw) return;

  // Quick check: must start with { or [
  const first = raw.charAt(0);
  if (first !== "{" && first !== "[") return;

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return; // Not valid JSON
  }

  // Check content-type header hint from the document
  const ct = document.contentType || "";
  const isJsonPage = ct.includes("json") || ct === "text/plain";
  if (!isJsonPage && document.querySelector("html > head > title")) return;

  // We have valid JSON - render it
  renderJSON(data, raw);

  function renderJSON(data, rawText) {
    // Replace the entire page
    document.head.innerHTML = "";
    document.body.innerHTML = "";

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: "SF Mono", "Fira Code", "Cascadia Code", Consolas, monospace; font-size: 13px; background: #1e1e2e; color: #cdd6f4; line-height: 1.6; }
      .jv-toolbar { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #181825; border-bottom: 1px solid #313244; }
      .jv-toolbar button { background: #313244; border: none; color: #cdd6f4; padding: 5px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; font-family: inherit; }
      .jv-toolbar button:hover { background: #45475a; }
      .jv-toolbar button.active { background: #89b4fa; color: #1e1e2e; }
      .jv-search { background: #313244; border: 1px solid #45475a; color: #cdd6f4; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-family: inherit; width: 200px; outline: none; }
      .jv-search:focus { border-color: #89b4fa; }
      .jv-search::placeholder { color: #6c7086; }
      .jv-info { margin-left: auto; font-size: 11px; color: #6c7086; }
      .jv-container { padding: 16px; overflow-x: auto; }
      .jv-key { color: #89b4fa; }
      .jv-string { color: #a6e3a1; }
      .jv-number { color: #fab387; }
      .jv-boolean { color: #cba6f7; }
      .jv-null { color: #f38ba8; }
      .jv-bracket { color: #6c7086; }
      .jv-comma { color: #6c7086; }
      .jv-line { padding: 0 0 0 20px; position: relative; }
      .jv-collapsible { cursor: pointer; user-select: none; }
      .jv-collapsible::before { content: "\\25BC"; display: inline-block; width: 14px; font-size: 10px; color: #6c7086; transition: transform 0.15s; }
      .jv-collapsible.collapsed::before { transform: rotate(-90deg); }
      .jv-collapsible.collapsed + .jv-children { display: none; }
      .jv-collapsible.collapsed .jv-preview { display: inline; }
      .jv-preview { display: none; color: #6c7086; font-size: 12px; }
      .jv-children { }
      .jv-highlight { background: #fab38740; border-radius: 2px; }
      .jv-raw { padding: 16px; white-space: pre-wrap; word-break: break-all; }
      .jv-copy-toast { position: fixed; bottom: 20px; right: 20px; background: #89b4fa; color: #1e1e2e; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: 600; z-index: 200; }
    `;
    document.head.appendChild(style);

    // Toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "jv-toolbar";
    toolbar.innerHTML = `
      <button id="jv-tree" class="active">Tree</button>
      <button id="jv-raw-btn">Raw</button>
      <button id="jv-copy">Copy</button>
      <button id="jv-collapse-all">Collapse All</button>
      <button id="jv-expand-all">Expand All</button>
      <input type="text" class="jv-search" id="jv-search" placeholder="Search keys or values...">
      <span class="jv-info" id="jv-info"></span>
    `;
    document.body.appendChild(toolbar);

    // Container
    const container = document.createElement("div");
    container.className = "jv-container";
    document.body.appendChild(container);

    // Stats
    let nodeCount = 0;
    function countNodes(obj) {
      if (obj === null || typeof obj !== "object") { nodeCount++; return; }
      if (Array.isArray(obj)) { nodeCount++; obj.forEach(countNodes); }
      else { nodeCount++; Object.values(obj).forEach(countNodes); }
    }
    countNodes(data);
    const sizeKB = (new Blob([rawText]).size / 1024).toFixed(1);
    document.getElementById("jv-info").textContent = `${nodeCount} nodes | ${sizeKB} KB`;

    // Render tree
    function renderValue(value, key, isLast) {
      if (value === null) {
        return `<span class="jv-null">null</span>${isLast ? "" : '<span class="jv-comma">,</span>'}`;
      }
      if (typeof value === "string") {
        const escaped = escapeHtml(value);
        return `<span class="jv-string">"${escaped}"</span>${isLast ? "" : '<span class="jv-comma">,</span>'}`;
      }
      if (typeof value === "number") {
        return `<span class="jv-number">${value}</span>${isLast ? "" : '<span class="jv-comma">,</span>'}`;
      }
      if (typeof value === "boolean") {
        return `<span class="jv-boolean">${value}</span>${isLast ? "" : '<span class="jv-comma">,</span>'}`;
      }
      return "";
    }

    function renderNode(value, key, isLast, depth) {
      const div = document.createElement("div");
      div.className = "jv-line";
      div.style.paddingLeft = (depth * 20) + "px";

      const keyHtml = key !== null ? `<span class="jv-key">"${escapeHtml(String(key))}"</span>: ` : "";

      if (value === null || typeof value !== "object") {
        div.innerHTML = keyHtml + renderValue(value, key, isLast);
        return div;
      }

      const isArray = Array.isArray(value);
      const entries = isArray ? value : Object.entries(value);
      const count = isArray ? value.length : Object.keys(value).length;
      const open = isArray ? "[" : "{";
      const close = isArray ? "]" : "}";
      const preview = isArray ? `[${count} items]` : `{${count} keys}`;

      if (count === 0) {
        div.innerHTML = `${keyHtml}<span class="jv-bracket">${open}${close}</span>${isLast ? "" : '<span class="jv-comma">,</span>'}`;
        return div;
      }

      const header = document.createElement("span");
      header.className = "jv-collapsible";
      header.innerHTML = `${keyHtml}<span class="jv-bracket">${open}</span> <span class="jv-preview">${preview}</span>`;
      header.addEventListener("click", (e) => {
        e.stopPropagation();
        header.classList.toggle("collapsed");
      });
      div.appendChild(header);

      const children = document.createElement("div");
      children.className = "jv-children";

      if (isArray) {
        value.forEach((item, i) => {
          children.appendChild(renderNode(item, null, i === value.length - 1, depth + 1));
        });
      } else {
        const keys = Object.keys(value);
        keys.forEach((k, i) => {
          children.appendChild(renderNode(value[k], k, i === keys.length - 1, depth + 1));
        });
      }

      div.appendChild(children);

      const closeLine = document.createElement("div");
      closeLine.className = "jv-line";
      closeLine.style.paddingLeft = (depth * 20) + "px";
      closeLine.innerHTML = `<span class="jv-bracket">${close}</span>${isLast ? "" : '<span class="jv-comma">,</span>'}`;
      div.appendChild(closeLine);

      return div;
    }

    const tree = renderNode(data, null, true, 0);
    tree.id = "jv-tree-view";
    container.appendChild(tree);

    // Raw view
    const rawDiv = document.createElement("pre");
    rawDiv.className = "jv-raw";
    rawDiv.style.display = "none";
    rawDiv.textContent = JSON.stringify(data, null, 2);
    rawDiv.id = "jv-raw-view";
    container.appendChild(rawDiv);

    // Events
    document.getElementById("jv-tree").addEventListener("click", () => {
      document.getElementById("jv-tree-view").style.display = "";
      document.getElementById("jv-raw-view").style.display = "none";
      document.getElementById("jv-tree").classList.add("active");
      document.getElementById("jv-raw-btn").classList.remove("active");
    });

    document.getElementById("jv-raw-btn").addEventListener("click", () => {
      document.getElementById("jv-tree-view").style.display = "none";
      document.getElementById("jv-raw-view").style.display = "";
      document.getElementById("jv-raw-btn").classList.add("active");
      document.getElementById("jv-tree").classList.remove("active");
    });

    document.getElementById("jv-copy").addEventListener("click", () => {
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      showToast("Copied!");
    });

    document.getElementById("jv-collapse-all").addEventListener("click", () => {
      document.querySelectorAll(".jv-collapsible").forEach((el) => el.classList.add("collapsed"));
    });

    document.getElementById("jv-expand-all").addEventListener("click", () => {
      document.querySelectorAll(".jv-collapsible").forEach((el) => el.classList.remove("collapsed"));
    });

    // Search
    let searchTimeout;
    document.getElementById("jv-search").addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll(".jv-highlight").forEach((el) => el.classList.remove("jv-highlight"));
        if (!query) return;

        document.querySelectorAll(".jv-key, .jv-string, .jv-number").forEach((el) => {
          if (el.textContent.toLowerCase().includes(query)) {
            el.classList.add("jv-highlight");
            // Expand parents
            let parent = el.closest(".jv-children");
            while (parent) {
              const collapsible = parent.previousElementSibling;
              if (collapsible?.classList.contains("jv-collapsible")) {
                collapsible.classList.remove("collapsed");
              }
              parent = parent.parentElement?.closest(".jv-children");
            }
          }
        });
      }, 200);
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function showToast(msg) {
    const el = document.createElement("div");
    el.className = "jv-copy-toast";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
})();
