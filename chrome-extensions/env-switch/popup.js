const ENV_COLORS = [
  "#22c55e", "#3b82f6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899", "#14b8a6", "#f97316",
];

let data = { projects: [], activeEnvByProject: {} };
let editingProject = null;
let editingEnv = null;

// Utils
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

// Data
async function loadData() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getData" }, (result) => {
      data = result || { projects: [], activeEnvByProject: {} };
      resolve();
    });
  });
}

async function saveAllData() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "saveData", data }, (r) => resolve());
  });
}

// Views
function showView(id) {
  document.getElementById("main-view").style.display = id === "main" ? "" : "none";
  document.getElementById("editor-view").style.display = id === "editor" ? "" : "none";
  document.getElementById("env-editor-view").style.display = id === "env-editor" ? "" : "none";
}

// === MAIN VIEW ===
function renderProjects() {
  const container = document.getElementById("projects");
  const empty = document.getElementById("empty");
  container.innerHTML = "";

  if (data.projects.length === 0) {
    empty.style.display = "";
    return;
  }

  empty.style.display = "none";

  data.projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";

    const activeEnv = data.activeEnvByProject[project.id] || null;

    card.innerHTML = `
      <div class="project-header">
        <span class="project-name">${esc(project.name)}</span>
        <button class="edit-btn">Edit</button>
      </div>
      <div class="env-buttons"></div>`;

    const envBtns = card.querySelector(".env-buttons");
    project.environments.forEach((env) => {
      const btn = document.createElement("button");
      btn.className = `env-btn ${activeEnv === env.name ? "active" : ""}`;
      btn.textContent = env.name;
      btn.style.color = env.color || "#64748b";
      if (activeEnv === env.name) {
        btn.style.background = env.color || "#64748b";
        btn.style.color = "#fff";
      }
      btn.addEventListener("click", () => switchToEnv(project.id, env.name));
      envBtns.appendChild(btn);
    });

    card.querySelector(".project-name").addEventListener("click", () => openProjectEditor(project));
    card.querySelector(".edit-btn").addEventListener("click", () => openProjectEditor(project));

    container.appendChild(card);
  });
}

async function switchToEnv(projectId, envName) {
  chrome.runtime.sendMessage({
    action: "navigateToEnv",
    projectId,
    envName,
  }, () => {
    data.activeEnvByProject[projectId] = envName;
    renderProjects();
    showToast(`Switched to ${envName}`);
  });
}

// === PROJECT EDITOR ===
function openProjectEditor(project) {
  editingProject = project ? { ...project, environments: [...project.environments.map((e) => ({ ...e, headers: [...(e.headers || [])] }))] } : {
    id: genId(),
    name: "",
    urlPattern: "",
    environments: [],
  };

  document.getElementById("project-name").value = editingProject.name;
  document.getElementById("url-pattern").value = editingProject.urlPattern || "";
  renderEnvList();
  showView("editor");
}

function renderEnvList() {
  const container = document.getElementById("env-list");
  container.innerHTML = "";

  editingProject.environments.forEach((env, i) => {
    const item = document.createElement("div");
    item.className = "env-item";
    item.innerHTML = `
      <div class="env-dot" style="background:${env.color || '#94a3b8'}"></div>
      <div>
        <div class="env-item-name">${esc(env.name || "Unnamed")}</div>
        <div class="env-item-url">${esc(env.baseUrl || "No URL set")}</div>
      </div>`;
    item.addEventListener("click", () => openEnvEditor(i));
    container.appendChild(item);
  });
}

// === ENVIRONMENT EDITOR ===
function openEnvEditor(index) {
  if (index !== undefined && index !== null) {
    editingEnv = { index, ...editingProject.environments[index] };
  } else {
    editingEnv = {
      index: null,
      name: "",
      baseUrl: "",
      color: ENV_COLORS[editingProject.environments.length % ENV_COLORS.length],
      headers: [],
    };
  }

  document.getElementById("env-name").value = editingEnv.name;
  document.getElementById("env-base-url").value = editingEnv.baseUrl;
  renderColorPicker();
  renderHeaderList();
  showView("env-editor");
}

