/* =========================================================
   LỘC AN SNEAKER COLLECTION
   SNEAKER IMAGE GALLERIES — v2

   IMPORTANT:
   - File này KHÔNG thay đổi data.js.
   - File này KHÔNG thay đổi sneaker story.
   - Ảnh đầu tiên luôn là COVER / ảnh bìa.
   - Các ảnh tiếp theo là DETAIL / ảnh phụ.
   - Homepage vẫn dùng sneaker.image trong data.js.
   - File này chỉ phục vụ gallery trên shoe.html.

   v2:
   - Quai 54: 2 ảnh.
   - Yuto Matcha: 2 ảnh.
   - Thêm fallback cho các convention tên file detail
     đã từng được dùng trong project.
========================================================= */

window.SNEAKER_GALLERIES = {

  /* =====================================================
     1. JORDAN 1 BLACK BLOODLINE PE SAMPLE
  ===================================================== */

  "air-jordan-1-black-bloodline-pe": [
    "pictures/jordan1_pe_bloodline_friendsandfamily_sample.png"
  ],


  /* =====================================================
     2. JORDAN 1 QUAI 54 F&F
     IMAGE 1 = COVER
     IMAGE 2 = DETAIL
  ===================================================== */

  "jordan-1-quai54-ff": [
    "pictures/jordan1_quai54_ff_v2.png",
    "pictures/jordan1_quai54_ff_v2_1.png"
  ],


  /* =====================================================
     3. NIKE SB DUNK LOW YUTO HORIGOME MATCHA
     IMAGE 1 = COVER
     IMAGE 2 = DETAIL
  ===================================================== */

  "nike-sb-dunk-yuto-matcha": [
    "pictures/sbdunk_yutohorigome_matcha.png",
    "pictures/sbdunk_yutohorigome_matcha1.png"
  ],


  /* =====================================================
     4. VIRGIL ABLOH ARCHIVE ALASKA
  ===================================================== */

  "virgil-abloh-archive-jordan-1-alaska": [
    "pictures/jordan1_vaa_alaska_v2.png"
  ],


  /* =====================================================
     5. FRAGMENT x UNION LA SAMPLE
  ===================================================== */

  "fragment-union-air-jordan-1-varsity-red-sport-royal-sample": [
    "pictures/jordan1_fragmentunion_sample.png"
  ],


  /* =====================================================
     6. JORDAN 1 SHADOW 2009
  ===================================================== */

  "jordan-1-shadow-2009": [
    "pictures/jordan1_shadow_2009.png"
  ],


  /* =====================================================
     7. BAPE x STUSSY
  ===================================================== */

  "bape-stussy-camo-canvas-hi-top-green": [
    "pictures/bapesta_stussy.png"
  ],


  /* =====================================================
     8. NIKE x OFF-WHITE WAFFLE RACER
  ===================================================== */

  "nike-off-white-waffle-racer-white": [
    "pictures/nike_waffle_racer_ow.png"
  ],


  /* =====================================================
     9. PUMA x ROSÉ SPEEDCAT LEATHER
  ===================================================== */

  "puma-rose-speedcat-leather-warm-white": [
    "pictures/puma_rose.png"
  ],


  /* =====================================================
     10. JORDAN 4 BLACK CEMENT 1999
  ===================================================== */

  "jordan-4-black-cement-1999": [
    "pictures/jordan4_bred_1999.png"
  ]

};


/* =========================================================
   DETAIL IMAGE FALLBACK RESOLUTION

   Chỉ chạy cho Quai 54 và Yuto Matcha.

   Nếu filename chính của ảnh detail không tồn tại,
   script sẽ thử các tên cũ đã từng được dùng trong project.
========================================================= */

(() => {
  "use strict";


  const DETAIL_CANDIDATES = {

    "jordan-1-quai54-ff": {
      cover:
        "pictures/jordan1_quai54_ff_v2.png",

      details: [
        "pictures/jordan1_quai54_ff_v2_1.png",
        "pictures/jordan1_quai54_ff_1.png",
        "pictures/jordan1_quai54_1.png",
        "pictures/jordan1_quai54.png",
        "pictures/jordan_quai54_friendsandfamily_1.png"
      ]
    },


    "nike-sb-dunk-yuto-matcha": {
      cover:
        "pictures/sbdunk_yutohorigome_matcha.png",

      details: [
        "pictures/sbdunk_yutohorigome_matcha1.png",
        "pictures/sbdunk_yutohorigome_matcha_1.png",
        "pictures/jordan1_yuto_matcha_1.png",
        "pictures/jordan1_yuto_matcha1.png"
      ]
    }

  };


  function probeImage(src) {

    return new Promise(
      resolve => {

        const image =
          new Image();


        const finish =
          result => {

            image.onload =
              null;

            image.onerror =
              null;

            resolve(
              result
            );

          };


        image.onload =
          () => finish(true);


        image.onerror =
          () => finish(false);


        /*
          Cache-bust probe only.
          Final gallery path stays clean.
        */
        image.src =
          `${src}?gallery_probe=20260916-v2`;

      }
    );

  }


  async function resolveGallery(
    sneakerId,
    config
  ) {

    for (
      const detail
      of config.details
    ) {

      const exists =
        await probeImage(
          detail
        );


      if (
        exists
      ) {

        window.SNEAKER_GALLERIES[
          sneakerId
        ] = [
          config.cover,
          detail
        ];


        return true;

      }

    }


    /*
      Nếu không tìm thấy detail image nào,
      giữ cover thay vì để thumbnail broken.
    */
    window.SNEAKER_GALLERIES[
      sneakerId
    ] = [
      config.cover
    ];


    return false;

  }


  async function resolveRequiredGalleries() {

    let changed =
      false;


    for (
      const [
        sneakerId,
        config
      ]
      of Object.entries(
        DETAIL_CANDIDATES
      )
    ) {

      const before =
        JSON.stringify(
          window.SNEAKER_GALLERIES[
            sneakerId
          ]
        );


      await resolveGallery(
        sneakerId,
        config
      );


      const after =
        JSON.stringify(
          window.SNEAKER_GALLERIES[
            sneakerId
          ]
        );


      if (
        before !== after
      ) {

        changed =
          true;

      }

    }


    /*
      shoe.html defines loadShoe() in a classic inline script.
      Re-render after fallback resolution if necessary.
    */
    if (
      changed
      &&
      typeof window.loadShoe ===
        "function"
    ) {

      window.loadShoe();

    }

  }


  /*
    Run after the detail-page script is available.
  */
  window.addEventListener(
    "load",
    resolveRequiredGalleries,
    {
      once: true
    }
  );

})();
