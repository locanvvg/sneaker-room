/* =========================================================
   LỘC AN — SNEAKER DISPLAY TUNING
   VERSION 13

   GRID:
   Giữ nguyên kích thước hiện tại vì Grid đã đẹp.

   3D:
   Hiệu chỉnh riêng để các đôi có cảm giác kích thước
   cân bằng với nhau hơn.

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

     TỪ SAU CHỈ CẦN CHỈNH SỐ TRONG PHẦN NÀY.
  ========================================================= */

  const TUNING = [


    /* =====================================================
       BAPE x STÜSSY

       GRID: giữ nguyên 0.90
       3D: tăng từ 0.78 -> 0.82
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
        scaleX: 0.82,
        scaleY: 0.82,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       NIKE x OFF-WHITE WAFFLE RACER

       GRID: giữ nguyên 0.88
       3D: tăng từ 0.76 -> 0.80
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
        scaleX: 0.80,
        scaleY: 0.80,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       JORDAN 4 BLACK CEMENT 1999

       Giữ nguyên.
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

       GRID: giữ nguyên 0.54
       3D: giảm mạnh hơn 0.44 -> 0.38
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
        scaleX: 0.38,
        scaleY: 0.38,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       JORDAN 1 LOW REVERSE BRED

       GRID: giữ nguyên 0.55
       3D: giảm 0.45 -> 0.40
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
        scaleX: 0.40,
        scaleY: 0.40,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       VANS KNU SKOOL

       Hiện tại giữ nguyên.
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
         ngang = 1.00
         cao   = 0.84

       3D:
         ngang = 1.00
         cao   = 0.60

       Chỉ ép chiều cao.
       Không làm hẹp chiều ngang.
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
        scaleY: 0.60,
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
     GET IMAGE INFORMATION

     Dùng:
     - alt
     - src
     - text gần ảnh

     để xác định đúng sneaker.
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
          "[class*='carousel']",
          "[class*='3d']"
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
  ========================================================= */

  function is3DImage(img) {


    /* -----------------------------------------------------
       Nếu nằm trong các container 3D rõ ràng
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
       Card Grid bình thường
    ----------------------------------------------------- */

    if (
      img.closest(".card")
    ) {

      return false;

    }


    /* -----------------------------------------------------
       Nếu nằm trong sneaker-grid nhưng không nằm trong
       .card thì coi như item được render bởi 3D mode.
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
       SCALE

       Dùng CSS individual "scale".
       Không ghi đè transform của hệ thống 3D.
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
       DEBUG DATA

       Khi Inspect image có thể thấy:

       data-locan-mode="grid"
       hoặc
       data-locan-mode="3d"
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
     APPLY ALL
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
     SCHEDULE
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

     Chế độ 3D có thể render / animation chậm hơn,
     nên apply lại vài lần.
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
       OBSERVER

       Theo dõi:
       - Grid render
       - 3D render
       - Search
       - Filter
       - Sort
       - Language
       - chuyển mode
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
       CLICK

       Hỗ trợ:
       - Grid / 3D
       - filter
       - sort
       - language
       - slider controls
    ----------------------------------------------------- */

    document.addEventListener(
      "click",
      applyAfterViewChange,
      true
    );


    /* -----------------------------------------------------
       KEYBOARD

       Hỗ trợ arrow navigation trong 3D.
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
       RESIZE
    ----------------------------------------------------- */

    window.addEventListener(
      "resize",
      applyAfterViewChange,
      {
        passive: true
      }
    );


    /* -----------------------------------------------------
       BACKUP PASSES
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
     DEBUG / MANUAL REAPPLY

     Có thể chạy trong Console:

     LocAnSneakerTuning.apply()

     Xem config:

     LocAnSneakerTuning.rules
  ========================================================= */

  window.LocAnSneakerTuning = {

    apply:
      applySneakerTuning,

    rules:
      TUNING

  };


  console.info(
    "Lộc An sneaker-display-tuning v13 loaded"
  );

})();
