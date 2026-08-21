import type { ParsedChapter } from "./adapters/types";
import { getSettings, saveSettings, getProgress, saveProgress } from "./storage";

const HOST_ID = "manga-reader-host-a1b2c3";
const PRELOAD_AHEAD = 3;

// Embedded so the reader never depends on declaring web_accessible_resources.
const EYE_OPEN_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC4ElEQVR4nO2Y32vPURjHX7NNC/ObFil3wxab/AGU4sLPC7mYH1vNDbnyIxeSwtWE/Cr5UdsKJYrSyG9S3Ci0UrJyqRjhAttMz3q+9ez0Mc9Z332/Ls6rTn06n/N+zvP5nuc85zlfSCQSiUQiwWxgE3ASuAu8A7qBXm3y/Ba4AxwHGoBZxXZ6JrAXeAn0D7O9APYAVYV0vAa4pL9sf57aL6ANmDOSjk8DzgJ9GQ78AG4B+4AVwFxgElAKlOmzfPgqYL+G0s8MO/KjnAYm59v5tcDHjAklfJqAymHYnAA0A50Zdj8AK/PheJluunCC+8DSfEwAlADLgccZ8xzRVRwWlbrU1qBkk0ZGhhJgC/AlmLMDGBNrbDzwNDB0s0DZYgZwO5j7ETDOa2C05nJr4IxzKUt1v0hGeQN81ybPrcAaYJQzdM8HPkiSKPd8wLlAKJnFwxLgtSNlvgIWO0PqQKCVDDUkDYGgxen8dqAnIu/3qMbDsUC7/m8DJb4/B0vmCZvGYIJPmuvrgbHa6rWvOxi72RlONqTFxvSsgRfNoC49fP5FtR5iOd09YMoQ46fqGHsAVjvmEZvvjU722CAWAL/NANmIHq4ZzTOgwqGRMc+N7qpzrnVGI9VArX15xbx84DRYZcoKKQHm4afG1FJ9EenZHnaXbd7NbUBZhYVOY83BYROLaHJ6seVhUVAADnz4LtP5MMKBFqMTG7HYeQ9H6Owq7JCOJ6YjpkxoNbqN8f6zwejbI3RNRicfM3BS5uJYsoSXE8bQtnj/2Wr0cpOLKetz++ebdBwEvuqpF8Nu48AF4hFNTi+2Yjikzsf6PIi64HCR+t7LxOBQq6NI2MuIhJSXU0bXSRFZHZQGOyOzT79eM4tKe+DQdWB+xjg57W8EY9v4D6jIuLnl6qkObV0Z70XjKT0KglSMR51/tfTqXVc0/x01GlK2LLeZqi2yZioa5VotLtNW670OJhKJRCKRSFA4/gDT2VWv7Gda2QAAAABJRU5ErkJggg==";
const EYE_CLOSED_ICON =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC0klEQVR4nO2ZW4hOURTHf8a4DeJzSXKfUHhAPIjyrlwyHjEpHniapIxiJE0zoiZyad48KAopl8i9GB7cby/kgXEZxpMazAwZrVqnVrvzfX37zDnnQ+dXu9mds/d/rb3P3vtbew1kZGRk/A+MBaqBJuAy8Ar4AnQBnVqXZ5eAfcBqYEypnRYHaoEnwG+gx7NIn4fAFmBUmo5PBY7p7PbEVDqBo8CUJB3PAc3AzzwOXAPqgJXADGAk0B8YoDMsz6qAncDNPBPQBRwChsXt/DLgQ4jB28BaYHAEzaHAOuBuiO47YEkcjvcF9oSs8RZgMfGxQL+gu0fEdllU0QrgoiP6EVhOcqwC2hybZ4FBvkLS4XqIkOyDpBkBXHBsX/EdxBlHoL43nzICZUCj48NJH4GvpuNWSsc248c3n47rgQfAJkrPRuCp/s3IyMjISI864AdwhNLRrKG6hODetJmocBrpM91EwRJEenPa/IzvJn3qjf1TUQRWGIH3Gl6nxRCd9cC+XKi86aeO24g0LRqN3Vb1JRLVRkg29BySZ55u3MDumt6I9QHuO7MhOaCkGO/cve+pD5GRLEKHc7GQ0HYc8TMReOHY6tBrpjcy6u0FElaSNZgbo/Pz82Q9gmN8h++XaHJEXupJ0GqedevG9r5wGyo089BtdN8CS9Wm9UF8KprPpuNVc5mXz/zcEX6j6cHhnhd3uaraCZHyDJigbXJqO3j3yWcANSq+Fyh33smMHw5ZXrJezwGbgYXAJJ1hSXpNBhbpQCXj8D1kmRwEBjq2ytWHVvUpNmblSTFGLb+A2aSIzRndAU6EnFaFirQ9rn2DZzfScr7K2ciStEWXixx5DcB5oN20a9fl1aD9g7BkprOB5V3iPDYG9xdot8u0k3o+Dph2j0iBFnMq5GIYQE61pN0tUmA0sKGIf0YUOwChUjVF+6+h1gxA6v8clcBrLVLPyMggfv4AoXhKfSx0ZrcAAAAASUVORK5CYII=";