function renderColorPicker() {
  const container = document.getElementById("env-colors");
  container.innerHTML = "";
  ENV_COLORS.forEach((color) => {
    const btn = document.createElement("div");
    btn.className = `color-option ${editingEnv.color === color ? "selected" : ""}`;
    btn.style.background = color;
    btn.addEventListener("click", () => {
      editingEnv.color = color;
      renderColorPicker();
    });
    container.appendChild(btn);
  });
}

function renderHeaderList() {
  const container = document.getElementById("header-list");
  container.innerHTML = "";
  (editingEnv.headers || []).forEach((h, i) => {
    const row = document.createElement("div");
    row.className = "header-row";
    row.innerHTML = `
      <input type="text" placeholder="Header name" value="${esc(h.name || "")}">
      <input type="text" placeholder="Value" value="${esc(h.value || "")}">
      <button class="remove-btn">&times;</button>`;
    row.querySelectorAll("input")[0].addEventListener("input", (e) => { editingEnv.headers[i].name = e.target.value; });
    row.querySelectorAll("input")[1].addEventListener("input", (e) => { editingEnv.headers[i].value = e.target.value; });
    row.querySelector(".remove-btn").addEventListener("click", () => {
      editingEnv.headers.splice(i, 1);
      renderHeaderList();
    });
    container.appendChild(row);
  });
}

// === EVENT LISTENERS ===

// Main view
document.getElementById("add-project").addEventListener("click", () => openProjectEditor(null));
document.getElementById("add-first").addEventListener("click", () => openProjectEditor(null));

// Project editor
document.getElementById("editor-back").addEventListener("click", () => {
  showView("main");
  renderProjects();
});

document.getElementById("save-project").addEventListener("click", async () => {
  editingProject.name = document.getElementById("project-name").value.trim() || "Untitled";
  editingProject.urlPattern = document.getElementById("url-pattern").value.trim();

  const existing = data.projects.findIndex((p) => p.id === editingProject.id);
  if (existing >= 0) {
    data.projects[existing] = editingProject;
  } else {
    data.projects.push(editingProject);
  }

  await saveAllData();
  showView("main");
  renderProjects();
  showToast("Project saved");
});

document.getElementById("add-env").addEventListener("click", () => openEnvEditor(null));

document.getElementById("delete-project").addEventListener("click", async () => {
  data.projects = data.projects.filter((p) => p.id !== editingProject.id);
  delete data.activeEnvByProject[editingProject.id];
  await saveAllData();
  chrome.runtime.sendMessage({ action: "clearRules" });
  showView("main");
  renderProjects();
  showToast("Project deleted");
});

// Env editor
document.getElementById("env-back").addEventListener("click", () => {
  showView("editor");
});

document.getElementById("save-env").addEventListener("click", () => {
  editingEnv.name = document.getElementById("env-name").value.trim() || "Unnamed";
  editingEnv.baseUrl = document.getElementById("env-base-url").value.trim();

  const envData = {
    name: editingEnv.name,
    baseUrl: editingEnv.baseUrl,
    color: editingEnv.color,
    headers: editingEnv.headers || [],
  };

  if (editingEnv.index !== null) {
    editingProject.environments[editingEnv.index] = envData;
  } else {
    editingProject.environments.push(envData);
  }

  renderEnvList();
  showView("editor");
});

document.getElementById("add-header").addEventListener("click", () => {
  editingEnv.headers = editingEnv.headers || [];
  editingEnv.headers.push({ name: "", value: "" });
  renderHeaderList();
});

document.getElementById("delete-env").addEventListener("click", () => {
  if (editingEnv.index !== null) {
    editingProject.environments.splice(editingEnv.index, 1);
  }
  renderEnvList();
  showView("editor");
});

// Import/Export
document.getElementById("export-btn").addEventListener("click", async () => {
  const json = JSON.stringify(data.projects, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `envswitch-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Exported!");
});

document.getElementById("import-btn").addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    try {
      const imported = JSON.parse(text);
      if (Array.isArray(imported)) {
        data.projects = [...data.projects, ...imported];
        await saveAllData();
        renderProjects();
        showToast(`Imported ${imported.length} projects`);
      }
    } catch {
      showToast("Invalid JSON file");
    }
  });
  input.click();
});

// Utils
function esc(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Init
loadData().then(renderProjects);
