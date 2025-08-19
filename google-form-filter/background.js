// Load file options.json ngay khi extension được bật
async function loadConfig() {
  try {
    const response = await fetch(chrome.runtime.getURL("options.json"));
    const config = await response.json();
    await chrome.storage.local.set({ formConfig: config });
    console.log("✅ Loaded options.json into storage", config);
  } catch (err) {
    console.error("❌ Failed to load options.json:", err);
  }
}

// Load khi cài đặt hoặc reload extension
chrome.runtime.onInstalled.addListener(loadConfig);
chrome.runtime.onStartup.addListener(loadConfig);
