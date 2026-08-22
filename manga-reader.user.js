// ==UserScript==
// @name         Manga Reader
// @namespace    manga-reader.local
// @version      1.0.0
// @description  Cole/abra a página de um capítulo de mangá e leia num modo de leitura decente: página única ou contínuo, zoom, RTL, tela cheia, tema escuro, navegação entre capítulos e progresso salvo.
// @author       you
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  /* ------------------------------------------------------------------ *
   * Storage (GM_getValue/GM_setValue, falls back to localStorage)       *
   * ------------------------------------------------------------------ */

  const hasGM = typeof GM_getValue === "function" && typeof GM_setValue === "function";

  function storageGet(key, fallback) {
    try {
      if (hasGM) {
        const raw = GM_getValue(key, null);
        return raw ? JSON.parse(raw) : fallback;
      }
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function storageSet(key, value) {
    try {
      const raw = JSON.stringify(value);
      if (hasGM) GM_setValue(key, raw);
      else localStorage.setItem(key, raw);
    } catch {
      /* ignore */
    }
  }

  const SETTINGS_KEY = "manga-reader:settings";
  const PROGRESS_PREFIX = "manga-reader:progress:";

  const DEFAULT_SETTINGS = {
    mode: "single", // "single" | "double" | "continuous"
    zoom: 1,
    rtl: false,
    darkMode: true,
    fitWidth: true,
    hudHidden: false,
    autoFullscreen: false,
  };

  function getSettings() {
    return { ...DEFAULT_SETTINGS, ...storageGet(SETTINGS_KEY, {}) };
  }
  function saveSettings(settings) {
    storageSet(SETTINGS_KEY, settings);
  }
  function getProgress(chapterKey) {
    return storageGet(PROGRESS_PREFIX + chapterKey, null);
  }
  function saveProgress(chapterKey, page) {
    storageSet(PROGRESS_PREFIX + chapterKey, { page, updatedAt: Date.now() });
  }

  /* ------------------------------------------------------------------ *
   * Parser: adapters (site-specific first, generic fallback)            *
   * ------------------------------------------------------------------ */

  const MIN_WIDTH = 250;
  const MIN_HEIGHT = 250;
  const MIN_IMAGES = 3;
  const NEXT_WORDS = /(next|próxim|proxim|seguinte|forward)/i;
  const PREV_WORDS = /(prev|anterior|back|voltar)/i;

  function isLikelyPageImage(img) {
    const w = img.naturalWidth || img.width || parseInt(img.getAttribute("width") || "0", 10);
    const h = img.naturalHeight || img.height || parseInt(img.getAttribute("height") || "0", 10);
    if (w && h) {
      if (w < MIN_WIDTH || h < MIN_HEIGHT) return false;
      const ratio = w / h;
      if (ratio > 4 || ratio < 0.15) return false;
    }
    const src = (img.currentSrc || img.src || "").toLowerCase();
    if (!src || src.startsWith("data:")) return false;
    return true;
  }

  function findImageCluster(doc) {
    const allImages = Array.from(doc.querySelectorAll("img"));
    const candidates = allImages.filter(isLikelyPageImage);
    if (candidates.length < MIN_IMAGES) return [];

    const countByAncestor = new Map();
    for (const img of candidates) {
      let node = img.parentElement;
      let steps = 0;
      while (node && steps < 6) {
        countByAncestor.set(node, (countByAncestor.get(node) || 0) + 1);
        node = node.parentElement;
        steps++;
      }
    }

    let bestAncestor = null;
    let bestCount = 0;
    for (const [el, count] of countByAncestor) {
      if (count > bestCount) {
        bestCount = count;
        bestAncestor = el;
      }
    }

    if (!bestAncestor || bestCount < MIN_IMAGES) return candidates;
    const inCluster = candidates.filter((img) => bestAncestor.contains(img));
    return inCluster.length >= MIN_IMAGES ? inCluster : candidates;
  }

  function findChapterLink(doc, wordPattern) {
    const anchors = Array.from(doc.querySelectorAll("a[href]"));
    for (const a of anchors) {
      const text = `${a.textContent || ""} ${a.getAttribute("rel") || ""} ${a.getAttribute("aria-label") || ""}`;
      if (wordPattern.test(text)) return a.href;
    }
    return null;
  }

  function guessTitle(doc) {
    const h1 = doc.querySelector("h1");
    if (h1?.textContent?.trim()) return h1.textContent.trim();
    if (doc.title) return doc.title.trim();
    return "Manga Chapter";
  }

  function genericParse(doc, url) {
    const cluster = findImageCluster(doc);
    if (cluster.length < MIN_IMAGES) return null;
    const images = cluster
      .map((img) => img.currentSrc || img.src)
      .filter((src, idx, arr) => src && arr.indexOf(src) === idx);
    if (images.length < MIN_IMAGES) return null;
    return {
      title: guessTitle(doc),
      chapterKey: url.split("#")[0].split("?")[0],
      images,
      prevChapterUrl: findChapterLink(doc, PREV_WORDS),
      nextChapterUrl: findChapterLink(doc, NEXT_WORDS),
    };
  }

  function extractChapterNumber(url) {
    const match = url.match(/chapter-(\d+)(?:[/?#]|$)/i);
    return match ? parseInt(match[1], 10) : null;
  }

  function bloodOnTheTracksParse(doc, url) {
    if (!/(^|\.)blood-on-the-tracks\.com$/i.test(new URL(url).hostname)) return null;

    const title = doc.querySelector("h1")?.textContent?.trim() || doc.title.trim();
    const images = Array.from(doc.querySelectorAll("img"))
      .map((img) => img.src)
      .filter((src) => /blogger(usercontent)?\.(com|googleusercontent\.com)/i.test(src));
    if (images.length < 3) return null;

    const currentChapterNum = extractChapterNumber(url);
    const nav = Array.from(doc.querySelectorAll("a[href]"));
    let prevChapterUrl = null;
    let nextChapterUrl = null;

    for (const a of nav) {
      const text = (a.textContent || "").trim();
      if (!/^previous/i.test(text) && !/^next/i.test(text)) continue;
      const candidateNum = extractChapterNumber(a.href);
      if (currentChapterNum !== null && candidateNum !== null) {
        if (candidateNum < currentChapterNum) prevChapterUrl = a.href;
        else if (candidateNum > currentChapterNum) nextChapterUrl = a.href;
      } else {
        if (/^previous/i.test(text)) prevChapterUrl = a.href;
        if (/^next/i.test(text)) nextChapterUrl = a.href;
      }
    }

    return {
      title,
      chapterKey: url.split("#")[0].split("?")[0],
      images,
      prevChapterUrl,
      nextChapterUrl,
    };
  }

  function parseChapter(doc, url) {
    return bloodOnTheTracksParse(doc, url) || genericParse(doc, url);
  }

  /* ------------------------------------------------------------------ *
   * Reader UI (Shadow DOM overlay)                                      *
   * ------------------------------------------------------------------ */

  const HOST_ID = "manga-reader-host-a1b2c3";
  const PRELOAD_AHEAD = 3;

  const EYE_OPEN_ICON =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC4ElEQVR4nO2Y32vPURjHX7NNC/ObFil3wxab/AGU4sLPC7mYH1vNDbnyIxeSwtWE/Cr5UdsKJYrSyG9S3Ci0UrJyqRjhAttMz3q+9ez0Mc9Z332/Ls6rTn06n/N+zvP5nuc85zlfSCQSiUQiwWxgE3ASuAu8A7qBXm3y/Ba4AxwHGoBZxXZ6JrAXeAn0D7O9APYAVYV0vAa4pL9sf57aL6ANmDOSjk8DzgJ9GQ78AG4B+4AVwFxgElAKlOmzfPgqYL+G0s8MO/KjnAYm59v5tcDHjAklfJqAymHYnAA0A50Zdj8AK/PheJluunCC+8DSfEwAlADLgccZ8xzRVRwWlbrU1qBkk0ZGhhJgC/AlmLMDGBNrbDzwNDB0s0DZYgZwO5j7ETDOa2C05nJr4IxzKUt1v0hGeQN81ybPrcAaYJQzdM8HPkiSKPd8wLlAKJnFwxLgtSNlvgIWO0PqQKCVDDUkDYGgxen8dqAnIu/3qMbDsUC7/m8DJb4/B0vmCZvGYIJPmuvrgbHa6rWvOxi72RlONqTFxvSsgRfNoC49fP5FtR5iOd09YMoQ46fqGHsAVjvmEZvvjU722CAWAL/NANmIHq4ZzTOgwqGRMc+N7qpzrnVGI9VArX15xbx84DRYZcoKKQHm4afG1FJ9EenZHnaXbd7NbUBZhYVOY83BYROLaHJ6seVhUVAADnz4LtP5MMKBFqMTG7HYeQ9H6Owq7JCOJ6YjpkxoNbqN8f6zwejbI3RNRicfM3BS5uJYsoSXE8bQtnj/2Wr0cpOLKetz++ebdBwEvuqpF8Nu48AF4hFNTi+2Yjikzsf6PIi64HCR+t7LxOBQq6NI2MuIhJSXU0bXSRFZHZQGOyOzT79eM4tKe+DQdWB+xjg57W8EY9v4D6jIuLnl6qkObV0Z70XjKT0KglSMR51/tfTqXVc0/x01GlK2LLeZqi2yZioa5VotLtNW670OJhKJRCKRSFA4/gDT2VWv7Gda2QAAAABJRU5ErkJggg==";
  const EYE_CLOSED_ICON =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC0klEQVR4nO2ZW4hOURTHf8a4DeJzSXKfUHhAPIjyrlwyHjEpHniapIxiJE0zoiZyad48KAopl8i9GB7cby/kgXEZxpMazAwZrVqnVrvzfX37zDnnQ+dXu9mds/d/rb3P3vtbew1kZGRk/A+MBaqBJuAy8Ar4AnQBnVqXZ5eAfcBqYEypnRYHaoEnwG+gx7NIn4fAFmBUmo5PBY7p7PbEVDqBo8CUJB3PAc3AzzwOXAPqgJXADGAk0B8YoDMsz6qAncDNPBPQBRwChsXt/DLgQ4jB28BaYHAEzaHAOuBuiO47YEkcjvcF9oSs8RZgMfGxQL+gu0fEdllU0QrgoiP6EVhOcqwC2hybZ4FBvkLS4XqIkOyDpBkBXHBsX/EdxBlHoL43nzICZUCj48NJH4GvpuNWSsc248c3n47rgQfAJkrPRuCp/s3IyMjISI864AdwhNLRrKG6hODetJmocBrpM91EwRJEenPa/IzvJn3qjf1TUQRWGIH3Gl6nxRCd9cC+XKi86aeO24g0LRqN3Vb1JRLVRkg29BySZ55u3MDumt6I9QHuO7MhOaCkGO/cve+pD5GRLEKHc7GQ0HYc8TMReOHY6tBrpjcy6u0FElaSNZgbo/Pz82Q9gmN8h++XaHJEXupJ0GqedevG9r5wGyo089BtdN8CS9Wm9UF8KprPpuNVc5mXz/zcEX6j6cHhnhd3uaraCZHyDJigbXJqO3j3yWcANSq+Fyh33smMHw5ZXrJezwGbgYXAJJ1hSXpNBhbpQCXj8D1kmRwEBjq2ytWHVvUpNmblSTFGLb+A2aSIzRndAU6EnFaFirQ9rn2DZzfScr7K2ciStEWXixx5DcB5oN20a9fl1aD9g7BkprOB5V3iPDYG9xdot8u0k3o+Dph2j0iBFnMq5GIYQE61pN0tUmA0sKGIf0YUOwChUjVF+6+h1gxA6v8clcBrLVLPyMggfv4AoXhKfSx0ZrcAAAAASUVORK5CYII=";

  function clamp(n, min, max) {
    return Math.min(max, Math.max(min, n));
  }

  function buildTemplate() {
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
            <button class="mr-btn mr-fit" title="Ajustar à largura">↔</button>
            <button class="mr-btn mr-zoom-out" title="Diminuir zoom">−</button>
            <div class="mr-zoom-label">100%</div>
            <button class="mr-btn mr-zoom-in" title="Aumentar zoom">+</button>
            <button class="mr-btn mr-dark" title="Alternar tema"></button>
            <button class="mr-btn mr-fullscreen" title="Tela cheia">⛶</button>
            <button class="mr-btn mr-auto-fullscreen" title="Entrar em tela cheia automaticamente ao abrir/trocar de capítulo">⛶ Auto</button>
            <button class="mr-btn mr-close" title="Fechar">✕</button>
          </div>
        </header>
        <div class="mr-stage-wrap">
          <div class="mr-click-left" title="Página anterior"></div>
          <div class="mr-stage"></div>
          <div class="mr-click-right" title="Próxima página"></div>
        </div>
        <footer class="mr-bottombar">
          <button class="mr-btn mr-prev-chapter">Cap. anterior</button>
          <button class="mr-btn mr-prev-page">‹</button>
          <input type="range" class="mr-slider" min="0" value="0" step="1" />
          <button class="mr-btn mr-next-page">›</button>
          <button class="mr-btn mr-next-chapter">Próximo cap.</button>
        </footer>
      </div>
    `;
  }

  const CSS = `
    :host { all: initial; }
    * { box-sizing: border-box; font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
    .mr-root { position: fixed; inset: 0; z-index: 2147483647; display: flex; flex-direction: column; --mr-zoom: 1; }
    .mr-dark-theme { background: #0e0e12; color: #f0f0f0; }
    .mr-light-theme { background: #f5f5f7; color: #1a1a1a; }
    .mr-topbar, .mr-bottombar { display: flex; align-items: center; gap: 6px; padding: 8px 10px; flex-wrap: wrap; }
    .mr-dark-theme .mr-topbar, .mr-dark-theme .mr-bottombar { background: #17171d; border-color: #2a2a33; }
    .mr-light-theme .mr-topbar, .mr-light-theme .mr-bottombar { background: #ffffff; border-color: #e2e2e6; }
    .mr-topbar { border-bottom: 1px solid; justify-content: space-between; padding-right: 58px; }
    .mr-bottombar { border-top: 1px solid; }
    .mr-title-block { display: flex; flex-direction: column; min-width: 0; }
    .mr-title { font-weight: 600; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 38vw; }
    .mr-page-info { font-size: 11px; opacity: 0.7; }
    .mr-topbar-controls { display: flex; gap: 4px; flex-wrap: wrap; align-items: center; }
    .mr-btn { border: 1px solid transparent; border-radius: 6px; padding: 7px 9px; font-size: 13px; cursor: pointer; background: rgba(127,127,127,0.15); color: inherit; touch-action: manipulation; }
    .mr-btn:hover { background: rgba(127,127,127,0.3); }
    .mr-btn:disabled { opacity: 0.35; cursor: default; }
    .mr-btn.mr-active { background: #4f7cff; color: white; }
    .mr-prev-chapter, .mr-next-chapter { text-align: center; }
    .mr-zoom-label { font-size: 11px; min-width: 36px; text-align: center; opacity: 0.8; }
    .mr-stage-wrap { position: relative; flex: 1; display: flex; overflow: hidden; }
    .mr-stage { flex: 1; overflow: auto; display: flex; flex-direction: column; align-items: center; scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
    .mr-continuous .mr-stage { gap: 4px; }
    .mr-double .mr-stage { flex-direction: row; gap: 6px; }
    .mr-double.mr-rtl-active .mr-stage { flex-direction: row-reverse; }
    .mr-page-img { max-width: calc(100% * var(--mr-zoom)); height: auto; display: block; margin: 0 auto; user-select: none; -webkit-user-select: none; }
    .mr-root:not(.mr-fit-width) .mr-page-img { max-width: none; width: calc(60% * var(--mr-zoom)); }
    .mr-double .mr-page-img { max-width: calc(48% * var(--mr-zoom)); width: auto; }
    .mr-root:not(.mr-fit-width).mr-double .mr-page-img { max-width: none; width: calc(30% * var(--mr-zoom)); }
    .mr-root:not(.mr-continuous) .mr-stage { justify-content: center; }
    .mr-root:not(.mr-continuous) .mr-page-img { margin: auto; }
    .mr-click-left, .mr-click-right { position: absolute; top: 0; bottom: 0; width: 16%; z-index: 2; }
    .mr-click-left { left: 0; } .mr-click-right { right: 0; }
    .mr-continuous .mr-click-left, .mr-continuous .mr-click-right { display: none; }
    .mr-slider { flex: 1; min-width: 60px; }
    .mr-hud-toggle {
      position: absolute; top: 12px; right: 14px; z-index: 10;
      width: 40px; height: 40px; border-radius: 50%;
      border: none; background: transparent;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; padding: 0; touch-action: manipulation;
      opacity: 0.85; transition: opacity 0.15s, transform 0.15s;
    }
    .mr-hud-toggle:hover { opacity: 1; transform: scale(1.08); background: transparent; }
    .mr-hud-icon { width: 20px; height: 20px; display: block; pointer-events: none; }
    .mr-dark-theme .mr-hud-icon { filter: invert(1); }
    .mr-hud-hidden .mr-topbar,
    .mr-hud-hidden .mr-bottombar { display: none; }
  `;

  // If openReader() runs more than once on the same page (e.g. the floating
  // button gets tapped again while the reader is already open), only the
  // newest instance should have live listeners — otherwise two keydown
  // handlers can both react to a single "F" press and race each other.
  let activeReaderCleanup = null;

  function openReader(chapter) {
    if (activeReaderCleanup) {
      activeReaderCleanup();
      activeReaderCleanup = null;
    }

    const existing = document.getElementById(HOST_ID);
    if (existing) existing.remove();

    const host = document.createElement("div");
    host.id = HOST_ID;
    document.documentElement.appendChild(host);
    const shadow = host.attachShadow({ mode: "open" });

    const settings = getSettings();
    const savedProgress = getProgress(chapter.chapterKey);
    let currentPage = clamp(savedProgress?.page ?? 0, 0, chapter.images.length - 1);
    let isFullscreen = Boolean(document.fullscreenElement);

    shadow.innerHTML = buildTemplate();
    const styleEl = document.createElement("style");
    styleEl.textContent = CSS;
    shadow.prepend(styleEl);

    const els = {
      root: shadow.querySelector(".mr-root"),
      title: shadow.querySelector(".mr-title"),
      pageInfo: shadow.querySelector(".mr-page-info"),
      stage: shadow.querySelector(".mr-stage"),
      slider: shadow.querySelector(".mr-slider"),
      prevPageBtn: shadow.querySelector(".mr-prev-page"),
      nextPageBtn: shadow.querySelector(".mr-next-page"),
      prevChapterBtn: shadow.querySelector(".mr-prev-chapter"),
      nextChapterBtn: shadow.querySelector(".mr-next-chapter"),
      modeBtn: shadow.querySelector(".mr-mode"),
      rtlBtn: shadow.querySelector(".mr-rtl"),
      darkBtn: shadow.querySelector(".mr-dark"),
      fitBtn: shadow.querySelector(".mr-fit"),
      zoomOutBtn: shadow.querySelector(".mr-zoom-out"),
      zoomInBtn: shadow.querySelector(".mr-zoom-in"),
      zoomLabel: shadow.querySelector(".mr-zoom-label"),
      fullscreenBtn: shadow.querySelector(".mr-fullscreen"),
      autoFullscreenBtn: shadow.querySelector(".mr-auto-fullscreen"),
      closeBtn: shadow.querySelector(".mr-close"),
      leftClickZone: shadow.querySelector(".mr-click-left"),
      rightClickZone: shadow.querySelector(".mr-click-right"),
      hudToggleBtn: shadow.querySelector(".mr-hud-toggle"),
      hudIcon: shadow.querySelector(".mr-hud-icon"),
    };

    els.title.textContent = chapter.title;
    els.slider.max = String(chapter.images.length - 1);
    els.prevChapterBtn.disabled = !chapter.prevChapterUrl;
    els.nextChapterBtn.disabled = !chapter.nextChapterUrl;

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
      els.fullscreenBtn.classList.toggle("mr-active", isFullscreen);
      els.fullscreenBtn.title = isFullscreen ? "Sair da tela cheia (F)" : "Entrar em tela cheia (F)";
      els.autoFullscreenBtn.classList.toggle("mr-active", settings.autoFullscreen);
      els.autoFullscreenBtn.title = settings.autoFullscreen
        ? "Tela cheia automática: ativada (clique para desativar)"
        : "Tela cheia automática: desativada (clique para ativar)";
      els.zoomLabel.textContent = `${Math.round(settings.zoom * 100)}%`;
      els.root.classList.toggle("mr-hud-hidden", settings.hudHidden);
      els.hudIcon.src = settings.hudHidden ? EYE_CLOSED_ICON : EYE_OPEN_ICON;
      els.hudToggleBtn.title = settings.hudHidden
        ? "Mostrar controles (H)"
        : "Ocultar controles (H)";
    }

    function persistSettings() {
      saveSettings(settings);
    }

    const preloaded = new Set();
    function preloadAround(page) {
      for (let i = page; i <= page + PRELOAD_AHEAD; i++) {
        if (i < 0 || i >= chapter.images.length || preloaded.has(i)) continue;
        preloaded.add(i);
        const img = new Image();
        img.src = chapter.images[i];
      }
    }

    let observer = null;

    function getSpreadStart(page) {
      return page - (page % 2);
    }

    function renderSinglePage() {
      if (observer) { observer.disconnect(); observer = null; }
      els.stage.innerHTML = "";
      const img = document.createElement("img");
      img.className = "mr-page-img";
      img.src = chapter.images[currentPage];
      img.alt = `Página ${currentPage + 1}`;
      els.stage.appendChild(img);
      els.pageInfo.textContent = `${currentPage + 1} / ${chapter.images.length}`;
      els.slider.value = String(currentPage);
      preloadAround(currentPage);
      saveProgress(chapter.chapterKey, currentPage);
    }

    function renderDoublePage() {
      if (observer) { observer.disconnect(); observer = null; }
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

      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const idx = Number(visible.target.dataset.pageIndex);
          if (!Number.isNaN(idx) && idx !== currentPage) {
            currentPage = idx;
            els.pageInfo.textContent = `${currentPage + 1} / ${chapter.images.length}`;
            els.slider.value = String(currentPage);
            preloadAround(currentPage);
            saveProgress(chapter.chapterKey, currentPage);
          }
        },
        { root: els.stage, threshold: [0.5] }
      );
      shadow.querySelectorAll(".mr-continuous-img").forEach((el) => observer.observe(el));

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

    function goToPage(page) {
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
      if (currentPage < chapter.images.length - 1) goToPage(currentPage + 1);
      else if (chapter.nextChapterUrl) navigateToChapter(chapter.nextChapterUrl);
    }

    function prevPage() {
      if (settings.mode === "double") {
        const prevStart = getSpreadStart(currentPage) - 2;
        if (prevStart >= 0) {
          currentPage = prevStart;
          render();
        } else if (chapter.prevChapterUrl) {
          navigateToChapter(chapter.prevChapterUrl);
        }
        return;
      }
      if (currentPage > 0) goToPage(currentPage - 1);
      else if (chapter.prevChapterUrl) navigateToChapter(chapter.prevChapterUrl);
    }

    function navigateToChapter(url) {
      window.location.href = url;
    }

    function closeReader() {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (observer) observer.disconnect();
      host.remove();
      if (activeReaderCleanup === closeReader) activeReaderCleanup = null;
    }
    activeReaderCleanup = closeReader;

    function onFullscreenChange() {
      isFullscreen = Boolean(document.fullscreenElement);
      applySettingsToDom();
    }

    function onKeyDown(e) {
      if (e.repeat) return; // ignore key-repeat while held
      if (e.key === "Escape") return closeReader();
      if (e.key === "f" || e.key === "F") return setFullscreen(!isFullscreen);
      if (e.key === "h" || e.key === "H") return toggleHud();
      if (settings.mode === "continuous") return;
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

    // Explicit target state (never "toggle, whatever that means right now")
    // so two near-simultaneous calls converge instead of racing.
    function setFullscreen(enabled) {
      isFullscreen = enabled;
      if (enabled) host.requestFullscreen?.().catch(() => {});
      else document.exitFullscreen?.().catch(() => {});
      applySettingsToDom();
    }

    els.closeBtn.addEventListener("click", closeReader);
    els.nextPageBtn.addEventListener("click", nextPage);
    els.prevPageBtn.addEventListener("click", prevPage);
    els.leftClickZone.addEventListener("click", () => (settings.rtl ? nextPage() : prevPage()));
    els.rightClickZone.addEventListener("click", () => (settings.rtl ? prevPage() : nextPage()));
    els.slider.addEventListener("input", () => goToPage(Number(els.slider.value)));
    els.prevChapterBtn.addEventListener("click", () => chapter.prevChapterUrl && navigateToChapter(chapter.prevChapterUrl));
    els.nextChapterBtn.addEventListener("click", () => chapter.nextChapterUrl && navigateToChapter(chapter.nextChapterUrl));

    els.modeBtn.addEventListener("click", () => {
      settings.mode = settings.mode === "single" ? "double" : settings.mode === "double" ? "continuous" : "single";
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
    function setZoom(z) {
      settings.zoom = clamp(Math.round(z * 100) / 100, 0.5, 2.5);
      applySettingsToDom();
      persistSettings();
    }

    // Manual button: flips current fullscreen state, same as F11, without
    // touching the "auto fullscreen" preference.
    els.fullscreenBtn.addEventListener("click", () => setFullscreen(!isFullscreen));

    // "Auto" button: also acts exactly like F11 immediately when clicked,
    // but additionally remembers the choice for future chapters/opens.
    // (On mobile there's no window-level fullscreen API, so re-entry after
    // a chapter change may still be blocked by the browser's fullscreen
    // permission rules — the button always works as a manual fallback.)
    els.autoFullscreenBtn.addEventListener("click", () => {
      settings.autoFullscreen = !settings.autoFullscreen;
      persistSettings();
      setFullscreen(settings.autoFullscreen);
    });

    els.hudToggleBtn.addEventListener("click", toggleHud);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    function toggleHud() {
      settings.hudHidden = !settings.hudHidden;
      applySettingsToDom();
      persistSettings();
    }

    applySettingsToDom();
    render();
    if (settings.autoFullscreen && !isFullscreen) setFullscreen(true);
  }

  /* ------------------------------------------------------------------ *
   * Activation: floating button (auto-detected) + Tampermonkey menu     *
   * ------------------------------------------------------------------ */

  function activate() {
    const chapter = parseChapter(document, window.location.href);
    if (!chapter) {
      alert(
        "Manga Reader: não consegui identificar as páginas do mangá nesta página.\n" +
          "Tente abrir diretamente a página do capítulo."
      );
      return;
    }
    openReader(chapter);
  }

  function maybeShowFloatingButton() {
    // Don't bother scanning pages that clearly aren't chapter pages, and don't
    // scan if the reader is already open.
    if (document.getElementById(HOST_ID)) return;
    if (document.getElementById("manga-reader-fab")) return;

    const chapter = parseChapter(document, window.location.href);
    if (!chapter) return;

    const btn = document.createElement("button");
    btn.id = "manga-reader-fab";
    btn.textContent = "📖";
    btn.title = "Abrir Manga Reader";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "24px",
      right: "20px",
      zIndex: "2147483646",
      width: "52px",
      height: "52px",
      borderRadius: "50%",
      border: "none",
      background: "#4f7cff",
      color: "white",
      fontSize: "22px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.35)",
      cursor: "pointer",
    });
    btn.addEventListener("click", activate);
    document.body.appendChild(btn);
  }

  if (typeof GM_registerMenuCommand === "function") {
    GM_registerMenuCommand("📖 Abrir Manga Reader", activate);
  }

  // Give lazy-loaded content a moment, then check whether this looks like a
  // chapter page; if so, show a small floating button as a one-tap shortcut
  // (handy on mobile where the Tampermonkey menu is a couple of taps away).
  window.addEventListener("load", () => setTimeout(maybeShowFloatingButton, 800));
  if (document.readyState === "complete") setTimeout(maybeShowFloatingButton, 800);
})();
