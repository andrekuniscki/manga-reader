import browser from "webextension-polyfill";

const statusEl = document.getElementById("status")!;
const urlInput = document.getElementById("url-input") as HTMLInputElement;

function setStatus(text: string) {
  statusEl.textContent = text;
}

document.getElementById("activate-current")!.addEventListener("click", async () => {
  setStatus("Abrindo leitor...");
  try {
    await browser.runtime.sendMessage({ type: "ACTIVATE_CURRENT_TAB" });
    window.close();
  } catch (err) {
    setStatus("Erro: não foi possível ativar o leitor nesta aba.");
  }
});

document.getElementById("open-url")!.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  if (!url) {
    setStatus("Cole um link válido primeiro.");
    return;
  }
  try {
    new URL(url);
  } catch {
    setStatus("Link inválido.");
    return;
  }
  setStatus("Abrindo aba e leitor...");
  try {
    await browser.runtime.sendMessage({ type: "OPEN_URL_IN_READER", url });
    window.close();
  } catch (err) {
    setStatus("Erro ao abrir o link.");
  }
});