export interface ReaderOptions {
  /** Called instead of window.location.href when moving to another chapter. */
  onNavigate?: (url: string) => void;
  /** Called on F key / fullscreen button click. Falls back to Element Fullscreen if omitted. */
  onToggleFullscreen?: () => void;
  /** Called when the reader opens with "auto fullscreen" enabled. Falls back to Element Fullscreen if omitted. */
  onEnsureFullscreen?: () => void;
}

export async function openReader(chapter: ParsedChapter, options: ReaderOptions = {}): Promise<void> {
  // Avoid double-mounting if the popup is triggered twice.
  const existing = document.getElementById(HOST_ID);
  if (existing) existing.remove();

  const host = document.createElement("div");
  host.id = HOST_ID;
  document.documentElement.appendChild(host);
  const shadow = host.attachShadow({ mode: "open" });

  const settings = await getSettings();
  const savedProgress = await getProgress(chapter.chapterKey);
  let currentPage = clamp(savedProgress?.page ?? 0, 0, chapter.images.length - 1);

  shadow.innerHTML = buildTemplate();
  const styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  shadow.prepend(styleEl);

  const els = {
    root: shadow.querySelector<HTMLDivElement>(".mr-root")!,
    title: shadow.querySelector<HTMLDivElement>(".mr-title")!,
    pageInfo: shadow.querySelector<HTMLDivElement>(".mr-page-info")!,
    stage: shadow.querySelector<HTMLDivElement>(".mr-stage")!,
    slider: shadow.querySelector<HTMLInputElement>(".mr-slider")!,
    prevPageBtn: shadow.querySelector<HTMLButtonElement>(".mr-prev-page")!,
    nextPageBtn: shadow.querySelector<HTMLButtonElement>(".mr-next-page")!,
    prevChapterBtn: shadow.querySelector<HTMLButtonElement>(".mr-prev-chapter")!,
    nextChapterBtn: shadow.querySelector<HTMLButtonElement>(".mr-next-chapter")!,
    modeBtn: shadow.querySelector<HTMLButtonElement>(".mr-mode")!,
    rtlBtn: shadow.querySelector<HTMLButtonElement>(".mr-rtl")!,
    darkBtn: shadow.querySelector<HTMLButtonElement>(".mr-dark")!,
    fitBtn: shadow.querySelector<HTMLButtonElement>(".mr-fit")!,
    zoomOutBtn: shadow.querySelector<HTMLButtonElement>(".mr-zoom-out")!,
    zoomInBtn: shadow.querySelector<HTMLButtonElement>(".mr-zoom-in")!,
    zoomLabel: shadow.querySelector<HTMLDivElement>(".mr-zoom-label")!,
    fullscreenBtn: shadow.querySelector<HTMLButtonElement>(".mr-fullscreen")!,
    autoFullscreenBtn: shadow.querySelector<HTMLButtonElement>(".mr-auto-fullscreen")!,
    closeBtn: shadow.querySelector<HTMLButtonElement>(".mr-close")!,
    leftClickZone: shadow.querySelector<HTMLDivElement>(".mr-click-left")!,
    rightClickZone: shadow.querySelector<HTMLDivElement>(".mr-click-right")!,
    hudToggleBtn: shadow.querySelector<HTMLButtonElement>(".mr-hud-toggle")!,
    hudIcon: shadow.querySelector<HTMLImageElement>(".mr-hud-icon")!,
  };

  els.title.textContent = chapter.title;
  els.slider.max = String(chapter.images.length - 1);
  els.prevChapterBtn.disabled = !chapter.prevChapterUrl;
  els.nextChapterBtn.disabled = !chapter.nextChapterUrl;

  applySettingsToDom();

  const preloaded = new Set<number>();
  function preloadAround(page: number) {
    for (let i = page; i <= page + PRELOAD_AHEAD; i++) {
      if (i < 0 || i >= chapter.images.length || preloaded.has(i)) continue;
      preloaded.add(i);
      const img = new Image();
      img.src = chapter.images[i];
    }
  }

  function applySettingsToDom() {
    els.root.classList.toggle("mr-dark-theme", settings.darkMode);
    els.root.classList.toggle("mr-light-theme", !settings.darkMode);
    els.root.classList.toggle("mr-continuous", settings.mode === "continuous");
    els.root.classList.toggle("mr-double", settings.mode === "double");
    els.root.classList.toggle("mr-rtl-active", settings.rtl);
    els.root.classList.toggle("mr-fit-width", settings.fitWidth);
    els.root.style.setProperty("--mr-zoom", String(settings.zoom));
    els.modeBtn.textContent =
      settings.mode === "single" ? "📖 1 pág." : settings.mode === "double" ? "📖 2 págs." : "📜 Contínuo";
    els.rtlBtn.textContent = settings.rtl ? "◀ RTL" : "▶ LTR";
    els.rtlBtn.classList.toggle("mr-active", settings.rtl);
    els.darkBtn.textContent = settings.darkMode ? "🌙" : "☀️";
    els.fitBtn.classList.toggle("mr-active", settings.fitWidth);
    els.zoomLabel.textContent = `${Math.round(settings.zoom * 100)}%`;
    els.autoFullscreenBtn.classList.toggle("mr-active", settings.autoFullscreen);
    els.autoFullscreenBtn.title = settings.autoFullscreen
      ? "Tela cheia automática: ativada (clique para desativar)"
      : "Tela cheia automática: desativada (clique para ativar)";
    els.root.classList.toggle("mr-hud-hidden", settings.hudHidden);
    els.hudIcon.src = settings.hudHidden ? EYE_CLOSED_ICON : EYE_OPEN_ICON;
    els.hudToggleBtn.title = settings.hudHidden
      ? "Mostrar controles (H)"
      : "Ocultar controles (H)";
  }

  function persistSettings() {
    saveSettings(settings).catch(() => void 0);
  }

  function getSpreadStart(page: number): number {
    return page - (page % 2);
  }

  let continuousObserver: IntersectionObserver | null = null;

  function renderSinglePage() {
    if (continuousObserver) {
      continuousObserver.disconnect();
      continuousObserver = null;
    }
    els.stage.innerHTML = "";
    const img = document.createElement("img");
    img.className = "mr-page-img";
    img.src = chapter.images[currentPage];
    img.alt = `Página ${currentPage + 1}`;
    els.stage.appendChild(img);
    els.pageInfo.textContent = `${currentPage + 1} / ${chapter.images.length}`;
    els.slider.value = String(currentPage);
    preloadAround(currentPage);
    saveProgress(chapter.chapterKey, currentPage).catch(() => void 0);
  }

  function renderDoublePage() {
    if (continuousObserver) {
      continuousObserver.disconnect();
      continuousObserver = null;
    }
    els.stage.innerHTML = "";
    const start = getSpreadStart(currentPage);
    const end = Math.min(start + 1, chapter.images.length - 1);

    for (let i = start; i <= end; i++) {
      const img = document.createElement("img");
      img.className = "mr-page-img";
      img.src = chapter.images[i];
      img.alt = `Página ${i + 1}`;
      els.stage.appendChild(img);
    }

    els.pageInfo.textContent =
      start === end ? `${start + 1} / ${chapter.images.length}` : `${start + 1}-${end + 1} / ${chapter.images.length}`;
    els.slider.value = String(currentPage);
    preloadAround(start);
    saveProgress(chapter.chapterKey, start);
  }

  function renderContinuous() {
    els.stage.innerHTML = "";
    chapter.images.forEach((src, idx) => {
      const img = document.createElement("img");
      img.className = "mr-page-img mr-continuous-img";
      img.loading = idx < PRELOAD_AHEAD + 1 ? "eager" : "lazy";
      img.src = src;
      img.dataset.pageIndex = String(idx);
      els.stage.appendChild(img);
    });
    els.pageInfo.textContent = `${currentPage + 1} / ${chapter.images.length}`;
    els.slider.value = String(currentPage);
    preloadAround(currentPage);

    // Track which page is in view to keep progress/slider accurate while scrolling.
    continuousObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const idx = Number((visible.target as HTMLElement).dataset.pageIndex);
        if (!Number.isNaN(idx) && idx !== currentPage) {
          currentPage = idx;
          els.pageInfo.textContent = `${currentPage + 1} / ${chapter.images.length}`;
          els.slider.value = String(currentPage);
          preloadAround(currentPage);
          saveProgress(chapter.chapterKey, currentPage).catch(() => void 0);
        }
      },
      { root: els.stage, threshold: [0.5] }
    );
    shadow.querySelectorAll(".mr-continuous-img").forEach((el) => continuousObserver!.observe(el));

    // Jump to the saved page on open.
    requestAnimationFrame(() => {
      const target = shadow.querySelector(`[data-page-index="${currentPage}"]`);
      target?.scrollIntoView({ block: "start" });
    });
  }

  function render() {
    if (settings.mode === "single") renderSinglePage();
    else if (settings.mode === "double") renderDoublePage();
    else renderContinuous();
  }

  function goToPage(page: number) {
    currentPage = clamp(page, 0, chapter.images.length - 1);
    render();
  }

  function nextPage() {
    if (settings.mode === "double") {
      const nextStart = getSpreadStart(currentPage) + 2;
      if (nextStart < chapter.images.length) {
        currentPage = nextStart;
        render();
      } else if (chapter.nextChapterUrl) {
        navigateToChapter(chapter.nextChapterUrl);
      }
      return;
    }
    if (currentPage < chapter.images.length - 1) {
      goToPage(currentPage + 1);
    } else if (chapter.nextChapterUrl) {
      navigateToChapter(chapter.nextChapterUrl);
    }
  }

  function prevPage() {
    if (settings.mode === "double") {
      const prevStart = getSpreadStart(currentPage) - 2;
      if (prevStart >= 0) {
        currentPage = prevStart;
        render();
      } else if (chapter.prevChapterUrl) {
        navigateToChapter(chapter.prevChapterUrl, true);
      }
      return;
    }
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    } else if (chapter.prevChapterUrl) {
      navigateToChapter(chapter.prevChapterUrl, true);
    }
  }

  function navigateToChapter(url: string, _fromStart = false) {
    void _fromStart; // reserved: could jump to last page when going "back"
    if (options.onNavigate) options.onNavigate(url);
    else window.location.href = url;
  }

  function closeReader() {
    document.removeEventListener("keydown", onKeyDown);
    if (continuousObserver) continuousObserver.disconnect();
    host.remove();
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "Escape") return closeReader();
    if (e.key === "f" || e.key === "F") return toggleFullscreen();
    if (e.key === "h" || e.key === "H") return toggleHud();
    if (settings.mode === "continuous") return; // arrow paging doesn't apply to continuous scroll
    const goForward = settings.rtl ? "ArrowLeft" : "ArrowRight";
    const goBack = settings.rtl ? "ArrowRight" : "ArrowLeft";
    if (e.key === goForward || e.key === " ") {
      e.preventDefault();
      nextPage();
    } else if (e.key === goBack) {
      e.preventDefault();
      prevPage();
    }
  }

  function toggleFullscreen() {
    if (options.onToggleFullscreen) {
      options.onToggleFullscreen();
      return;
    }
    if (!document.fullscreenElement) {
      host.requestFullscreen?.().catch(() => void 0);
    } else {
      document.exitFullscreen?.().catch(() => void 0);
    }
  }

  // Wire up controls.
  els.closeBtn.addEventListener("click", closeReader);
  els.nextPageBtn.addEventListener("click", nextPage);
  els.prevPageBtn.addEventListener("click", prevPage);
  els.leftClickZone.addEventListener("click", () => (settings.rtl ? nextPage() : prevPage()));
  els.rightClickZone.addEventListener("click", () => (settings.rtl ? prevPage() : nextPage()));
  els.slider.addEventListener("input", () => goToPage(Number(els.slider.value)));
  els.prevChapterBtn.addEventListener("click", () => chapter.prevChapterUrl && navigateToChapter(chapter.prevChapterUrl, true));
  els.nextChapterBtn.addEventListener("click", () => chapter.nextChapterUrl && navigateToChapter(chapter.nextChapterUrl));

  els.modeBtn.addEventListener("click", () => {
    settings.mode = settings.mode === "single" ? "double" : settings.mode === "double" ? "continuous" : "single";
    // Keep the spread aligned to an even boundary when entering double mode.
    if (settings.mode === "double") currentPage = getSpreadStart(currentPage);
    applySettingsToDom();
    persistSettings();
    render();
  });
  els.rtlBtn.addEventListener("click", () => {
    settings.rtl = !settings.rtl;
    applySettingsToDom();
    persistSettings();
  });
  els.darkBtn.addEventListener("click", () => {
    settings.darkMode = !settings.darkMode;
    applySettingsToDom();
    persistSettings();
  });
  els.fitBtn.addEventListener("click", () => {
    settings.fitWidth = !settings.fitWidth;
    applySettingsToDom();
    persistSettings();
  });
  els.zoomInBtn.addEventListener("click", () => setZoom(settings.zoom + 0.1));
  els.zoomOutBtn.addEventListener("click", () => setZoom(settings.zoom - 0.1));
  function setZoom(z: number) {
    settings.zoom = clamp(Math.round(z * 100) / 100, 0.5, 2.5);
    applySettingsToDom();
    persistSettings();
  }

  els.fullscreenBtn.addEventListener("click", toggleFullscreen);
  els.autoFullscreenBtn.addEventListener("click", () => {
    settings.autoFullscreen = !settings.autoFullscreen;
    applySettingsToDom();
    persistSettings();
    if (settings.autoFullscreen) tryEnterFullscreen();
  });
  els.hudToggleBtn.addEventListener("click", toggleHud);
  document.addEventListener("keydown", onKeyDown);

  function tryEnterFullscreen() {
    if (options.onEnsureFullscreen) {
      options.onEnsureFullscreen();
      return;
    }
    if (document.fullscreenElement) return;
    // Best-effort: browsers require a user gesture for the Fullscreen API,
    // and that gesture doesn't carry over across a full page navigation, so
    // this can silently fail right after a chapter change. When it does,
    // the toolbar button still works as a one-click fallback.
    host.requestFullscreen?.().catch(() => void 0);
  }

  function toggleHud() {
    settings.hudHidden = !settings.hudHidden;
    applySettingsToDom();
    persistSettings();
  }

  render();
  if (settings.autoFullscreen) tryEnterFullscreen();
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function buildTemplate(): string {
  return `
    <div class="mr-root">
      <button class="mr-hud-toggle" title="Ocultar/mostrar controles (H)">
        <img class="mr-hud-icon" alt="Alternar controles" />
      </button>

      <header class="mr-topbar">
        <div class="mr-title-block">
          <div class="mr-title"></div>
          <div class="mr-page-info"></div>
        </div>
        <div class="mr-topbar-controls">
          <button class="mr-btn mr-mode" title="Alternar modo de leitura"></button>
          <button class="mr-btn mr-rtl" title="Alternar direção de leitura"></button>
          <button class="mr-btn mr-fit" title="Ajustar à largura">↔ Largura</button>
          <button class="mr-btn mr-zoom-out" title="Diminuir zoom">−</button>
          <div class="mr-zoom-label">100%</div>
          <button class="mr-btn mr-zoom-in" title="Aumentar zoom">+</button>
          <button class="mr-btn mr-dark" title="Alternar tema"></button>
          <button class="mr-btn mr-fullscreen" title="Tela cheia (F)">⛶</button>
          <button class="mr-btn mr-auto-fullscreen" title="Entrar em tela cheia automaticamente ao abrir/trocar de capítulo">⛶ Auto</button>
          <button class="mr-btn mr-close" title="Fechar (Esc)">✕</button>
        </div>
      </header>

      <div class="mr-stage-wrap">
        <div class="mr-click-left" title="Página anterior"></div>
        <div class="mr-stage"></div>
        <div class="mr-click-right" title="Próxima página"></div>
      </div>

      <footer class="mr-bottombar">
        <button class="mr-btn mr-prev-chapter">Capítulo anterior</button>
        <button class="mr-btn mr-prev-page">‹</button>
        <input type="range" class="mr-slider" min="0" value="0" step="1" />
        <button class="mr-btn mr-next-page">›</button>
        <button class="mr-btn mr-next-chapter">Próximo capítulo</button>
      </footer>
    </div>
  `;
}

