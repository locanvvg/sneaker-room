/* =========================================================
   LỘC AN — CATALOG DISPLAY ENGINE v4b — MOBILE 3D FINE TUNE

   PURPOSE
   -------
   1) GRID của các đôi cũ đã cân đẹp: GIỮ NGUYÊN.
   2) 3D: dùng visual bounding-box auto fit cho các đôi legacy
      đang lệch kích thước.
   3) Giày mới (schemaVersion: 2): Auto Fit ở cả Grid + 3D.
   4) Một đôi đặc biệt vẫn có thể override trong chính entry.

   WHY v2
   ------
   Cùng một "scale: 0.90" không có nghĩa Grid và 3D nhìn bằng
   nhau, vì khung ảnh của hai mode có kích thước/tỷ lệ khác nhau.

   v2 không cố dùng cùng một con số scale.
   v2 dùng cùng một MỤC TIÊU KÍCH THƯỚC THỊ GIÁC:
     transparent PNG
          ↓
     alpha bounding box
          ↓
     scale + center theo khung thật của mode
          ↓
     Grid / 3D nhìn cân hơn

   ========================================================= */

(() => {
  "use strict";


  /* =========================================================
     AUTO FIT TARGETS
  ========================================================= */

  const AUTO_TARGET = {

    grid: {
      width: 0.82,
      height: 0.68
    },

    view3d: {
      width: 0.80,
      height: 0.66
    },

    /*
      Phone 3D cards are narrower/taller than desktop cards.
      New schemaVersion:2 shoes therefore use a smaller
      visual target automatically on mobile.
    */
    view3dMobile: {
      width: 0.66,
      height: 0.54
    },

    minScale: 0.40,
    maxScale: 1.45,

    alphaThreshold: 18,

    /*
      Downsample before reading pixels.
      Keeps Auto Fit fast even with large PNG files.
    */
    sampleMax: 300
  };


  /* =========================================================
     LEGACY MIGRATION PRESETS

     GRID:
       Keep the values already calibrated by hand.

     3D:
       "auto" means:
       use actual transparent-pixel bounding box instead of
       blindly reusing the Grid scale.

     visualWeight:
       a small optical correction AFTER automatic measurement.
       This is only for already-existing legacy images.

       Future schemaVersion:2 shoes do NOT need to be added here.
  ========================================================= */

  const MIGRATION_PRESETS = [

    /* BAPE — legacy 3D exception */
    {
      any: [
        "bape x stussy",
        "bape x stüssy"
      ],

      grid: {
        scaleX: 0.90,
        scaleY: 0.90,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 0.68,
        scaleY: 0.68,
        x: 0,
        y: 0
      },

      view3dMobile: {
        scaleX: 0.53,
        scaleY: 0.53,
        x: 0,
        y: 0
      }
    },


    /* Off-White Waffle — legacy 3D exception */
    {
      any: [
        "waffle racer",
        "off-white waffle"
      ],

      grid: {
        scaleX: 0.88,
        scaleY: 0.88,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 0.70,
        scaleY: 0.70,
        x: 0,
        y: 0
      },

      view3dMobile: {
        scaleX: 0.55,
        scaleY: 0.55,
        x: 0,
        y: 0
      }
    },


    /* Jordan 4 Black Cement — legacy 3D exception */
    {
      all: [
        "jordan 4",
        "black cement"
      ],

      grid: {
        scaleX: 0.90,
        scaleY: 0.90,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 1.02,
        scaleY: 1.02,
        x: 0,
        y: 0
      },

      view3dMobile: {
        scaleX: 0.82,
        scaleY: 0.82,
        x: 0,
        y: 0
      }
    },


    /* New Balance 2002R — legacy 3D exception */
    {
      all: [
        "new balance",
        "2002r"
      ],

      grid: {
        scaleX: 0.54,
        scaleY: 0.54,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 0.78,
        scaleY: 0.78,
        x: 0,
        y: 0
      },

      view3dMobile: {
        scaleX: 0.60,
        scaleY: 0.60,
        x: 0,
        y: 0
      }
    },


    /* Reverse Bred — legacy 3D exception */
    {
      all: [
        "jordan 1 low",
        "reverse bred"
      ],

      grid: {
        scaleX: 0.55,
        scaleY: 0.55,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 0.78,
        scaleY: 0.78,
        x: 0,
        y: 0
      },

      view3dMobile: {
        scaleX: 0.60,
        scaleY: 0.60,
        x: 0,
        y: 0
      }
    },


    /* Vans — keep current calibration */
    {
      all: [
        "vans",
        "knu skool"
      ],

      grid: {
        scaleX: 1.00,
        scaleY: 1.00,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 1.00,
        scaleY: 1.00,
        x: 0,
        y: 0
      }
    },


    /*
      Balenciaga — keep the intentional height compression.
      scaleY 0.84 means: same width, shorter height.
    */
    {
      all: [
        "balenciaga",
        "defender"
      ],

      grid: {
        scaleX: 1.00,
        scaleY: 0.84,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 1.00,
        scaleY: 0.84,
        x: 0,
        y: 0
      },

      view3dMobile: {
        scaleX: 0.80,
        scaleY: 0.68,
        x: 0,
        y: 0
      }
    },


    /*
      Puma Speedcat — desktop is already visually correct.
      Only reduce it in phone 3D mode.
    */
    {
      all: [
        "puma",
        "speedcat"
      ],

      view3dMobile: {
        scaleX: 0.78,
        scaleY: 0.78,
        x: 0,
        y: 0
      }
    }

  ];


  /* =========================================================
     TEXT HELPERS
  ========================================================= */

  function normalize(value) {

    return String(value ?? "")

      .normalize("NFD")

      .replace(
        /[\u0300-\u036f]/g,
        ""
      )

      .replace(
        /[“”‘’]/g,
        "'"
      )

      .toLowerCase()

      .replace(
        /\s+/g,
        " "
      )

      .trim();

  }


  function corpus(sneaker) {

    return normalize(
      [

        sneaker?.id,

        sneaker?.title?.vi,

        sneaker?.title?.en,

        typeof sneaker?.title ===
          "string"
            ? sneaker.title
            : "",

        sneaker?.image,

        ...(
          Array.isArray(
            sneaker?.images
          )
            ? sneaker.images
            : []
        )

      ]

        .filter(Boolean)

        .join(" ")
    );

  }


  function matchesPreset(
    sneaker,
    preset
  ) {

    const text =
      corpus(sneaker);


    const any =
      Array.isArray(
        preset.any
      )
        ? preset.any
        : [];


    const all =
      Array.isArray(
        preset.all
      )
        ? preset.all
        : [];


    const anyOK =

      any.length === 0

      ||

      any.some(
        keyword =>
          text.includes(
            normalize(keyword)
          )
      );


    const allOK =

      all.length === 0

      ||

      all.every(
        keyword =>
          text.includes(
            normalize(keyword)
          )
      );


    return (

      (
        any.length > 0
        ||
        all.length > 0
      )

      &&

      anyOK

      &&

      allOK

    );

  }


  function migrationPreset(
    sneaker
  ) {

    return (

      MIGRATION_PRESETS.find(
        preset =>
          matchesPreset(
            sneaker,
            preset
          )
      )

      ||

      null

    );

  }


  function numeric(
    value,
    fallback
  ) {

    const number =
      Number(value);


    return Number.isFinite(
      number
    )
      ? number
      : fallback;

  }


  /* =========================================================
     MODE
  ========================================================= */

  function isMobile3DViewport() {

    return window.matchMedia(
      "(max-width: 650px)"
    ).matches;

  }


  function imageMode(img) {

    if (
      img.closest(
        ".sneaker-3d-image"
      )
    ) {

      return isMobile3DViewport()
        ? "view3dMobile"
        : "view3d";

    }


    return "grid";

  }


  /* =========================================================
     DISPLAY OVERRIDES

     New sneaker can use:

     display: {
       scaleX: 0.95,
       scaleY: 0.95,
       x: 0,
       y: 0
     }

     -> applies to BOTH modes.

     Or:

     display: {
       grid: {
         scaleX: 0.95,
         scaleY: 0.95
       },

       view3d: "auto"
     }

     -> separate behavior only when needed.
  ========================================================= */

  function normalizeDisplayObject(
    value
  ) {

    if (
      !value
      ||
      typeof value !==
        "object"
      ||
      Array.isArray(value)
    ) {

      return null;

    }


    return {

      scaleX:
        numeric(
          value.scaleX ??
          value.scale,
          1
        ),

      scaleY:
        numeric(
          value.scaleY ??
          value.scale,
          1
        ),

      x:
        numeric(
          value.x,
          0
        ),

      y:
        numeric(
          value.y,
          0
        )

    };

  }


  function inlineModeSetting(
    sneaker,
    mode
  ) {

    const display =
      sneaker?.display;


    if (
      display === "auto"
    ) {

      return "auto";

    }


    if (
      !display
      ||
      typeof display !==
        "object"
      ||
      Array.isArray(display)
    ) {

      return null;

    }


    const fallbackMode =
      mode === "view3dMobile"
        ? "view3d"
        : mode;


    const modeValue =
      display[mode] ??
      display[fallbackMode];


    if (
      modeValue ===
      "auto"
    ) {

      return "auto";

    }


    const modeObject =
      normalizeDisplayObject(
        modeValue
      );


    if (modeObject) {

      return modeObject;

    }


    /*
      Flat display object applies to both Grid + 3D.
    */

    if (

      "scale" in display

      ||

      "scaleX" in display

      ||

      "scaleY" in display

      ||

      "x" in display

      ||

      "y" in display

    ) {

      return normalizeDisplayObject(
        display
      );

    }


    return null;

  }


  function legacyModeSetting(
    sneaker,
    mode
  ) {

    const preset =
      migrationPreset(
        sneaker
      );


    if (!preset) {

      return null;

    }


    const fallbackMode =
      mode === "view3dMobile"
        ? "view3d"
        : mode;


    const modeValue =
      preset[mode] ??
      preset[fallbackMode];


    if (
      modeValue ===
      "auto"
    ) {

      return "auto";

    }


    return normalizeDisplayObject(
      modeValue
    );

  }


  function modeSetting(
    sneaker,
    mode
  ) {

    const inline =
      inlineModeSetting(
        sneaker,
        mode
      );


    if (inline) {

      return inline;

    }


    const legacy =
      legacyModeSetting(
        sneaker,
        mode
      );


    if (legacy) {

      return legacy;

    }


    /*
      Every new schemaVersion:2 sneaker gets Auto Fit
      by default in BOTH modes.
    */

    if (
      sneaker?.autoFit === true

      ||

      sneaker?.schemaVersion >= 2
    ) {

      return "auto";

    }


    /*
      Existing uncalibrated legacy entries:
      leave their old layout untouched.
    */

    return null;

  }


  function visualWeight(
    sneaker,
    mode
  ) {

    if (
      mode !== "view3d"
      &&
      mode !== "view3dMobile"
    ) {

      return 1;

    }


    const preset =
      migrationPreset(
        sneaker
      );


    return numeric(
      preset?.visualWeight3d,
      1
    );

  }


  /* =========================================================
     SNEAKER LOOKUP
  ========================================================= */

  function findSneaker(id) {

    if (

      typeof sneakers ===
        "undefined"

      ||

      !Array.isArray(
        sneakers
      )

    ) {

      return null;

    }


    return (

      sneakers.find(
        item =>
          String(item.id) ===
          String(id)
      )

      ||

      null

    );

  }


  /* =========================================================
     INITIAL INLINE STYLE
  ========================================================= */

  function styleString(
    sneaker
  ) {

    /*
      Initial neutral values.
      The exact mode-specific values are applied after the
      <img> exists in the Grid or 3D DOM.
    */

    return [
      "--shoe-scale-x:1",
      "--shoe-scale-y:1",
      "--shoe-x:0%",
      "--shoe-y:0%"
    ].join(";");

  }


  /* =========================================================
     CSS
  ========================================================= */

  function installCSS() {

    document

      .getElementById(
        "locan-catalog-display-v2"
      )

      ?.remove();


    /*
      Remove v1 style if browser has both during cache transition.
    */

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
      "locan-catalog-display-v2";


    style.textContent = `

      .grid
      .card-img-wrapper
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


  /* =========================================================
     ALPHA BOUNDING BOX

     Reads transparent pixels from PNG/WebP.
  ========================================================= */

  function alphaBounds(img) {

    const naturalWidth =
      img.naturalWidth;


    const naturalHeight =
      img.naturalHeight;


    if (

      !naturalWidth

      ||

      !naturalHeight

    ) {

      return null;

    }


    const sampleScale =
      Math.min(

        1,

        AUTO_TARGET.sampleMax
        /
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
        AUTO_TARGET
          .alphaThreshold;


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
              )
              *
              4
              +
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

        maxX < minX

        ||

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
          (maxX + 1)
          /
          width,

        bottom:
          (maxY + 1)
          /
          height

      };


    } catch (error) {

      console.warn(
        "[Catalog Display] Auto Fit skipped:",
        error
      );


      return null;

    }

  }


  /* =========================================================
     MANUAL DISPLAY
  ========================================================= */

  function applyManual(
    img,
    display,
    mode
  ) {

    img.style.setProperty(
      "--shoe-scale-x",
      String(
        display.scaleX
      )
    );


    img.style.setProperty(
      "--shoe-scale-y",
      String(
        display.scaleY
      )
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
      `manual-${mode}`;

  }


  /* =========================================================
     AUTO DISPLAY
  ========================================================= */

  function applyAuto(
    img,
    sneaker,
    mode
  ) {

    const bounds =
      alphaBounds(img);


    if (!bounds) {

      img.dataset.catalogFit =
        `fallback-${mode}`;


      return;

    }


    const rect =
      img.getBoundingClientRect();


    const elementWidth =
      rect.width;


    const elementHeight =
      rect.height;


    if (

      !elementWidth

      ||

      !elementHeight

    ) {

      requestAnimationFrame(
        () =>
          applyAuto(
            img,
            sneaker,
            mode
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
      )
      /
      2;


    const offsetY =
      (
        elementHeight -
        renderedHeight
      )
      /
      2;


    const bboxWidth =
      (
        bounds.right -
        bounds.left
      )
      *
      renderedWidth;


    const bboxHeight =
      (
        bounds.bottom -
        bounds.top
      )
      *
      renderedHeight;


    const target =
      AUTO_TARGET[
        mode
      ];


    const targetWidth =
      elementWidth *
      target.width;


    const targetHeight =
      elementHeight *
      target.height;


    let fitScale =
      Math.min(

        targetWidth
        /
        Math.max(
          bboxWidth,
          1
        ),

        targetHeight
        /
        Math.max(
          bboxHeight,
          1
        )

      );


    /*
      Small optical correction for existing legacy pairs.
      Future shoes normally use weight = 1.
    */

    fitScale *=
      visualWeight(
        sneaker,
        mode
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
      offsetX
      +
      (
        (
          bounds.left +
          bounds.right
        )
        /
        2
      )
      *
      renderedWidth;


    const centerY =
      offsetY
      +
      (
        (
          bounds.top +
          bounds.bottom
        )
        /
        2
      )
      *
      renderedHeight;


    const dxPercent =
      (
        (
          elementWidth / 2
          -
          centerX
        )
        /
        elementWidth
      )
      *
      100;


    const dyPercent =
      (
        (
          elementHeight / 2
          -
          centerY
        )
        /
        elementHeight
      )
      *
      100;


    img.style.setProperty(
      "--shoe-scale-x",
      String(
        fitScale
      )
    );


    img.style.setProperty(
      "--shoe-scale-y",
      String(
        fitScale
      )
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
      `auto-${mode}`;


    img.dataset.catalogAutoScale =
      fitScale.toFixed(4);

  }


  /* =========================================================
     FIT ONE IMAGE
  ========================================================= */

  function fitImage(img) {

    const id =
      img.dataset.sneakerId;


    const sneaker =
      findSneaker(id);


    if (!sneaker) {

      return;

    }


    const mode =
      imageMode(img);


    const setting =
      modeSetting(
        sneaker,
        mode
      );


    /*
      Existing legacy item with no migration rule:
      leave old behavior unchanged.
    */

    if (!setting) {

      img.dataset.catalogFit =
        `legacy-default-${mode}`;


      return;

    }


    if (
      setting === "auto"
    ) {

      if (

        !img.complete

        ||

        !img.naturalWidth

        ||

        !img.naturalHeight

      ) {

        return;

      }


      applyAuto(
        img,
        sneaker,
        mode
      );


      return;

    }


    applyManual(
      img,
      setting,
      mode
    );

  }


  /* =========================================================
     PREPARE IMAGES
  ========================================================= */

  function prepareImage(img) {

    if (!img) {

      return;

    }


    /*
      Always allow refit after Grid density / responsive
      layout changes, but bind load handler only once.
    */

    if (
      img.dataset
        .catalogPrepared !==
        "true"
    ) {

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

    }


    if (

      img.complete

      &&

      img.naturalWidth

    ) {

      requestAnimationFrame(
        () =>
          fitImage(img)
      );

    }

  }


  function prepareWithin(root) {

    if (!root) {

      return;

    }


    root

      .querySelectorAll(
        'img[data-catalog-image="true"]'
      )

      .forEach(
        prepareImage
      );

  }


  /* =========================================================
     GRID RENDERER OVERRIDE
  ========================================================= */

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
          )}`

          +

          `&lang=${encodeURIComponent(
            currentLang
          )}`;


        const badge =

          edition

            ?

            `<span class="badge">${escapeHTML(
              edition
            )}</span>`

            :

            `<span class="badge badge-placeholder">&nbsp;</span>`;


        return `

          <a

            href="${detailURL}"

            class="card-link"

            aria-label="${escapeHTML(
              title
            )}"

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

                  alt="${escapeHTML(
                    title
                  )}"

                  loading="lazy"

                  decoding="async"

                  data-catalog-image="true"

                  data-sneaker-id="${escapeHTML(
                    sneaker.id || ""
                  )}"

                  style="${escapeHTML(
                    styleString(
                      sneaker
                    )
                  )}"

                >


              </div>


              <div class="card-info">


                <h3>

                  ${escapeHTML(
                    title
                  )}

                </h3>


                <p class="subtitle">

                  ${escapeHTML(
                    subtitle
                  )}

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


  /* =========================================================
     REFIT AFTER RESIZE / GRID DENSITY
  ========================================================= */

  let resizeTimer =
    0;


  function refitVisibleImages() {

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      window.setTimeout(
        () => {

          prepareWithin(
            document.getElementById(
              "sneaker-grid"
            )
          );

        },
        80
      );

  }


  /* =========================================================
     INIT
  ========================================================= */

  installCSS();

  installGridRenderer();


  window.addEventListener(
    "resize",
    refitVisibleImages,
    {
      passive: true
    }
  );


  window.getSneakerDisplayStyle =
    styleString;


  window.CatalogDisplay = {

    prepareImage,

    prepareWithin,

    fitImage,

    styleString,

    modeSetting,

    migrationPreset,

    presets:
      MIGRATION_PRESETS,

    autoTarget:
      AUTO_TARGET

  };


  console.info(
    "Lộc An catalog display engine v4b loaded — mobile fine tune for Puma / Jordan 4 / Balenciaga"
  );

})();
