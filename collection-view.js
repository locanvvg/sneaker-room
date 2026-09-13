/* =========================================================
   LỘC AN SNEAKER COLLECTION
   COLLECTION VIEW CONTROLLER

   - Horizontal grid-density slider: 1–5 columns
   - View toggle placed between slider and total count
   - Desktop / tablet / mobile responsive layout
   - Smooth 3D cover-flow
   - Mouse drag, touch swipe, arrows, keyboard, trackpad
   - Works with existing Search / Filter / Sort
========================================================= */

(() => {
  "use strict";


  /* =======================================================
     NEUTRALIZE THE LEGACY GRID CONTROLLER FROM main.js

     collection-view.js will own:
     - grid density
     - view mode
     - 3D cover flow
  ======================================================= */

  try {

    if (
      typeof handleGridViewResize ===
      "function"
    ) {

      window.removeEventListener(
        "resize",
        handleGridViewResize
      );

    }

  } catch (_) {}


  try {

    if (
      typeof createGridViewControls ===
      "function"
    ) {

      createGridViewControls =
        function () {};

    }

  } catch (_) {}


  try {

    if (
      typeof applySavedGridView ===
      "function"
    ) {

      applySavedGridView =
        function () {};

    }

  } catch (_) {}


  try {

    if (
      typeof updateGridViewControl ===
      "function"
    ) {

      updateGridViewControl =
        function () {};

    }

  } catch (_) {}


  const originalUpdateStaticText =
    updateStaticText;


  const GRID_MIN =
    1;


  const GRID_MAX =
    5;


  let viewMode =

    safeGet(
      "locan_collection_view"
    ) === "3d"

      ? "3d"

      : "grid";


  let gridColumns =
    readStoredColumns();


  let slideItems =
    [];


  let slideIndex =
    0;


  let slideActiveId =
    null;


  let resizeTimer =
    null;


  let wheelLockedUntil =
    0;


  const drag = {

    active:
      false,

    pointerId:
      null,

    startX:
      0,

    startY:
      0,

    lastX:
      0,

    lastTime:
      0,

    deltaX:
      0,

    velocityX:
      0,

    moved:
      false,

    raf:
      0

  };


  /* =======================================================
     STORAGE
  ======================================================= */

  function safeGet(
    key
  ) {

    try {

      return localStorage.getItem(
        key
      );

    } catch (_) {

      return null;

    }

  }


  function safeSet(
    key,
    value
  ) {

    try {

      localStorage.setItem(
        key,
        String(value)
      );

    } catch (_) {}

  }


  function deviceMode() {

    if (
      window.innerWidth <= 650
    ) {

      return "mobile";

    }


    if (
      window.innerWidth <= 950
    ) {

      return "tablet";

    }


    return "desktop";

  }


  function defaultColumns() {

    const mode =
      deviceMode();


    if (
      mode === "mobile"
    ) {

      return 1;

    }


    if (
      mode === "tablet"
    ) {

      return 2;

    }


    return 3;

  }


  function storageKey() {

    return (
      `locan_grid_columns_${deviceMode()}`
    );

  }


  function readStoredColumns() {

    const stored =
      Number.parseInt(

        safeGet(
          storageKey()
        ),

        10

      );


    if (
      !Number.isFinite(
        stored
      )
    ) {

      return defaultColumns();

    }


    return clamp(

      stored,

      GRID_MIN,

      GRID_MAX

    );

  }


  function clamp(
    value,
    min,
    max
  ) {

    return Math.min(

      max,

      Math.max(
        min,
        value
      )

    );

  }


  /* =======================================================
     TEXT
  ======================================================= */

  function copy() {

    const vi =

      typeof currentLang !==
        "undefined"

      &&

      currentLang === "vi";


    return vi

      ? {

          gridLabel:
            n =>
              `LƯỚI · ${n} CỘT`,

          minus:
            "Giảm số cột",

          plus:
            "Tăng số cột",

          range:
            "Điều chỉnh số cột trong lưới",

          open3D:
            "3D VIEW",

          backGrid:
            "GRID VIEW",

          previous:
            "Đôi trước",

          next:
            "Đôi tiếp theo",

          hint:
            "KÉO / VUỐT ĐỂ XEM · NHẤN ĐÔI Ở GIỮA ĐỂ MỞ",

          empty:
            "Không có hiện vật phù hợp với bộ lọc hiện tại."

        }

      : {

          gridLabel:
            n =>
              `GRID · ${n} COLUMNS`,

          minus:
            "Decrease grid columns",

          plus:
            "Increase grid columns",

          range:
            "Adjust the number of grid columns",

          open3D:
            "3D VIEW",

          backGrid:
            "GRID VIEW",

          previous:
            "Previous sneaker",

          next:
            "Next sneaker",

          hint:
            "DRAG / SWIPE TO BROWSE · TAP THE CENTER PAIR TO OPEN",

          empty:
            "No artifacts match the current filters."

        };

  }


  /* =======================================================
     CLEAN OLD VIEW UI
  ======================================================= */

  function removeOldViewUI() {

    const count =
      document.getElementById(
        "collection-count"
      );


    const filterPanel =
      document.querySelector(
        ".filter-panel"
      );


    /*
       If a previous version moved the count
       into another container, detach it first
       so it is not accidentally deleted.
    */

    if (
      count
      &&
      filterPanel
    ) {

      filterPanel.insertAdjacentElement(

        "afterend",

        count

      );

    }


    [

      "grid-view-control",

      "grid-mobile-toggle",

      "collection-view-control",

      "collection-mobile-view-controls",

      "collection-display-row",

      "collection-3d-toggle"

    ]

      .forEach(
        id => {

          const element =
            document.getElementById(
              id
            );


          if (
            element
            &&
            !element.contains(
              count
            )
          ) {

            element.remove();

          }

        }
      );

  }


  /* =======================================================
     CREATE HORIZONTAL CONTROL ROW

     DESKTOP:

     [ LONG GRID SLIDER ]
     [ 3D VIEW / GRID VIEW ]
     [ TOTAL ]

     MOBILE:

     [ TOTAL ]
     [ 3D VIEW / GRID VIEW ]
     [ LONG GRID SLIDER ]

     Therefore VIEW button is always between
     the GRID slider and TOTAL.
  ======================================================= */

  function createViewUI() {

    if (
      document.getElementById(
        "collection-display-row"
      )
    ) {

      return;

    }


    const filterPanel =
      document.querySelector(
        ".filter-panel"
      );


    const count =
      document.getElementById(
        "collection-count"
      );


    if (
      !filterPanel
      ||
      !count
    ) {

      return;

    }


    const row =
      document.createElement(
        "div"
      );


    row.id =
      "collection-display-row";


    row.className =
      "collection-display-row";


    /* =====================================================
       GRID DENSITY
    ===================================================== */

    const density =
      document.createElement(
        "div"
      );


    density.id =
      "grid-density-control";


    density.className =
      "grid-density-control";


    density.innerHTML = `

      <div
        id="grid-density-label"
        class="grid-density-label"
      >

        LƯỚI · 3 CỘT

      </div>


      <div class="grid-density-slider-row">


        <button

          type="button"

          id="grid-density-minus"

          class="grid-density-step"

          aria-label="Giảm số cột"

        >

          −

        </button>


        <div class="grid-density-range-wrap">


          <input

            id="grid-density-range"

            class="grid-density-range"

            type="range"

            min="1"

            max="5"

            step="1"

            value="3"

            aria-label="Điều chỉnh số cột trong lưới"

          >


          <div

            class="grid-density-ticks"

            aria-hidden="true"

          >

            <span>1</span>

            <span>2</span>

            <span>3</span>

            <span>4</span>

            <span>5</span>

          </div>


        </div>


        <button

          type="button"

          id="grid-density-plus"

          class="grid-density-step"

          aria-label="Tăng số cột"

        >

          +

        </button>


      </div>

    `;


    /* =====================================================
       VIEW BUTTON
    ===================================================== */

    const viewButton =
      document.createElement(
        "button"
      );


    viewButton.type =
      "button";


    viewButton.id =
      "collection-view-toggle";


    viewButton.className =
      "collection-view-toggle";


    /* =====================================================
       ORDER

       Slider → View → Total
    ===================================================== */

    row.appendChild(
      density
    );


    row.appendChild(
      viewButton
    );


    row.appendChild(
      count
    );


    filterPanel.insertAdjacentElement(

      "afterend",

      row

    );


    /* =====================================================
       MINUS
    ===================================================== */

    document

      .getElementById(
        "grid-density-minus"
      )

      ?.addEventListener(

        "click",

        () => {

          setGridColumns(

            gridColumns - 1

          );

        }

      );


    /* =====================================================
       PLUS
    ===================================================== */

    document

      .getElementById(
        "grid-density-plus"
      )

      ?.addEventListener(

        "click",

        () => {

          setGridColumns(

            gridColumns + 1

          );

        }

      );


    /* =====================================================
       RANGE
    ===================================================== */

    document

      .getElementById(
        "grid-density-range"
      )

      ?.addEventListener(

        "input",

        event => {


          if (
            viewMode === "3d"
          ) {

            return;

          }


          setGridColumns(

            Number(
              event.target.value
            )

          );

        }

      );


    /* =====================================================
       GRID / 3D
    ===================================================== */

    viewButton.addEventListener(

      "click",

      () => {


        setViewMode(

          viewMode === "3d"

            ? "grid"

            : "3d"

        );

      }

    );

  }


  /* =======================================================
     GRID DENSITY
  ======================================================= */

  function setGridColumns(
    value,
    persist = true
  ) {

    const next =
      clamp(

        Number.parseInt(
          value,
          10
        ) || 1,

        GRID_MIN,

        GRID_MAX

      );


    gridColumns =
      next;


    if (
      persist
    ) {

      safeSet(

        storageKey(),

        gridColumns

      );

    }


    applyGridLayout();

    updateControls();

  }


  /* =======================================================
     APPLY GRID LAYOUT
  ======================================================= */

  function applyGridLayout() {

    const grid =
      document.getElementById(
        "sneaker-grid"
      );


    if (!grid) {
      return;
    }


    grid.classList.remove(

      "locan-grid-view",

      "locan-3d-view",

      "grid-cols-1",

      "grid-cols-2",

      "grid-cols-3",

      "grid-cols-4",

      "grid-cols-5"

    );


    if (
      viewMode === "3d"
    ) {

      grid.classList.add(
        "locan-3d-view"
      );


      grid.style.removeProperty(
        "--locan-grid-columns"
      );


      return;

    }


    grid.classList.add(

      "locan-grid-view",

      `grid-cols-${gridColumns}`

    );


    grid.style.setProperty(

      "--locan-grid-columns",

      String(
        gridColumns
      )

    );

  }


  /* =======================================================
     RANGE PROGRESS
  ======================================================= */

  function updateRangeProgress(
    range
  ) {

    if (!range) {
      return;
    }


    const value =
      Number(
        range.value
      );


    const min =
      Number(
        range.min
      );


    const max =
      Number(
        range.max
      );


    const progress =

      (
        (
          value - min
        )

        /

        (
          max - min
        )
      )

      * 100;


    range.style.setProperty(

      "--range-progress",

      `${progress}%`

    );

  }


  /* =======================================================
     UPDATE CONTROLS
  ======================================================= */

  function updateControls() {

    const t =
      copy();


    const label =
      document.getElementById(
        "grid-density-label"
      );


    const range =
      document.getElementById(
        "grid-density-range"
      );


    const minus =
      document.getElementById(
        "grid-density-minus"
      );


    const plus =
      document.getElementById(
        "grid-density-plus"
      );


    const density =
      document.getElementById(
        "grid-density-control"
      );


    const toggle =
      document.getElementById(
        "collection-view-toggle"
      );


    /* LABEL */

    if (
      label
    ) {

      label.textContent =
        t.gridLabel(
          gridColumns
        );

    }


    /* RANGE */

    if (
      range
    ) {

      range.value =
        String(
          gridColumns
        );


      range.disabled =
        viewMode === "3d";


      range.setAttribute(

        "aria-label",

        t.range

      );


      updateRangeProgress(
        range
      );

    }


    /* MINUS */

    if (
      minus
    ) {

      minus.disabled =

        viewMode === "3d"

        ||

        gridColumns <= GRID_MIN;


      minus.title =
        t.minus;


      minus.setAttribute(

        "aria-label",

        t.minus

      );

    }


    /* PLUS */

    if (
      plus
    ) {

      plus.disabled =

        viewMode === "3d"

        ||

        gridColumns >= GRID_MAX;


      plus.title =
        t.plus;


      plus.setAttribute(

        "aria-label",

        t.plus

      );

    }


    /* SLIDER DIM IN 3D */

    density
      ?.classList
      .toggle(

        "disabled",

        viewMode === "3d"

      );


    /* VIEW BUTTON */

    if (
      toggle
    ) {

      const in3D =
        viewMode === "3d";


      toggle.textContent =

        in3D

          ? t.backGrid

          : t.open3D;


      toggle.classList.toggle(

        "active",

        in3D

      );


      toggle.setAttribute(

        "aria-label",

        in3D
          ? t.backGrid
          : t.open3D

      );

    }

  }


  /* =======================================================
     VIEW MODE
  ======================================================= */

  function setViewMode(
    mode
  ) {

    viewMode =

      mode === "3d"

        ? "3d"

        : "grid";


    safeSet(

      "locan_collection_view",

      viewMode

    );


    if (
      viewMode === "3d"
    ) {

      slideIndex =
        0;


      slideActiveId =
        null;

    }


    applyGridLayout();

    updateControls();

    renderCollection();

  }


  /* =======================================================
     VISIBLE ITEMS

     filterSneakers already includes:
     - Edition
     - Condition
     - Size
     - Search extension

     sortSneakers includes current sorting.
  ======================================================= */

  function getVisibleItems() {

    if (

      typeof sneakers ===
        "undefined"

      ||

      !Array.isArray(
        sneakers
      )

    ) {

      return [];

    }


    return sortSneakers(

      filterSneakers(
        sneakers
      )

    );

  }


  /* =======================================================
     RENDER COLLECTION
  ======================================================= */

  function renderCollection() {

    const grid =
      document.getElementById(
        "sneaker-grid"
      );


    if (!grid) {
      return;
    }


    applyGridLayout();


    if (

      typeof sneakers ===
        "undefined"

      ||

      !Array.isArray(
        sneakers
      )

    ) {

      grid.innerHTML = `

        <div class="not-found">

          Collection data could not be loaded.

        </div>

      `;


      updateCollectionCount(
        0
      );


      return;

    }


    const items =
      getVisibleItems();


    updateCollectionCount(
      items.length
    );


    if (
      !items.length
    ) {

      grid.innerHTML = `

        <div class="not-found">

          ${escapeHTML(
            copy().empty
          )}

        </div>

      `;


      return;

    }


    /* 3D */

    if (
      viewMode === "3d"
    ) {

      render3DGallery(
        items
      );


      return;

    }


    /* GRID */

    grid.innerHTML =

      items

        .map(
          renderCard
        )

        .join("");

  }


  /* =======================================================
     3D HELPERS
  ======================================================= */

  function wrapIndex(
    index,
    length
  ) {

    if (
      !length
    ) {

      return 0;

    }


    return (

      (
        index % length
      )

      +

      length

    )

    %

    length;

  }


  function circularRelative(
    index,
    center,
    length
  ) {

    let difference =
      index - center;


    if (
      difference > length / 2
    ) {

      difference -=
        length;

    }


    if (
      difference < -length / 2
    ) {

      difference +=
        length;

    }


    return difference;

  }


  function detailURL(
    sneaker
  ) {

    return (

      `./shoe.html?id=${encodeURIComponent(
        sneaker.id
      )}`

      +

      `&lang=${encodeURIComponent(
        currentLang
      )}`

    );

  }


  /* =======================================================
     3D CARD
  ======================================================= */

  function render3DCard(
    sneaker,
    index
  ) {

    const title =
      getLocalizedText(
        sneaker.title
      );


    const subtitle =
      getLocalizedText(
        sneaker.subtitle
      );


    const edition =
      getLocalizedText(
        sneaker.editionType
      );


    return `

      <article

        class="sneaker-3d-card"

        data-index="${index}"

        tabindex="0"

        role="button"

        aria-label="${escapeHTML(
          title
        )}"

      >


        <div class="sneaker-3d-image">


          <img

            data-src="${escapeHTML(
              sneaker.image || ""
            )}"

            alt="${escapeHTML(
              title
            )}"

            decoding="async"

            draggable="false"

          >


        </div>


        <div class="sneaker-3d-info">


          <h3>

            ${escapeHTML(
              title
            )}

          </h3>


          <p>

            ${escapeHTML(
              subtitle
            )}

          </p>


          <div class="sneaker-3d-meta">


            <span>

              ${escapeHTML(
                edition || "—"
              )}

            </span>


            <small>

              ${escapeHTML(
                sneaker.size || ""
              )}

            </small>


          </div>


        </div>


      </article>

    `;

  }


  /* =======================================================
     LAZY LOAD ONLY NEARBY 3D IMAGES
  ======================================================= */

  function ensureNearbyImage(
    card,
    relative
  ) {

    if (
      Math.abs(
        relative
      ) > 3.2
    ) {

      return;

    }


    const img =
      card.querySelector(
        "img[data-src]"
      );


    if (
      !img
      ||
      img.getAttribute(
        "src"
      )
    ) {

      return;

    }


    const src =
      img.dataset.src;


    if (
      src
    ) {

      img.src =
        src;

    }

  }


  /* =======================================================
     STAGE METRICS
  ======================================================= */

  function stageMetrics() {

    const stage =
      document.getElementById(
        "sneaker-3d-stage"
      );


    if (!stage) {

      return {
        spacing:
          300
      };

    }


    const width =
      stage.clientWidth
      ||
      window.innerWidth;


    /*
       Large desktop:
       cards farther apart.

       Mobile:
       cards naturally closer.
    */

    const spacing =
      clamp(

        width * 0.27,

        245,

        360

      );


    return {
      spacing
    };

  }


  /* =======================================================
     SMOOTH 3D POSITIONING

     Instead of rebuilding the whole gallery every time,
     we keep the SAME DOM cards and continuously change
     their transforms.

     dragProgress:

        0    = current sneaker centered
       -1    = next sneaker centered
       +1    = previous sneaker centered

     This is what makes dragging physically follow
     the finger / mouse.
  ======================================================= */

  function update3DPositions(
    dragProgress = 0,
    animate = true
  ) {

    const stage =
      document.getElementById(
        "sneaker-3d-stage"
      );


    const gallery =
      document.getElementById(
        "sneaker-3d-gallery"
      );


    if (
      !stage
      ||
      !gallery
      ||
      !slideItems.length
    ) {

      return;

    }


    gallery.classList.toggle(

      "is-dragging",

      !animate

    );


    const {
      spacing
    } =
      stageMetrics();


    const cards =
      stage.querySelectorAll(
        ".sneaker-3d-card"
      );


    cards.forEach(
      card => {


        const index =
          Number.parseInt(

            card.dataset.index,

            10

          );


        const baseRelative =
          circularRelative(

            index,

            slideIndex,

            slideItems.length

          );


        /*
           If user drags LEFT,
           dragProgress becomes negative.

           Next card:
           1 → 0
           and moves smoothly to center.
        */

        const relative =

          baseRelative

          +

          dragProgress;


        const absolute =
          Math.abs(
            relative
          );


        ensureNearbyImage(

          card,

          relative

        );


        const x =
          relative
          *
          spacing;


        const z =

          120

          -

          Math.min(
            absolute,
            3
          )

          *
          170;


        const rotation =
          clamp(

            -relative * 27,

            -48,

            48

          );


        const scale =
          clamp(

            1
            -
            absolute
            *
            0.16,

            0.56,

            1

          );


        const opacity =

          absolute > 2.65

            ? 0

            : clamp(

                1
                -
                absolute
                *
                0.30,

                0.10,

                1

              );


        const brightness =
          clamp(

            1
            -
            absolute
            *
            0.16,

            0.56,

            1

          );


        const saturation =
          clamp(

            1
            -
            absolute
            *
            0.12,

            0.62,

            1

          );


        card.style.transform =

          `translate3d(`

          +

          `calc(-50% + ${x}px), `

          +

          `-50%, `

          +

          `${z}px`

          +

          `) `

          +

          `rotateY(${rotation}deg) `

          +

          `scale(${scale})`;


        card.style.opacity =
          String(
            opacity
          );


        card.style.filter =

          `brightness(${brightness}) `

          +

          `saturate(${saturation})`;


        card.style.zIndex =
          String(

            100

            -

            Math.round(
              absolute * 12
            )

          );


        card.style.pointerEvents =

          absolute <= 2.25

            ? "auto"

            : "none";


        card.classList.toggle(

          "is-center",

          absolute < 0.35

        );

      }

    );


    const counter =
      document.getElementById(
        "sneaker-3d-counter"
      );


    if (
      counter
    ) {

      counter.textContent =

        `${slideIndex + 1} / ${slideItems.length}`;

    }

  }


  /* =======================================================
     MOVE SLIDE
  ======================================================= */

  function moveSlide(
    direction
  ) {

    if (
      slideItems.length <= 1
    ) {

      return;

    }


    slideIndex =
      wrapIndex(

        slideIndex
        +
        direction,

        slideItems.length

      );


    slideActiveId =
      slideItems[
        slideIndex
      ]?.id
      ||
      null;


    update3DPositions(

      0,

      true

    );

  }


  /* =======================================================
     MOVE DIRECTLY TO CLICKED CARD
  ======================================================= */

  function moveToSlide(
    index
  ) {

    if (
      !slideItems.length
    ) {

      return;

    }


    slideIndex =
      wrapIndex(

        index,

        slideItems.length

      );


    slideActiveId =
      slideItems[
        slideIndex
      ]?.id
      ||
      null;


    update3DPositions(

      0,

      true

    );

  }


  /* =======================================================
     OPEN CENTER CARD
  ======================================================= */

  function openCenterSlide() {

    const sneaker =
      slideItems[
        slideIndex
      ];


    if (
      !sneaker
    ) {

      return;

    }


    window.location.href =
      detailURL(
        sneaker
      );

  }


  /* =======================================================
     RESET DRAG
  ======================================================= */

  function resetDrag() {

    drag.active =
      false;


    drag.pointerId =
      null;


    drag.deltaX =
      0;


    drag.velocityX =
      0;


    if (
      drag.raf
    ) {

      cancelAnimationFrame(
        drag.raf
      );


      drag.raf =
        0;

    }

  }


  /* =======================================================
     REQUEST ANIMATION FRAME FOR DRAG

     This prevents excessive DOM updates and makes
     mobile motion substantially smoother.
  ======================================================= */

  function scheduleDragFrame() {

    if (
      drag.raf
    ) {

      return;

    }


    drag.raf =
      requestAnimationFrame(
        () => {


          drag.raf =
            0;


          const {
            spacing
          } =
            stageMetrics();


          const progress =
            clamp(

              drag.deltaX
              /
              spacing,

              -1.15,

              1.15

            );


          update3DPositions(

            progress,

            false

          );

        }
      );

  }


  /* =======================================================
     FINISH DRAG

     Uses:
     - distance
     - velocity

     A quick flick therefore works even without
     dragging very far.
  ======================================================= */

  function finishDrag() {

    const {
      spacing
    } =
      stageMetrics();


    const progress =
      drag.deltaX
      /
      spacing;


    const shouldMove =

      Math.abs(
        drag.deltaX
      )
      >
      Math.min(

        72,

        spacing * 0.22

      )

      ||

      Math.abs(
        drag.velocityX
      )
      >
      0.42;


    const direction =

      drag.deltaX < 0

        ? 1

        : -1;


    const gallery =
      document.getElementById(
        "sneaker-3d-gallery"
      );


    gallery
      ?.classList
      .remove(
        "is-dragging"
      );


    if (

      shouldMove

      &&

      Math.abs(
        progress
      ) > 0.08

    ) {

      slideIndex =
        wrapIndex(

          slideIndex
          +
          direction,

          slideItems.length

        );


      slideActiveId =
        slideItems[
          slideIndex
        ]?.id
        ||
        null;

    }


    /*
       Smooth spring-like snap
       to the final card.
    */

    update3DPositions(

      0,

      true

    );


    const hadMoved =
      drag.moved;


    resetDrag();


    /*
       Prevent the click event that follows a drag
       from opening the sneaker detail.
    */

    if (
      hadMoved
    ) {

      window.setTimeout(
        () => {

          drag.moved =
            false;

        },
        80
      );

    }

  }


  /* =======================================================
     GALLERY EVENTS
  ======================================================= */

  function bindGalleryEvents() {

    const gallery =
      document.getElementById(
        "sneaker-3d-gallery"
      );


    const stage =
      document.getElementById(
        "sneaker-3d-stage"
      );


    if (
      !gallery
      ||
      !stage
    ) {

      return;

    }


    /* =====================================================
       DESKTOP PREVIOUS BUTTON
    ===================================================== */

    document

      .getElementById(
        "sneaker-3d-prev"
      )

      ?.addEventListener(

        "click",

        event => {


          event.preventDefault();

          event.stopPropagation();


          moveSlide(
            -1
          );

        }

      );


    /* =====================================================
       DESKTOP NEXT BUTTON
    ===================================================== */

    document

      .getElementById(
        "sneaker-3d-next"
      )

      ?.addEventListener(

        "click",

        event => {


          event.preventDefault();

          event.stopPropagation();


          moveSlide(
            1
          );

        }

      );


    /* =====================================================
       CARD CLICK
    ===================================================== */

    stage

      .querySelectorAll(
        ".sneaker-3d-card"
      )

      .forEach(
        card => {


          const activate =
            () => {


              if (
                drag.moved
              ) {

                return;

              }


              const index =
                Number.parseInt(

                  card.dataset.index,

                  10

                );


              if (
                !Number.isFinite(
                  index
                )
              ) {

                return;

              }


              /*
                 CENTER:
                 open detail.

                 SIDE CARD:
                 move it to center.
              */

              if (
                index === slideIndex
              ) {

                openCenterSlide();

              } else {

                moveToSlide(
                  index
                );

              }

            };


          card.addEventListener(

            "click",

            activate

          );


          card.addEventListener(

            "keydown",

            event => {


              if (

                event.key === "Enter"

                ||

                event.key === " "

              ) {

                event.preventDefault();

                activate();

              }

            }

          );

        }

      );


    /* =====================================================
       KEYBOARD
    ===================================================== */

    gallery.addEventListener(

      "keydown",

      event => {


        if (
          event.key === "ArrowLeft"
        ) {

          event.preventDefault();

          moveSlide(
            -1
          );

        }


        if (
          event.key === "ArrowRight"
        ) {

          event.preventDefault();

          moveSlide(
            1
          );

        }

      }

    );


    /* =====================================================
       POINTER DOWN
       Works with:
       - mouse
       - touch
       - stylus
    ===================================================== */

    gallery.addEventListener(

      "pointerdown",

      event => {


        /*
           Left mouse button only.
           Touch pointer has button 0.
        */

        if (

          event.button !== undefined

          &&

          event.button !== 0

        ) {

          return;

        }


        drag.active =
          true;


        drag.pointerId =
          event.pointerId;


        drag.startX =
          event.clientX;


        drag.startY =
          event.clientY;


        drag.lastX =
          event.clientX;


        drag.lastTime =
          performance.now();


        drag.deltaX =
          0;


        drag.velocityX =
          0;


        drag.moved =
          false;


        gallery.classList.add(
          "is-dragging"
        );


        try {

          gallery.setPointerCapture(
            event.pointerId
          );

        } catch (_) {}

      }

    );


    /* =====================================================
       POINTER MOVE

       This now updates card positions continuously,
       instead of waiting for pointerup.
    ===================================================== */

    gallery.addEventListener(

      "pointermove",

      event => {


        if (

          !drag.active

          ||

          event.pointerId !==
            drag.pointerId

        ) {

          return;

        }


        const now =
          performance.now();


        const dx =

          event.clientX

          -

          drag.startX;


        const dy =

          event.clientY

          -

          drag.startY;


        /*
           Ignore tiny accidental movements.
        */

        if (

          !drag.moved

          &&

          Math.abs(
            dx
          ) < 6

          &&

          Math.abs(
            dy
          ) < 6

        ) {

          return;

        }


        /*
           If user is clearly scrolling vertically
           on mobile, let the page scroll normally.
        */

        if (

          Math.abs(
            dy
          )

          >

          Math.abs(
            dx
          )
          *
          1.25

          &&

          Math.abs(
            dx
          ) < 18

        ) {

          return;

        }


        drag.moved =
          true;


        drag.deltaX =
          dx;


        /*
           Calculate smoothed velocity.
        */

        const dt =
          Math.max(

            1,

            now
            -
            drag.lastTime

          );


        const instantVelocity =

          (
            event.clientX
            -
            drag.lastX
          )

          /

          dt;


        drag.velocityX =

          drag.velocityX
          *
          0.72

          +

          instantVelocity
          *
          0.28;


        drag.lastX =
          event.clientX;


        drag.lastTime =
          now;


        scheduleDragFrame();

      }

    );


    /* =====================================================
       POINTER UP
    ===================================================== */

    gallery.addEventListener(

      "pointerup",

      event => {


        if (

          !drag.active

          ||

          event.pointerId !==
            drag.pointerId

        ) {

          return;

        }


        finishDrag();

      }

    );


    /* =====================================================
       POINTER CANCEL
    ===================================================== */

    gallery.addEventListener(

      "pointercancel",

      () => {


        if (
          !drag.active
        ) {

          return;

        }


        finishDrag();

      }

    );


    /* =====================================================
       TRACKPAD HORIZONTAL SWIPE

       One gesture = one slide.
       Throttle prevents 10 slides from one trackpad flick.
    ===================================================== */

    gallery.addEventListener(

      "wheel",

      event => {


        const horizontalIntent =

          Math.abs(
            event.deltaX
          )

          >

          Math.abs(
            event.deltaY
          )

          ||

          event.shiftKey;


        if (
          !horizontalIntent
        ) {

          return;

        }


        event.preventDefault();


        const now =
          performance.now();


        if (
          now < wheelLockedUntil
        ) {

          return;

        }


        const delta =

          Math.abs(
            event.deltaX
          )

          >

          Math.abs(
            event.deltaY
          )

            ? event.deltaX

            : event.deltaY;


        if (
          Math.abs(
            delta
          ) < 12
        ) {

          return;

        }


        wheelLockedUntil =
          now + 380;


        moveSlide(

          delta > 0

            ? 1

            : -1

        );

      },

      {
        passive:
          false
      }

    );

  }


  /* =======================================================
     RENDER 3D GALLERY

     IMPORTANT:
     Every card is rendered ONCE.

     Moving between sneakers only changes transforms.

     This fixes the old issue where every swipe rebuilt
     the entire gallery DOM, which caused the hard/jumpy
     feeling.
  ======================================================= */

  function render3DGallery(
    items
  ) {

    const grid =
      document.getElementById(
        "sneaker-grid"
      );


    if (
      !grid
      ||
      !items.length
    ) {

      return;

    }


    slideItems =
      items;


    /*
       Preserve same sneaker when Search / Sort / Filter
       changes if possible.
    */

    if (
      slideActiveId
    ) {

      const preserved =
        slideItems.findIndex(

          item =>
            item.id ===
            slideActiveId

        );


      if (
        preserved >= 0
      ) {

        slideIndex =
          preserved;

      }

    }


    slideIndex =
      wrapIndex(

        slideIndex,

        slideItems.length

      );


    slideActiveId =
      slideItems[
        slideIndex
      ]?.id
      ||
      null;


    const t =
      copy();


    grid.innerHTML = `

      <section

        id="sneaker-3d-gallery"

        class="sneaker-3d-gallery"

        tabindex="0"

      >


        <button

          type="button"

          id="sneaker-3d-prev"

          class="
            sneaker-3d-nav
            sneaker-3d-prev
          "

          aria-label="${escapeHTML(
            t.previous
          )}"

        >

          ‹

        </button>


        <div

          id="sneaker-3d-stage"

          class="sneaker-3d-stage"

        >

          ${slideItems
            .map(
              render3DCard
            )
            .join("")}

        </div>


        <button

          type="button"

          id="sneaker-3d-next"

          class="
            sneaker-3d-nav
            sneaker-3d-next
          "

          aria-label="${escapeHTML(
            t.next
          )}"

        >

          ›

        </button>


        <div class="sneaker-3d-footer">


          <strong
            id="sneaker-3d-counter"
          >

            ${slideIndex + 1}
            /
            ${slideItems.length}

          </strong>


          <span>

            ${escapeHTML(
              t.hint
            )}

          </span>


        </div>


      </section>

    `;


    bindGalleryEvents();


    /*
       First frame:
       set positions without animation.

       Second frame:
       normal transitions become active.
    */

    requestAnimationFrame(
      () => {


        update3DPositions(

          0,

          false

        );


        requestAnimationFrame(
          () => {

            update3DPositions(

              0,

              true

            );

          }
        );

      }
    );

  }


  /* =======================================================
     STYLES
  ======================================================= */

  function installStyles() {

    if (
      document.getElementById(
        "locan-collection-view-v3-css"
      )
    ) {

      return;

    }


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "locan-collection-view-v3-css";


    style.textContent = `

      /* ===================================================
         HIDE LEGACY CONTROLS
      =================================================== */

      #grid-view-control,
      #grid-mobile-toggle,
      #collection-view-control,
      #collection-mobile-view-controls,
      #collection-3d-toggle {

        display:
          none !important;

      }


      /* ===================================================
         CONTROL ROW
      =================================================== */

      .collection-display-row {

        display: grid;

        grid-template-columns:
          minmax(420px, 1fr)
          142px
          max-content;

        align-items: center;

        gap: 18px;

        width: 100%;

        margin:
          16px
          0
          28px;

      }


      .collection-display-row
      .collection-count {

        justify-self: end;

        margin:
          0 !important;

        white-space:
          nowrap;

      }


      /* ===================================================
         GRID SLIDER
      =================================================== */

      .grid-density-control {

        width: 100%;

        min-width: 0;

        padding:
          10px
          16px
          8px;

        background:

          linear-gradient(

            145deg,

            rgba(
              255,
              255,
              255,
              0.043
            ),

            rgba(
              255,
              255,
              255,
              0.018
            )

          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            0.09
          );

        border-radius:
          14px;

        box-shadow:

          inset
          0
          1px
          0
          rgba(
            255,
            255,
            255,
            0.055
          ),

          0
          10px
          28px
          rgba(
            0,
            0,
            0,
            0.12
          );

        backdrop-filter:

          blur(18px)

          saturate(130%);

        -webkit-backdrop-filter:

          blur(18px)

          saturate(130%);

        transition:

          opacity
          0.2s ease,

          border-color
          0.2s ease;

      }


      .grid-density-control.disabled {

        opacity:
          0.38;

      }


      .grid-density-label {

        margin-bottom:
          5px;

        color:
          #777b83;

        font-size:
          0.62rem;

        font-weight:
          850;

        letter-spacing:
          1.25px;

        text-align:
          center;

      }


      .grid-density-slider-row {

        display: grid;

        grid-template-columns:

          34px

          minmax(
            0,
            1fr
          )

          34px;

        align-items:
          center;

        gap:
          13px;

      }


      /* ===================================================
         − / +
      =================================================== */

      .grid-density-step {

        display: grid;

        place-items:
          center;

        width:
          34px;

        height:
          34px;

        padding:
          0;

        color:
          #92959d;

        background:
          rgba(
            255,
            255,
            255,
            0.025
          );

        border:

          1px solid

          rgba(
            255,
            255,
            255,
            0.075
          );

        border-radius:
          50%;

        cursor:
          pointer;

        font-size:
          1.12rem;

        line-height:
          1;

        transition:

          color
          0.18s ease,

          border-color
          0.18s ease,

          background
          0.18s ease,

          transform
          0.18s ease;

      }


      .grid-density-step:hover:not(:disabled) {

        color:
          #ffcc00;

        border-color:
          rgba(
            255,
            204,
            0,
            0.30
          );

        background:
          rgba(
            255,
            204,
            0,
            0.045
          );

        transform:
          scale(1.04);

      }


      .grid-density-step:disabled {

        opacity:
          0.28;

        cursor:
          default;

      }


      /* ===================================================
         RANGE
      =================================================== */

      .grid-density-range-wrap {

        min-width:
          0;

      }


      .grid-density-range {

        --range-progress:
          50%;

        display:
          block;

        width:
          100%;

        height:
          24px;

        margin:
          0;

        padding:
          0;

        appearance:
          none;

        -webkit-appearance:
          none;

        background:
          transparent;

        cursor:
          pointer;

      }


      .grid-density-range:disabled {

        cursor:
          default;

      }


      .grid-density-range::-webkit-slider-runnable-track {

        height:
          4px;

        border-radius:
          999px;

        background:

          linear-gradient(

            to right,

            #ffcc00
            0%,

            #ffcc00
            var(
              --range-progress
            ),

            #3c3c41
            var(
              --range-progress
            ),

            #3c3c41
            100%

          );

      }


      .grid-density-range::-webkit-slider-thumb {

        width:
          19px;

        height:
          19px;

        margin-top:
          -7.5px;

        appearance:
          none;

        -webkit-appearance:
          none;

        background:
          #111114;

        border:

          3px solid

          #ffcc00;

        border-radius:
          50%;

        box-shadow:

          0
          0
          0
          3px
          rgba(
            255,
            204,
            0,
            0.08
          ),

          0
          3px
          10px
          rgba(
            0,
            0,
            0,
            0.45
          );

      }


      .grid-density-range::-moz-range-track {

        height:
          4px;

        border-radius:
          999px;

        background:
          #3c3c41;

      }


      .grid-density-range::-moz-range-progress {

        height:
          4px;

        border-radius:
          999px;

        background:
          #ffcc00;

      }


      .grid-density-range::-moz-range-thumb {

        width:
          15px;

        height:
          15px;

        background:
          #111114;

        border:

          3px solid

          #ffcc00;

        border-radius:
          50%;

      }


      /* ===================================================
         1 2 3 4 5
      =================================================== */

      .grid-density-ticks {

        display:
          flex;

        justify-content:
          space-between;

        padding:
          0 2px;

        margin-top:
          -2px;

        color:
          #505158;

        font-size:
          0.50rem;

        font-weight:
          800;

        line-height:
          1;

      }


      /* ===================================================
         VIEW TOGGLE

         Now physically BETWEEN:
         grid slider ↔ total count.
      =================================================== */

      .collection-view-toggle {

        justify-self:
          center;

        width:
          142px;

        min-height:
          48px;

        padding:
          10px
          14px;

        color:
          #ffcc00;

        background:
          rgba(
            255,
            204,
            0,
            0.025
          );

        border:

          1px solid

          rgba(
            255,
            204,
            0,
            0.22
          );

        border-radius:
          10px;

        cursor:
          pointer;

        font:
          inherit;

        font-size:
          0.67rem;

        font-weight:
          900;

        letter-spacing:
          1px;

        transition:

          color
          0.18s ease,

          background
          0.18s ease,

          border-color
          0.18s ease,

          transform
          0.18s ease;

      }


      .collection-view-toggle:hover {

        background:
          rgba(
            255,
            204,
            0,
            0.07
          );

        border-color:
          rgba(
            255,
            204,
            0,
            0.42
          );

        transform:
          translateY(
            -1px
          );

      }


      .collection-view-toggle.active {

        color:
          #0d0d0f;

        background:
          #ffcc00;

        border-color:
          #ffcc00;

      }


      /* ===================================================
         GRID
      =================================================== */

      #sneaker-grid.locan-grid-view {

        --locan-grid-columns:
          3;

        display:
          grid !important;

        grid-template-columns:

          repeat(

            var(
              --locan-grid-columns
            ),

            minmax(
              0,
              1fr
            )

          ) !important;

        align-items:
          stretch !important;

      }


      /* 1 COLUMN */

      #sneaker-grid.locan-grid-view.grid-cols-1 {

        max-width:
          760px;

        margin-left:
          auto;

        margin-right:
          auto;

      }


      /* GAPS */

      #sneaker-grid.locan-grid-view.grid-cols-2,

      #sneaker-grid.locan-grid-view.grid-cols-3 {

        gap:
          28px;

      }


      #sneaker-grid.locan-grid-view.grid-cols-4 {

        gap:
          20px;

      }


      #sneaker-grid.locan-grid-view.grid-cols-5 {

        gap:
          16px;

      }


      /* 4 COLUMNS */

      #sneaker-grid.grid-cols-4
      .card-info {

        min-height:
          178px;

        padding:
          17px;

      }


      #sneaker-grid.grid-cols-4
      .card-info h3 {

        font-size:
          0.98rem;

      }


      #sneaker-grid.grid-cols-4
      .card-info .subtitle {

        font-size:
          0.78rem;

      }


      #sneaker-grid.grid-cols-4
      .badge,

      #sneaker-grid.grid-cols-4
      .size {

        font-size:
          0.74rem;

      }


      /* 5 COLUMNS */

      #sneaker-grid.grid-cols-5
      .card {

        border-radius:
          15px;

      }


      #sneaker-grid.grid-cols-5
      .card-info {

        min-height:
          166px;

        padding:
          14px;

      }


      #sneaker-grid.grid-cols-5
      .card-info h3 {

        margin-bottom:
          6px;

        font-size:
          0.86rem;

        line-height:
          1.34;

      }


      #sneaker-grid.grid-cols-5
      .card-info .subtitle {

        margin-bottom:
          12px;

        font-size:
          0.71rem;

      }


      #sneaker-grid.grid-cols-5
      .badge {

        padding:
          4px
          7px;

        font-size:
          0.66rem;

      }


      #sneaker-grid.grid-cols-5
      .size {

        font-size:
          0.67rem;

      }


      #sneaker-grid.grid-cols-5
      .card-cta {

        margin-top:
          12px;

        padding-top:
          10px;

        font-size:
          0.61rem;

      }


      /* ===================================================
         3D COVER FLOW
      =================================================== */

      #sneaker-grid.locan-3d-view {

        display:
          block !important;

        width:
          100% !important;

        max-width:
          none !important;

        margin:
          0 !important;

        overflow:
          visible !important;

      }


      .sneaker-3d-gallery {

        position:
          relative;

        width:
          100%;

        min-height:
          650px;

        overflow:
          hidden;

        border-radius:
          24px;

        outline:
          none;

        perspective:
          1500px;

        perspective-origin:
          50% 44%;

        touch-action:
          pan-y;

        user-select:
          none;

        cursor:
          grab;

      }


      .sneaker-3d-gallery.is-dragging {

        cursor:
          grabbing;

      }


      .sneaker-3d-gallery::before {

        content:
          "";

        position:
          absolute;

        inset:
          8% 8% 12%;

        pointer-events:
          none;

        background:

          radial-gradient(

            circle at center,

            rgba(
              255,
              255,
              255,
              0.048
            ),

            rgba(
              255,
              255,
              255,
              0.018
            )
            34%,

            transparent
            70%

          );

        filter:
          blur(
            18px
          );

      }


      .sneaker-3d-stage {

        position:
          relative;

        width:
          100%;

        height:
          575px;

        transform-style:
          preserve-3d;

      }


      .sneaker-3d-card {

        position:
          absolute;

        top:
          48%;

        left:
          50%;

        width:

          min(
            360px,
            30vw
          );

        min-width:
          270px;

        height:
          480px;

        overflow:
          hidden;

        background:

          linear-gradient(

            145deg,

            rgba(
              255,
              255,
              255,
              0.075
            ),

            rgba(
              255,
              255,
              255,
              0.024
            )
            48%,

            rgba(
              255,
              255,
              255,
              0.016
            )

          );

        border:

          1px solid

          rgba(
            255,
            255,
            255,
            0.13
          );

        border-radius:
          22px;

        box-shadow:

          0
          30px
          55px
          rgba(
            0,
            0,
            0,
            0.44
          ),

          inset
          0
          1px
          0
          rgba(
            255,
            255,
            255,
            0.09
          );

        backdrop-filter:

          blur(
            24px
          )

          saturate(
            145%
          );

        -webkit-backdrop-filter:

          blur(
            24px
          )

          saturate(
            145%
          );

        transform-style:
          preserve-3d;

        transform-origin:
          center center;

        will-change:

          transform,
          opacity,
          filter;

        cursor:
          pointer;

        opacity:
          0;

        transition:

          transform
          0.46s
          cubic-bezier(
            0.22,
            0.78,
            0.22,
            1
          ),

          opacity
          0.34s ease,

          filter
          0.34s ease,

          border-color
          0.24s ease,

          box-shadow
          0.24s ease;

      }


      /*
         During active dragging,
         transition MUST be removed so
         the card follows pointer 1:1.
      */

      .sneaker-3d-gallery.is-dragging
      .sneaker-3d-card {

        transition:
          none !important;

      }


      .sneaker-3d-card.is-center {

        border-color:
          rgba(
            255,
            204,
            0,
            0.24
          );

        box-shadow:

          0
          34px
          65px
          rgba(
            0,
            0,
            0,
            0.52
          ),

          inset
          0
          1px
          0
          rgba(
            255,
            255,
            255,
            0.10
          );

      }


      /* ===================================================
         3D IMAGE
      =================================================== */

      .sneaker-3d-image {

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        width:
          100%;

        height:
          285px;

        pointer-events:
          none;

      }


      .sneaker-3d-image img {

        display:
          block;

        width:
          88%;

        height:
          88%;

        object-fit:
          contain;

        object-position:
          center;

        background:
          transparent;

        filter:

          drop-shadow(

            0
            16px
            18px
            rgba(
              0,
              0,
              0,
              0.24
            )

          );

        pointer-events:
          none;

        -webkit-user-drag:
          none;

      }


      /* BAPE */

      .sneaker-3d-image
      img[src*="bapesta_stussy.png"] {

        width:
          54%;

        height:
          54%;

      }


      /* WAFFLE */

      .sneaker-3d-image
      img[src*="nike_waffle_racer_ow.png"] {

        width:
          52%;

        height:
          52%;

      }


      /* ===================================================
         3D INFO
      =================================================== */

      .sneaker-3d-info {

        display:
          flex;

        flex-direction:
          column;

        min-height:
          194px;

        padding:

          18px

          20px

          20px;

        border-top:

          1px solid

          rgba(
            255,
            255,
            255,
            0.055
          );

        pointer-events:
          none;

      }


      .sneaker-3d-info h3 {

        margin:

          0
          0
          8px;

        color:
          #f6f6f8;

        font-size:
          1rem;

        line-height:
          1.38;

      }


      .sneaker-3d-info p {

        margin:

          0
          0
          14px;

        color:
          #9699a2;

        font-size:
          0.78rem;

        line-height:
          1.45;

      }


      .sneaker-3d-meta {

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          10px;

        margin-top:
          auto;

      }


      .sneaker-3d-meta span {

        padding:
          5px
          8px;

        color:
          #ffcc00;

        background:
          rgba(
            255,
            255,
            255,
            0.085
          );

        border-radius:
          6px;

        font-size:
          0.70rem;

      }


      .sneaker-3d-meta small {

        color:
          #b5bac3;

        font-size:
          0.72rem;

      }


      /* ===================================================
         3D DESKTOP ARROWS
      =================================================== */

      .sneaker-3d-nav {

        position:
          absolute;

        top:
          46%;

        z-index:
          500;

        display:
          grid;

        place-items:
          center;

        width:
          50px;

        height:
          50px;

        padding:
          0;

        color:
          #b7b7bd;

        background:
          rgba(
            18,
            18,
            21,
            0.72
          );

        border:

          1px solid

          rgba(
            255,
            255,
            255,
            0.14
          );

        border-radius:
          50%;

        backdrop-filter:
          blur(
            18px
          );

        -webkit-backdrop-filter:
          blur(
            18px
          );

        cursor:
          pointer;

        font-size:
          1.7rem;

        line-height:
          1;

        transform:
          translateY(
            -50%
          );

        transition:

          color
          0.18s ease,

          border-color
          0.18s ease,

          background
          0.18s ease,

          transform
          0.18s ease;

      }


      .sneaker-3d-nav:hover {

        color:
          #ffcc00;

        border-color:
          rgba(
            255,
            204,
            0,
            0.34
          );

        background:
          rgba(
            28,
            28,
            31,
            0.86
          );

      }


      .sneaker-3d-nav:active {

        transform:

          translateY(
            -50%
          )

          scale(
            0.94
          );

      }


      .sneaker-3d-prev {

        left:
          20px;

      }


      .sneaker-3d-next {

        right:
          20px;

      }


      /* ===================================================
         3D FOOTER
      =================================================== */

      .sneaker-3d-footer {

        position:
          absolute;

        left:
          50%;

        bottom:
          15px;

        z-index:
          20;

        display:
          flex;

        flex-direction:
          column;

        align-items:
          center;

        gap:
          7px;

        transform:
          translateX(
            -50%
          );

        pointer-events:
          none;

      }


      .sneaker-3d-footer strong {

        color:
          #ffcc00;

        font-size:
          0.72rem;

        letter-spacing:
          1.4px;

      }


      .sneaker-3d-footer span {

        color:
          #626269;

        font-size:
          0.58rem;

        font-weight:
          800;

        letter-spacing:
          1px;

        white-space:
          nowrap;

      }


      /* ===================================================
         TABLET
      =================================================== */

      @media screen and
      (max-width: 950px) {


        .collection-display-row {

          grid-template-columns:

            minmax(
              300px,
              1fr
            )

            132px

            max-content;

          gap:
            12px;

        }


        .collection-view-toggle {

          width:
            132px;

        }


        .sneaker-3d-card {

          width:

            min(
              340px,
              42vw
            );

          min-width:
            250px;

        }

      }


      /* ===================================================
         MOBILE

         Previous requirement preserved:

         TOTAL
         ↓
         GRID / 3D VIEW
         ↓
         GRID SLIDER

         The View button is still between
         Total and Slider.
      =================================================== */

      @media screen and
      (max-width: 650px) {


        .collection-display-row {

          display:
            flex;

          flex-direction:
            column;

          gap:
            10px;

          margin:

            14px
            0
            22px;

        }


        /* TOTAL FIRST */

        .collection-display-row
        .collection-count {

          order:
            1;

          align-self:
            stretch;

          justify-self:
            auto;

          text-align:
            center;

        }


        /* VIEW BUTTON SECOND */

        .collection-view-toggle {

          order:
            2;

          width:

            min(
              190px,
              100%
            );

          align-self:
            center;

          min-height:
            42px;

        }


        /* SLIDER THIRD */

        .grid-density-control {

          order:
            3;

          width:
            100%;

          padding:

            10px

            12px

            8px;

        }


        .grid-density-slider-row {

          grid-template-columns:

            32px

            minmax(
              0,
              1fr
            )

            32px;

          gap:
            10px;

        }


        .grid-density-step {

          width:
            32px;

          height:
            32px;

        }


        /* =================================================
           MOBILE GRID
        ================================================= */

        #sneaker-grid.locan-grid-view {

          max-width:
            none !important;

          margin-left:
            0 !important;

          margin-right:
            0 !important;

        }


        #sneaker-grid.locan-grid-view.grid-cols-1 {

          gap:
            22px;

        }


        #sneaker-grid.locan-grid-view.grid-cols-2 {

          gap:
            12px;

        }


        #sneaker-grid.locan-grid-view.grid-cols-3 {

          gap:
            9px;

        }


        #sneaker-grid.locan-grid-view.grid-cols-4,

        #sneaker-grid.locan-grid-view.grid-cols-5 {

          gap:
            7px;

        }


        /* MOBILE 2 COLUMNS */

        #sneaker-grid.grid-cols-2
        .card-info {

          min-height:
            146px;

          padding:
            11px;

        }


        #sneaker-grid.grid-cols-2
        .card-info h3 {

          font-size:
            0.77rem;

          line-height:
            1.31;

        }


        #sneaker-grid.grid-cols-2
        .card-info .subtitle {

          font-size:
            0.65rem;

        }


        /* MOBILE 3 COLUMNS */

        #sneaker-grid.grid-cols-3
        .card {

          border-radius:
            11px;

        }


        #sneaker-grid.grid-cols-3
        .card-info {

          min-height:
            94px;

          padding:
            8px;

        }


        #sneaker-grid.grid-cols-3
        .card-info h3 {

          margin:
            0;

          font-size:
            0.62rem;

          line-height:
            1.25;

        }


        #sneaker-grid.grid-cols-3
        .card-info .subtitle,

        #sneaker-grid.grid-cols-3
        .card-meta,

        #sneaker-grid.grid-cols-3
        .card-cta {

          display:
            none;

        }


        /* MOBILE 4 / 5
           Visual overview mode
        */

        #sneaker-grid.grid-cols-4
        .card,

        #sneaker-grid.grid-cols-5
        .card {

          border-radius:
            9px;

        }


        #sneaker-grid.grid-cols-4
        .card-info,

        #sneaker-grid.grid-cols-5
        .card-info {

          display:
            none;

        }


        #sneaker-grid.grid-cols-4
        .card-img-wrapper,

        #sneaker-grid.grid-cols-5
        .card-img-wrapper {

          aspect-ratio:
            1 / 1;

        }


        /* =================================================
           MOBILE 3D
        ================================================= */

        .sneaker-3d-gallery {

          min-height:
            545px;

          border-radius:
            18px;

          perspective:
            1100px;

        }


        .sneaker-3d-stage {

          height:
            490px;

        }


        .sneaker-3d-card {

          top:
            47%;

          width:

            min(
              78vw,
              330px
            );

          min-width:
            0;

          height:
            420px;

        }


        .sneaker-3d-image {

          height:
            245px;

        }


        .sneaker-3d-info {

          min-height:
            174px;

          padding:

            15px

            16px

            17px;

        }


        .sneaker-3d-info h3 {

          font-size:
            0.9rem;

        }


        .sneaker-3d-info p {

          font-size:
            0.72rem;

        }


        /*
           Mobile uses swipe,
           so arrows are unnecessary.
        */

        .sneaker-3d-nav {

          display:
            none;

        }


        .sneaker-3d-footer {

          bottom:
            8px;

        }


        .sneaker-3d-footer span {

          max-width:
            88vw;

          overflow:
            hidden;

          text-overflow:
            ellipsis;

          font-size:
            0.52rem;

        }

      }


      /* ===================================================
         SMALL MOBILE
      =================================================== */

      @media screen and
      (max-width: 430px) {


        .grid-density-label {

          font-size:
            0.58rem;

        }


        .grid-density-ticks {

          font-size:
            0.47rem;

        }


        .sneaker-3d-card {

          width:
            80vw;

          height:
            405px;

        }


        .sneaker-3d-image {

          height:
            232px;

        }


        .sneaker-3d-info {

          min-height:
            172px;

          padding:
            14px;

        }

      }


      /* ===================================================
         REDUCED MOTION
      =================================================== */

      @media
      (prefers-reduced-motion: reduce) {


        .sneaker-3d-card,

        .grid-density-step,

        .collection-view-toggle {

          transition:
            none !important;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =======================================================
     LANGUAGE WRAPPER
  ======================================================= */

  updateStaticText =
    function () {


      originalUpdateStaticText();


      updateControls();


      if (
        viewMode === "3d"
        &&
        slideItems.length
      ) {

        const footer =
          document.querySelector(
            ".sneaker-3d-footer span"
          );


        if (
          footer
        ) {

          footer.textContent =
            copy().hint;

        }


        const prev =
          document.getElementById(
            "sneaker-3d-prev"
          );


        const next =
          document.getElementById(
            "sneaker-3d-next"
          );


        if (
          prev
        ) {

          prev.setAttribute(

            "aria-label",

            copy().previous

          );

        }


        if (
          next
        ) {

          next.setAttribute(

            "aria-label",

            copy().next

          );

        }

      }

    };


  /* =======================================================
     TAKE OVER GLOBAL renderGrid()

     Search / Filter / Sort already call renderGrid(),
     therefore all existing features automatically work
     in both Grid and 3D modes.
  ======================================================= */

  renderGrid =
    renderCollection;


  /* =======================================================
     RESIZE
  ======================================================= */

  function handleResize() {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      window.setTimeout(
        () => {


          const stored =
            Number.parseInt(

              safeGet(
                storageKey()
              ),

              10

            );


          if (
            Number.isFinite(
              stored
            )
          ) {

            gridColumns =
              clamp(

                stored,

                GRID_MIN,

                GRID_MAX

              );

          } else {

            gridColumns =
              defaultColumns();

          }


          applyGridLayout();

          updateControls();


          if (
            viewMode === "3d"
          ) {

            update3DPositions(

              0,

              false

            );


            requestAnimationFrame(
              () => {

                update3DPositions(

                  0,

                  true

                );

              }
            );

          }

        },

        140

      );

  }


  window.addEventListener(

    "resize",

    handleResize

  );


  /* =======================================================
     INIT
  ======================================================= */

  function init() {

    installStyles();


    removeOldViewUI();


    createViewUI();


    gridColumns =
      readStoredColumns();


    applyGridLayout();


    updateControls();


    renderCollection();

  }


  /*
     collection-view.js is loaded at the bottom
     of index.html, so the required DOM elements
     already exist.

     Running immediately also stops the old
     controller from flashing onto the screen.
  */

  init();

})();
