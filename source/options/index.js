/* Save the Azure PAT token into the chrome storage system */
function save() {
  const el = document.getElementById("azure-pat-token");
  chrome.storage.sync.set({ pat_token: el.value });
  alert("Configuration saved!");
}

/* Retrieve the Azure PAT token from the chrome storage system */
async function get() {
  chrome.storage.sync.get("pat_token", function (items) {
    document.getElementById("azure-pat-token").value = items.pat_token ?? "";
  });
}

/* Execute when loading the page */
function load() {
  get();

  var manifestData = chrome.runtime.getManifest();
  document.getElementById(
    "version-label"
  ).innerHTML = `v${manifestData.version}`;
}

/* Runtime script */
document.getElementById("save-button").onclick = () => {
  save();
};

load();
