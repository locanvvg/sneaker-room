/* LỘC AN SNEAKER COLLECTION — collection-view.js v16 — DIRECT 3D CALIBRATION */

(() => {
  "use strict";

  let drag = {
    active: false,
    id: null,
    sx: 0,
    sy: 0,
    lx: 0,
    lt: 0,
    dx: 0,
    vx: 0,
    moved: false,
    raf: 0
  };

  let suppressClickUntil = 0;
  let wheelLockUntil = 0;
  let lastSignature = "";
  let forceReset = false;


  const clamp = (v, a, b) =>
    Math.min(
      b,
      Math.max(
        a,
        v
      )
    );


  const text = () =>
    currentLang === "vi"

      ? {
          prev:
            "Đôi trước",

          next:
            "Đôi tiếp theo",

          more:
            "☝ XEM THÊM",

          moreAria:
            "Mở hồ sơ của đôi sneaker ở giữa"
        }

      : {
          prev:
            "Previous sneaker",

          next:
            "Next sneaker",

          more:
            "☝ VIEW MORE",

          moreAria:
            "Open the sneaker in the center"
        };


  /* =====================================================
     CONTROL POSITION
  ===================================================== */

  function sharedDensityLanguage() {
    try {
      return currentLang === "en"
        ? "en"
        : "vi";
    } catch (_) {
      return "vi";
    }
  }


  function updateSharedDensityLabel(
    control,
    range
  ) {
    if (
      !control
      ||
      !range
    ) {
      return;
    }

    const value =
      String(
        range.value ||
        "1"
      );

    control.dataset.densityLabel =
      sharedDensityLanguage() === "en"
        ? `GRID · ${value} COL`
        : `LƯỚI · ${value} CỘT`;

    const min =
      Number(
        range.min || 1
      );

    const max =
      Number(
        range.max || 5
      );

    const numeric =
      Number(
        range.value || min
      );

    const span =
      Math.max(
        1,
        max - min
      );

    const pct =
      (
        (
          numeric - min
        )
        /
        span
      )
      *
      100;

    control.style.setProperty(
      "--density-pct",
      `${pct}%`
    );
  }


  function buildOwnedDensityControl(
    legacyControl
  ) {

    const existing =
      document.getElementById(
        "sneaker-density-control-final"
      );


    if (
      existing
    ) {

      return existing;

    }


    if (
      !legacyControl
    ) {

      return null;

    }


    const oldRange =
      legacyControl.querySelector(
        'input[type="range"]'
      );


    const saved =
      Number(
        localStorage.getItem(
          "locan_sneaker_density_final"
        )
      );


    const inherited =
      Number(
        oldRange?.value
      );


    const initial =
      clamp(

        Number.isFinite(saved)
        &&
        saved >= 1
        &&
        saved <= 5

          ? saved

          : (
              Number.isFinite(inherited)
              &&
              inherited >= 1
              &&
              inherited <= 5

                ? inherited

                : 3
            ),

        1,

        5

      );


    const control =
      document.createElement(
        "div"
      );


    control.id =
      "sneaker-density-control-final";


    control.className =
      "unified-density-control";


    const minus =
      document.createElement(
        "button"
      );


    minus.type =
      "button";


    minus.className =
      "category-density-button shared-density-minus";


    minus.textContent =
      "−";


    const range =
      document.createElement(
        "input"
      );


    range.id =
      "sneaker-density-range-final";


    range.type =
      "range";


    range.className =
      "category-density-range";


    range.min =
      "1";


    range.max =
      "5";


    range.step =
      "1";


    range.value =
      String(initial);


    const plus =
      document.createElement(
        "button"
      );


    plus.type =
      "button";


    plus.className =
      "category-density-button shared-density-plus";


    plus.textContent =
      "+";


    const ticks =
      document.createElement(
        "div"
      );


    ticks.className =
      "category-density-ticks";


    ticks.setAttribute(
      "aria-hidden",
      "true"
    );


    ticks.innerHTML =
      "<span>1</span>"
      +
      "<span>2</span>"
      +
      "<span>3</span>"
      +
      "<span>4</span>"
      +
      "<span>5</span>";


    control.append(
      minus,
      range,
      plus,
      ticks
    );


    /*
      Replace the entire legacy control node.

      Any old script that stored references to the old
      input/control can no longer change the visible slider.
    */
    legacyControl.replaceWith(
      control
    );


    let selectedColumns =
      initial;


    const updateAccessibleText =
      () => {

        const english =
          sharedDensityLanguage()
          ===
          "en";


        minus.setAttribute(
          "aria-label",
          english
            ? "Fewer grid columns"
            : "Giảm số cột"
        );


        plus.setAttribute(
          "aria-label",
          english
            ? "More grid columns"
            : "Tăng số cột"
        );


        range.setAttribute(
          "aria-label",
          english
            ? "Grid columns"
            : "Số cột lưới"
        );

      };


    const updateVisual =
      () => {

        range.value =
          String(
            selectedColumns
          );


        updateSharedDensityLabel(
          control,
          range
        );


        const grid =
          document.getElementById(
            "sneaker-grid"
          );


        if (
          grid
        ) {

          grid.dataset.densityColumns =
            String(
              selectedColumns
            );

        }

      };


    const applyGridColumns =
      () => {

        const grid =
          document.getElementById(
            "sneaker-grid"
          );


        if (
          !grid
        ) {

          return;

        }


        grid.dataset.densityColumns =
          String(
            selectedColumns
          );


        /*
          Only the Grid uses this layout.
          3D keeps the selected value but does not change it.
        */
        if (
          !grid.querySelector(
            ".sneaker-3d-gallery"
          )
        ) {

          grid.style.setProperty(
            "grid-template-columns",
            `repeat(${selectedColumns}, minmax(0, 1fr))`,
            "important"
          );

        }

      };


    const setColumns =
      nextValue => {

        selectedColumns =
          clamp(
            Number(nextValue),
            1,
            5
          );


        localStorage.setItem(
          "locan_sneaker_density_final",
          String(
            selectedColumns
          )
        );


        updateVisual();
        applyGridColumns();

      };


    const syncMode =
      () => {

        const grid =
          document.getElementById(
            "sneaker-grid"
          );


        const is3D =
          Boolean(
            grid?.querySelector(
              ".sneaker-3d-gallery"
            )
          );


        control.classList.toggle(
          "is-disabled",
          is3D
        );


        control.setAttribute(
          "aria-disabled",
          is3D
            ? "true"
            : "false"
        );


        [
          minus,
          range,
          plus
        ]
          .forEach(
            element => {

              element.disabled =
                is3D;

            }
          );


        /*
          Critical fix:
          switching mode NEVER rewrites range.value.
          It only enables/disables the control.
        */
        updateVisual();


        if (
          !is3D
        ) {

          applyGridColumns();

        }

      };


    range.addEventListener(
      "input",
      event => {

        setColumns(
          event.target.value
        );

      }
    );


    minus.addEventListener(
      "click",
      () => {

        setColumns(
          selectedColumns - 1
        );

      }
    );


    plus.addEventListener(
      "click",
      () => {

        setColumns(
          selectedColumns + 1
        );

      }
    );


    const grid =
      document.getElementById(
        "sneaker-grid"
      );


    if (
      grid
    ) {

      const observer =
        new MutationObserver(
          () => {

            /*
              main.js / 3D rendering replaces grid children.
              Re-apply OUR saved layout after every render.
            */
            requestAnimationFrame(
              () => {

                syncMode();

              }
            );

          }
        );


      observer.observe(
        grid,
        {
          childList:
            true,

          subtree:
            false
        }
      );

    }


    updateAccessibleText();
    updateVisual();
    applyGridColumns();
    syncMode();


    return control;

  }


  function arrangeControls() {

    const row =
      document.getElementById(
        "collection-display-row"
      );


    const density =
      document.getElementById(
        "sneaker-density-control-final"
      )
      ||
      document.getElementById(
        "grid-density-control"
      );


    const toggle =
      document.getElementById(
        "collection-3d-toggle"
      );


    const count =
      document.getElementById(
        "collection-count"
      );


    if (
      !row
      ||
      !density
      ||
      !toggle
      ||
      !count
    ) {

      return false;

    }


    row
      .querySelector(
        ".collection-display-spacer"
      )
      ?.remove();


    row.classList.add(
      "unified-display-toolbar"
    );

    density.classList.add(
      "unified-density-control"
    );

    toggle.classList.add(
      "unified-view-toggle"
    );

    count.classList.add(
      "unified-count"
    );


    row.append(
      density,
      toggle,
      count
    );


    if (
      density.id !==
      "sneaker-density-control-final"
    ) {

      buildOwnedDensityControl(
        density
      );

    }


    return true;

  }


  /* =====================================================
     RESULT SIGNATURE
  ===================================================== */

  function signature(
    items
  ) {

    return items

      .map(
        item =>
          String(
            item.id || ""
          )
      )

      .join(
        "||"
      );

  }


  /* =====================================================
     3D POSITION HELPERS
  ===================================================== */

  function relative(
    index,
    center,
    length
  ) {

    let difference =
      index - center;


    if (
      difference >
      length / 2
    ) {

      difference -=
        length;

    }


    if (
      difference <
      -length / 2
    ) {

      difference +=
        length;

    }


    return difference;

  }


  function spacing() {

    const stage =
      document.getElementById(
        "sneaker-3d-stage"
      );


    const width =
      stage?.clientWidth
      ||
      window.innerWidth;


    return clamp(

      width * 0.30,

      215,

      350

    );

  }


  /* =====================================================
     DIRECT 3D CALIBRATION

     These three legacy images have unusual transparent-canvas
     proportions. Their 3D sizing is owned directly by this
     renderer, independent of CatalogDisplay detection.
  ===================================================== */

  function direct3DCalibrationKey(
    sneaker
  ) {

    const values = [

      sneaker?.id,

      sneaker?.image,

      typeof sneaker?.title === "string"
        ? sneaker.title
        : sneaker?.title?.vi,

      sneaker?.title?.en

    ];


    const corpus = values

      .filter(Boolean)

      .join(" ")

      .toLowerCase()

      .replace(
        /[_-]+/g,
        " "
      )

      .replace(
        /\s+/g,
        " "
      );


    if (
      corpus.includes(
        "new balance 2002r"
      )
    ) {

      return "nb-2002r";

    }


    if (

      corpus.includes(
        "reverse bred"
      )

      ||

      (
        corpus.includes(
          "jordan 1 low"
        )

        &&

        corpus.includes(
          "bred"
        )
      )

    ) {

      return "reverse-bred";

    }


    if (

      corpus.includes(
        "balenciaga"
      )

      &&

      corpus.includes(
        "defender"
      )

    ) {

      return "balenciaga-defender";

    }


    return "";

  }


  function installDirect3DCalibrationStyles() {

    document
      .getElementById(
        "locan-direct-3d-calibration-v21"
      )
      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "locan-direct-3d-calibration-v21";


    style.textContent = `

      /*
        These rules affect ONLY the three named images inside
        Sneakers 3D View. Grid View remains completely untouched.

        scale: 1 1 neutralizes CatalogDisplay's individual-scale
        property. transform: scale(...) then becomes the single
        source of truth for these three 3D images.
      */

      .sneaker-3d-image
      img[data-3d-calibration="nb-2002r"] {

        scale:
          1 1
          !important;

        transform:
          scale(
            .50,
            .50
          )
          !important;

        transform-origin:
          center center
          !important;

      }


      .sneaker-3d-image
      img[data-3d-calibration="reverse-bred"] {

        scale:
          1 1
          !important;

        transform:
          scale(
            .50,
            .50
          )
          !important;

        transform-origin:
          center center
          !important;

      }


      .sneaker-3d-image
      img[data-3d-calibration="balenciaga-defender"] {

        scale:
          1 1
          !important;

        transform:
          scale(
            1,
            .78
          )
          !important;

        transform-origin:
          center center
          !important;

      }


      @media
      (
        max-width:
        650px
      ) {

        .sneaker-3d-image
        img[data-3d-calibration="nb-2002r"],

        .sneaker-3d-image
        img[data-3d-calibration="reverse-bred"] {

          transform:
            scale(
              .44,
              .44
            )
            !important;

        }


        .sneaker-3d-image
        img[data-3d-calibration="balenciaga-defender"] {

          transform:
            scale(
              .80,
              .64
            )
            !important;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =====================================================
     3D CARD
  ===================================================== */

  function patchedCard(
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


    const directCalibration =
      direct3DCalibrationKey(
        sneaker
      );


    const imageStyle =
      typeof getSneakerDisplayStyle === "function"
        ? getSneakerDisplayStyle(sneaker)
        : "--shoe-scale-x:1;--shoe-scale-y:1;--shoe-x:0px;--shoe-y:0px;--shoe-fit:contain";


    return `

      <article

        class="sneaker-3d-card unified-3d-card"

        data-index="${index}"

        tabindex="0"

        role="button"

        aria-label="${escapeHTML(
          title
        )}"

      >


        <div class="sneaker-3d-image unified-3d-image">


          <img

            data-src="${escapeHTML(
              sneaker.image || ""
            )}"

            alt="${escapeHTML(
              title
            )}"

            decoding="async"

            draggable="false"

            data-sneaker-display="true"

            data-catalog-image="true"

            data-sneaker-id="${escapeHTML(
              sneaker.id || ""
            )}"

            data-3d-calibration="${escapeHTML(
              directCalibration
            )}"

            style="${escapeHTML(
              imageStyle
            )}"

          >


        </div>


        <div class="sneaker-3d-info unified-3d-info">


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


          <div class="sneaker-3d-meta unified-3d-meta">


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


  /* =====================================================
     LAZY LOAD NEARBY IMAGES
  ===================================================== */

  function loadNear(
    card,
    relativePosition
  ) {

    if (
      Math.abs(
        relativePosition
      ) > 3.2
    ) {

      return;

    }


    const image =
      card.querySelector(
        "img[data-src]"
      );


    if (

      image

      &&

      !image.getAttribute(
        "src"
      )

      &&

      image.dataset.src

    ) {

      image.src =
        image.dataset.src;

    }

  }


  /* =====================================================
     UPDATE 3D POSITIONS
  ===================================================== */

  function updatePositions(
    progress = 0,
    animate = true
  ) {

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

      ||

      !slideItems.length

    ) {

      return;

    }


    gallery
      .classList
      .toggle(

        "is-dragging",

        !animate

      );


    const gap =
      spacing();


    stage

      .querySelectorAll(
        ".sneaker-3d-card"
      )

      .forEach(
        card => {


          const index =
            parseInt(
              card.dataset.index,
              10
            );


          const r =

            relative(

              index,

              slideIndex,

              slideItems.length

            )

            +

            progress;


          const absolute =
            Math.abs(
              r
            );


          loadNear(
            card,
            r
          );


          const x =
            r * gap;


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

              -r * 27,

              -48,

              48

            );


          const scale =
            clamp(

              1
              -
              absolute * 0.16,

              0.56,

              1

            );


          const opacity =

            absolute > 1.55

              ? 0

              : clamp(

                  1
                  -
                  absolute * 0.30,

                  0.18,

                  1

                );


          const brightness =
            clamp(

              1
              -
              absolute * 0.16,

              0.56,

              1

            );


          const saturation =
            clamp(

              1
              -
              absolute * 0.12,

              0.62,

              1

            );


          card.style.transform =

            `translate3d(`

            +

            `calc(-50% + ${x}px),`

            +

            `-50%,`

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

            absolute <= 1.55

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


  /* =====================================================
     SLIDE NAVIGATION
  ===================================================== */

  function move(
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


    updatePositions(
      0,
      true
    );

  }


  function moveTo(
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


    updatePositions(
      0,
      true
    );

  }


  /* =====================================================
     OPEN CENTER CARD
  ===================================================== */

  function openCenter() {

    const sneaker =
      slideItems[
        slideIndex
      ];


    if (
      sneaker
    ) {

      window.location.href =
        getDetailURL(
          sneaker
        );

    }

  }


  /* =====================================================
     DRAG
  ===================================================== */

  function resetDrag() {

    drag.active =
      false;


    drag.id =
      null;


    drag.dx =
      0;


    drag.vx =
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


  function scheduleFrame() {

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


          updatePositions(

            clamp(

              drag.dx
              /
              spacing(),

              -1.15,

              1.15

            ),

            false

          );

        }
      );

  }


  function finishDrag() {

    const gap =
      spacing();


    const shouldMove =

      Math.abs(
        drag.dx
      )

      >

      Math.min(

        72,

        gap * 0.22

      )

      ||

      Math.abs(
        drag.vx
      )

      >
      0.42;


    if (

      shouldMove

      &&

      Math.abs(
        drag.dx / gap
      )

      >
      0.08

    ) {

      slideIndex =
        wrapIndex(

          slideIndex

          +

          (
            drag.dx < 0

              ? 1

              : -1
          ),

          slideItems.length

        );


      slideActiveId =
        slideItems[
          slideIndex
        ]?.id
        ||
        null;

    }


    if (
      drag.moved
    ) {

      suppressClickUntil =

        performance.now()

        +

        260;

    }


    document

      .getElementById(
        "sneaker-3d-gallery"
      )

      ?.classList

      .remove(
        "is-dragging"
      );


    updatePositions(
      0,
      true
    );


    resetDrag();

  }


  /* =====================================================
     EVENTS
  ===================================================== */

  function bindEvents() {

    const gallery =
      document.getElementById(
        "sneaker-3d-gallery"
      );


    const stage =
      document.getElementById(
        "sneaker-3d-stage"
      );


    const previous =
      document.getElementById(
        "sneaker-3d-prev"
      );


    const next =
      document.getElementById(
        "sneaker-3d-next"
      );


    const more =
      document.getElementById(
        "sneaker-3d-open"
      );


    if (
      !gallery
      ||
      !stage
    ) {

      return;

    }


    [
      previous,
      next,
      more
    ]

      .filter(
        Boolean
      )

      .forEach(
        button => {


          [
            "pointerdown",
            "pointerup",
            "pointercancel"
          ]

            .forEach(
              type => {

                button.addEventListener(

                  type,

                  event => {

                    event.stopPropagation();

                  }

                );

              }
            );

        }

      );


    previous
      ?.addEventListener(

        "click",

        event => {

          event.preventDefault();

          event.stopPropagation();

          move(
            -1
          );

        }

      );


    next
      ?.addEventListener(

        "click",

        event => {

          event.preventDefault();

          event.stopPropagation();

          move(
            1
          );

        }

      );


    more
      ?.addEventListener(

        "click",

        event => {

          event.preventDefault();

          event.stopPropagation();

          openCenter();

        }

      );


    /* CLICK CENTER CARD */

    stage.addEventListener(

      "click",

      event => {


        if (
          performance.now()
          <
          suppressClickUntil
        ) {

          return;

        }


        const card =
          event.target.closest(
            ".sneaker-3d-card"
          );


        if (!card) {
          return;
        }


        const index =
          parseInt(
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


        if (
          index === slideIndex
        ) {

          openCenter();

        } else {

          moveTo(
            index
          );

        }

      }

    );


    stage.addEventListener(

      "keydown",

      event => {


        if (

          event.key !== "Enter"

          &&

          event.key !== " "

        ) {

          return;

        }


        const card =
          event.target.closest(
            ".sneaker-3d-card"
          );


        if (!card) {
          return;
        }


        event.preventDefault();


        const index =
          parseInt(
            card.dataset.index,
            10
          );


        if (
          Number.isFinite(
            index
          )
        ) {

          if (
            index === slideIndex
          ) {

            openCenter();

          } else {

            moveTo(
              index
            );

          }

        }

      }

    );


    /* KEYBOARD */

    gallery.addEventListener(

      "keydown",

      event => {


        if (
          event.key === "ArrowLeft"
        ) {

          event.preventDefault();

          move(
            -1
          );

        }


        if (
          event.key === "ArrowRight"
        ) {

          event.preventDefault();

          move(
            1
          );

        }

      }

    );


    /* POINTER DOWN */

    gallery.addEventListener(

      "pointerdown",

      event => {


        if (

          event.target.closest(
            ".sneaker-3d-nav,.sneaker-3d-open"
          )

        ) {

          return;

        }


        if (

          event.button !== undefined

          &&

          event.button !== 0

        ) {

          return;

        }


        drag = {

          active:
            true,

          id:
            event.pointerId,

          sx:
            event.clientX,

          sy:
            event.clientY,

          lx:
            event.clientX,

          lt:
            performance.now(),

          dx:
            0,

          vx:
            0,

          moved:
            false,

          raf:
            0

        };

      }

    );


    /* POINTER MOVE */

    gallery.addEventListener(

      "pointermove",

      event => {


        if (

          !drag.active

          ||

          event.pointerId !==
            drag.id

        ) {

          return;

        }


        const now =
          performance.now();


        const dx =
          event.clientX
          -
          drag.sx;


        const dy =
          event.clientY
          -
          drag.sy;


        if (
          !drag.moved
        ) {

          if (

            Math.abs(
              dx
            ) < 7

            &&

            Math.abs(
              dy
            ) < 7

          ) {

            return;

          }


          if (

            Math.abs(
              dy
            )

            >

            Math.abs(
              dx
            )

            *
            1.18

          ) {

            return;

          }


          drag.moved =
            true;


          try {

            gallery.setPointerCapture(
              event.pointerId
            );

          } catch (_) {}


          gallery.classList.add(
            "is-dragging"
          );

        }


        drag.dx =
          dx;


        const dt =
          Math.max(

            1,

            now
            -
            drag.lt

          );


        const instant =

          (
            event.clientX
            -
            drag.lx
          )

          /
          dt;


        drag.vx =

          drag.vx
          *
          0.72

          +

          instant
          *
          0.28;


        drag.lx =
          event.clientX;


        drag.lt =
          now;


        scheduleFrame();

      }

    );


    /* POINTER UP */

    gallery.addEventListener(

      "pointerup",

      event => {


        if (

          !drag.active

          ||

          event.pointerId !==
            drag.id

        ) {

          return;

        }


        if (
          drag.moved
        ) {

          finishDrag();

        } else {

          resetDrag();

        }

      }

    );


    gallery.addEventListener(

      "pointercancel",

      event => {


        if (

          !drag.active

          ||

          event.pointerId !==
            drag.id

        ) {

          return;

        }


        if (
          drag.moved
        ) {

          finishDrag();

        } else {

          resetDrag();

        }

      }

    );


    /* TRACKPAD */

    gallery.addEventListener(

      "wheel",

      event => {


        const horizontal =

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
          !horizontal
        ) {

          return;

        }


        event.preventDefault();


        const now =
          performance.now();


        if (
          now <
          wheelLockUntil
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


        wheelLockUntil =
          now + 380;


        move(

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


  /* =====================================================
     REPLACE ONLY 3D RENDERER
  ===================================================== */

  render3DGallery =
    function (
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


      const sig =
        signature(
          items
        );


      const changed =

        lastSignature !== ""

        &&

        sig !==
        lastSignature;


      const reset =

        forceReset

        ||

        changed;


      lastSignature =
        sig;


      forceReset =
        false;


      /* FILTER / SEARCH / SORT => RESULT #1 */

      if (
        reset
      ) {

        slideIndex =
          0;


        slideActiveId =
          items[0]?.id
          ||
          null;

      } else if (
        slideActiveId
      ) {

        const preserved =
          items.findIndex(

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

          items.length

        );


      slideActiveId =
        items[
          slideIndex
        ]?.id
        ||
        null;


      const t =
        text();


      grid.innerHTML = `

        <section

          id="sneaker-3d-gallery"

          class="sneaker-3d-gallery unified-3d-gallery"

          tabindex="0"

        >


          <button

            type="button"

            id="sneaker-3d-prev"

            class="
              sneaker-3d-nav
              sneaker-3d-prev
              unified-3d-nav
              unified-3d-prev
            "

            aria-label="${escapeHTML(
              t.prev
            )}"

          >

            ‹

          </button>


          <div

            id="sneaker-3d-stage"

            class="sneaker-3d-stage unified-3d-stage"

          >

            ${items
              .map(
                patchedCard
              )
              .join("")}

          </div>


          <button

            type="button"

            id="sneaker-3d-next"

            class="
              sneaker-3d-nav
              sneaker-3d-next
              unified-3d-nav
              unified-3d-next
            "

            aria-label="${escapeHTML(
              t.next
            )}"

          >

            ›

          </button>


          <div class="sneaker-3d-footer unified-3d-footer">


            <strong
              id="sneaker-3d-counter"
              class="unified-3d-counter"
            >

              ${slideIndex + 1}
              /
              ${items.length}

            </strong>


            <button

              type="button"

              id="sneaker-3d-open"

              class="sneaker-3d-open unified-3d-open"

              aria-label="${escapeHTML(
                t.moreAria
              )}"

            >

              ${escapeHTML(
                t.more
              )}

            </button>


          </div>


        </section>

      `;


      /*
        Critical:
        3D images are created dynamically by collection-view.js.
        Register them with CatalogDisplay BEFORE the lazy loader
        assigns img.src, so each pair receives its calibrated
        view3d / view3dMobile scale when the image loads.
      */
      window.CatalogDisplay
        ?.prepareWithin(
          grid
        );


      bindEvents();


      requestAnimationFrame(
        () => {


          if (
            reset
          ) {

            /*
              Give the reset a small visible
              rotation back into result #1.
            */

            updatePositions(

              0.48,

              false

            );


            requestAnimationFrame(
              () => {

                updatePositions(

                  0,

                  true

                );

              }
            );

          } else {

            updatePositions(

              0,

              false

            );


            requestAnimationFrame(
              () => {

                updatePositions(

                  0,

                  true

                );

              }
            );

          }

        }

      );

    };


  /* =====================================================
     FILTER / SEARCH / SORT RESET
  ===================================================== */

  function markReset(
    event
  ) {

    const target =
      event.target;


    if (
      !(
        target instanceof Element
      )
    ) {

      return;

    }


    if (

      target.closest(

        ".filter-chip,"
        +
        "#clear-filters,"
        +
        "#archive-search-clear"

      )

      ||

      target.matches(

        "#archive-search-input,"
        +
        "#sort-select"

      )

    ) {

      forceReset =
        true;


      slideIndex =
        0;


      slideActiveId =
        null;

    }

  }


  /* =====================================================
     INIT
  ===================================================== */

  function init() {

    installDirect3DCalibrationStyles();


    if (
      !arrangeControls()
    ) {

      requestAnimationFrame(
        arrangeControls
      );

    }


    document.addEventListener(

      "click",

      markReset,

      true

    );


    document.addEventListener(

      "input",

      markReset,

      true

    );


    document.addEventListener(

      "change",

      markReset,

      true

    );

  }


  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(

      "DOMContentLoaded",

      init,

      {
        once:
          true
      }

    );

  } else {

    init();

  }

})();