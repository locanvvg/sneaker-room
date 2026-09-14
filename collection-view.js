/* LỘC AN SNEAKER COLLECTION — collection-view.js v9 — CATALOG ENGINE */

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

  function arrangeControls() {

    const row =
      document.getElementById(
        "collection-display-row"
      );


    const density =
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


    row.append(
      density,
      toggle,
      count
    );


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

      width * 0.27,

      245,

      360

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


    const imageStyle =
      typeof getSneakerDisplayStyle === "function"
        ? getSneakerDisplayStyle(sneaker)
        : "--shoe-scale-x:1;--shoe-scale-y:1;--shoe-x:0px;--shoe-y:0px;--shoe-fit:contain";


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

            data-catalog-image="true"

            data-sneaker-id="${escapeHTML(
              sneaker.id || ""
            )}"

            style="${escapeHTML(
              imageStyle
            )}"

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

            absolute > 2.65

              ? 0

              : clamp(

                  1
                  -
                  absolute * 0.30,

                  0.10,

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
              t.prev
            )}"

          >

            ‹

          </button>


          <div

            id="sneaker-3d-stage"

            class="sneaker-3d-stage"

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
              ${items.length}

            </strong>


            <button

              type="button"

              id="sneaker-3d-open"

              class="sneaker-3d-open"

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
        Prepare Grid/3D image normalization immediately.
        Lazy-loaded 3D images already receive a load listener here.
      */
      if (
        window.CatalogDisplay
      ) {

        window.CatalogDisplay
          .prepareWithin(
            grid
          );

      }


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
     CSS PATCH
  ===================================================== */

  function installStyles() {

    document

      .getElementById(
        "collection-view-patch-v7"
      )

      ?.remove();


    const style =
      document.createElement(
        "style"
      );


    style.id =
      "collection-view-patch-v7";


    style.textContent = `

      /* DESKTOP:
         [ GRID SLIDER ] [ GRID/3D VIEW ] [ TOTAL ] */

      .collection-display-row {

        grid-template-columns:

          minmax(
            420px,
            1fr
          )

          142px

          max-content

          !important;

        gap:
          18px !important;

      }


      .collection-display-spacer {

        display:
          none !important;

      }


      .collection-display-row
      >
      #grid-density-control {

        justify-self:
          stretch !important;

        width:
          100% !important;

      }


      .collection-display-row
      >
      #collection-3d-toggle {

        justify-self:
          center !important;

        width:
          142px !important;

        min-height:
          48px !important;

        margin:
          0 !important;

      }


      .collection-display-row
      >
      #collection-count {

        justify-self:
          end !important;

        margin:
          0 !important;

        white-space:
          nowrap;

      }


      /* SMOOTH 3D */

      .sneaker-3d-card {

        will-change:

          transform,
          opacity,
          filter;

        transform-style:
          preserve-3d;

        transition:

          transform
          .46s
          cubic-bezier(
            .22,
            .78,
            .22,
            1
          ),

          opacity
          .34s ease,

          filter
          .34s ease,

          border-color
          .24s ease,

          box-shadow
          .24s ease

          !important;

      }


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
            .24
          )
          !important;

      }


      .sneaker-3d-nav {

        z-index:
          1000 !important;

        pointer-events:
          auto !important;

        touch-action:
          manipulation;

      }


      .sneaker-3d-image,

      .sneaker-3d-image img,

      .sneaker-3d-info {

        pointer-events:
          none;

      }


      /* COUNTER + XEM THÊM ONLY */

      .sneaker-3d-footer {

        z-index:
          1200 !important;

        gap:
          9px !important;

        pointer-events:
          none !important;

      }


      .sneaker-3d-open {

        pointer-events:
          auto;

        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        min-height:
          34px;

        padding:
          7px 12px;

        color:
          #8e929a;

        background:
          rgba(
            255,
            255,
            255,
            .025
          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .085
          );

        border-radius:
          999px;

        cursor:
          pointer;

        font:
          inherit;

        font-size:
          .58rem;

        font-weight:
          900;

        letter-spacing:
          .9px;

      }


      .sneaker-3d-open:hover {

        color:
          #ffcc00;

        border-color:
          rgba(
            255,
            204,
            0,
            .32
          );

        background:
          rgba(
            255,
            204,
            0,
            .045
          );

      }


      /* TABLET */

      @media
      (
        max-width:
        950px
      ) {

        .collection-display-row {

          grid-template-columns:

            minmax(
              300px,
              1fr
            )

            132px

            max-content

            !important;

          gap:
            12px !important;

        }


        .collection-display-row
        >
        #collection-3d-toggle {

          width:
            132px !important;

        }

      }


      /* MOBILE:
         TOTAL
         GRID / 3D VIEW
         GRID SLIDER */

      @media
      (
        max-width:
        650px
      ) {

        .collection-display-row {

          display:
            flex !important;

          flex-direction:
            column !important;

          gap:
            10px !important;

        }


        .collection-display-row
        >
        #collection-count {

          order:
            1;

          align-self:
            stretch;

          text-align:
            center;

        }


        .collection-display-row
        >
        #collection-3d-toggle {

          order:
            2;

          width:

            min(
              190px,
              100%
            )

            !important;

          align-self:
            center;

        }


        .collection-display-row
        >
        #grid-density-control {

          order:
            3;

          width:
            100% !important;

        }


        .sneaker-3d-nav {

          display:
            none !important;

        }


        .sneaker-3d-open {

          min-height:
            32px;

          padding:
            6px 11px;

          font-size:
            .56rem;

        }

      }

    `;


    document.head.appendChild(
      style
    );

  }


  /* =====================================================
     INIT
  ===================================================== */

  function init() {

    installStyles();


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