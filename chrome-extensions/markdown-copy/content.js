function htmlToMarkdown(element) {
  let md = "";

  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      md += node.textContent;
      continue;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) continue;

    const tag = node.tagName.toLowerCase();
    const inner = htmlToMarkdown(node);

    switch (tag) {
      case "h1":
        md += `\n# ${inner.trim()}\n\n`;
        break;
      case "h2":
        md += `\n## ${inner.trim()}\n\n`;
        break;
      case "h3":
        md += `\n### ${inner.trim()}\n\n`;
        break;
      case "h4":
        md += `\n#### ${inner.trim()}\n\n`;
        break;
      case "h5":
        md += `\n##### ${inner.trim()}\n\n`;
        break;
      case "h6":
        md += `\n###### ${inner.trim()}\n\n`;
        break;
      case "p":
        md += `\n${inner.trim()}\n\n`;
        break;
      case "br":
        md += "\n";
        break;
      case "strong":
      case "b":
        md += `**${inner}**`;
        break;
      case "em":
      case "i":
        md += `*${inner}*`;
        break;
      case "del":
      case "s":
        md += `~~${inner}~~`;
        break;
      case "code":
        if (node.parentElement && node.parentElement.tagName.toLowerCase() === "pre") {
          md += inner;
        } else {
          md += `\`${inner}\``;
        }
        break;
      case "pre": {
        const codeEl = node.querySelector("code");
        const lang = codeEl
          ? [...codeEl.classList].find((c) => c.startsWith("language-"))?.replace("language-", "") || ""
          : "";
        const codeText = codeEl ? codeEl.textContent : node.textContent;
        md += `\n\`\`\`${lang}\n${codeText.trim()}\n\`\`\`\n\n`;
        break;
      }
      case "a": {
        const href = node.getAttribute("href") || "";
        if (href && href !== "#") {
          const absUrl = href.startsWith("http") ? href : new URL(href, location.href).href;
          md += `[${inner}](${absUrl})`;
        } else {
          md += inner;
        }
        break;
      }
      case "img": {
        const src = node.getAttribute("src") || "";
        const alt = node.getAttribute("alt") || "";
        const absUrl = src.startsWith("http") ? src : new URL(src, location.href).href;
        md += `![${alt}](${absUrl})`;
        break;
      }
      case "ul":
      case "ol": {
        const items = node.querySelectorAll(":scope > li");
        items.forEach((li, i) => {
          const prefix = tag === "ol" ? `${i + 1}. ` : "- ";
          md += `${prefix}${htmlToMarkdown(li).trim()}\n`;
        });
        md += "\n";
        break;
      }
      case "li":
        md += inner;
        break;
      case "blockquote":
        md += inner
          .trim()
          .split("\n")
          .map((line) => `> ${line}`)
          .join("\n") + "\n\n";
        break;
      case "hr":
        md += "\n---\n\n";
        break;
      case "table": {
        const rows = node.querySelectorAll("tr");
        const tableData = [];
        rows.forEach((row) => {
          const cells = [...row.querySelectorAll("th, td")].map((c) => c.textContent.trim());
          tableData.push(cells);
        });
        if (tableData.length > 0) {
          const colCount = Math.max(...tableData.map((r) => r.length));
          md += "\n" + tableData[0].map((c) => c).join(" | ") + "\n";
          md += Array(colCount).fill("---").join(" | ") + "\n";
          tableData.slice(1).forEach((row) => {
            md += row.join(" | ") + "\n";
          });
          md += "\n";
        }
        break;
      }
      case "div":
      case "span":
      case "section":
      case "article":
      case "main":
      case "aside":
      case "header":
      case "footer":
      case "nav":
      case "figure":
      case "figcaption":
        md += inner;
        break;
      default:
        md += inner;
    }
  }

  return md;
}

function getSelectedHtml() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;

  const range = selection.getRangeAt(0);
  const container = document.createElement("div");
  container.appendChild(range.cloneContents());
  return container;
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "copyAsMarkdown") {
    const container = getSelectedHtml();
    if (!container) return;

    const markdown = htmlToMarkdown(container)
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    navigator.clipboard.writeText(markdown).then(() => {
      showNotification("Copied as Markdown!");
    });
  }
});

function showNotification(text) {
  const el = document.createElement("div");
  el.textContent = text;
  Object.assign(el.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#2563eb",
    color: "#fff",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "system-ui, sans-serif",
    zIndex: "2147483647",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    transition: "opacity 0.3s",
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 300);
  }, 2000);
}
