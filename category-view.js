/* =========================================================
   LỘC AN — UNIVERSAL CATEGORY VIEW v4 — MODE-AWARE GRID CONTROL
   Shared GRID / 3D gallery for:
   - LEGO
   - SNEAKER MASK

   No filters.
   No density slider.
   Data files stay unchanged.
   ========================================================= */

(() => {
  "use strict";

  const clamp = (value, min, max) =>
    Math.min(max, Math.max(min, value));

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function installStyles() {
    if (
      document.getElementById(
        "locan-category-view-v1"
      )
    ) {
      return;
    }

    const style =
      document.createElement("style");

    style.id =
      "locan-category-view-v1";

    style.textContent = `

      /* =====================================================
         GRID / 3D TOOLBAR
         MATCHES THE SNEAKERS CONTROL BAR
      ===================================================== */

      .category-view-toolbar {
        display:
          grid;

        grid-template-columns:
          minmax(
            420px,
            1fr
          )
          142px
          max-content;

        align-items:
          stretch;

        gap:
          18px;

        margin:
          18px
          0
          20px;
      }


      .category-view-toolbar
      .collection-count {
        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        min-height:
          48px;

        margin:
          0 !important;

        padding:
          0
          18px;

        color:
          #8d8d93;

        background:
          #171719;

        border:
          1px solid
          #2a2a2d;

        border-radius:
          10px;

        font-size:
          .62rem;

        font-weight:
          900;

        letter-spacing:
          .85px;

        white-space:
          nowrap;
      }


      /* =====================================================
         GRID DENSITY — SAME VISUAL LANGUAGE AS SNEAKERS
      ===================================================== */

      .category-grid-density {
        position:
          relative;

        display:
          grid;

        grid-template-columns:
          34px
          minmax(
            160px,
            1fr
          )
          34px;

        grid-template-rows:
          auto
          36px
          13px;

        align-items:
          center;

        column-gap:
          11px;

        row-gap:
          2px;

        width:
          100%;

        min-height:
          48px;

        padding:
          7px
          13px
          8px;

        background:
          #171719;

        border:
          1px solid
          #2a2a2d;

        border-radius:
          10px;
      }


      .category-grid-density::before {
        content:
          attr(data-density-label);

        grid-column:
          1 / -1;

        grid-row:
          1;

        justify-self:
          center;

        color:
          #77777e;

        font-size:
          .58rem;

        font-weight:
          900;

        letter-spacing:
          .85px;

        line-height:
          1;

        text-transform:
          uppercase;

        white-space:
          nowrap;
      }


      .category-density-button {
        appearance:
          none;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        width:
          30px;

        height:
          30px;

        padding:
          0;

        color:
          #77777e;

        background:
          #1b1b1e;

        border:
          1px solid
          #303034;

        border-radius:
          50%;

        cursor:
          pointer;

        font-size:
          .92rem;

        font-weight:
          900;

        line-height:
          1;

        transition:
          color
          .18s
          ease,
          border-color
          .18s
          ease,
          background
          .18s
          ease;
      }


      .category-density-button:first-of-type {
        grid-column:
          1;

        grid-row:
          2;
      }


      .category-density-button:last-of-type {
        grid-column:
          3;

        grid-row:
          2;
      }


      .category-density-button:hover,
      .category-density-button:focus-visible {
        color:
          #ffcc00;

        background:
          #202023;

        border-color:
          rgba(
            255,
            204,
            0,
            .32
          );

        outline:
          none;
      }


      .category-density-range {
        grid-column:
          2;

        grid-row:
          2;

        width:
          100%;

        height:
          18px;

        margin:
          0;

        accent-color:
          #ffcc00;

        cursor:
          pointer;
      }


      .category-density-ticks {
        grid-column:
          2;

        grid-row:
          3;

        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        padding:
          0
          1px;

        color:
          #4f4f55;

        font-size:
          .48rem;

        font-weight:
          800;

        line-height:
          1;

        pointer-events:
          none;
      }


      .category-density-value {
        display:
          none !important;
      }


      /* =====================================================
         VIEW TOGGLE — SAME SHAPE AS SNEAKERS
      ===================================================== */

      .category-view-toggle {
        display:
          inline-flex;

        align-items:
          center;

        justify-content:
          center;

        width:
          142px;

        min-height:
          48px;

        padding:
          0
          14px;

        color:
          #8d8d93;

        background:
          #171719;

        border:
          1px solid
          #2a2a2d;

        border-radius:
          10px;

        cursor:
          pointer;

        font-family:
          Arial,
          "Segoe UI",
          "Helvetica Neue",
          sans-serif;

        font-size:
          .60rem;

        font-weight:
          900;

        letter-spacing:
          .9px;

        transition:
          color
          .18s
          ease,
          border-color
          .18s
          ease,
          background
          .18s
          ease;
      }


      .category-view-toggle:hover,
      .category-view-toggle:focus-visible {
        color:
          #ffcc00;

        background:
          #1b1b1e;

        border-color:
          rgba(
            255,
            204,
            0,
            .32
          );

        outline:
          none;
      }


      @media
      (
        max-width:
        950px
      ) {

        .category-view-toolbar {
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


        .category-view-toggle {
          width:
            132px;
        }

      }


      /* MOBILE:
         TOTAL
         GRID / 3D VIEW
         GRID SLIDER
      */

      @media
      (
        max-width:
        650px
      ) {

        .category-view-toolbar {
          display:
            flex;

          flex-direction:
            column;

          gap:
            10px;
        }


        .category-view-toolbar
        .collection-count {
          order:
            1;

          align-self:
            stretch;

          text-align:
            center;
        }


        .category-view-toggle {
          order:
            2;

          align-self:
            center;

          width:
            min(
              190px,
              100%
            );
        }


        .category-grid-density {
          order:
            3;

          width:
            100%;
        }

      }



      /* =====================================================
         GRID CONTROL STATE
         GRID  = active
         3D    = muted + disabled
      ===================================================== */

      .category-grid-density {
        transition:
          opacity .22s ease,
          filter .22s ease,
          border-color .22s ease;
      }


      .category-grid-density.is-disabled,
      .category-grid-density[aria-disabled="true"] {
        opacity:
          .30;

        filter:
          grayscale(.45)
          saturate(.35);

        pointer-events:
          none;

        border-color:
          #232326;
      }


      .category-grid-density.is-disabled
      .category-density-range,
      .category-grid-density[aria-disabled="true"]
      .category-density-range {
        cursor:
          not-allowed;
      }


      .category-grid-density.is-disabled
      .category-density-button,
      .category-grid-density[aria-disabled="true"]
      .category-density-button {
        cursor:
          not-allowed;
      }


      /* =====================================================
         3D ROOT
      ===================================================== */

      .category-3d-root {
        width:
          100%;

        min-width:
          0;
      }


      .category-3d-gallery {
        position:
          relative;

        width:
          100%;

        min-height:
          580px;

        overflow:
          hidden;

        perspective:
          1450px;

        perspective-origin:
          center center;

        outline:
          none;

        touch-action:
          pan-y;
      }


      .category-3d-stage {
        position:
          relative;

        width:
          100%;

        height:
          520px;

        transform-style:
          preserve-3d;
      }


      .category-3d-card {
        position:
          absolute;

        top:
          50%;

        left:
          50%;

        width:
          min(
            370px,
            74vw
          );

        min-height:
          440px;

        overflow:
          hidden;

        color:
          #ededf0;

        background:
          linear-gradient(
            145deg,
            rgba(
              255,
              255,
              255,
              .055
            ),
            rgba(
              255,
              255,
              255,
              .018
            )
          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .09
          );

        border-radius:
          16px;

        box-shadow:
          0
          22px
          55px
          rgba(
            0,
            0,
            0,
            .35
          );

        cursor:
          pointer;

        transform-style:
          preserve-3d;

        will-change:
          transform,
          opacity,
          filter;

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
          .34s
          ease,
          filter
          .34s
          ease,
          border-color
          .24s
          ease,
          box-shadow
          .24s
          ease;
      }


      .category-3d-gallery.is-dragging
      .category-3d-card {
        transition:
          none !important;
      }


      .category-3d-card.is-center {
        border-color:
          rgba(
            255,
            204,
            0,
            .28
          );

        box-shadow:
          0
          28px
          68px
          rgba(
            0,
            0,
            0,
            .43
          );
      }


      .category-3d-image {
        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        width:
          100%;

        height:
          310px;

        padding:
          14px;

        background:
          #101012;

        pointer-events:
          none;
      }


      .category-3d-image img {
        display:
          block;

        width:
          100%;

        height:
          100%;

        object-fit:
          contain;

        object-position:
          center;

        user-select:
          none;

        -webkit-user-drag:
          none;
      }


      .category-3d-info {
        padding:
          18px
          20px
          20px;

        pointer-events:
          none;
      }


      .category-3d-info h3 {
        margin:
          0
          0
          8px;

        color:
          #f3f3f5;

        font-size:
          1rem;

        line-height:
          1.35;
      }


      .category-3d-info p {
        margin:
          0
          0
          14px;

        color:
          #8f8f96;

        font-size:
          .77rem;

        line-height:
          1.55;
      }


      .category-3d-meta {
        display:
          flex;

        align-items:
          center;

        justify-content:
          space-between;

        gap:
          12px;

        color:
          #9b9ba1;

        font-size:
          .67rem;

        font-weight:
          800;

        letter-spacing:
          .6px;
      }


      .category-3d-meta
      span:first-child {
        color:
          #ffcc00;
      }


      .category-3d-nav {
        position:
          absolute;

        top:
          45%;

        z-index:
          1000;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        width:
          44px;

        height:
          44px;

        padding:
          0;

        color:
          #aaaab0;

        background:
          rgba(
            15,
            15,
            17,
            .78
          );

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .11
          );

        border-radius:
          50%;

        cursor:
          pointer;

        font-size:
          1.55rem;

        line-height:
          1;

        transform:
          translateY(
            -50%
          );

        touch-action:
          manipulation;
      }


      .category-3d-nav:hover {
        color:
          #ffcc00;

        border-color:
          rgba(
            255,
            204,
            0,
            .32
          );
      }


      .category-3d-prev {
        left:
          10px;
      }


      .category-3d-next {
        right:
          10px;
      }


      .category-3d-footer {
        position:
          absolute;

        left:
          50%;

        bottom:
          4px;

        z-index:
          1200;

        display:
          flex;

        align-items:
          center;

        gap:
          9px;

        transform:
          translateX(
            -50%
          );

        pointer-events:
          none;
      }


      .category-3d-footer strong {
        color:
          #8d8d94;

        font-size:
          .68rem;

        letter-spacing:
          .7px;
      }


      .category-3d-open {
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
          7px
          12px;

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


      .category-3d-open:hover {
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


      /* =====================================================
         MOBILE
      ===================================================== */

      @media
      (
        max-width:
        650px
      ) {

        .category-view-toolbar {
          display:
            flex;

          flex-direction:
            column;

          align-items:
            stretch;

          gap:
            10px;
        }


        .category-view-toolbar
        .collection-count {
          order:
            1;

          align-self:
            stretch;

          text-align:
            center;
        }


        .category-view-toggle {
          order:
            2;

          align-self:
            center;

          min-width:
            150px;
        }


        .category-grid-density {
          order:
            3;

          width:
            100%;
        }


        .category-3d-gallery {
          min-height:
            535px;
        }


        .category-3d-stage {
          height:
            480px;
        }


        .category-3d-card {
          width:
            min(
              78vw,
              345px
            );

          min-height:
            410px;
        }


        .category-3d-image {
          height:
            285px;

          padding:
            12px;
        }


        .category-3d-info {
          padding:
            15px
            17px
            18px;
        }


        .category-3d-nav {
          display:
            none !important;
        }


        .category-3d-open {
          min-height:
            32px;

          padding:
            6px
            11px;

          font-size:
            .56rem;
        }

      }

    `;

    document.head.appendChild(
      style
    );
  }


  function create(options) {
    installStyles();

    const {
      key,
      root,
      toggle,
      items,
      getLanguage,
      getTitle,
      getSubtitle,
      getImage,
      getMetaPrimary,
      getMetaSecondary,
      getURL,
      renderGridCard,
      density
    } = options;

    if (!root || !toggle) {
      throw new Error(
        "Lộc An Category View: root/toggle missing."
      );
    }

    const list =
      Array.isArray(items)
        ? items
        : [];

    const storageKey =
      `locan_category_view_${key}`;

    let mode =
      localStorage.getItem(
        storageKey
      ) === "3d"
        ? "3d"
        : "grid";

    let centerIndex =
      0;


    const densityStorageKey =
      `locan_category_density_${key}`;


    const densityMin =
      Number(
        density?.min ??
        1
      );


    const densityMax =
      Number(
        density?.max ??
        5
      );


    const densityDefault =
      Number(
        density?.defaultColumns ??
        2
      );


    let densityColumns =
      clamp(
        Number(
          localStorage.getItem(
            densityStorageKey
          )
        )
        ||
        densityDefault,
        densityMin,
        densityMax
      );


    let drag = {
      active: false,
      id: null,
      startX: 0,
      startY: 0,
      lastX: 0,
      lastTime: 0,
      dx: 0,
      vx: 0,
      moved: false,
      raf: 0
    };

    let suppressClickUntil =
      0;


    function language() {
      const value =
        getLanguage?.();

      return value === "en"
        ? "en"
        : "vi";
    }


    function labels() {
      return language() === "vi"
        ? {
            switchTo3D:
              "CHẾ ĐỘ 3D",

            switchToGrid:
              "CHẾ ĐỘ LƯỚI",

            previous:
              "Hiện vật trước",

            next:
              "Hiện vật tiếp theo",

            more:
              "☝ XEM THÊM",

            moreAria:
              "Mở hồ sơ hiện vật ở giữa"
          }
        : {
            switchTo3D:
              "3D VIEW",

            switchToGrid:
              "GRID VIEW",

            previous:
              "Previous object",

            next:
              "Next object",

            more:
              "☝ VIEW MORE",

            moreAria:
              "Open the object in the center"
          };
    }


    function densityLabel() {
      return language() === "vi"
        ? `${densityColumns} CỘT`
        : `${densityColumns} COL`;
    }


    function updateDensityUI() {
      if (!density) {
        return;
      }

      if (density.range) {
        density.range.value =
          String(
            densityColumns
          );
      }

      if (density.value) {
        density.value.textContent =
          densityLabel();
      }

      if (density.control) {
        density.control.dataset.densityLabel =
          language() === "vi"
            ? `LƯỚI · ${densityColumns} CỘT`
            : `GRID · ${densityColumns} COL`;
      }
    }


    function applyGridDensity() {
      if (!density) {
        return;
      }

      localStorage.setItem(
        densityStorageKey,
        String(
          densityColumns
        )
      );

      root.style
        .setProperty(
          "grid-template-columns",
          `repeat(${densityColumns}, minmax(0, 1fr))`,
          "important"
        );

      updateDensityUI();
    }


    function setDensity(nextValue) {
      densityColumns =
        clamp(
          Number(nextValue),
          densityMin,
          densityMax
        );

      updateDensityUI();

      if (
        mode === "grid"
      ) {
        applyGridDensity();
      }
    }


    function bindDensity() {
      if (!density) {
        return;
      }

      density.range
        ?.addEventListener(
          "input",
          event => {
            setDensity(
              event.target.value
            );
          }
        );

      density.minus
        ?.addEventListener(
          "click",
          () => {
            setDensity(
              densityColumns - 1
            );
          }
        );

      density.plus
        ?.addEventListener(
          "click",
          () => {
            setDensity(
              densityColumns + 1
            );
          }
        );

      updateDensityUI();
    }


    function updateDensityModeState() {
      if (!density) {
        return;
      }

      const disabled =
        mode === "3d";

      density.control
        ?.classList
        .toggle(
          "is-disabled",
          disabled
        );

      density.control
        ?.setAttribute(
          "aria-disabled",
          disabled
            ? "true"
            : "false"
        );

      [
        density.range,
        density.minus,
        density.plus
      ]
        .filter(Boolean)
        .forEach(
          element => {
            element.disabled =
              disabled;

            element.setAttribute(
              "aria-disabled",
              disabled
                ? "true"
                : "false"
            );
          }
        );
    }


    function updateToggle() {
      const t =
        labels();

      toggle.textContent =
        mode === "grid"
          ? t.switchTo3D
          : t.switchToGrid;

      toggle.setAttribute(
        "aria-pressed",
        mode === "3d"
          ? "true"
          : "false"
      );
    }


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
      const width =
        root.clientWidth ||
        window.innerWidth;

      return clamp(
        width * .30,
        215,
        350
      );
    }


    function wrapIndex(index) {
      if (!list.length) {
        return 0;
      }

      return (
        (
          index %
          list.length
        )
        +
        list.length
      )
      %
      list.length;
    }


    function openCenter() {
      const item =
        list[
          centerIndex
        ];

      if (!item) {
        return;
      }

      const url =
        getURL?.(
          item
        );

      if (url) {
        window.location.href =
          url;
      }
    }


    function renderGrid() {
      root.className =
        root.dataset.gridClass ||
        "grid";

      root.innerHTML =
        "";

      applyGridDensity();

      list.forEach(
        (item, index) => {
          const node =
            renderGridCard?.(
              item,
              index
            );

          if (
            node instanceof
            Node
          ) {
            root.appendChild(
              node
            );
          }
        }
      );
    }


    function cardHTML(
      item,
      index
    ) {
      const title =
        getTitle?.(
          item
        ) || "";

      const subtitle =
        getSubtitle?.(
          item
        ) || "";

      const image =
        getImage?.(
          item
        ) || "";

      const primary =
        getMetaPrimary?.(
          item
        ) || "";

      const secondary =
        getMetaSecondary?.(
          item
        ) || "";

      return `

        <article
          class="category-3d-card"
          data-index="${index}"
          tabindex="0"
          role="button"
          aria-label="${escapeHTML(
            title
          )}"
        >

          <div class="category-3d-image">

            <img
              data-src="${escapeHTML(
                image
              )}"
              alt="${escapeHTML(
                title
              )}"
              decoding="async"
              draggable="false"
            >

          </div>

          <div class="category-3d-info">

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

            <div class="category-3d-meta">

              <span>
                ${escapeHTML(
                  primary
                )}
              </span>

              <small>
                ${escapeHTML(
                  secondary
                )}
              </small>

            </div>

          </div>

        </article>

      `;
    }


    function loadNear(
      card,
      relativePosition
    ) {
      if (
        Math.abs(
          relativePosition
        ) >
        3.2
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


    function updatePositions(
      progress = 0,
      animate = true
    ) {
      const gallery =
        root.querySelector(
          ".category-3d-gallery"
        );

      const stage =
        root.querySelector(
          ".category-3d-stage"
        );

      if (
        !gallery
        ||
        !stage
        ||
        !list.length
      ) {
        return;
      }

      gallery.classList.toggle(
        "is-dragging",
        !animate
      );

      const gap =
        spacing();

      stage
        .querySelectorAll(
          ".category-3d-card"
        )
        .forEach(
          card => {
            const index =
              Number.parseInt(
                card.dataset.index,
                10
              );

            const r =
              relative(
                index,
                centerIndex,
                list.length
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
                absolute *
                .16,
                .56,
                1
              );

            const opacity =
              absolute >
              2.65
                ? 0
                : clamp(
                    1
                    -
                    absolute *
                    .30,
                    .10,
                    1
                  );

            const brightness =
              clamp(
                1
                -
                absolute *
                .16,
                .56,
                1
              );

            const saturation =
              clamp(
                1
                -
                absolute *
                .12,
                .62,
                1
              );

            card.style.transform =
              `translate3d(` +
              `calc(-50% + ${x}px),` +
              `-50%,` +
              `${z}px` +
              `) ` +
              `rotateY(${rotation}deg) ` +
              `scale(${scale})`;

            card.style.opacity =
              String(
                opacity
              );

            card.style.filter =
              `brightness(${brightness}) ` +
              `saturate(${saturation})`;

            card.style.zIndex =
              String(
                100
                -
                Math.round(
                  absolute *
                  12
                )
              );

            card.style.pointerEvents =
              absolute <=
              2.25
                ? "auto"
                : "none";

            card.classList.toggle(
              "is-center",
              absolute <
              .35
            );
          }
        );

      const counter =
        root.querySelector(
          ".category-3d-counter"
        );

      if (counter) {
        counter.textContent =
          `${centerIndex + 1} / ${list.length}`;
      }
    }


    function move(direction) {
      if (
        list.length <=
        1
      ) {
        return;
      }

      centerIndex =
        wrapIndex(
          centerIndex +
          direction
        );

      updatePositions(
        0,
        true
      );
    }


    function moveTo(index) {
      if (
        !list.length
      ) {
        return;
      }

      centerIndex =
        wrapIndex(
          index
        );

      updatePositions(
        0,
        true
      );
    }


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

            updatePositions(
              clamp(
                drag.dx /
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
          gap *
          .22
        )
        ||
        Math.abs(
          drag.vx
        )
        >
        .42;

      if (
        shouldMove
        &&
        Math.abs(
          drag.dx /
          gap
        )
        >
        .08
      ) {
        centerIndex =
          wrapIndex(
            centerIndex
            +
            (
              drag.dx <
              0
                ? 1
                : -1
            )
          );
      }

      if (
        drag.moved
      ) {
        suppressClickUntil =
          performance.now()
          +
          260;
      }

      root
        .querySelector(
          ".category-3d-gallery"
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


    function bind3DEvents() {
      const gallery =
        root.querySelector(
          ".category-3d-gallery"
        );

      const stage =
        root.querySelector(
          ".category-3d-stage"
        );

      const previous =
        root.querySelector(
          ".category-3d-prev"
        );

      const next =
        root.querySelector(
          ".category-3d-next"
        );

      const open =
        root.querySelector(
          ".category-3d-open"
        );

      if (
        !gallery
        ||
        !stage
      ) {
        return;
      }


      previous
        ?.addEventListener(
          "click",
          event => {
            event.preventDefault();
            event.stopPropagation();
            move(-1);
          }
        );


      next
        ?.addEventListener(
          "click",
          event => {
            event.preventDefault();
            event.stopPropagation();
            move(1);
          }
        );


      open
        ?.addEventListener(
          "click",
          event => {
            event.preventDefault();
            event.stopPropagation();
            openCenter();
          }
        );


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
              ".category-3d-card"
            );

          if (!card) {
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

          if (
            index ===
            centerIndex
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
            event.key !==
            "Enter"
            &&
            event.key !==
            " "
          ) {
            return;
          }

          const card =
            event.target.closest(
              ".category-3d-card"
            );

          if (!card) {
            return;
          }

          event.preventDefault();

          const index =
            Number.parseInt(
              card.dataset.index,
              10
            );

          if (
            Number.isFinite(
              index
            )
          ) {
            if (
              index ===
              centerIndex
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


      gallery.addEventListener(
        "keydown",
        event => {
          if (
            event.key ===
            "ArrowLeft"
          ) {
            event.preventDefault();
            move(-1);
          }

          if (
            event.key ===
            "ArrowRight"
          ) {
            event.preventDefault();
            move(1);
          }
        }
      );


      gallery.addEventListener(
        "pointerdown",
        event => {
          if (
            event.target.closest(
              ".category-3d-nav," +
              ".category-3d-open"
            )
          ) {
            return;
          }

          if (
            event.button !==
              undefined
            &&
            event.button !==
              0
          ) {
            return;
          }

          drag = {
            active: true,
            id: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            lastX: event.clientX,
            lastTime: performance.now(),
            dx: 0,
            vx: 0,
            moved: false,
            raf: 0
          };
        }
      );


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
            drag.startX;

          const dy =
            event.clientY
            -
            drag.startY;

          if (
            !drag.moved
          ) {
            if (
              Math.abs(dx) <
                7
              &&
              Math.abs(dy) <
                7
            ) {
              return;
            }

            if (
              Math.abs(dy)
              >
              Math.abs(dx)
              *
              1.18
            ) {
              return;
            }

            drag.moved =
              true;

            try {
              gallery
                .setPointerCapture(
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
              drag.lastTime
            );

          const instant =
            (
              event.clientX
              -
              drag.lastX
            )
            /
            dt;

          drag.vx =
            drag.vx *
            .72
            +
            instant *
            .28;

          drag.lastX =
            event.clientX;

          drag.lastTime =
            now;

          scheduleDragFrame();
        }
      );


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
    }


    function render3D() {
      root.className =
        "category-3d-root";

      root.style.removeProperty(
        "grid-template-columns"
      );

      const t =
        labels();

      root.innerHTML = `

        <section
          class="category-3d-gallery"
          tabindex="0"
        >

          <button
            type="button"
            class="
              category-3d-nav
              category-3d-prev
            "
            aria-label="${escapeHTML(
              t.previous
            )}"
          >
            ‹
          </button>

          <div
            class="category-3d-stage"
          >
            ${list
              .map(
                cardHTML
              )
              .join("")}
          </div>

          <button
            type="button"
            class="
              category-3d-nav
              category-3d-next
            "
            aria-label="${escapeHTML(
              t.next
            )}"
          >
            ›
          </button>

          <div
            class="category-3d-footer"
          >

            <strong
              class="category-3d-counter"
            >
              ${centerIndex + 1} / ${list.length}
            </strong>

            <button
              type="button"
              class="category-3d-open"
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

      bind3DEvents();

      requestAnimationFrame(
        () =>
          updatePositions(
            0,
            false
          )
      );
    }


    function render() {
      updateToggle();
      updateDensityModeState();

      if (
        mode === "3d"
      ) {
        render3D();
      } else {
        renderGrid();
      }
    }


    function setMode(nextMode) {
      mode =
        nextMode === "3d"
          ? "3d"
          : "grid";

      localStorage.setItem(
        storageKey,
        mode
      );

      render();
    }


    function setLanguage() {
      updateDensityUI();
      render();
    }


    toggle.addEventListener(
      "click",
      () => {
        setMode(
          mode === "grid"
            ? "3d"
            : "grid"
        );
      }
    );


    bindDensity();


    window.addEventListener(
      "resize",
      () => {
        if (
          mode === "3d"
        ) {
          requestAnimationFrame(
            () =>
              updatePositions(
                0,
                false
              )
          );
        }
      },
      {
        passive: true
      }
    );


    render();

    return {
      render,
      setMode,
      setLanguage,

      get mode() {
        return mode;
      }
    };
  }


  window.LocAnCategoryView = {
    create
  };

})();
