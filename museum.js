/* =========================================================
   LỘC AN — FULLSCREEN MUSEUM MODE v24

   EXACT-FRAME RENDERER
   --------------------
   The previous Museum versions still depended on each PNG's
   internal transparent padding. That can look different even
   when every <img> element has the same CSS size.

   v24 measures the ACTUAL visible sneaker pixels (alpha bounds)
   and draws every pair into one fixed canvas envelope using the
   homepage Grid target:
       width  = 82% of Museum image frame
       height = 68% of Museum image frame

   No per-pair scale table. No guessing.
========================================================= */
(() => {
  "use strict";

  const LANGS = ["vi", "en"];

  const HOMEPAGE_GRID_TARGET = Object.freeze({
    width: 0.82,
    height: 0.68,
    alphaThreshold: 18,
    sampleMax: 320
  });

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

  const app = document.getElementById("museum-app");
  const stage = document.getElementById("museum-stage");
  const frame = document.getElementById("museum-image-frame");
  const canvas = document.getElementById("museum-canvas");
  const ctx = canvas?.getContext("2d", { alpha: true });

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
    renderToken: 0,
    imageCache: new Map(),
    bboxCache: new Map(),
    currentImage: null,
    currentItem: null
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

  function statusOf(item) {
    return String(item?.collectionStatus || "own").trim().toLowerCase();
  }

  function releaseYear(item) {
    const raw = String(item?.releaseDate || "");
    const match = raw.match(/\b(19|20)\d{2}\b/);
    return match ? match[0] : "—";
  }

  function editionOf(item) {
    return localized(item?.editionType) || localized(item?.edition) || "";
  }

  function cleanPath(value) {
    return String(value || "")
      .split("?")[0]
      .split("#")[0]
      .replace(/^\.\//, "")
      .trim();
  }

  function originalImageOf(item) {
    const candidates = [
      item?.catalogOriginalImage,
      item?.originalImage,
      Array.isArray(item?.images) ? item.images[0] : "",
      item?.image
    ];

    for (const candidate of candidates) {
      const path = cleanPath(candidate);
      if (!path) continue;

      /*
        If another script already changed item.image to a normalized path,
        prefer catalogOriginalImage/images above. Otherwise this is valid.
      */
      return path;
    }

    return "";
  }

  function imageOf(item) {
    const source = originalImageOf(item);
    const map =
      window.CATALOG_NORMALIZED_IMAGE_MAP &&
      typeof window.CATALOG_NORMALIZED_IMAGE_MAP === "object"
        ? window.CATALOG_NORMALIZED_IMAGE_MAP
        : {};

    const entry = map[source] || map[`./${source}`];

    let grid = "";

    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      grid = cleanPath(entry.grid || entry.view3d || entry.default || "");
    } else if (typeof entry === "string") {
      grid = cleanPath(entry);
    }

    const resolved = grid || source;

    if (!resolved) return "";

    const separator = resolved.includes("?") ? "&" : "?";
    return `${resolved}${separator}museum=20261013-v24`;
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

    return paragraphs.find(text => text.length >= 90) || paragraphs[0];
  }

  function buildCollection() {
    const catalog =
      (typeof sneakers !== "undefined" && Array.isArray(sneakers))
        ? sneakers
        : [];

    state.pairs = catalog.filter(item => {
      if (!item || statusOf(item) !== "own") return false;

      /*
        Safety lock: this pair is explicitly in Formerly in Collection.
        Even a stale status patch cannot put it back into Museum Mode.
      */
      if (String(item.id || "") === "balenciaga-defender-beige") return false;

      return true;
    });
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

    document.title =
      state.lang === "vi"
        ? "Museum Mode | Bộ sưu tập giày Lộc An"
        : "Museum Mode | Lộc An Sneaker Collection";
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function loadImage(src) {
    if (!src) return Promise.resolve(null);

    if (state.imageCache.has(src)) {
      return state.imageCache.get(src);
    }

    const promise = new Promise(resolve => {
      const img = new Image();
      img.decoding = "async";
      img.loading = "eager";

      const finish = async () => {
        try {
          if (typeof img.decode === "function") {
            await img.decode();
          }
        } catch (_) {}

        resolve(img);
      };

      img.onload = finish;
      img.onerror = () => resolve(null);
      img.src = src;

      if (img.complete && img.naturalWidth > 0) {
        finish();
      }
    });

    state.imageCache.set(src, promise);
    return promise;
  }

  function alphaBounds(img, src) {
    if (!img) return null;

    if (state.bboxCache.has(src)) {
      return state.bboxCache.get(src);
    }

    const naturalW = Math.max(1, img.naturalWidth || img.width || 1);
    const naturalH = Math.max(1, img.naturalHeight || img.height || 1);

    const sampleScale =
      Math.min(
        1,
        HOMEPAGE_GRID_TARGET.sampleMax / Math.max(naturalW, naturalH)
      );

    const sampleW = Math.max(1, Math.round(naturalW * sampleScale));
    const sampleH = Math.max(1, Math.round(naturalH * sampleScale));

    const sample = document.createElement("canvas");
    sample.width = sampleW;
    sample.height = sampleH;

    const sctx = sample.getContext("2d", {
      alpha: true,
      willReadFrequently: true
    });

    if (!sctx) {
      const fallback = {
        left: 0,
        top: 0,
        right: naturalW,
        bottom: naturalH,
        width: naturalW,
        height: naturalH
      };
      state.bboxCache.set(src, fallback);
      return fallback;
    }

    sctx.clearRect(0, 0, sampleW, sampleH);
    sctx.drawImage(img, 0, 0, sampleW, sampleH);

    let data;

    try {
      data = sctx.getImageData(0, 0, sampleW, sampleH).data;
    } catch (_) {
      const fallback = {
        left: 0,
        top: 0,
        right: naturalW,
        bottom: naturalH,
        width: naturalW,
        height: naturalH
      };
      state.bboxCache.set(src, fallback);
      return fallback;
    }

    let minX = sampleW;
    let minY = sampleH;
    let maxX = -1;
    let maxY = -1;

    const threshold = HOMEPAGE_GRID_TARGET.alphaThreshold;

    for (let y = 0; y < sampleH; y += 1) {
      const row = y * sampleW;

      for (let x = 0; x < sampleW; x += 1) {
        const alpha = data[(row + x) * 4 + 3];

        if (alpha <= threshold) continue;

        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }

    if (maxX < minX || maxY < minY) {
      const fallback = {
        left: 0,
        top: 0,
        right: naturalW,
        bottom: naturalH,
        width: naturalW,
        height: naturalH
      };
      state.bboxCache.set(src, fallback);
      return fallback;
    }

    const xRatio = naturalW / sampleW;
    const yRatio = naturalH / sampleH;

    const left = minX * xRatio;
    const top = minY * yRatio;
    const right = (maxX + 1) * xRatio;
    const bottom = (maxY + 1) * yRatio;

    const bbox = {
      left,
      top,
      right,
      bottom,
      width: Math.max(1, right - left),
      height: Math.max(1, bottom - top)
    };

    state.bboxCache.set(src, bbox);
    return bbox;
  }

  function sizeCanvas() {
    if (!canvas || !ctx || !frame) return null;

    const rect = frame.getBoundingClientRect();
    const cssW = Math.max(1, rect.width);
    const cssH = Math.max(1, rect.height);

    /*
      Cap DPR for smooth TV/monitor playback.
      A full 2x/3x canvas is unnecessary for a large sneaker exhibition.
    */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    const pixelW = Math.max(1, Math.round(cssW * dpr));
    const pixelH = Math.max(1, Math.round(cssH * dpr));

    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW;
      canvas.height = pixelH;
    }

    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    return { cssW, cssH, dpr };
  }

  function drawFittedImage(img, src) {
    if (!img || !ctx) return;

    const sized = sizeCanvas();
    if (!sized) return;

    const { cssW, cssH } = sized;

    ctx.clearRect(0, 0, cssW, cssH);

    const bbox = alphaBounds(img, src);
    if (!bbox) return;

    const targetW = cssW * HOMEPAGE_GRID_TARGET.width;
    const targetH = cssH * HOMEPAGE_GRID_TARGET.height;

    /*
      This is the key: fit VISIBLE sneaker pixels, not the PNG canvas.
    */
    const scale = Math.min(
      targetW / bbox.width,
      targetH / bbox.height
    );

    const naturalW = img.naturalWidth || img.width;
    const naturalH = img.naturalHeight || img.height;

    const drawW = naturalW * scale;
    const drawH = naturalH * scale;

    const visualCenterX =
      (bbox.left + bbox.width / 2) * scale;

    const visualCenterY =
      (bbox.top + bbox.height / 2) * scale;

    const dx = cssW / 2 - visualCenterX;
    const dy = cssH / 2 - visualCenterY;

    ctx.drawImage(
      img,
      dx,
      dy,
      drawW,
      drawH
    );
  }

  async function preparePair(item) {
    const src = imageOf(item);
    const img = await loadImage(src);

    if (img) {
      alphaBounds(img, src);
    }

    return { item, src, img };
  }

  function preloadAround(index) {
    if (!state.pairs.length) return;

    [index, index + 1, index + 2, index - 1].forEach(rawIndex => {
      const i = (rawIndex + state.pairs.length) % state.pairs.length;
      preparePair(state.pairs[i]);
    });
  }

  async function renderPair(nextIndex, { immediate = false, resetTimer = true } = {}) {
    if (!state.pairs.length) {
      title.textContent = COPY[state.lang].noPairs;
      subtitle.textContent = "";
      story.textContent = "";
      counter.textContent = "00 / 00";

      if (ctx) {
        const sized = sizeCanvas();
        if (sized) ctx.clearRect(0, 0, sized.cssW, sized.cssH);
      }

      return;
    }

    const normalized =
      (nextIndex + state.pairs.length) % state.pairs.length;

    const token = ++state.transitionToken;
    const item = state.pairs[normalized];

    /*
      Load + alpha-measure BEFORE fading the current slide.
      This removes the visible loading hitch.
    */
    const prepared = await preparePair(item);

    if (token !== state.transitionToken) return;

    const apply = () => {
      if (token !== state.transitionToken) return;

      state.index = normalized;
      state.currentItem = item;
      state.currentImage = prepared;

      drawFittedImage(prepared.img, prepared.src);

      if (canvas) {
        canvas.setAttribute(
          "aria-label",
          localized(item?.title) || COPY[state.lang].untitled
        );
      }

      title.textContent =
        localized(item?.title) ||
        COPY[state.lang].untitled;

      subtitle.textContent = localized(item?.subtitle);
      year.textContent = releaseYear(item);
      edition.textContent = editionOf(item);
      story.textContent = firstSubstantialStoryParagraph(item);

      counter.textContent =
        `${String(normalized + 1).padStart(2, "0")} / ${String(state.pairs.length).padStart(2, "0")}`;

      stage.classList.remove("is-changing");
      stage.classList.add("is-entering");

      preloadAround(normalized);

      if (resetTimer) resetCycle();
    };

    if (immediate) {
      apply();
      return;
    }

    stage.classList.remove("is-entering");
    stage.classList.add("is-changing");

    window.setTimeout(() => {
      if (token !== state.transitionToken) return;
      apply();
    }, 160);
  }

  function redrawCurrent() {
    const prepared = state.currentImage;
    if (!prepared?.img) return;

    drawFittedImage(prepared.img, prepared.src);
  }

  function nextPair() {
    renderPair(state.index + 1);
  }

  function previousPair() {
    renderPair(state.index - 1);
  }

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

      if (state.playing && ratio >= 1) {
        nextPair();
      }
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
      if (!document.fullscreenElement && target.requestFullscreen) {
        await target.requestFullscreen();
      }
    } catch (_) {}

    syncFullscreenButton();

    requestAnimationFrame(redrawCurrent);
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await enterFullscreen();
      }
    } catch (_) {}

    syncFullscreenButton();
    revealControls();

    requestAnimationFrame(redrawCurrent);
  }

  function syncFullscreenButton() {
    const t = COPY[state.lang];

    setText(
      "museum-fullscreen-copy",
      document.fullscreenElement ? t.leaveFullscreen : t.fullscreen
    );
  }

  function startMuseum({ fullscreen = false } = {}) {
    state.started = true;
    launch.hidden = true;

    resetCycle();
    state.playing = true;
    syncPlayButton();
    revealControls();

    preloadAround(state.index);
    requestAnimationFrame(redrawCurrent);

    if (fullscreen) {
      enterFullscreen();
    }
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
      event.preventDefault();
      nextPair();
      revealControls();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousPair();
      revealControls();
    } else if (event.code === "Space") {
      event.preventDefault();
      togglePlay();
    } else if (event.key.toLowerCase() === "f") {
      event.preventDefault();
      toggleFullscreen();
    }
  }

  let resizeTimer = 0;

  function handleResize() {
    clearTimeout(resizeTimer);

    resizeTimer = window.setTimeout(() => {
      redrawCurrent();
    }, 80);
  }

  function installEvents() {
    document.getElementById("museum-prev")?.addEventListener("click", previousPair);
    document.getElementById("museum-next")?.addEventListener("click", nextPair);
    document.getElementById("museum-play")?.addEventListener("click", togglePlay);
    document.getElementById("museum-fullscreen")?.addEventListener("click", toggleFullscreen);

    document.getElementById("museum-lang-vi")?.addEventListener("click", () => setLanguage("vi"));
    document.getElementById("museum-lang-en")?.addEventListener("click", () => setLanguage("en"));

    document.getElementById("museum-speed")?.addEventListener("change", event => {
      changeDuration(event.target.value);
    });

    document.getElementById("museum-launch-window")?.addEventListener("click", () => {
      startMuseum({ fullscreen: false });
    });

    document.getElementById("museum-launch-fullscreen")?.addEventListener("click", () => {
      startMuseum({ fullscreen: true });
    });

    document.addEventListener("fullscreenchange", () => {
      syncFullscreenButton();
      requestAnimationFrame(redrawCurrent);
    });

    document.addEventListener("keydown", handleKeyboard);
    window.addEventListener("resize", handleResize, { passive: true });

    ["mousemove", "pointerdown", "touchstart"].forEach(type => {
      document.addEventListener(type, revealControls, { passive: true });
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && state.playing) {
        setPlaying(false);
      }
    });
  }

  async function init() {
    buildCollection();
    syncStaticCopy();
    installEvents();

    if (state.pairs.length) {
      await renderPair(0, {
        immediate: true,
        resetTimer: false
      });
    }

    state.raf = requestAnimationFrame(animationLoop);
  }

  /*
    catalog-additions.js registers its SOLD patches before this file.
    Initializing here ensures Balenciaga's current status is already applied.
  */
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init,
      { once: true }
    );
  } else {
    init();
  }
})();
