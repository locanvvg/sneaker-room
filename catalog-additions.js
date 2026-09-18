/* =========================================================
   LỘC AN — CATALOG ADDITIONS

   TỪ SAU, KHI THÊM GIÀY MỚI:
   1) Upload ảnh vào thư mục pictures/
   2) Mở catalog-builder.html
   3) Điền thông tin
   4) Copy entry được tạo
   5) Paste entry vào mảng CATALOG_ADDITIONS bên dưới
   6) Commit

   KHÔNG cần sửa:
   - index.html
   - main.js
   - collection-view.js
   - style.css
   - shoe.html
   ========================================================= */

const CATALOG_ADDITIONS = [
  /*
    PASTE NEW ENTRIES HERE.

    Example structure:

    {
      schemaVersion: 2,

      title: {
        vi: "Tên giày",
        en: "Shoe Name"
      },

      subtitle: {
        vi: "Mô tả ngắn",
        en: "Short subtitle"
      },

      sku: "ABC123-001",
      colorway: "Black/White",

      retail: {
        amount: 150,
        currency: "USD"
      },

      releaseDate: "2026-09-14",

      edition: "GR",
      condition: "Deadstock",
      size: "10 US",
      images: [
        "pictures/example.png"
      ],

      story: {
        vi: "<p>...</p>",
        en: "<p>...</p>"
      }
    },
  */

];


/* =========================================================
   DO NOT EDIT BELOW
========================================================= */

if (
  typeof sneakers !== "undefined" &&
  Array.isArray(sneakers)
) {
  sneakers.push(...CATALOG_ADDITIONS);
}


/* =========================================================
   RAYGUN SIZE OVERRIDE — 2026-09-17

   This intentionally affects ONLY:
   pictures/sb_raygun.png

   Grid:        0.66
   3D desktop:  0.60
   3D mobile:   0.56
========================================================= */

(() => {
  const styleId = "locan-raygun-size-override-20260917";

  document.getElementById(styleId)?.remove();

  const style = document.createElement("style");
  style.id = styleId;

  style.textContent = `
    html body #sneaker-grid.grid
    .card-img-wrapper
    img[src*="sb_raygun.png"] {
      scale: 0.66 0.66 !important;
      transform: none !important;
      transform-origin: center center !important;
      object-fit: contain !important;
    }

    html body
    .sneaker-3d-image
    img[src*="sb_raygun.png"] {
      scale: 0.60 0.60 !important;
      transform: none !important;
      transform-origin: center center !important;
      object-fit: contain !important;
    }

    @media (max-width: 650px) {
      html body
      .sneaker-3d-image
      img[src*="sb_raygun.png"] {
        scale: 0.56 0.56 !important;
      }
    }
  `;

  document.head.appendChild(style);
})();
