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
