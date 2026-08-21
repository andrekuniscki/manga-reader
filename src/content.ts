import browser from "webextension-polyfill";
import { parseChapter } from "./adapters";
import { openReader } from "./reader";

type ActivateMessage = { type: "ACTIVATE_READER" };

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
