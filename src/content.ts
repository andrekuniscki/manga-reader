import browser from "webextension-polyfill";
import { parseChapter } from "./adapters";
import { openReader } from "./reader";

type ActivateMessage = { type: "ACTIVATE_READER" };

// scripting.executeScript can end up injecting this file more than once into
// the same document (e.g. clicking the popup's "open reader" button again
// while it's already active). Without this guard that would register a
// second onMessage listener and a second reader instance side by side,
// which is exactly what caused the fullscreen button to misfire — two
// listeners both reacting to one keypress/click and racing each other.
const GUARD_KEY = "__mangaReaderContentLoaded";
if ((window as unknown as Record<string, boolean>)[GUARD_KEY]) {
  // Already loaded in this document; do nothing on this second injection.
} else {
  (window as unknown as Record<string, boolean>)[GUARD_KEY] = true;

  async function handleActivate() {
    const chapter = parseChapter(document, window.location.href);
    if (!chapter) {
      alert(
        "Manga Reader: não consegui identificar as páginas do mangá nesta página.\n" +
          "Tente abrir diretamente a página do capítulo (não a página inicial do site)."
      );
      return;
    }
    await openReader(chapter, {
      onNavigate: (url) => {
        // Let the background script drive the navigation: it watches for the
        // new page to finish loading and reopens the reader automatically,
        // so chapter-to-chapter reading never drops back to the raw page.
        browser.runtime.sendMessage({ type: "NAVIGATE_CHAPTER", url }).catch(() => {
          window.location.href = url; // fallback if messaging fails for any reason
        });
      },
    });
  }

  browser.runtime.onMessage.addListener((message: unknown) => {
    const msg = message as ActivateMessage;
    if (msg?.type === "ACTIVATE_READER") {
      handleActivate();
    }
  });
}
