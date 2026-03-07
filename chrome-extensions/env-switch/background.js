// EnvSwitch Background Service Worker
// Manages environment switching, URL rewriting, and header injection

const DEFAULT_DATA = {
  projects: [],
  activeEnvByProject: {},
};

async function getData() {
  const result = await chrome.storage.local.get("envswitch");
  return result.envswitch || DEFAULT_DATA;
}

async function saveData(data) {
  await chrome.storage.local.set({ envswitch: data });
}

// Apply declarativeNetRequest rules for header injection
async function applyHeaderRules(project, envName) {
  // Clear existing rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const removeIds = existingRules.map((r) => r.id);
  if (removeIds.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: removeIds });
  }

  if (!project || !envName) return;

  const env = project.environments.find((e) => e.name === envName);
  if (!env || !env.headers || env.headers.length === 0) return;

  const rules = env.headers
    .filter((h) => h.name && h.value)
    .map((h, i) => ({
      id: i + 1,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: h.name,
            operation: "set",
            value: h.value,
          },
        ],
      },
      condition: {
        urlFilter: project.urlPattern || "*",
        resourceTypes: [
          "main_frame", "sub_frame", "xmlhttprequest",
          "script", "stylesheet", "image", "font",
          "media", "websocket", "other",
        ],
      },
    }));

  if (rules.length > 0) {
    await chrome.declarativeNetRequest.updateDynamicRules({ addRules: rules });
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getData") {
    getData().then(sendResponse);
    return true;
  }

  if (msg.action === "saveData") {
    saveData(msg.data).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (msg.action === "switchEnv") {
    getData().then(async (data) => {
      const project = data.projects.find((p) => p.id === msg.projectId);
      if (project) {
        data.activeEnvByProject[msg.projectId] = msg.envName;
        await saveData(data);
        await applyHeaderRules(project, msg.envName);
      }
      sendResponse({ ok: true });
    });
    return true;
  }

  if (msg.action === "clearRules") {
    applyHeaderRules(null, null).then(() => sendResponse({ ok: true }));
    return true;
  }

  if (msg.action === "navigateToEnv") {
    getData().then(async (data) => {
      const project = data.projects.find((p) => p.id === msg.projectId);
      if (!project) return sendResponse({ ok: false });

      const env = project.environments.find((e) => e.name === msg.envName);
      if (!env) return sendResponse({ ok: false });

      // Update active env
      data.activeEnvByProject[msg.projectId] = msg.envName;
      await saveData(data);
      await applyHeaderRules(project, msg.envName);

      // Navigate current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        const currentUrl = new URL(tab.url);
        const newUrl = currentUrl.href.replace(
          currentUrl.origin,
          env.baseUrl.replace(/\/$/, "")
        );
        await chrome.tabs.update(tab.id, { url: newUrl });
      }
      sendResponse({ ok: true });
    });
    return true;
  }
});