const CSS = `
:host { all: initial; }
* { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
.mr-root {
  position: fixed; inset: 0; z-index: 2147483647;
  display: flex; flex-direction: column;
  --mr-zoom: 1;
}
.mr-dark-theme { background: #0e0e12; color: #f0f0f0; }
.mr-light-theme { background: #f5f5f7; color: #1a1a1a; }

.mr-topbar, .mr-bottombar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; flex-wrap: wrap;
}
.mr-dark-theme .mr-topbar, .mr-dark-theme .mr-bottombar { background: #17171d; border-color: #2a2a33; }
.mr-light-theme .mr-topbar, .mr-light-theme .mr-bottombar { background: #ffffff; border-color: #e2e2e6; }
.mr-topbar { border-bottom: 1px solid; justify-content: space-between; padding-right: 58px; }
.mr-bottombar { border-top: 1px solid; }

.mr-title-block { display: flex; flex-direction: column; min-width: 0; }
.mr-title { font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 40vw; }
.mr-page-info { font-size: 12px; opacity: 0.7; }

.mr-topbar-controls { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }

.mr-btn {
  border: 1px solid transparent; border-radius: 6px; padding: 6px 10px;
  font-size: 13px; cursor: pointer; background: rgba(127,127,127,0.15); color: inherit;
}
.mr-btn:hover { background: rgba(127,127,127,0.3); }
.mr-btn:disabled { opacity: 0.35; cursor: default; }
.mr-btn.mr-active { background: #4f7cff; color: white; }
.mr-zoom-label { font-size: 12px; min-width: 40px; text-align: center; opacity: 0.8; }

.mr-prev-chapter, .mr-next-chapter { text-align: center; }

.mr-stage-wrap { position: relative; flex: 1; display: flex; overflow: hidden; }
.mr-stage { flex: 1; overflow: auto; display: flex; flex-direction: column; align-items: center; scroll-behavior: smooth; }
.mr-continuous .mr-stage { gap: 4px; }
.mr-double .mr-stage { flex-direction: row; gap: 6px; }
.mr-double.mr-rtl-active .mr-stage { flex-direction: row-reverse; }

.mr-page-img {
  max-width: calc(100% * var(--mr-zoom));
  height: auto;
  display: block;
  margin: 0 auto;
  user-select: none;
}
.mr-root:not(.mr-fit-width) .mr-page-img { max-width: none; width: calc(60% * var(--mr-zoom)); }
.mr-double .mr-page-img { max-width: calc(48% * var(--mr-zoom)); width: auto; }
.mr-root:not(.mr-fit-width).mr-double .mr-page-img { max-width: none; width: calc(30% * var(--mr-zoom)); }
.mr-root:not(.mr-continuous) .mr-stage { justify-content: center; }
.mr-root:not(.mr-continuous) .mr-page-img { margin: auto; }

.mr-click-left, .mr-click-right {
  position: absolute; top: 0; bottom: 0; width: 12%; z-index: 2; cursor: pointer;
}
.mr-click-left { left: 0; } .mr-click-right { right: 0; }
.mr-continuous .mr-click-left, .mr-continuous .mr-click-right { display: none; }

.mr-slider { flex: 1; min-width: 80px; }

.mr-hud-toggle {
  position: absolute; top: 12px; right: 14px; z-index: 10;
  width: 36px; height: 36px; border-radius: 50%;
  border: none; background: transparent;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; padding: 0; opacity: 0.85; transition: opacity 0.15s, transform 0.15s;
}
.mr-hud-toggle:hover { opacity: 1; transform: scale(1.08); background: transparent; }
.mr-hud-icon { width: 20px; height: 20px; display: block; pointer-events: none; }
.mr-dark-theme .mr-hud-icon { filter: invert(1); }

.mr-hud-hidden .mr-topbar,
.mr-hud-hidden .mr-bottombar { display: none; }
`;
