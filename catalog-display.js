/* =========================================================
   LỘC AN — CATALOG DISPLAY ENGINE v1

   GOAL:
   - Existing calibrated shoes keep their current visual size.
   - New schemaVersion:2 shoes use AUTO FIT by default.
   - Grid + 3D use the exact same display result.
   - Manual override stays possible inside the sneaker object.

   Future new sneaker:
     autoFit is automatic.

   Only if Auto Fit is imperfect:
     display: {
       scaleX: 0.95,
       scaleY: 0.95,
       x: 0,
       y: 0
     }
   ========================================================= */

(() => {
  "use strict";

  const AUTO_TARGET = {
    width: 0.82,
    height: 0.68,
    minScale: 0.52,
    maxScale: 1.38,
    alphaThreshold: 18,
    sampleMax: 280
  };

  /*
    MIGRATION PRESETS:
    Preserve the current visual calibration of the shoes
    already tuned manually.

    Future shoes do NOT need to be added here.
  */
  const MIGRATION_PRESETS = [
    {
      any: [
        "bape x stussy",
        "bape x stüssy"
      ],
      scaleX: 0.90,
      scaleY: 0.90
    },

    {
      any: [
        "waffle racer",
        "off-white waffle"
      ],
      scaleX: 0.88,
      scaleY: 0.88
    },

    {
      all: [
        "jordan 4",
        "black cement"
      ],
      scaleX: 0.90,
      scaleY: 0.90
    },

    {
      all: [
        "new balance",
        "2002r"
      ],
      scaleX: 0.54,
      scaleY: 0.54
    },

    {
      all: [
        "jordan 1 low",
        "reverse bred"
      ],
      scaleX: 0.55,
      scaleY: 0.55
    },

    {
      all: [
        "vans",
        "knu skool"
      ],
      scaleX: 1.00,
      scaleY: 1.00
    },

    {
      all: [
        "balenciaga",
        "defender"
      ],
      scaleX: 1.00,
      scaleY: 0.84
    }
  ];

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[“”‘’]/g, "'")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function corpus(sneaker) {
    return normalize([
      sneaker?.id,
      sneaker?.title?.vi,
      sneaker?.title?.en,
      typeof sneaker?.title === "string"
        ? sneaker.title
        : "",
      sneaker?.image,
      ...(Array.isArray(sneaker?.images)
        ? sneaker.images
        : [])
    ]
      .filter(Boolean)
      .join(" "));
  }

  function matchesPreset(
    sneaker,
    preset
  ) {
    const text =
      corpus(sneaker);

    const any =
      Array.isArray(preset.any)
        ? preset.any
        : [];

    const all =
      Array.isArray(preset.all)
        ? preset.all
        : [];

    const anyOK =
      any.length === 0 ||
      any.some(keyword =>
        text.includes(
          normalize(keyword)
        )
      );

    const allOK =
      all.length === 0 ||
      all.every(keyword =>
        text.includes(
          normalize(keyword)
        )
      );

    return (
      (any.length > 0 || all.length > 0) &&
      anyOK &&
      allOK
    );
  }

  function migrationPreset(sneaker) {
    return (
      MIGRATION_PRESETS.find(
        preset =>
          matchesPreset(
            sneaker,
            preset
          )
      ) ||
      null
    );
  }

  function numeric(
    value,
    fallback
  ) {
    const number =
      Number(value);

    return Number.isFinite(number)
      ? number
      : fallback;
  }

  function manualDisplay(sneaker) {
    if (
      sneaker?.display &&
      typeof sneaker.display === "object"
    ) {
      return {
        scaleX:
          numeric(
            sneaker.display.scaleX ??
            sneaker.display.scale,
            1
          ),

        scaleY:
          numeric(
            sneaker.display.scaleY ??
            sneaker.display.scale,
            1
          ),

        x:
          numeric(
            sneaker.display.x,
            0
          ),

        y:
          numeric(
            sneaker.display.y,
            0
          )
      };
    }

    const preset =
      migrationPreset(sneaker);

    if (preset) {
      return {
        scaleX:
          numeric(
            preset.scaleX,
            1
          ),

        scaleY:
          numeric(
            preset.scaleY,
            1
          ),

        x:
          numeric(
            preset.x,
            0
          ),

        y:
          numeric(
            preset.y,
            0
          )
      };
    }

    return null;
  }

  function shouldAutoFit(sneaker) {
    if (manualDisplay(sneaker)) {
      return false;
    }

    return (
      sneaker?.autoFit === true ||
      sneaker?.display === "auto" ||
      sneaker?.schemaVersion >= 2
    );
  }

  function findSneaker(id) {
    if (
      typeof sneakers === "undefined" ||
      !Array.isArray(sneakers)
    ) {
      return null;
    }

    return (
      sneakers.find(
        item =>
          String(item.id) ===
          String(id)
      ) ||
      null
    );
  }

  function styleString(sneaker) {
    const display =
      manualDisplay(sneaker);

    if (!display) {
      return [
        "--shoe-scale-x:1",
        "--shoe-scale-y:1",
        "--shoe-x:0%",
        "--shoe-y:0%"
      ].join(";");
    }

    return [
      `--shoe-scale-x:${display.scaleX}`,
      `--shoe-scale-y:${display.scaleY}`,
      `--shoe-x:${display.x}%`,
      `--shoe-y:${display.y}%`
    ].join(";");
  }

  function installCSS() {
    document
      .getElementById(
        "locan-catalog-display-v1"
      )
      ?.remove();

    const style =
      document.createElement(
        "style"
      );

    style.id =
      "locan-catalog-display-v1";

    style.textContent = `
      .grid .card-img-wrapper
      img[data-catalog-image="true"],

      .sneaker-3d-image
      img[data-catalog-image="true"] {

        scale:
          var(--shoe-scale-x, 1)
          var(--shoe-scale-y, 1)
          !important;

        translate:
          var(--shoe-x, 0%)
          var(--shoe-y, 0%)
          !important;

        transform-origin:
          center center
          !important;

        object-fit:
          contain
          !important;

        object-position:
          center center
          !important;
      }

      .sneaker-3d-image
      img[data-catalog-image="true"] {

        width:
          100% !important;

        height:
          100% !important;

        max-width:
          none !important;

        max-height:
          none !important;

        margin:
          0 !important;
      }
    `;

    document.head.appendChild(
      style
    );
  }

  function alphaBounds(img) {
    const naturalWidth =
      img.naturalWidth;

    const naturalHeight =
      img.naturalHeight;

    if (
      !naturalWidth ||
      !naturalHeight
    ) {
      return null;
    }

    const sampleScale =
      Math.min(
        1,
        AUTO_TARGET.sampleMax /
        Math.max(
          naturalWidth,
          naturalHeight
        )
      );

    const width =
      Math.max(
        1,
        Math.round(
          naturalWidth *
          sampleScale
        )
      );

    const height =
      Math.max(
        1,
        Math.round(
          naturalHeight *
          sampleScale
        )
      );

    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width =
      width;

    canvas.height =
      height;

    const context =
      canvas.getContext(
        "2d",
        {
          willReadFrequently:
            true
        }
      );

    if (!context) {
      return null;
    }

    try {
      context.clearRect(
        0,
        0,
        width,
        height
      );

      context.drawImage(
        img,
        0,
        0,
        width,
        height
      );

      const data =
        context.getImageData(
          0,
          0,
          width,
          height
        ).data;

      let minX =
        width;

      let minY =
        height;

      let maxX =
        -1;

      let maxY =
        -1;

      const threshold =
        AUTO_TARGET.alphaThreshold;

      for (
        let y = 0;
        y < height;
        y += 1
      ) {
        for (
          let x = 0;
          x < width;
          x += 1
        ) {
          const alpha =
            data[
              (
                y * width +
                x
              ) * 4 +
              3
            ];

          if (
            alpha <= threshold
          ) {
            continue;
          }

          if (x < minX) {
            minX = x;
          }

          if (x > maxX) {
            maxX = x;
          }

          if (y < minY) {
            minY = y;
          }

          if (y > maxY) {
            maxY = y;
          }
        }
      }

      if (
        maxX < minX ||
        maxY < minY
      ) {
        return null;
      }

      return {
        left:
          minX / width,

        top:
          minY / height,

        right:
          (maxX + 1) / width,

        bottom:
          (maxY + 1) / height
      };

    } catch (error) {
      /*
        Same-origin GitHub Pages images should work.
        If a future external image blocks canvas access,
        simply fall back to scale 1.
      */
      console.warn(
        "[Catalog Display] Auto Fit skipped:",
        error
      );

      return null;
    }
  }

  function applyManual(
    img,
    display
  ) {
    img.style.setProperty(
      "--shoe-scale-x",
      String(display.scaleX)
    );

    img.style.setProperty(
      "--shoe-scale-y",
      String(display.scaleY)
    );

    img.style.setProperty(
      "--shoe-x",
      `${display.x}%`
    );

    img.style.setProperty(
      "--shoe-y",
      `${display.y}%`
    );

    img.dataset.catalogFit =
      "manual";
  }

  function applyAuto(
    img,
    sneaker
  ) {
    const bounds =
      alphaBounds(img);

    if (!bounds) {
      img.dataset.catalogFit =
        "fallback";

      return;
    }

    const rect =
      img.getBoundingClientRect();

    const elementWidth =
      rect.width;

    const elementHeight =
      rect.height;

    if (
      !elementWidth ||
      !elementHeight
    ) {
      requestAnimationFrame(
        () =>
          applyAuto(
            img,
            sneaker
          )
      );

      return;
    }

    const naturalWidth =
      img.naturalWidth;

    const naturalHeight =
      img.naturalHeight;

    const baseScale =
      Math.min(
        elementWidth /
        naturalWidth,

        elementHeight /
        naturalHeight
      );

    const renderedWidth =
      naturalWidth *
      baseScale;

    const renderedHeight =
      naturalHeight *
      baseScale;

    const offsetX =
      (
        elementWidth -
        renderedWidth
      ) / 2;

    const offsetY =
      (
        elementHeight -
        renderedHeight
      ) / 2;

    const bboxWidth =
      (
        bounds.right -
        bounds.left
      ) *
      renderedWidth;

    const bboxHeight =
      (
        bounds.bottom -
        bounds.top
      ) *
      renderedHeight;

    const targetWidth =
      elementWidth *
      AUTO_TARGET.width;

    const targetHeight =
      elementHeight *
      AUTO_TARGET.height;

    let fitScale =
      Math.min(
        targetWidth /
          Math.max(
            bboxWidth,
            1
          ),

        targetHeight /
          Math.max(
            bboxHeight,
            1
          )
      );

    fitScale =
      Math.max(
        AUTO_TARGET.minScale,

        Math.min(
          AUTO_TARGET.maxScale,
          fitScale
        )
      );

    const centerX =
      offsetX +
      (
        (
          bounds.left +
          bounds.right
        ) / 2
      ) *
      renderedWidth;

    const centerY =
      offsetY +
      (
        (
          bounds.top +
          bounds.bottom
        ) / 2
      ) *
      renderedHeight;

    /*
      Translate in percentages so the alignment remains
      proportional when the grid-density slider resizes cards.
    */
    const dxPercent =
      (
        (
          elementWidth / 2 -
          centerX
        ) /
        elementWidth
      ) * 100;

    const dyPercent =
      (
        (
          elementHeight / 2 -
          centerY
        ) /
        elementHeight
      ) * 100;

    img.style.setProperty(
      "--shoe-scale-x",
      String(fitScale)
    );

    img.style.setProperty(
      "--shoe-scale-y",
      String(fitScale)
    );

    img.style.setProperty(
      "--shoe-x",
      `${dxPercent}%`
    );

    img.style.setProperty(
      "--shoe-y",
      `${dyPercent}%`
    );

    img.dataset.catalogFit =
      "auto";

    img.dataset.catalogAutoScale =
      fitScale.toFixed(4);
  }

  function fitImage(img) {
    const id =
      img.dataset.sneakerId;

    const sneaker =
      findSneaker(id);

    if (!sneaker) {
      return;
    }

    const manual =
      manualDisplay(sneaker);

    if (manual) {
      applyManual(
        img,
        manual
      );

      return;
    }

    if (!shouldAutoFit(sneaker)) {
      img.dataset.catalogFit =
        "legacy-default";

      return;
    }

    if (
      !img.complete ||
      !img.naturalWidth ||
      !img.naturalHeight
    ) {
      return;
    }

    applyAuto(
      img,
      sneaker
    );
  }

  function prepareImage(img) {
    if (
      !img ||
      img.dataset.catalogPrepared ===
        "true"
    ) {
      return;
    }

    img.dataset.catalogPrepared =
      "true";

    img.addEventListener(
      "load",
      () =>
        requestAnimationFrame(
          () =>
            fitImage(img)
        )
    );

    if (
      img.complete &&
      img.naturalWidth
    ) {
      requestAnimationFrame(
        () =>
          fitImage(img)
      );
    }
  }

  function prepareWithin(root) {
    if (!root) return;

    root
      .querySelectorAll(
        'img[data-catalog-image="true"]'
      )
      .forEach(
        prepareImage
      );
  }

  /*
    GRID renderer override.
    Existing main.js filter/sort/search behavior stays intact.
  */
  function installGridRenderer() {
    if (
      typeof renderCard !==
      "function"
    ) {
      console.warn(
        "[Catalog Display] renderCard not found."
      );

      return;
    }

    renderCard =
      function catalogRenderCard(
        sneaker
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

        const detailURL =
          `./shoe.html?id=${encodeURIComponent(
            sneaker.id
          )}` +
          `&lang=${encodeURIComponent(
            currentLang
          )}`;

        const badge =
          edition
            ? `<span class="badge">${escapeHTML(
                edition
              )}</span>`
            : `<span class="badge badge-placeholder">&nbsp;</span>`;

        const initialStyle =
          styleString(
            sneaker
          );

        return `
          <a
            href="${detailURL}"
            class="card-link"
            aria-label="${escapeHTML(title)}"
          >
            <article
              class="card"
              data-sneaker-id="${escapeHTML(
                sneaker.id || ""
              )}"
            >

              <div class="card-img-wrapper">

                <img
                  src="${escapeHTML(
                    sneaker.image || ""
                  )}"
                  alt="${escapeHTML(title)}"
                  loading="lazy"
                  decoding="async"
                  data-catalog-image="true"
                  data-sneaker-id="${escapeHTML(
                    sneaker.id || ""
                  )}"
                  style="${escapeHTML(
                    initialStyle
                  )}"
                >

              </div>

              <div class="card-info">

                <h3>
                  ${escapeHTML(title)}
                </h3>

                <p class="subtitle">
                  ${escapeHTML(subtitle)}
                </p>

                <div class="card-meta">

                  ${badge}

                  <span class="size">
                    ${escapeHTML(
                      sneaker.size || ""
                    )}
                  </span>

                </div>

                <span class="card-cta">
                  ${translations[currentLang].viewMore}
                </span>

              </div>

            </article>
          </a>
        `;
      };

    if (
      typeof renderGrid ===
      "function"
    ) {
      const originalRenderGrid =
        renderGrid;

      renderGrid =
        function catalogRenderGrid() {
          const result =
            originalRenderGrid();

          requestAnimationFrame(
            () =>
              prepareWithin(
                document.getElementById(
                  "sneaker-grid"
                )
              )
          );

          return result;
        };
    }
  }

  installCSS();
  installGridRenderer();

  window.getSneakerDisplayStyle =
    styleString;

  window.CatalogDisplay = {
    prepareImage,
    prepareWithin,
    fitImage,
    styleString,
    manualDisplay,
    shouldAutoFit,
    presets:
      MIGRATION_PRESETS,
    autoTarget:
      AUTO_TARGET
  };

  console.info(
    "Lộc An catalog display engine v1 loaded"
  );
})();
