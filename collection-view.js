/* =========================================================
   LỘC AN SNEAKER COLLECTION
   COLLECTION VIEW CONTROLLER

   Adds:
   - Adjustable grid columns
   - 3D cover-flow gallery mode
   - Desktop/tablet/mobile controls
   - Drag/swipe + keyboard navigation
   - localStorage preferences
========================================================= */

(() => {
  "use strict";

  const GRID_CONFIG = {
    desktop: { min: 1, max: 5, defaultValue: 3, key: "locan_grid_desktop" },
    tablet:  { min: 1, max: 3, defaultValue: 2, key: "locan_grid_tablet" },
    mobile:  { min: 1, max: 2, defaultValue: 1, key: "locan_grid_mobile" }
  };

  let viewMode = safeGet("locan_collection_view") === "3d" ? "3d" : "grid";
  let gridColumns = 3;
  let gridDevice = null;

  let slideItems = [];
  let slideIndex = 0;
  let slideActiveId = null;

  let pointerStartX = null;
  let pointerStartY = null;
  let pointerMoved = false;
  let resizeTimer = null;

  const originalRenderGrid = renderGrid;
  const originalUpdateStaticText = updateStaticText;

  function safeGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, String(value));
    } catch (_) {
      /* Preference persistence is optional. */
    }
  }

  function deviceMode() {
    if (window.innerWidth <= 700) return "mobile";
    if (window.innerWidth <= 999) return "tablet";
    return "desktop";
  }

  function readGridColumns(mode) {
    const config = GRID_CONFIG[mode];
    const stored = Number.parseInt(safeGet(config.key), 10);

    if (!Number.isFinite(stored)) {
      return config.defaultValue;
    }

    return Math.min(config.max, Math.max(config.min, stored));
  }

  function setGridColumns(value, persist = true) {
    const mode = deviceMode();
    const config = GRID_CONFIG[mode];

    let next = Number.parseInt(value, 10);
    if (!Number.isFinite(next)) next = config.defaultValue;

    next = Math.min(config.max, Math.max(config.min, next));

    gridDevice = mode;
    gridColumns = next;

    if (persist) safeSet(config.key, next);

    applyGridClasses();
    updateControls();
  }

  function changeGridColumns(delta) {
    if (viewMode !== "grid") return;
    setGridColumns(gridColumns + delta, true);
  }

  function applyGridClasses() {
    const grid = document.getElementById("sneaker-grid");
    if (!grid) return;

    grid.classList.remove(
      "locan-grid-view",
      "locan-3d-view",
      "grid-cols-1",
      "grid-cols-2",
      "grid-cols-3",
      "grid-cols-4",
      "grid-cols-5"
    );

    if (viewMode === "3d") {
      grid.classList.add("locan-3d-view");
      grid.style.removeProperty("--locan-grid-columns");
      return;
    }

    grid.classList.add("locan-grid-view", `grid-cols-${gridColumns}`);
    grid.style.setProperty("--locan-grid-columns", String(gridColumns));
  }

  function resetSlide() {
    slideIndex = 0;
    slideActiveId = null;
  }

  function setViewMode(mode) {
    viewMode = mode === "3d" ? "3d" : "grid";
    safeSet("locan_collection_view", viewMode);

    if (viewMode === "3d") resetSlide();

    applyGridClasses();
    updateControls();
    renderGrid();
  }

  function toggleViewMode() {
    setViewMode(viewMode === "3d" ? "grid" : "3d");
  }

  function text() {
    const vi = typeof currentLang !== "undefined" && currentLang === "vi";

    return vi
      ? {
          grid: "LƯỚI",
          threeD: "3D",
          plus: "Tăng số cột",
          minus: "Giảm số cột",
          open3D: "Chế độ gallery 3D",
          close3D: "Quay lại chế độ lưới",
          prev: "Đôi trước",
          next: "Đôi tiếp theo",
          hint: "KÉO / VUỐT ĐỂ XEM · NHẤN ĐÔI Ở GIỮA ĐỂ MỞ"
        }
      : {
          grid: "GRID",
          threeD: "3D",
          plus: "Increase grid columns",
          minus: "Decrease grid columns",
          open3D: "3D gallery mode",
          close3D: "Return to grid view",
          prev: "Previous sneaker",
          next: "Next sneaker",
          hint: "DRAG / SWIPE TO BROWSE · TAP THE CENTER PAIR TO OPEN"
        };
  }

  function createControls() {
    const toolbar = document.querySelector(".collection-toolbar");
    if (!toolbar) return;

    if (!document.getElementById("collection-view-control")) {
      const rail = document.createElement("div");
      rail.id = "collection-view-control";
      rail.className = "collection-view-control";
      rail.setAttribute("role", "group");

      rail.innerHTML = `
        <button type="button" id="collection-view-plus" class="collection-view-btn collection-view-plus">+</button>
        <span id="collection-view-number" class="collection-view-number" aria-live="polite">3</span>
        <button type="button" id="collection-view-minus" class="collection-view-btn collection-view-minus">−</button>
        <button type="button" id="collection-view-3d" class="collection-view-btn collection-view-3d">3D</button>
      `;

      toolbar.appendChild(rail);

      document.getElementById("collection-view-plus")
        ?.addEventListener("click", () => changeGridColumns(1));

      document.getElementById("collection-view-minus")
        ?.addEventListener("click", () => changeGridColumns(-1));

      document.getElementById("collection-view-3d")
        ?.addEventListener("click", toggleViewMode);
    }

    if (!document.getElementById("collection-mobile-view-controls")) {
      const mobile = document.createElement("div");
      mobile.id = "collection-mobile-view-controls";
      mobile.className = "collection-mobile-view-controls";

      mobile.innerHTML = `
        <button type="button" id="collection-mobile-grid" class="collection-mobile-view-btn">▦ GRID</button>
        <button type="button" id="collection-mobile-3d" class="collection-mobile-view-btn">3D</button>
      `;

      toolbar.appendChild(mobile);

      document.getElementById("collection-mobile-grid")
        ?.addEventListener("click", () => {
          if (viewMode === "3d") {
            setViewMode("grid");
          } else {
            setGridColumns(gridColumns === 1 ? 2 : 1, true);
          }
        });

      document.getElementById("collection-mobile-3d")
        ?.addEventListener("click", toggleViewMode);
    }
  }

  function updateControls() {
    const t = text();
    const mode = deviceMode();
    const config = GRID_CONFIG[mode];

    const plus = document.getElementById("collection-view-plus");
    const minus = document.getElementById("collection-view-minus");
    const number = document.getElementById("collection-view-number");
    const toggle3D = document.getElementById("collection-view-3d");
    const mobileGrid = document.getElementById("collection-mobile-grid");
    const mobile3D = document.getElementById("collection-mobile-3d");

    if (plus) {
      plus.disabled = viewMode === "3d" || gridColumns >= config.max;
      plus.title = t.plus;
      plus.setAttribute("aria-label", t.plus);
    }

    if (minus) {
      minus.disabled = viewMode === "3d" || gridColumns <= config.min;
      minus.title = t.minus;
      minus.setAttribute("aria-label", t.minus);
    }

    if (number) {
      number.textContent = viewMode === "3d" ? "3D" : String(gridColumns);
    }

    if (toggle3D) {
      toggle3D.classList.toggle("active", viewMode === "3d");
      toggle3D.title = viewMode === "3d" ? t.close3D : t.open3D;
      toggle3D.setAttribute("aria-label", viewMode === "3d" ? t.close3D : t.open3D);
    }

    if (mobileGrid) {
      mobileGrid.textContent = viewMode === "3d"
        ? `▦ ${t.grid}`
        : `▦ ${t.grid} · ${gridColumns}`;
      mobileGrid.classList.toggle("active", viewMode === "grid");
    }

    if (mobile3D) {
      mobile3D.textContent = t.threeD;
      mobile3D.classList.toggle("active", viewMode === "3d");
      mobile3D.setAttribute("aria-label", t.open3D);
    }
  }

  function wrapIndex(index, length) {
    return length > 0 ? ((index % length) + length) % length : 0;
  }

  function offsetsFor(length) {
    if (length <= 1) return [0];
    if (length === 2) return [0, 1];
    if (length === 3) return [-1, 0, 1];
    if (length === 4) return [-1, 0, 1, 2];
    return [-2, -1, 0, 1, 2];
  }

  function detailURL(sneaker) {
    return (
      `./shoe.html?id=${encodeURIComponent(sneaker.id)}` +
      `&lang=${encodeURIComponent(currentLang)}`
    );
  }

  function render3DCard(sneaker, index, offset) {
    const title = getLocalizedText(sneaker.title);
    const subtitle = getLocalizedText(sneaker.subtitle);
    const edition = getLocalizedText(sneaker.editionType);

    return `
      <article
        class="sneaker-3d-card"
        data-index="${index}"
        data-offset="${offset}"
        tabindex="0"
        role="button"
        aria-label="${escapeHTML(title)}"
      >
        <div class="sneaker-3d-image">
          <img
            src="${escapeHTML(sneaker.image || "")}"
            alt="${escapeHTML(title)}"
            loading="${offset === 0 ? "eager" : "lazy"}"
            decoding="async"
            draggable="false"
          >
        </div>

        <div class="sneaker-3d-info">
          <h3>${escapeHTML(title)}</h3>
          <p>${escapeHTML(subtitle)}</p>

          <div class="sneaker-3d-meta">
            <span>${escapeHTML(edition || "—")}</span>
            <small>${escapeHTML(sneaker.size || "")}</small>
          </div>
        </div>
      </article>
    `;
  }

  function setSlideIndex(index) {
    if (!slideItems.length) return;

    slideIndex = wrapIndex(index, slideItems.length);
    slideActiveId = slideItems[slideIndex]?.id || null;
    render3DGallery(slideItems);
  }

  function moveSlide(direction) {
    if (slideItems.length <= 1) return;
    setSlideIndex(slideIndex + direction);
  }

  function openActiveSlide() {
    const sneaker = slideItems[slideIndex];
    if (!sneaker) return;
    window.location.href = detailURL(sneaker);
  }

  function bindGalleryEvents() {
    const gallery = document.getElementById("sneaker-3d-gallery");
    if (!gallery) return;

    document.getElementById("sneaker-3d-prev")
      ?.addEventListener("click", event => {
        event.stopPropagation();
        moveSlide(-1);
      });

    document.getElementById("sneaker-3d-next")
      ?.addEventListener("click", event => {
        event.stopPropagation();
        moveSlide(1);
      });

    gallery.querySelectorAll(".sneaker-3d-card").forEach(card => {
      const activate = () => {
        if (pointerMoved) return;

        const index = Number.parseInt(card.dataset.index, 10);
        if (!Number.isFinite(index)) return;

        if (index === slideIndex) {
          openActiveSlide();
        } else {
          setSlideIndex(index);
        }
      };

      card.addEventListener("click", activate);

      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      });
    });

    gallery.addEventListener("keydown", event => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveSlide(-1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveSlide(1);
      }
    });

    gallery.addEventListener("pointerdown", event => {
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerMoved = false;

      try {
        gallery.setPointerCapture(event.pointerId);
      } catch (_) {
        /* Optional. */
      }
    });

    gallery.addEventListener("pointermove", event => {
      if (pointerStartX === null || pointerStartY === null) return;

      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;

      if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
        pointerMoved = true;
      }
    });

    gallery.addEventListener("pointerup", event => {
      if (pointerStartX === null || pointerStartY === null) return;

      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;

      if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
        moveSlide(dx < 0 ? 1 : -1);
      }

      pointerStartX = null;
      pointerStartY = null;

      window.setTimeout(() => {
        pointerMoved = false;
      }, 0);
    });

    gallery.addEventListener("pointercancel", () => {
      pointerStartX = null;
      pointerStartY = null;
      pointerMoved = false;
    });

    gallery.addEventListener(
      "wheel",
      event => {
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;

        event.preventDefault();

        if (event.deltaX > 18) moveSlide(1);
        if (event.deltaX < -18) moveSlide(-1);
      },
      { passive: false }
    );
  }

  function render3DGallery(items) {
    const grid = document.getElementById("sneaker-grid");
    if (!grid || !items.length) return;

    slideItems = items;

    if (slideActiveId) {
      const preserved = slideItems.findIndex(item => item.id === slideActiveId);
      slideIndex = preserved >= 0 ? preserved : 0;
    }

    slideIndex = wrapIndex(slideIndex, slideItems.length);
    slideActiveId = slideItems[slideIndex]?.id || null;

    const seen = new Set();
    const cards = [];

    offsetsFor(slideItems.length).forEach(offset => {
      const index = wrapIndex(slideIndex + offset, slideItems.length);
      if (seen.has(index)) return;

      seen.add(index);
      cards.push(render3DCard(slideItems[index], index, offset));
    });

    const t = text();

    grid.innerHTML = `
      <section id="sneaker-3d-gallery" class="sneaker-3d-gallery" tabindex="0">
        <button
          type="button"
          id="sneaker-3d-prev"
          class="sneaker-3d-nav sneaker-3d-prev"
          aria-label="${escapeHTML(t.prev)}"
        >‹</button>

        <div class="sneaker-3d-stage">
          ${cards.join("")}
        </div>

        <button
          type="button"
          id="sneaker-3d-next"
          class="sneaker-3d-nav sneaker-3d-next"
          aria-label="${escapeHTML(t.next)}"
        >›</button>

        <div class="sneaker-3d-footer">
          <strong>${slideIndex + 1} / ${slideItems.length}</strong>
          <span>${escapeHTML(t.hint)}</span>
        </div>
      </section>
    `;

    bindGalleryEvents();
  }

  function render3DMode() {
    const grid = document.getElementById("sneaker-grid");
    if (!grid) return;

    if (typeof sneakers === "undefined" || !Array.isArray(sneakers)) {
      originalRenderGrid();
      return;
    }

    const filtered = filterSneakers(sneakers);
    const sorted = sortSneakers(filtered);

    updateCollectionCount(sorted.length);

    if (!sorted.length) {
      grid.innerHTML = `
        <div class="not-found">
          ${escapeHTML(
            currentLang === "vi"
              ? "Không có hiện vật phù hợp với bộ lọc hiện tại."
              : "No artifacts match the current filters."
          )}
        </div>
      `;
      return;
    }

    render3DGallery(sorted);
  }

  function installStyles() {
    if (document.getElementById("locan-collection-view-css")) return;

    const style = document.createElement("style");
    style.id = "locan-collection-view-css";

    style.textContent = `

      /* =====================================================
         GRID VIEW
      ===================================================== */

      #sneaker-grid.locan-grid-view {
        --locan-grid-columns: 3;

        display: grid !important;

        grid-template-columns:
          repeat(
            var(--locan-grid-columns),
            minmax(0, 1fr)
          ) !important;

        align-items: stretch !important;
      }


      #sneaker-grid.locan-grid-view.grid-cols-1 {
        max-width: 760px;

        margin-left: auto;
        margin-right: auto;
      }


      #sneaker-grid.locan-grid-view.grid-cols-2,
      #sneaker-grid.locan-grid-view.grid-cols-3 {
        gap: 28px;
      }


      #sneaker-grid.locan-grid-view.grid-cols-4 {
        gap: 20px;
      }


      #sneaker-grid.locan-grid-view.grid-cols-5 {
        gap: 16px;
      }


      /* =====================================================
         4-COLUMN CARD DENSITY
      ===================================================== */

      #sneaker-grid.grid-cols-4 .card-info {
        min-height: 178px;
        padding: 17px;
      }


      #sneaker-grid.grid-cols-4 .card-info h3 {
        font-size: 0.98rem;
      }


      #sneaker-grid.grid-cols-4 .card-info .subtitle {
        font-size: 0.78rem;
      }


      #sneaker-grid.grid-cols-4 .badge,
      #sneaker-grid.grid-cols-4 .size {
        font-size: 0.74rem;
      }


      /* =====================================================
         5-COLUMN CARD DENSITY
      ===================================================== */

      #sneaker-grid.grid-cols-5 .card {
        border-radius: 15px;
      }


      #sneaker-grid.grid-cols-5 .card-info {
        min-height: 166px;
        padding: 14px;
      }


      #sneaker-grid.grid-cols-5 .card-info h3 {
        margin-bottom: 6px;

        font-size: 0.86rem;
        line-height: 1.34;
      }


      #sneaker-grid.grid-cols-5 .card-info .subtitle {
        margin-bottom: 12px;

        font-size: 0.71rem;
      }


      #sneaker-grid.grid-cols-5 .badge {
        padding: 4px 7px;

        font-size: 0.66rem;
      }


      #sneaker-grid.grid-cols-5 .size {
        font-size: 0.67rem;
      }


      #sneaker-grid.grid-cols-5 .card-cta {
        margin-top: 12px;
        padding-top: 10px;

        font-size: 0.61rem;
      }


      /* =====================================================
         DESKTOP FLOATING CONTROL
      ===================================================== */

      .collection-view-control {
        position: fixed;

        top: 50%;
        right: 18px;

        z-index: 120;

        display: flex;
        flex-direction: column;

        width: 48px;

        overflow: hidden;

        background:
          linear-gradient(
            145deg,
            rgba(48, 48, 53, 0.74),
            rgba(18, 18, 21, 0.60)
          );

        border:
          1px solid
          rgba(255, 255, 255, 0.13);

        border-radius: 16px;

        box-shadow:
          0 14px 36px rgba(0, 0, 0, 0.34),
          inset 0 1px 0 rgba(255, 255, 255, 0.09);

        backdrop-filter:
          blur(24px)
          saturate(145%);

        -webkit-backdrop-filter:
          blur(24px)
          saturate(145%);

        transform:
          translateY(-50%);

        user-select: none;
      }


      .collection-view-btn {
        display: grid;

        place-items: center;

        width: 46px;
        height: 44px;

        padding: 0;

        color: #a2a2a8;

        background: transparent;

        border: 0;

        cursor: pointer;

        font: inherit;

        line-height: 1;

        transition:
          color 0.18s ease,
          background 0.18s ease,
          opacity 0.18s ease;
      }


      .collection-view-plus,
      .collection-view-minus {
        font-size: 1.3rem;
      }


      .collection-view-btn:hover,
      .collection-view-btn:focus-visible {
        color: #ffcc00;

        background:
          rgba(255, 204, 0, 0.065);
      }


      .collection-view-btn:disabled {
        color: #505056;

        opacity: 0.42;

        cursor: default;

        background: transparent;
      }


      .collection-view-number {
        display: grid;

        place-items: center;

        width: 46px;
        height: 35px;

        color: #ffcc00;

        border-top:
          1px solid
          rgba(255, 255, 255, 0.075);

        border-bottom:
          1px solid
          rgba(255, 255, 255, 0.075);

        font-size: 0.75rem;
        font-weight: 850;
      }


      .collection-view-3d {
        height: 42px;

        border-top:
          1px solid
          rgba(255, 255, 255, 0.075);

        font-size: 0.68rem;
        font-weight: 900;

        letter-spacing: 0.7px;
      }


      .collection-view-3d.active {
        color: #101010;

        background: #ffcc00;
      }


      /* =====================================================
         MOBILE CONTROLS
      ===================================================== */

      .collection-mobile-view-controls {
        display: none;

        align-items: center;

        gap: 8px;

        margin-left: auto;
      }


      .collection-mobile-view-btn {
        min-height: 39px;

        padding: 9px 12px;

        color: #96969c;

        background:
          linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.045),
            rgba(255, 255, 255, 0.018)
          );

        border:
          1px solid
          rgba(255, 255, 255, 0.10);

        border-radius: 9px;

        cursor: pointer;

        font-size: 0.66rem;
        font-weight: 850;

        letter-spacing: 0.8px;

        backdrop-filter:
          blur(18px);

        -webkit-backdrop-filter:
          blur(18px);
      }


      .collection-mobile-view-btn.active {
        color: #ffcc00;

        border-color:
          rgba(255, 204, 0, 0.26);

        background:
          rgba(255, 204, 0, 0.05);
      }


      /* =====================================================
         3D VIEW
      ===================================================== */

      #sneaker-grid.locan-3d-view {
        display: block !important;

        width: 100% !important;
        max-width: none !important;

        margin: 0 !important;

        overflow: visible !important;
      }


      .sneaker-3d-gallery {
        position: relative;

        width: 100%;

        min-height: 620px;

        overflow: hidden;

        border-radius: 24px;

        outline: none;

        perspective: 1450px;

        perspective-origin:
          50% 45%;

        touch-action: pan-y;

        user-select: none;
      }


      .sneaker-3d-gallery::before {
        content: "";

        position: absolute;

        inset:
          8%
          8%
          12%;

        pointer-events: none;

        background:
          radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0.048),
            rgba(255, 255, 255, 0.018) 34%,
            transparent 70%
          );

        filter:
          blur(18px);
      }


      .sneaker-3d-stage {
        position: relative;

        width: 100%;
        height: 550px;

        transform-style:
          preserve-3d;
      }


      .sneaker-3d-card {
        position: absolute;

        top: 48%;
        left: 50%;

        width:
          min(
            360px,
            30vw
          );

        min-width: 270px;

        height: 480px;

        overflow: hidden;

        background:
          linear-gradient(
            145deg,
            rgba(255, 255, 255, 0.075),
            rgba(255, 255, 255, 0.024) 48%,
            rgba(255, 255, 255, 0.016)
          );

        border:
          1px solid
          rgba(255, 255, 255, 0.13);

        border-radius: 22px;

        box-shadow:
          0 30px 55px
          rgba(0, 0, 0, 0.44),

          inset 0 1px 0
          rgba(255, 255, 255, 0.09);

        backdrop-filter:
          blur(24px)
          saturate(145%);

        -webkit-backdrop-filter:
          blur(24px)
          saturate(145%);

        transform-style:
          preserve-3d;

        cursor: pointer;

        opacity: 0;

        transition:
          transform 0.48s cubic-bezier(0.22, 0.76, 0.22, 1),
          opacity 0.34s ease,
          filter 0.34s ease,
          border-color 0.24s ease;
      }


      .sneaker-3d-card[data-offset="0"] {
        z-index: 5;

        opacity: 1;

        transform:
          translate(-50%, -50%)
          translateZ(110px)
          scale(1);

        border-color:
          rgba(255, 204, 0, 0.20);
      }


      .sneaker-3d-card[data-offset="-1"] {
        z-index: 4;

        opacity: 0.74;

        filter:
          brightness(0.72)
          saturate(0.82);

        transform:
          translate(-50%, -50%)
          translateX(-77%)
          translateZ(-80px)
          rotateY(27deg)
          scale(0.82);
      }


      .sneaker-3d-card[data-offset="1"] {
        z-index: 4;

        opacity: 0.74;

        filter:
          brightness(0.72)
          saturate(0.82);

        transform:
          translate(-50%, -50%)
          translateX(77%)
          translateZ(-80px)
          rotateY(-27deg)
          scale(0.82);
      }


      .sneaker-3d-card[data-offset="-2"] {
        z-index: 3;

        opacity: 0.32;

        filter:
          brightness(0.52)
          saturate(0.65);

        transform:
          translate(-50%, -50%)
          translateX(-128%)
          translateZ(-250px)
          rotateY(40deg)
          scale(0.64);
      }


      .sneaker-3d-card[data-offset="2"] {
        z-index: 3;

        opacity: 0.32;

        filter:
          brightness(0.52)
          saturate(0.65);

        transform:
          translate(-50%, -50%)
          translateX(128%)
          translateZ(-250px)
          rotateY(-40deg)
          scale(0.64);
      }


      /* =====================================================
         3D IMAGE
      ===================================================== */

      .sneaker-3d-image {
        display: flex;

        align-items: center;
        justify-content: center;

        width: 100%;
        height: 285px;
      }


      .sneaker-3d-image img {
        display: block;

        width: 88%;
        height: 88%;

        object-fit: contain;
        object-position: center;

        background: transparent;

        filter:
          drop-shadow(
            0
            16px
            18px
            rgba(0, 0, 0, 0.24)
          );

        pointer-events: none;
      }


      .sneaker-3d-image
      img[src*="bapesta_stussy.png"] {
        width: 54%;
        height: 54%;
      }


      .sneaker-3d-image
      img[src*="nike_waffle_racer_ow.png"] {
        width: 52%;
        height: 52%;
      }


      /* =====================================================
         3D CARD INFO
      ===================================================== */

      .sneaker-3d-info {
        display: flex;

        flex-direction: column;

        min-height: 194px;

        padding:
          18px
          20px
          20px;

        border-top:
          1px solid
          rgba(255, 255, 255, 0.055);
      }


      .sneaker-3d-info h3 {
        margin:
          0
          0
          8px;

        color: #f6f6f8;

        font-size: 1rem;

        line-height: 1.38;
      }


      .sneaker-3d-info p {
        margin:
          0
          0
          14px;

        color: #9699a2;

        font-size: 0.78rem;

        line-height: 1.45;
      }


      .sneaker-3d-meta {
        display: flex;

        align-items: center;
        justify-content: space-between;

        gap: 10px;

        margin-top: auto;
      }


      .sneaker-3d-meta span {
        padding:
          5px
          8px;

        color: #ffcc00;

        background:
          rgba(255, 255, 255, 0.085);

        border-radius: 6px;

        font-size: 0.70rem;
      }


      .sneaker-3d-meta small {
        color: #b5bac3;

        font-size: 0.72rem;
      }


      /* =====================================================
         3D NAVIGATION
      ===================================================== */

      .sneaker-3d-nav {
        position: absolute;

        top: 46%;

        z-index: 20;

        display: grid;

        place-items: center;

        width: 46px;
        height: 46px;

        padding: 0;

        color: #a5a5aa;

        background:
          rgba(18, 18, 21, 0.58);

        border:
          1px solid
          rgba(255, 255, 255, 0.11);

        border-radius: 50%;

        backdrop-filter:
          blur(18px);

        -webkit-backdrop-filter:
          blur(18px);

        cursor: pointer;

        font-size: 1.6rem;

        transform:
          translateY(-50%);
      }


      .sneaker-3d-nav:hover {
        color: #ffcc00;

        border-color:
          rgba(255, 204, 0, 0.26);
      }


      .sneaker-3d-prev {
        left: 18px;
      }


      .sneaker-3d-next {
        right: 18px;
      }


      /* =====================================================
         3D FOOTER
      ===================================================== */

      .sneaker-3d-footer {
        position: absolute;

        left: 50%;
        bottom: 17px;

        z-index: 15;

        display: flex;

        flex-direction: column;

        align-items: center;

        gap: 7px;

        transform:
          translateX(-50%);

        pointer-events: none;
      }


      .sneaker-3d-footer strong {
        color: #ffcc00;

        font-size: 0.72rem;

        letter-spacing: 1.4px;
      }


      .sneaker-3d-footer span {
        color: #626269;

        font-size: 0.58rem;
        font-weight: 800;

        letter-spacing: 1px;

        white-space: nowrap;
      }


      /* =====================================================
         TABLET
      ===================================================== */

      @media screen and
      (min-width: 701px) and
      (max-width: 999px) {

        .collection-toolbar {
          gap: 12px;

          flex-wrap: wrap;
        }


        .collection-view-control {
          position: static;

          flex-direction: row;

          width: auto;
          height: 41px;

          margin-left: auto;

          border-radius: 10px;

          transform: none;
        }


        .collection-view-btn {
          width: 39px;
          height: 39px;
        }


        .collection-view-number {
          width: 36px;
          height: 39px;

          border: 0;

          border-left:
            1px solid
            rgba(255, 255, 255, 0.075);

          border-right:
            1px solid
            rgba(255, 255, 255, 0.075);
        }


        .collection-view-3d {
          width: 45px;

          border-top: 0;

          border-left:
            1px solid
            rgba(255, 255, 255, 0.075);
        }


        #sneaker-grid.locan-grid-view.grid-cols-1 {
          max-width: 680px;
        }


        .sneaker-3d-card {
          width: 330px;

          min-width: 0;

          height: 460px;
        }

      }


      /* =====================================================
         MOBILE
      ===================================================== */

      @media screen and
      (max-width: 700px) {

        .collection-toolbar {
          flex-wrap: wrap;

          gap: 10px;
        }


        .collection-view-control {
          display: none !important;
        }


        .collection-mobile-view-controls {
          display: flex;
        }


        #sneaker-grid.locan-grid-view {
          max-width: none !important;

          margin-left: 0 !important;
          margin-right: 0 !important;
        }


        #sneaker-grid.locan-grid-view.grid-cols-1 {
          gap: 22px;
        }


        #sneaker-grid.locan-grid-view.grid-cols-2 {
          gap: 12px;
        }


        #sneaker-grid.grid-cols-2 .card {
          border-radius: 13px;
        }


        #sneaker-grid.grid-cols-2 .card-info {
          min-height: 148px;

          padding: 11px;
        }


        #sneaker-grid.grid-cols-2 .card-info h3 {
          margin-bottom: 5px;

          font-size: 0.77rem;

          line-height: 1.32;
        }


        #sneaker-grid.grid-cols-2 .card-info .subtitle {
          margin-bottom: 9px;

          font-size: 0.66rem;

          line-height: 1.38;
        }


        #sneaker-grid.grid-cols-2 .badge {
          padding:
            3px
            5px;

          font-size: 0.58rem;
        }


        #sneaker-grid.grid-cols-2 .size {
          font-size: 0.59rem;
        }


        #sneaker-grid.grid-cols-2 .card-cta {
          margin-top: 9px;

          padding-top: 8px;

          font-size: 0.54rem;
        }


        .sneaker-3d-gallery {
          min-height: 540px;

          border-radius: 18px;

          perspective: 1100px;
        }


        .sneaker-3d-stage {
          height: 485px;
        }


        .sneaker-3d-card {
          top: 47%;

          width:
            min(
              78vw,
              330px
            );

          min-width: 0;

          height: 420px;
        }


        .sneaker-3d-card[data-offset="0"] {
          transform:
            translate(-50%, -50%)
            translateZ(80px)
            scale(1);
        }


        .sneaker-3d-card[data-offset="-1"] {
          opacity: 0.46;

          transform:
            translate(-50%, -50%)
            translateX(-82%)
            translateZ(-100px)
            rotateY(30deg)
            scale(0.72);
        }


        .sneaker-3d-card[data-offset="1"] {
          opacity: 0.46;

          transform:
            translate(-50%, -50%)
            translateX(82%)
            translateZ(-100px)
            rotateY(-30deg)
            scale(0.72);
        }


        .sneaker-3d-card[data-offset="-2"],
        .sneaker-3d-card[data-offset="2"] {
          opacity: 0;

          pointer-events: none;
        }


        .sneaker-3d-image {
          height: 245px;
        }


        .sneaker-3d-info {
          min-height: 174px;

          padding:
            15px
            16px
            17px;
        }


        .sneaker-3d-info h3 {
          font-size: 0.9rem;
        }


        .sneaker-3d-info p {
          font-size: 0.72rem;
        }


        .sneaker-3d-nav {
          display: none;
        }


        .sneaker-3d-footer {
          bottom: 10px;
        }


        .sneaker-3d-footer span {
          max-width: 88vw;

          overflow: hidden;

          text-overflow: ellipsis;

          font-size: 0.52rem;
        }

      }


      /* =====================================================
         SMALL MOBILE
      ===================================================== */

      @media screen and
      (max-width: 430px) {

        .collection-mobile-view-btn {
          min-height: 37px;

          padding:
            8px
            10px;

          font-size: 0.62rem;
        }


        #sneaker-grid.locan-grid-view.grid-cols-2 {
          gap: 9px;
        }


        #sneaker-grid.grid-cols-2 .card-info {
          min-height: 140px;

          padding: 9px;
        }


        #sneaker-grid.grid-cols-2 .card-info h3 {
          font-size: 0.72rem;
        }


        #sneaker-grid.grid-cols-2 .card-info .subtitle {
          font-size: 0.62rem;
        }


        #sneaker-grid.grid-cols-2 .badge,
        #sneaker-grid.grid-cols-2 .size {
          font-size: 0.54rem;
        }


        .sneaker-3d-card {
          width: 80vw;

          height: 405px;
        }


        .sneaker-3d-image {
          height: 232px;
        }


        .sneaker-3d-info {
          min-height: 172px;

          padding: 14px;
        }

      }


      /* =====================================================
         REDUCED MOTION
      ===================================================== */

      @media
      (prefers-reduced-motion: reduce) {

        .sneaker-3d-card,
        .collection-view-btn,
        .collection-mobile-view-btn {
          transition:
            none !important;
        }

      }

    `;

    document.head.appendChild(style);
  }


  /* =========================================================
     OVERRIDE GRID RENDER
  ========================================================= */

  renderGrid = function () {
    applyGridClasses();

    if (viewMode === "3d") {
      render3DMode();
      return;
    }

    originalRenderGrid();
  };


  /* =========================================================
     LANGUAGE UPDATE
  ========================================================= */

  updateStaticText = function () {
    originalUpdateStaticText();

    updateControls();
  };


  /* =========================================================
     RESIZE
  ========================================================= */

  function handleResize() {
    clearTimeout(resizeTimer);

    resizeTimer =
      window.setTimeout(() => {
        const nextDevice = deviceMode();

        if (nextDevice !== gridDevice) {
          setGridColumns(
            readGridColumns(nextDevice),
            false
          );
        } else {
          setGridColumns(
            gridColumns,
            false
          );
        }

        if (viewMode === "3d") {
          renderGrid();
        }
      }, 120);
  }


  window.addEventListener(
    "resize",
    handleResize
  );


  /* =========================================================
     INITIALIZE
  ========================================================= */

  function init() {
    installStyles();

    createControls();

    const mode =
      deviceMode();

    setGridColumns(
      readGridColumns(mode),
      false
    );

    applyGridClasses();

    updateControls();

    renderGrid();
  }


  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

})();
