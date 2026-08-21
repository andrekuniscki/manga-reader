import browser from "webextension-polyfill";

type BgMessage =
  | { type: "ACTIVATE_CURRENT_TAB" }
  | { type: "OPEN_URL_IN_READER"; url: string }
  | { type: "NAVIGATE_CHAPTER"; url: string }
  | { type: "TOGGLE_WINDOW_FULLSCREEN" }
  | { type: "SET_WINDOW_FULLSCREEN"; enabled: boolean };

// Tabs that should have the reader auto-reopened as soon as their current
// navigation finishes loading (used for "open URL" and chapter-to-chapter
// navigation, so the person never has to click the toolbar icon again).
const pendingAutoActivate = new Set<number>();

async function injectAndActivate(tabId: number) {
  await browser.scripting.executeScript({
    target: { tabId },
    files: ["dist/content.js"],
  });
  await browser.tabs.sendMessage(tabId, { type: "ACTIVATE_READER" });
}

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete" && pendingAutoActivate.has(tabId)) {
    pendingAutoActivate.delete(tabId);
    injectAndActivate(tabId).catch(() => void 0);
  }
});

// If a tab closes without ever reaching "complete" (e.g. user cancels a
// navigation), don't leave a stale flag around.
browser.tabs.onRemoved.addListener((tabId) => pendingAutoActivate.delete(tabId));

browser.runtime.onMessage.addListener(async (message: unknown, sender) => {
  const msg = message as BgMessage;

  if (msg?.type === "ACTIVATE_CURRENT_TAB") {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) await injectAndActivate(tab.id);
    return;
  }

  if (msg?.type === "OPEN_URL_IN_READER") {
    const tab = await browser.tabs.create({ url: msg.url });
    if (tab.id) pendingAutoActivate.add(tab.id);
    return;
  }

  if (msg?.type === "NAVIGATE_CHAPTER") {
    // Sent by the reader itself (via content.ts) when the person clicks
    // "next/previous chapter" or pages past the last/first image. Doing the
    // navigation here (rather than the content script setting
    // window.location.href directly) lets us watch for the page finishing
    // load and re-activate the reader automatically — no need to click the
    // toolbar icon again between chapters.
    const tabId = sender.tab?.id;
    if (tabId === undefined) return;
    pendingAutoActivate.add(tabId);
    await browser.tabs.update(tabId, { url: msg.url });
    return;
  }

  if (msg?.type === "TOGGLE_WINDOW_FULLSCREEN") {
    // Real browser-window fullscreen (same as pressing F11) rather than the
    // page-level Fullscreen API: it's a window state, so — unlike
    // element.requestFullscreen() — it survives page navigation, which is
    // exactly what makes chapter-to-chapter reading stay fullscreen.
    const windowId = sender.tab?.windowId;
    if (windowId === undefined) return;
    const win = await browser.windows.get(windowId);
    const next = win.state === "fullscreen" ? "normal" : "fullscreen";
    await browser.windows.update(windowId, { state: next });
    return;
  }

  if (msg?.type === "SET_WINDOW_FULLSCREEN") {
    const windowId = sender.tab?.windowId;
    if (windowId === undefined) return;
    await browser.windows.update(windowId, { state: msg.enabled ? "fullscreen" : "normal" });
    return;
  }
});
