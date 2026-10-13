/* =========================================================
   LỘC AN — FULLSCREEN MUSEUM MODE v22

   Fixes:
   - excludes Balenciaga / sold museum pairs
   - smoother, lighter transitions
   - image preload before swap
   - per-pair size normalization for oversize pairs
========================================================= */
(() => {
  "use strict";

  const LANGS = ["vi", "en"];

  const COPY = {
    vi: {
      mode: "MUSEUM MODE",
      story: "CÂU CHUYỆN",
      exit: "BỘ SƯU TẬP",
      pause: "TẠM DỪNG",
      play: "TIẾP TỤC",
      fullscreen: "TOÀN MÀN HÌNH",
      leaveFullscreen: "THOÁT TOÀN MÀN HÌNH",
      speed: "THỜI GIAN",
      idle: "Di chuyển chuột để hiện điều khiển",
      launchTitle: "MUSEUM MODE",
      launchText: "Trình chiếu tự động dành cho TV và màn hình trong phòng trưng bày.",
      launchFullscreen: "BẮT ĐẦU TOÀN MÀN HÌNH",
      launchWindow: "BẮT ĐẦU",
      launchNote: "← / → chuyển đôi · Space tạm dừng · F toàn màn hình",
      untitled: "HIỆN VẬT KHÔNG TÊN",
      noStory: "Thông tin lưu trữ của đôi giày này đang được cập nhật.",
      noPairs: "Không có đôi giày nào trong bộ sưu tập hiện tại."
    },
    en: {
      mode: "MUSEUM MODE",
      story: "STORY",
      exit: "COLLECTION",
      pause: "PAUSE",
      play: "RESUME",
      fullscreen: "FULLSCREEN",
      leaveFullscreen: "EXIT FULLSCREEN",
      speed: "TIMING",
      idle: "Move the pointer to show controls",
      launchTitle: "MUSEUM MODE",
      launchText: "An automatic exhibition loop designed for a TV or display in the sneaker room.",
      launchFullscreen: "START FULLSCREEN",
      launchWindow: "START",
      launchNote: "← / → change pair · Space pause · F fullscreen",
      untitled: "UNTITLED ARTIFACT",
      noStory: "Archive information for this pair is being updated.",
      noPairs: "There are no current collection pairs to display."
    }
  };

  const MUSEUM_EXCLUDE_PATTERNS = [
    /balenciaga/i
  ];

  const FIT_OVERRIDES = [
    { match: /New Balance\s*2002R/i, width: "69%", height: "64%", mobileWidth: "70%", mobileHeight: "62%" },
    { match: /Raygun Away/i, width: "70%", height: "65%", mobileWidth: "71%", mobileHeight: "63%" },
    { match: /BAPE\s*x\s*St[üu]ssy/i, width: "66%", height: "62%", mobileWidth: "68%", mobileHeight: "61%" },
    { match: /Waffle Racer/i, width: "67%", height: "62%", mobileWidth: "69%", mobileHeight: "61%" },
    { match: /Seafoam/i, width: "70%", height: "65%", mobileWidth: "71%", mobileHeight: "63%" }
  ];

  const DEFAULT_FIT = {
    width: "84%",
    height: "76%",
    mobileWidth: "84%",
    mobileHeight: "72%"
  };

  const app = document.getElementById("museum-app");
  const stage = document.getElementById("museum-stage");
  const image = document.getElementById("museum-image");
  const title = document.getElementById("museum-title");
  const subtitle = document.getElementById("museum-subtitle");
  const year = document.getElementById("museum-year");
  const edition = document.getElementById("museum-edition");
  const story = document.getElementById("museum-story");
  const counter = document.getElementById("museum-counter");
  const progress = document.getElementById("museum-progress-bar");
  const launch = document.getElementById("museum-launch");

  const state = {
    lang: initialLanguage(),
    pairs: [],
    index: 0,
    playing: true,
    started: false,
    durationMs: 12000,
    elapsedBeforePause: 0,
    cycleStartedAt: 0,
    raf: 0,
    hideTimer: 0,
    transitionToken: 0,
    imageCache: new Map()
  };

  function initialLanguage() {
    const query = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(query)) return query;

    try {
      const stored = localStorage.getItem("locan_lang");
      if (LANGS.includes(stored)) return stored;
    } catch (_) {}

    return "vi";
  }

  function saveLanguage(lang) {
    try { localStorage.setItem("locan_lang", lang); } catch (_) {}
  }

  function localized(value) {
    if (value == null) return "";
    if (typeof value === "string" || typeof value === "number") return String(value);
    return String(value[state.lang] ?? value.vi ?? value.en ?? "");
  }

  function normalizedTitle(item) {
    return [localized(item?.title), localized(item?.subtitle), localized(item?.brand)]
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  function statusOf(item) {
    return String(item?.collectionStatus || "own").trim().toLowerCase();
  }

  function shouldExcludeFromMuseum(item) {
    const haystack = normalizedTitle(item);
    return MUSEUM_EXCLUDE_PATTERNS.some(pattern => pattern.test(haystack));
  }

  function releaseYear(item) {
    const raw = String(item?.releaseDate || "");
    const match = raw.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : "—";
  }

  function editionOf(item) {
    return localized(item?.editionType) || localized(item?.edition) || "";
  }

  function imageOf(item) {
    if (Array.isArray(item?.images) && item.images.length) return String(item.images[0]);
    return String(item?.image || "");
  }

  function firstSubstantialStoryParagraph(item) {
    const html = localized(item?.story);
    if (!html) return COPY[state.lang].noStory;

    const holder = document.createElement("div");
    holder.innerHTML = html;

    const paragraphs = Array.from(holder.querySelectorAll("p"))
      .map(node => (node.textContent || "").replace(/\s+/g, " ").trim())
      .filter(Boolean);

    if (!paragraphs.length) {
      const plain = (holder.textContent || "").replace(/\s+/g, " ").trim();
      return plain || COPY[state.lang].noStory;
    }

    const substantial = paragraphs.find(text => text.length >= 90);
    return substantial || paragraphs[0];
  }

  function fitFor(item) {
    const haystack = normalizedTitle(item);
    return FIT_OVERRIDES.find(entry => entry.match.test(haystack)) || DEFAULT_FIT;
  }

  function applyFit(item) {
    const fit = fitFor(item);

    image.style.setProperty("--museum-image-width", fit.width);
    image.style.setProperty("--museum-image-height", fit.height);
    image.style.setProperty("--museum-image-width-mobile", fit.mobileWidth || fit.width);
    image.style.setProperty("--museum-image-height-mobile", fit.mobileHeight || fit.height);
  }

  function buildCollection() {
    const catalog = (typeof sneakers !== "undefined" && Array.isArray(sneakers)) ? sneakers : [];
    state.pairs = catalog.filter(item => statusOf(item) === "own" && !shouldExcludeFromMuseum(item));
  }

  function setLanguage(lang) {
    state.lang = LANGS.includes(lang) ? lang : "vi";
    saveLanguage(state.lang);
    document.documentElement.lang = state.lang;

    document.getElementById("museum-lang-vi")?.classList.toggle("active", state.lang === "vi");
    document.getElementById("museum-lang-en")?.classList.toggle("active", state.lang === "en");

    syncStaticCopy();

    if (state.pairs.length) {
      renderPair(state.index, { immediate: true, resetTimer: false });
    }

    const url = new URL(location.href);
    url.searchParams.set("lang", state.lang);
    history.replaceState({}, "", url.pathname + url.search + url.hash);
  }

  function syncStaticCopy() {
    const t = COPY[state.lang];
    setText("museum-mode-label", t.mode);
    setText("museum-story-label", t.story);
    setText("museum-exit-copy", t.exit);
    setText("museum-speed-label", t.speed);
    setText("museum-idle-hint-copy", t.idle);
    setText("museum-launch-title", t.launchTitle);
    setText("museum-launch-text", t.launchText);
    setText("museum-launch-fullscreen-copy", t.launchFullscreen);
    setText("museum-launch-window-copy", t.launchWindow);
    setText("museum-launch-note", t.launchNote);
    syncPlayButton();
    syncFullscreenButton();

    const exit = document.getElementById("museum-exit-link");
    if (exit) exit.href = `./index.html?lang=${encodeURIComponent(state.lang)}`;

    document.title = state.lang === "vi" ? "Museum Mode | Bộ sưu tập giày Lộc An" : "Museum Mode | Lộc An Sneaker Collection";
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function cacheImage(src) {
    if (!src) return Promise.resolve(src);
    if (state.imageCache.has(src)) return state.imageCache.get(src);

    const promise = new Promise(resolve => {
      const preload = new Image();
      preload.decoding = "async";
      preload.loading = "eager";

      const finish = async () => {
        try {
          if (typeof preload.decode === "function") {
            await preload.decode();
          }
        } catch (_) {}
        resolve(src);
      };

      preload.onload = finish;
      preload.onerror = () => resolve(src);
      preload.src = src;

      if (preload.complete && preload.naturalWidth > 0) {
        finish();
      }
    });

    state.imageCache.set(src, promise);
    return promise;
  }

  function preloadAround(index) {
    if (!state.pairs.length) return;
    [index, index + 1, index + 2, index - 1].forEach(rawIndex => {
      const i = (rawIndex + state.pairs.length) % state.pairs.length;
      cacheImage(imageOf(state.pairs[i]));
    });
  }

  function renderPair(nextIndex, { immediate = false, resetTimer = true } = {}) {
    if (!state.pairs.length) {
      title.textContent = COPY[state.lang].noPairs;
      subtitle.textContent = "";
      story.textContent = "";
      image.removeAttribute("src");
      counter.textContent = "00 / 00";
      return;
    }

    const normalized = (nextIndex + state.pairs.length) % state.pairs.length;
    const token = ++state.transitionToken;
    const item = state.pairs[normalized];
    const src = imageOf(item);

    const apply = () => {
      if (token !== state.transitionToken) return;

      state.index = normalized;
      applyFit(item);
      image.src = src;
      image.alt = localized(item?.title) || COPY[state.lang].untitled;
      title.textContent = localized(item?.title) || COPY[state.lang].untitled;
      subtitle.textContent = localized(item?.subtitle);
      year.textContent = releaseYear(item);
      edition.textContent = editionOf(item);
      story.textContent = firstSubstantialStoryParagraph(item);
      counter.textContent = `${String(normalized + 1).padStart(2, "0")} / ${String(state.pairs.length).padStart(2, "0")}`;

      stage.classList.remove("is-changing", "is-entering");
      requestAnimationFrame(() => {
        if (token === state.transitionToken) {
          stage.classList.add("is-entering");
        }
      });

      preloadAround(normalized);
      if (resetTimer) resetCycle();
    };

    if (immediate) {
      apply();
      return;
    }

    stage.classList.add("is-changing");
    cacheImage(src).then(() => {
      if (token !== state.transitionToken) return;
      apply();
    });
  }

  function nextPair() { renderPair(state.index + 1); }
  function previousPair() { renderPair(state.index - 1); }

  function resetCycle() {
    state.elapsedBeforePause = 0;
    state.cycleStartedAt = performance.now();
    progress.style.transform = "scaleX(0)";
  }

  function elapsedMs(now) {
    if (!state.playing) return state.elapsedBeforePause;
    return state.elapsedBeforePause + Math.max(0, now - state.cycleStartedAt);
  }

  function animationLoop(now) {
    if (state.started && state.pairs.length) {
      const elapsed = elapsedMs(now);
      const ratio = Math.min(1, elapsed / state.durationMs);
      progress.style.transform = `scaleX(${ratio})`;
      if (state.playing && ratio >= 1) nextPair();
    }
    state.raf = requestAnimationFrame(animationLoop);
  }

  function setPlaying(nextPlaying) {
    const now = performance.now();
    if (nextPlaying === state.playing) return;
    if (nextPlaying) {
      state.cycleStartedAt = now;
      state.playing = true;
    } else {
      state.elapsedBeforePause = elapsedMs(now);
      state.playing = false;
    }
    syncPlayButton();
  }

  function togglePlay() {
    setPlaying(!state.playing);
    revealControls();
  }

  function syncPlayButton() {
    const t = COPY[state.lang];
    const icon = document.getElementById("museum-play-icon");
    const copy = document.getElementById("museum-play-copy");
    if (icon) icon.textContent = state.playing ? "Ⅱ" : "▶";
    if (copy) copy.textContent = state.playing ? t.pause : t.play;
  }

  async function enterFullscreen() {
    const target = document.documentElement;
    try {
      if (!document.fullscreenElement && target.requestFullscreen) await target.requestFullscreen();
    } catch (_) {}
    syncFullscreenButton();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await enterFullscreen();
    } catch (_) {}
    syncFullscreenButton();
    revealControls();
  }

  function syncFullscreenButton() {
    const t = COPY[state.lang];
    setText("museum-fullscreen-copy", document.fullscreenElement ? t.leaveFullscreen : t.fullscreen);
  }

  function startMuseum({ fullscreen = false } = {}) {
    state.started = true;
    launch.hidden = true;
    resetCycle();
    state.playing = true;
    syncPlayButton();
    revealControls();
    if (fullscreen) enterFullscreen();
  }

  function revealControls() {
    app.classList.remove("controls-hidden");
    clearTimeout(state.hideTimer);
    if (!state.started) return;
    state.hideTimer = window.setTimeout(() => {
      app.classList.add("controls-hidden");
    }, 3600);
  }

  function changeDuration(seconds) {
    const parsed = Number(seconds);
    if (![8, 12, 20, 30].includes(parsed)) return;
    state.durationMs = parsed * 1000;
    resetCycle();
    revealControls();
  }

  function handleKeyboard(event) {
    const target = event.target;
    const tag = target?.tagName?.toLowerCase();
    if (tag === "select" || tag === "input" || tag === "textarea") return;
    if (event.key === "ArrowRight") {
      event.preventDefault(); nextPair(); revealControls();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault(); previousPair(); revealControls();
    } else if (event.code === "Space") {
      event.preventDefault(); togglePlay();
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault(); toggleFullscreen();
    }
  }

  function installEvents() {
    document.getElementById("museum-prev")?.addEventListener("click", previousPair);
    document.getElementById("museum-next")?.addEventListener("click", nextPair);
    document.getElementById("museum-play")?.addEventListener("click", togglePlay);
    document.getElementById("museum-fullscreen")?.addEventListener("click", toggleFullscreen);
    document.getElementById("museum-lang-vi")?.addEventListener("click", () => setLanguage("vi"));
    document.getElementById("museum-lang-en")?.addEventListener("click", () => setLanguage("en"));
    document.getElementById("museum-speed")?.addEventListener("change", event => changeDuration(event.target.value));
    document.getElementById("museum-launch-window")?.addEventListener("click", () => startMuseum({ fullscreen: false }));
    document.getElementById("museum-launch-fullscreen")?.addEventListener("click", () => startMuseum({ fullscreen: true }));
    document.addEventListener("fullscreenchange", syncFullscreenButton);
    document.addEventListener("keydown", handleKeyboard);
    ["mousemove", "pointerdown", "touchstart"].forEach(type => {
      document.addEventListener(type, revealControls, { passive: true });
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.playing) setPlaying(false);
    });
  }

  function init() {
    buildCollection();
    syncStaticCopy();
    setLanguage(state.lang);
    renderPair(0, { immediate: true, resetTimer: false });
    installEvents();
    state.raf = requestAnimationFrame(animationLoop);
  }

  init();
})();
