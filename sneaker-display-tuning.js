/* =========================================================
   LỘC AN — SNEAKER DISPLAY TUNING
   SIMPLE / RELIABLE VERSION
   GRID + 3D
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     CHỈNH KÍCH THƯỚC Ở ĐÂY

     scaleX
       = chiều ngang

     scaleY
       = chiều cao

     1.00 = 100%
     0.90 = 90%
     1.10 = 110%

     x
       + sang phải
       - sang trái

     y
       + xuống
       - lên
  ========================================================= */

  const TUNING = [

    /* BAPE — nhỏ lại một chút */
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


    /* OFF-WHITE WAFFLE — nhỏ lại */
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


    /* JORDAN 4 BLACK CEMENT — nhỏ lại */
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


    /* NEW BALANCE — giảm đáng kể */
    {
      match: [
        "new balance 2002r"
      ],

      scaleX: 0.54,
      scaleY: 0.54,

      x: 0,
      y: 0
    },


    /* JORDAN 1 LOW — nhỏ hơn hiện tại */
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


    /* VANS — to lên */
    {
      match: [
        "vans knu skool"
      ],

      scaleX: 1.10,
      scaleY: 1.10,

      x: 0,
      y: 0
    },


    /* BALENCIAGA
       Giữ nguyên chiều ngang.
       ÉP CHIỀU CAO xuống còn 76%.
       Đây là "lùn lại", KHÔNG phải dịch xuống.
    */
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
     KHÔNG CẦN CHỈNH PHẦN DƯỚI
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


  function findRule(img) {

    const text =
      getImageText(
        img
      );


    return TUNING.find(
      rule => {

        return rule.match.some(
          keyword =>

            text.includes(
              normalize(keyword)
            )

        );

      }
    );

  }


  function applyRule(
    img,
    rule
  ) {

    /*
      Individual SCALE property:

      scaleX scaleY

      Ví dụ:
      1 0.76

      = giữ ngang 100%
        ép chiều cao xuống 76%
    */

    img.style.setProperty(
      "scale",

      `${rule.scaleX} ${rule.scaleY}`,

      "important"
    );


    /*
      Vị trí riêng.
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


    img.style.setProperty(
      "object-fit",
      "contain",
      "important"
    );


    /*
      Đánh dấu để dễ kiểm tra bằng DevTools.
    */

    img.dataset.locanTuned =
      "true";

  }


  function applySneakerTuning() {

    document
      .querySelectorAll("img")
      .forEach(
        img => {

          const rule =
            findRule(
              img
            );


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
     INITIAL LOAD
  ========================================================= */

  function init() {

    applySneakerTuning();


    /*
      Khi website render lại:
      - Grid
      - 3D
      - Search
      - Filter
      - Sort
      - Language

      script sẽ áp dụng lại.
    */

    let scheduled =
      false;


    const observer =
      new MutationObserver(
        () => {

          if (
            scheduled
          ) {
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
      );


    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );


    /*
      Một vài lần chạy dự phòng.
    */

    [
      100,
      300,
      600,
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


  if (
    document.readyState
    ===
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


  console.info(
    "Lộc An sneaker-display-tuning v7 loaded"
  );

})();
