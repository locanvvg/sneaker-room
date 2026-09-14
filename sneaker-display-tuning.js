/* =========================================================
   LỘC AN — SNEAKER DISPLAY TUNING
   GRID + 3D INDEPENDENT VISUAL CALIBRATION

   GRID:
   Giữ nguyên kích thước đã chỉnh và đang đẹp.

   3D:
   Chỉ hiệu chỉnh những đôi đang nhìn quá lớn / quá cao.

   scaleX = chiều ngang
   scaleY = chiều cao

   x:
     + sang phải
     - sang trái

   y:
     + xuống
     - lên
   ========================================================= */

(() => {
  "use strict";


  /* =========================================================
     TUNING CONFIG

     Chỉ cần chỉnh số ở phần này về sau.
  ========================================================= */

  const TUNING = [


    /* =====================================================
       BAPE x STÜSSY
       Grid đang đẹp.
       3D hiện đang quá lớn -> giảm riêng 3D.
    ===================================================== */

    {
      match: [
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
        scaleX: 0.78,
        scaleY: 0.78,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       NIKE x OFF-WHITE WAFFLE RACER
       Grid đang đẹp.
       3D đang quá lớn.
    ===================================================== */

    {
      match: [
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
        scaleX: 0.76,
        scaleY: 0.76,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       JORDAN 4 BLACK CEMENT
       Hiện tại không có vấn đề.
       Giữ nguyên cả Grid và 3D.
    ===================================================== */

    {
      match: [
        "jordan 4 retro",
        "black cement"
      ],

      grid: {
        scaleX: 0.90,
        scaleY: 0.90,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 0.90,
        scaleY: 0.90,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       NEW BALANCE 2002R
       Grid = 0.54 đang đẹp.
       3D đang quá lớn -> giảm riêng.
    ===================================================== */

    {
      match: [
        "new balance 2002r"
      ],

      grid: {
        scaleX: 0.54,
        scaleY: 0.54,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 0.44,
        scaleY: 0.44,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       JORDAN 1 LOW REVERSE BRED
       Grid = 0.55 đang đẹp.
       3D đang quá lớn.
    ===================================================== */

    {
      match: [
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
        scaleX: 0.45,
        scaleY: 0.45,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       VANS KNU SKOOL
       Hiện tại ổn.
    ===================================================== */

    {
      match: [
        "vans knu skool"
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


    /* =====================================================
       BALENCIAGA DEFENDER

       GRID:
       ngang 100%
       cao 84%

       3D:
       ngang vẫn 100%
       chỉ ép chiều cao xuống 68%

       -> không làm đôi giày hẹp lại
       -> chỉ làm nó LÙN hơn
    ===================================================== */

    {
      match: [
        "balenciaga defender"
      ],

      grid: {
        scaleX: 1.00,
        scaleY: 0.84,
        x: 0,
        y: 0
      },

      view3d: {
        scaleX: 1.00,
        scaleY: 0.68,
        x: 0,
        y: 0
      }
    }

  ];


  /* =========================================================
     NORMALIZE TEXT
  ========================================================= */

  function normalize(value) {

    return String(value || "")

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


  /* =========================================================
     GET IMAGE TEXT

     Dùng:
     - alt
     - src
     - text trên card

     để nhận diện sneaker.
  ========================================================= */

  function getImageText(img) {

    const alt =
      normalize(
        img.getAttribute("alt")
      );


    const src =
      normalize(
        img.getAttribute("src")
      );


    const container =
      img.closest(
        [
          ".card",
          ".card-link",
          ".coverflow-card",
          ".gallery-card",
          ".slider-card",
          ".collection-3d-card",
          "[class*='coverflow']",
          "[class*='gallery']",
          "[class*='slider']",
          "[class*='carousel']"
        ].join(",")
      );


    const nearby =
      normalize(
        container?.textContent || ""
      );


    return (
      alt +
      " " +
      src +
      " " +
      nearby
    );

  }


  /* =========================================================
     FIND RULE
  ========================================================= */

  function findRule(img) {

    const text =
      getImageText(img);


    return TUNING.find(
      rule =>

        rule.match.some(
          keyword =>

            text.includes(
              normalize(keyword)
            )

        )
    );

  }


  /* =========================================================
     DETECT GRID / 3D

     Cấu trúc hiện tại:

     GRID:
       image nằm trong .card

     3D:
       image không nằm trong .card
       hoặc nằm trong coverflow / slider / 3D container
  ========================================================= */

  function is3DImage(img) {


    /* -----------------------------------------------------
       Các container 3D rõ ràng
    ----------------------------------------------------- */

    if (
      img.closest(
        [
          ".coverflow-card",
          ".gallery-card",
          ".slider-card",
          ".collection-3d-card",
          "[class*='coverflow']",
          "[class*='gallery']",
          "[class*='slider']",
          "[class*='carousel']",
          "[class*='3d']"
        ].join(",")
      )
    ) {

      return true;

    }


    /* -----------------------------------------------------
       Grid card chuẩn của site
    ----------------------------------------------------- */

    if (
      img.closest(".card")
    ) {

      return false;

    }


    /* -----------------------------------------------------
       Trong sneaker-grid nhưng không phải .card
       => 3D rendered item
    ----------------------------------------------------- */

    if (
      img.closest("#sneaker-grid")
    ) {

      return true;

    }


    return false;

  }


  /* =========================================================
     APPLY RULE
  ========================================================= */

  function applyRule(
    img,
    rule
  ) {

    const in3D =
      is3DImage(img);


    const values =
      in3D
        ? rule.view3d
        : rule.grid;


    if (!values) {
      return;
    }


    /* -----------------------------------------------------
       SIZE

       CSS individual scale property.
       Không đụng transform của card 3D.
    ----------------------------------------------------- */

    img.style.setProperty(
      "scale",

      `${values.scaleX} ${values.scaleY}`,

      "important"
    );


    /* -----------------------------------------------------
       POSITION
    ----------------------------------------------------- */

    img.style.setProperty(
      "translate",

      `${values.x}px ${values.y}px`,

      "important"
    );


    /* -----------------------------------------------------
       IMAGE FIT
    ----------------------------------------------------- */

    img.style.setProperty(
      "object-fit",
      "contain",
      "important"
    );


    img.style.setProperty(
      "object-position",
      "center center",
      "important"
    );


    img.style.setProperty(
      "transform-origin",
      "center center",
      "important"
    );


    /* -----------------------------------------------------
       DEBUG MARKERS

       Có thể Inspect ảnh để xem:
       data-locan-mode
       data-locan-scale-x
       data-locan-scale-y
    ----------------------------------------------------- */

    img.dataset.locanTuned =
      "true";


    img.dataset.locanMode =
      in3D
        ? "3d"
        : "grid";


    img.dataset.locanScaleX =
      String(
        values.scaleX
      );


    img.dataset.locanScaleY =
      String(
        values.scaleY
      );

  }


  /* =========================================================
     APPLY ALL TUNING
  ========================================================= */

  function applySneakerTuning() {

    const root =
      document.getElementById(
        "sneaker-grid"
      );


    if (!root) {
      return;
    }


    root
      .querySelectorAll("img")
      .forEach(
        img => {

          const rule =
            findRule(img);


          if (!rule) {
            return;
          }


          applyRule(
            img,
            rule
          );

        }
      );

  }


  /* =========================================================
     SCHEDULE APPLY
  ========================================================= */

  let scheduled =
    false;


  function scheduleApply() {

    if (scheduled) {
      return;
    }


    scheduled =
      true;


    requestAnimationFrame(
      () => {

        scheduled =
          false;


        applySneakerTuning();

      }
    );

  }


  /* =========================================================
     APPLY AFTER VIEW CHANGE

     3D có animation/render delay,
     nên chạy nhiều lần sau interaction.
  ========================================================= */

  function applyAfterViewChange() {

    scheduleApply();


    [
      40,
      100,
      180,
      300,
      500,
      800
    ]

      .forEach(
        delay => {

          setTimeout(
            applySneakerTuning,
            delay
          );

        }
      );

  }


  /* =========================================================
     INIT
  ========================================================= */

  function init() {


    /* -----------------------------------------------------
       Initial apply
    ----------------------------------------------------- */

    applySneakerTuning();


    /* -----------------------------------------------------
       DOM observer

       Theo dõi:
       - Grid render
       - 3D render
       - Search
       - Filter
       - Sort
       - Language
       - switch view
    ----------------------------------------------------- */

    const observer =
      new MutationObserver(
        mutations => {

          const relevant =
            mutations.some(
              mutation => {

                if (
                  mutation.type ===
                  "childList"
                ) {

                  return true;

                }


                if (
                  mutation.type ===
                    "attributes"

                  &&
                  mutation.attributeName ===
                    "class"
                ) {

                  return true;

                }


                return false;

              }
            );


          if (relevant) {

            scheduleApply();

          }

        }
      );


    observer.observe(
      document.body,
      {

        childList: true,

        subtree: true,

        attributes: true,

        attributeFilter: [
          "class"
        ]

      }
    );


    /* -----------------------------------------------------
       Click

       Bao gồm:
       - Grid / 3D
       - filter
       - sort
       - language
    ----------------------------------------------------- */

    document.addEventListener(
      "click",
      applyAfterViewChange,
      true
    );


    /* -----------------------------------------------------
       Keyboard

       Arrow trong 3D.
    ----------------------------------------------------- */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
            "ArrowLeft"

          ||

          event.key ===
            "ArrowRight"
        ) {

          applyAfterViewChange();

        }

      }
    );


    /* -----------------------------------------------------
       Window resize
    ----------------------------------------------------- */

    window.addEventListener(
      "resize",
      applyAfterViewChange,
      {
        passive: true
      }
    );


    /* -----------------------------------------------------
       Backup passes
    ----------------------------------------------------- */

    [
      50,
      100,
      250,
      500,
      1000,
      1600
    ]

      .forEach(
        delay => {

          setTimeout(
            applySneakerTuning,
            delay
          );

        }
      );

  }


  /* =========================================================
     START
  ========================================================= */

  if (
    document.readyState ===
      "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();

  }


  /* =========================================================
     MANUAL DEBUG

     Console:

     LocAnSneakerTuning.apply()

     hoặc:

     LocAnSneakerTuning.rules
  ========================================================= */

  window.LocAnSneakerTuning = {

    apply:
      applySneakerTuning,

    rules:
      TUNING

  };


  console.info(
    "Lộc An sneaker-display-tuning v12 loaded"
  );

})();
