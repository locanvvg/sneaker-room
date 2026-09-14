/* =========================================================
   LỘC AN — SNEAKER DISPLAY TUNING
   SHARED SIZE — GRID + 3D

   QUY TẮC:
   - Grid và 3D dùng CHÍNH XÁC cùng một kích thước.
   - Không có scale riêng cho 3D.
   - Các giá trị bên dưới là các giá trị đã được chỉnh
     và chốt từ Grid.
   ========================================================= */

(() => {
  "use strict";


  /* =========================================================
     SNEAKER SIZE CONFIG

     scaleX = chiều ngang
     scaleY = chiều cao

     1.00 = 100%
     0.90 = 90%
     1.10 = 110%

     x:
       + sang phải
       - sang trái

     y:
       + xuống
       - lên

     QUAN TRỌNG:
     Các giá trị này được dùng CHUNG cho:
     - GRID
     - 3D
  ========================================================= */

  const TUNING = [

    /* =====================================================
       BAPE x STUSSY
    ===================================================== */
    {
      match: [
        "bape x stussy",
        "bape x stüssy"
      ],

      scaleX: 0.90,
      scaleY: 0.90,

      x: 0,
      y: 0
    },


    /* =====================================================
       OFF-WHITE WAFFLE RACER
    ===================================================== */
    {
      match: [
        "waffle racer",
        "off-white waffle"
      ],

      scaleX: 0.88,
      scaleY: 0.88,

      x: 0,
      y: 0
    },


    /* =====================================================
       JORDAN 4 BLACK CEMENT 1999
    ===================================================== */
    {
      match: [
        "jordan 4 retro",
        "black cement"
      ],

      scaleX: 0.90,
      scaleY: 0.90,

      x: 0,
      y: 0
    },


    /* =====================================================
       NEW BALANCE 2002R
    ===================================================== */
    {
      match: [
        "new balance 2002r"
      ],

      scaleX: 0.54,
      scaleY: 0.54,

      x: 0,
      y: 0
    },


    /* =====================================================
       JORDAN 1 LOW REVERSE BRED
    ===================================================== */
    {
      match: [
        "jordan 1 low",
        "reverse bred"
      ],

      scaleX: 0.55,
      scaleY: 0.55,

      x: 0,
      y: 0
    },


    /* =====================================================
       VANS KNU SKOOL
    ===================================================== */
    {
      match: [
        "vans knu skool"
      ],

      scaleX: 1.00,
      scaleY: 1.00,

      x: 0,
      y: 0
    },


    /* =====================================================
       BALENCIAGA DEFENDER

       Giữ chiều ngang 100%.
       Chiều cao 84%.
    ===================================================== */
    {
      match: [
        "balenciaga defender"
      ],

      scaleX: 1.00,
      scaleY: 0.84,

      x: 0,
      y: 0
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
     - card text

     để nhận diện chính xác đôi giày.
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
      alt
      + " "
      + src
      + " "
      + nearby
    );

  }


  /* =========================================================
     FIND TUNING RULE
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
     APPLY ONE SHARED SIZE

     QUAN TRỌNG:
     Không detect Grid / 3D ở đây.

     Grid và 3D đều nhận CÙNG:
       scaleX
       scaleY
       x
       y
  ========================================================= */

  function applyRule(img, rule) {

    /*
      Đảm bảo image box giống nhau giữa các mode.
    */

    img.style.setProperty(
      "width",
      "100%",
      "important"
    );

    img.style.setProperty(
      "height",
      "100%",
      "important"
    );

    img.style.setProperty(
      "max-width",
      "none",
      "important"
    );

    img.style.setProperty(
      "max-height",
      "none",
      "important"
    );


    /*
      Không crop ảnh.
    */

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


    /*
      KÍCH THƯỚC CHUNG
      cho Grid + 3D.
    */

    img.style.setProperty(
      "scale",
      `${rule.scaleX} ${rule.scaleY}`,
      "important"
    );


    /*
      POSITION CHUNG
      cho Grid + 3D.
    */

    img.style.setProperty(
      "translate",
      `${rule.x}px ${rule.y}px`,
      "important"
    );


    img.style.setProperty(
      "transform-origin",
      "center center",
      "important"
    );


    /*
      Marker để kiểm tra DevTools.
    */

    img.dataset.locanTuned =
      "true";

    img.dataset.locanScaleX =
      String(rule.scaleX);

    img.dataset.locanScaleY =
      String(rule.scaleY);

  }


  /* =========================================================
     APPLY ALL
  ========================================================= */

  function applySneakerTuning() {

    document
      .querySelectorAll(
        "#sneaker-grid img"
      )
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
     SCHEDULER

     Tránh chạy quá nhiều lần cùng lúc.
  ========================================================= */

  let applyQueued =
    false;


  function scheduleApply() {

    if (applyQueued) {
      return;
    }


    applyQueued =
      true;


    requestAnimationFrame(
      () => {

        applyQueued =
          false;

        applySneakerTuning();

      }
    );

  }


  /* =========================================================
     INITIALIZE
  ========================================================= */

  function init() {

    /*
      Lần đầu.
    */

    applySneakerTuning();


    /* =====================================================
       DOM OBSERVER

       childList:
       - render Grid mới
       - render 3D mới
       - search
       - filter
       - sort
       - language

       attributes / class:
       - đổi Grid -> 3D
       - đổi 3D -> Grid
       - active card
    ===================================================== */

    const observer =
      new MutationObserver(
        mutations => {

          const relevant =
            mutations.some(
              mutation =>

                mutation.type ===
                  "childList"

                ||

                (
                  mutation.type ===
                    "attributes"

                  &&

                  mutation.attributeName ===
                    "class"
                )
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


    /* =====================================================
       EXTRA PASSES

       3D view có animation/render delay,
       nên áp lại vài lần.
    ===================================================== */

    [
      50,
      100,
      200,
      350,
      500,
      800,
      1200,
      1800
    ]

      .forEach(
        delay => {

          setTimeout(
            applySneakerTuning,
            delay
          );

        }
      );


    /* =====================================================
       USER INTERACTION

       Khi click nút Grid / 3D,
       filter, sort...
       áp lại sau animation.
    ===================================================== */

    document.addEventListener(
      "click",
      () => {

        requestAnimationFrame(
          scheduleApply
        );


        setTimeout(
          scheduleApply,
          80
        );


        setTimeout(
          scheduleApply,
          200
        );


        setTimeout(
          scheduleApply,
          400
        );

      },
      true
    );


    /* =====================================================
       RESIZE

       Desktop/mobile hoặc thay đổi viewport.
    ===================================================== */

    window.addEventListener(
      "resize",
      () => {

        scheduleApply();

      },
      {
        passive: true
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
     MANUAL DEBUG / REAPPLY

     Console:
     LocAnSneakerTuning.apply()
  ========================================================= */

  window.LocAnSneakerTuning = {

    apply:
      applySneakerTuning,

    tuning:
      TUNING

  };


  console.info(
    "Lộc An sneaker-display-tuning SHARED Grid/3D v10 loaded"
  );

})();
