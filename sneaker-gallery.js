/* =========================================================
   LỘC AN SNEAKER COLLECTION
   SNEAKER IMAGE GALLERIES — v2

   - Ảnh đầu tiên luôn là COVER / ảnh bìa.
   - Các ảnh tiếp theo là DETAIL / ảnh phụ.
   - Homepage vẫn dùng sneaker.image trong data.js.
   - File này chỉ phục vụ gallery trên shoe.html.

   v2:
   - Quai 54: bắt buộc 2 ảnh.
   - Yuto Matcha: bắt buộc 2 ảnh.
   - Có fallback cho các cách đặt tên detail image cũ.
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
     Ảnh 1 = cover
     Ảnh 2 = detail
  ===================================================== */

  "jordan-1-quai54-ff": [
    "pictures/jordan1_quai54_ff_v2.png",
    "pictures/jordan1_quai54_ff_v2_1.png"
  ],


  /* =====================================================
     3. NIKE SB DUNK LOW YUTO HORIGOME MATCHA
     Ảnh 1 = cover
     Ảnh 2 = detail
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
   DETAIL IMAGE FALLBACK

   Repo đã từng dùng nhiều convention khác nhau:
   "...matcha1.png" và "...matcha_1.png", v.v.

   Nếu detail path chính không load được, script thử các tên
   cũ. Khi tìm được file hợp lệ, shoe.html được render lại.
========================================================= */

(() => {
  "use strict";

  const candidates = {

    "jordan-1-quai54-ff": [
      "pictures/jordan1_quai54_ff_v2_1.png",
      "pictures/jordan1_quai54_ff_1.png",
      "pictures/jordan1_quai54_1.png"
    ],

    "nike-sb-dunk-yuto-matcha": [
      "pictures/sbdunk_yutohorigome_matcha1.png",
      "pictures/sbdunk_yutohorigome_matcha_1.png",
      "pictures/jordan1_yuto_matcha_1.png"
    ]

  };


  function imageExists(src) {
    return new Promise(resolve => {

      const image =
        new Image();


      const done =
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
        () => done(true);


      image.onerror =
        () => done(false);


      /*
        Cache-bust only the probe.
        The final gallery path stays clean.
      */
      image.src =
        `${src}?gallery_probe=20260915`;

    });
  }


  async function resolveSecondImage(
    sneakerId
  ) {

    const gallery =
      window.SNEAKER_GALLERIES[
        sneakerId
      ];


    if (
      !Array.isArray(gallery)
      ||
      gallery.length === 0
    ) {
      return false;
    }


    const cover =
      gallery[0];


    const options =
      candidates[
        sneakerId
      ]
      ||
      [];


    for (
      const candidate
      of options
    ) {

      if (
        await imageExists(
          candidate
        )
      ) {

        window.SNEAKER_GALLERIES[
          sneakerId
        ] = [
          cover,
          candidate
        ];

        return true;

      }

    }


    return false;

  }


  async function resolveRequiredGalleries() {

    const changed = [

      await resolveSecondImage(
        "jordan-1-quai54-ff"
      ),

      await resolveSecondImage(
        "nike-sb-dunk-yuto-matcha"
      )

    ].some(Boolean);


    /*
      shoe.html declares loadShoe() in its inline classic script.
      At window.load it is available globally.
      Re-render once after filename resolution.
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


  window.addEventListener(
    "load",
    resolveRequiredGalleries,
    {
      once: true
    }
  );

})();
