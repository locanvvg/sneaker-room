/* =========================================================
   LỘC AN — SNEAKER DISPLAY TUNING
   ALL SNEAKERS / GRID + 3D
   2026-09-14

   File này tự động áp dụng cho TOÀN BỘ sneakers trong data.js,
   kể cả những đôi bạn thêm sau này.

   Cách chỉnh:
   - scale = kích thước ảnh
   - x = dịch ngang (px): + sang phải, - sang trái
   - y = dịch dọc (px): + xuống, - lên

   Ví dụ:
     grid:   { scale: 0.90, x: 0, y: 5 }
     view3d: { scale: 0.85, x: 0, y: 8 }

   QUAN TRỌNG:
   - Không dùng transform: scale(...)
   - File dùng CSS `scale` + `translate`
   - Vì vậy không ghi đè animation/transform của 3D
   ========================================================= */

(() => {
  "use strict";

  /* =========================================================
     1. MẶC ĐỊNH CHO TẤT CẢ GIÀY

     Mọi đôi trong data.js đều có các giá trị này
     nếu không có override riêng ở phần 2.
  ========================================================= */

  const DEFAULT_TUNING = {
  grid: {
    scaleX: 1,
    scaleY: 1,
    x: 0,
    y: 0
  },

  view3d: {
    scaleX: 1,
    scaleY: 1,
    x: 0,
    y: 0
  }
};

  /* =========================================================
     2. CHỈNH RIÊNG TỪNG ĐÔI

     Bạn chỉ cần chỉnh phần này.

     match:
     - có thể là một phần tên giày
     - hoặc id trong data.js

     scale:
     - 1.00 = 100%
     - 0.90 = 90%
     - 0.80 = 80%
     - 1.10 = 110%

     x:
     + = sang phải
     - = sang trái

     y:
     + = xuống
     - = lên
  ========================================================= */

  const OVERRIDES = [

  {
    match: "BAPE x Stussy Camo Canvas Hi Top",

    grid: {
      scaleX: 0.90,
      scaleY: 0.90,
      x: 0,
      y: 0
    },

    view3d: {
      scaleX: 0.88,
      scaleY: 0.88,
      x: 0,
      y: 0
    }
  },

  {
    match: "Nike x Off-White Waffle Racer SP 'White'",

    grid: {
      scaleX: 0.88,
      scaleY: 0.88,
      x: 0,
      y: 0
    },

    view3d: {
      scaleX: 0.86,
      scaleY: 0.86,
      x: 0,
      y: 0
    }
  },

  {
    match: "Jordan 4 Retro 'Black Cement' 1999",

    grid: {
      scaleX: 0.90,
      scaleY: 0.90,
      x: 0,
      y: 0
    },

    view3d: {
      scaleX: 0.88,
      scaleY: 0.88,
      x: 0,
      y: 0
    }
  },

  {
    match: "New Balance 2002R",

    grid: {
      scaleX: 0.60,
      scaleY: 0.60,
      x: 0,
      y: 0
    },

    view3d: {
      scaleX: 0.55,
      scaleY: 0.55,
      x: 0,
      y: 0
    }
  },

  {
    match: "Jordan 1 Low 'Reverse Bred'",

    grid: {
      scaleX: 0.74,
      scaleY: 0.74,
      x: 0,
      y: 0
    },

    view3d: {
      scaleX: 0.72,
      scaleY: 0.72,
      x: 0,
      y: 0
    }
  },

  {
    match: "Vans Knu Skool",

    grid: {
      scaleX: 1.08,
      scaleY: 1.08,
      x: 0,
      y: 0
    },

    view3d: {
      scaleX: 1.10,
      scaleY: 1.10,
      x: 0,
      y: 0
    }
  },

  {
    match: "Balenciaga Defender",

    grid: {
      scaleX: 1,
      scaleY: 0.88,
      x: 0,
      y: 0
    },

    view3d: {
      scaleX: 1,
      scaleY: 0.88,
      x: 0,
      y: 0
    }
  }

];


    /* =====================================================
       NEW BALANCE 2002R
    ===================================================== */

    {
      match: "New Balance 2002R",

      grid: {
        scale: 0.70,
        x: 0,
        y: 0
      },

      view3d: {
        scale: 0.60,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       JORDAN 1 LOW 'REVERSE BRED'
    ===================================================== */

    {
      match: "Jordan 1 Low 'Reverse Bred'",

      grid: {
        scale: 0.40,
        x: 0,
        y: 0
      },

      view3d: {
        scale: 0.40,
        x: 0,
        y: 0
      }
    },


    /* =====================================================
       BALENCIAGA DEFENDER
       Chỉ hạ xuống.
       Không đổi chiều ngang.
       Không đổi kích thước.
    ===================================================== */

    {
  match: "Balenciaga Defender",

  grid: {
    scaleX: 1,
    scaleY: 0.80,
    x: 0,
    y: 0
  },

  view3d: {
    scaleX: 1,
    scaleY: 0.80,
    x: 0,
    y: 0
  }
},

     {
         match: "Vans Knu Skool",

         grid: {
           scale: 0.85,
           x: 0,
           y: 0
         },

         view3d: {
           scale: 0.85,
           x: 0,
           y: 0
         }
       },


    /* =====================================================
       THÊM CÁC ĐÔI KHÁC Ở ĐÂY

       Ví dụ:

       {
         match: "Jordan 4 Retro Black Cement",

         grid: {
           scale: 0.90,
           x: 0,
           y: 0
         },

         view3d: {
           scale: 0.85,
           x: 0,
           y: 0
         }
       },

       Nếu một đôi đang hiển thị đẹp rồi
       thì KHÔNG cần thêm vào đây.

       Nó sẽ tự dùng:
       scale: 1
       x: 0
       y: 0
    ===================================================== */


  ];


  /* =========================================================
     3. KHÔNG CẦN CHỈNH TỪ ĐÂY TRỞ XUỐNG
  ========================================================= */


  const normalize = value =>

    String(
      value ?? ""
    )

      .toLowerCase()

      .replace(
        /[“”‘’]/g,
        "'"
      )

      .replace(
        /\s+/g,
        " "
      )

      .trim();


  /* =========================================================
     MODE VALUES
  ========================================================= */

  function cloneMode(mode) {
  return {
    scaleX:
      Number.isFinite(mode?.scaleX)
        ? mode.scaleX
        : 1,

    scaleY:
      Number.isFinite(mode?.scaleY)
        ? mode.scaleY
        : 1,

    x:
      Number.isFinite(mode?.x)
        ? mode.x
        : 0,

    y:
      Number.isFinite(mode?.y)
        ? mode.y
        : 0
  };
}


  /* =========================================================
     GET ALL SNEAKERS
  ========================================================= */

  function allSneakers() {

    try {

      if (
        typeof sneakers !== "undefined"
        &&
        Array.isArray(
          sneakers
        )
      ) {

        return sneakers;

      }

    } catch (
      error
    ) {

      console.warn(
        "[Sneaker tuning] Cannot access sneakers:",
        error
      );

    }

    return [];

  }


  /* =========================================================
     BUILD COMPLETE TUNING TABLE

     Tự tạo setting cho TẤT CẢ đôi trong data.js.
  ========================================================= */

  function buildTuningTable() {

    return allSneakers()

      .map(
        item => {

          const titleVi =
            String(
              item?.title?.vi || ""
            );


          const titleEn =
            String(
              item?.title?.en || ""
            );


          const id =
            String(
              item?.id || ""
            );


          const searchable =
            normalize(
              `
                ${id}
                ${titleVi}
                ${titleEn}
              `
            );


          const override =
            OVERRIDES.find(
              rule =>

                searchable.includes(
                  normalize(
                    rule.match
                  )
                )

            );


          return {

            item,

            id,

            title:
              titleEn
              ||
              titleVi
              ||
              id,

            image:
              String(
                item?.image || ""
              ),


            grid:

              cloneMode(
                override?.grid
                ||
                DEFAULT_TUNING.grid
              ),


            view3d:

              cloneMode(
                override?.view3d
                ||
                DEFAULT_TUNING.view3d
              )

          };

        }
      );

  }


  /* =========================================================
     GET FILE NAME
  ========================================================= */

  function filename(
    value
  ) {

    return normalize(

      String(
        value ?? ""
      )

        .split("?")[0]

        .split("#")[0]

        .split("/")

        .pop()

    );

  }


  /* =========================================================
     DETECT CURRENT MODE
  ========================================================= */

  function currentMode() {

    /*
      main.js hiện có collectionViewMode.
      Dùng nó trước nếu đọc được.
    */

    try {

      if (
        typeof collectionViewMode
        !==
        "undefined"
      ) {

        return (

          collectionViewMode
          ===
          "3d"

            ? "view3d"

            : "grid"

        );

      }

    } catch (
      error
    ) {

      /* fallback bên dưới */

    }


    /*
      Fallback bằng DOM.
    */

    const grid =
      document.getElementById(
        "sneaker-grid"
      );


    if (
      grid
      &&
      (
        grid.classList.contains(
          "view-3d"
        )

        ||

        grid.classList.contains(
          "is-3d"
        )

        ||

        grid.querySelector(
          `
            [class*='coverflow'],
            [class*='3d'],
            [class*='slider']
          `
        )
      )
    ) {

      return "view3d";

    }


    return "grid";

  }


  /* =========================================================
     CHECK IF IMAGE BELONGS TO SNEAKER
  ========================================================= */

  function imageBelongsToItem(
    img,
    tuning
  ) {

    const imgFile =
      filename(

        img.getAttribute(
          "src"
        )

        ||

        img.src

      );


    const targetFile =
      filename(
        tuning.image
      );


    /*
      Filename là cách chính xác nhất.
    */

    if (
      targetFile
      &&
      imgFile
      &&
      targetFile === imgFile
    ) {

      return true;

    }


    /*
      Nếu filename không match,
      thử alt.
    */

    const title =
      normalize(
        tuning.title
      );


    if (
      !title
    ) {

      return false;

    }


    const alt =
      normalize(
        img.alt
      );


    if (
      alt.includes(
        title
      )
    ) {

      return true;

    }


    /*
      Fallback cuối:
      tìm text quanh card.
    */

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


    const nearbyText =
      normalize(
        container?.textContent
        ||
        ""
      );


    return (

      nearbyText.includes(
        title
      )

    );

  }


  /* =========================================================
     APPLY SCALE / POSITION
  ========================================================= */

 function applyValues(img, values) {
  img.style.setProperty(
    "scale",
    `${values.scaleX} ${values.scaleY}`,
    "important"
  );

  img.style.setProperty(
    "translate",
    `${values.x}px ${values.y}px`,
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
}

    /*
      Luôn scale quanh tâm ảnh.
    */

    img.style.setProperty(
      "transform-origin",
      "center center",
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

  }


  /* =========================================================
     APPLY TO ALL SNEAKERS
  ========================================================= */

  function applyAllSneakerTuning() {

    const tuningTable =
      buildTuningTable();


    if (
      tuningTable.length === 0
    ) {

      return;

    }


    const mode =
      currentMode();


    const images =
      document.querySelectorAll(
        "img"
      );


    /*
      Đi qua TOÀN BỘ sneakers
      trong data.js.
    */

    tuningTable.forEach(
      tuning => {


        images.forEach(
          img => {


            if (
              !imageBelongsToItem(
                img,
                tuning
              )
            ) {

              return;

            }


            applyValues(

              img,

              tuning[
                mode
              ]

            );

          }
        );

      }
    );

  }


  /* =========================================================
     DEBUG TOOL

     Nếu cần xem toàn bộ giày:
     mở Console và gõ:

     LocAnSneakerTuning.list()
  ========================================================= */

  window.LocAnSneakerTuning = {


    list() {

      const rows =

        buildTuningTable()

          .map(
            tuning => ({

              id:
                tuning.id,

              title:
                tuning.title,

              image:
                tuning.image,

              gridScale:
                tuning.grid.scale,

              gridX:
                tuning.grid.x,

              gridY:
                tuning.grid.y,

              view3dScale:
                tuning.view3d.scale,

              view3dX:
                tuning.view3d.x,

              view3dY:
                tuning.view3d.y

            })
          );


      console.table(
        rows
      );


      return rows;

    },


    apply() {

      applyAllSneakerTuning();

    }

  };


  /* =========================================================
     AUTO APPLY
  ========================================================= */


  let rafId = 0;


  function scheduleApply() {

    cancelAnimationFrame(
      rafId
    );


    rafId =

      requestAnimationFrame(

        applyAllSneakerTuning

      );

  }


  /* =========================================================
     FIRST LOAD
  ========================================================= */

  if (
    document.readyState
    ===
    "loading"
  ) {

    document.addEventListener(

      "DOMContentLoaded",

      applyAllSneakerTuning,

      {
        once: true
      }

    );

  } else {

    applyAllSneakerTuning();

  }


  /* =========================================================
     WINDOW LOAD
  ========================================================= */

  window.addEventListener(

    "load",

    applyAllSneakerTuning

  );


  /* =========================================================
     MUTATION OBSERVER

     Tự chạy lại khi:
     - Grid → 3D
     - 3D → Grid
     - Search
     - Filter
     - Sort
     - Language
     - render lại card
  ========================================================= */

  const observer =

    new MutationObserver(

      scheduleApply

    );


  function startObserver() {

    if (
      !document.body
    ) {

      return;

    }


    observer.observe(

      document.body,

      {

        childList: true,

        subtree: true

      }

    );

  }


  if (
    document.body
  ) {

    startObserver();

  } else {

    document.addEventListener(

      "DOMContentLoaded",

      startObserver,

      {
        once: true
      }

    );

  }


  /* =========================================================
     DELAYED PASSES

     Dự phòng trong trường hợp
     Grid / 3D render trễ.
  ========================================================= */

  [
    50,
    120,
    250,
    500,
    900,
    1500
  ]

    .forEach(
      ms =>

        setTimeout(

          applyAllSneakerTuning,

          ms

        )
    );


})();
