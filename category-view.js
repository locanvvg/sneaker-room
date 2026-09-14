/* =========================================================
   LỘC AN — UNIVERSAL CATEGORY VIEW v8 — DENSE GRID DATA STATE
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

  function create(options) {
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

        const span =
          Math.max(
            1,
            densityMax - densityMin
          );

        const pct =
          (
            (
              densityColumns - densityMin
            )
            /
            span
          )
          *
          100;

        density.control.style.setProperty(
          "--density-pct",
          `${pct}%`
        );
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

      root.dataset.densityColumns =
        String(
          densityColumns
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
          class="category-3d-card unified-3d-card"
          data-index="${index}"
          tabindex="0"
          role="button"
          aria-label="${escapeHTML(
            title
          )}"
        >

          <div class="category-3d-image unified-3d-image">

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

          <div class="category-3d-info unified-3d-info">

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

            <div class="category-3d-meta unified-3d-meta">

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
              1.55
                ? 0
                : clamp(
                    1
                    -
                    absolute *
                    .30,
                    .18,
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
              1.55
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
        "category-3d-root unified-3d-root";

      root.style.removeProperty(
        "grid-template-columns"
      );

      const t =
        labels();

      root.innerHTML = `

        <section
          class="category-3d-gallery unified-3d-gallery"
          tabindex="0"
        >

          <button
            type="button"
            class="
              category-3d-nav
              category-3d-prev
              unified-3d-nav
              unified-3d-prev
            "
            aria-label="${escapeHTML(
              t.previous
            )}"
          >
            ‹
          </button>

          <div
            class="category-3d-stage unified-3d-stage"
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
              unified-3d-nav
              unified-3d-next
            "
            aria-label="${escapeHTML(
              t.next
            )}"
          >
            ›
          </button>

          <div
            class="category-3d-footer unified-3d-footer"
          >

            <strong
              class="category-3d-counter unified-3d-counter"
            >
              ${centerIndex + 1} / ${list.length}
            </strong>

            <button
              type="button"
              class="category-3d-open unified-3d-open"
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
