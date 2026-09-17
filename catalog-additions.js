/* =========================================================
LỘC AN — CATALOG ADDITIONS

RAYGUN OWN ENTRY + DISPLAY CALIBRATION
2026-09-17

This file is loaded by index.html before the shared display
engine. It adds the Raygun pair if it is not already present,
and locks ONLY the Raygun image to a balanced visual size in
Grid and 3D modes.

Existing sneakers, layouts and the 15 locked stories are not
modified.
========================================================= */

const CATALOG_ADDITIONS = [

  {
    schemaVersion: 2,

    id: "nike-sb-dunk-low-raygun-away-2005",

    title: {
      vi: "Nike Dunk Low Pro SB 'Raygun Away'",
      en: "Nike Dunk Low Pro SB 'Raygun Away'"
    },

    subtitle: {
      vi: "Pink Box Era — Roswell Rayguns (2005)",
      en: "Pink Box Era — Roswell Rayguns (2005)"
    },

    sku: "304292-802",

    colorway: "Orange Flash/Black-White",

    retail: {
      amount: 65,
      currency: "USD"
    },

    retailPrice: "$65 USD",

    releaseDate: "2005-02",

    edition: "GR",

    editionType: {
      vi: "GR",
      en: "GR"
    },

    condition: {
      vi: "Used",
      en: "Used"
    },

    size: "9 US",

    collectionStatus: "own",

    image: "pictures/sb_raygun.png",

    images: [
      "pictures/sb_raygun.png"
    ],

    /*
      Shared catalog-display.js reads these values directly.
      These values are intentionally larger than the previous
      "too small" calibration.
    */
    display: {
      grid: {
        scaleX: 0.76,
        scaleY: 0.76,
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
        scaleX: 0.66,
        scaleY: 0.66,
        x: 0,
        y: 0
      }
    },

    story: {
      vi: `
        <p>Nike Dunk Low Pro SB 'Raygun Away' là một trong những thiết kế tiêu biểu của giai đoạn đầu Nike SB và của thời kỳ Pink Box. Câu chuyện của nó bắt đầu trước khi đôi Dunk xuất hiện: Nike từng tạo ra Roswell Rayguns, một đội bóng rổ hư cấu được xây dựng như một thế giới quảng cáo retro-futuristic, trộn basketball với hình ảnh UFO, người ngoài hành tinh và văn hóa đại chúng Mỹ.</p>
        <p>Khi concept Rayguns được chuyển sang Nike SB Dunk Low Pro, mascot alien cầm raygun trở thành dấu hiệu nhận diện quan trọng nhất. Hình thêu ở heel nhỏ nhưng đủ mạnh để biến toàn bộ đôi giày thành một phần của thế giới Roswell Rayguns. Đây là kiểu storytelling rất đặc trưng của Nike SB thời kỳ đầu: một Dunk có thể bắt nguồn từ một câu chuyện kỳ lạ, một graphic hoặc một reference văn hóa thay vì chỉ là phối màu mới.</p>
        <p>Bản Away được nhận biết bởi toe màu trắng, kết hợp orange ở mid-panel, yellow ở heel và black Swoosh. White toe làm phần trước sáng hơn rõ rệt so với bản toe đen thường được gọi là Home. Bảng màu orange–yellow–black–white vừa gắn với uniform của đội bóng hư cấu vừa tạo ra một bố cục cực kỳ dễ nhận ra, ngay cả khi nhìn đôi giày từ xa.</p>
        <p>Raygun cũng quan trọng vì nó thuộc giai đoạn Nike SB đang xây dựng bản sắc riêng trong sneaker culture. Dunk SB lúc đó chưa đơn giản là một silhouette retro được phát hành liên tục; mỗi release thường gắn với skate shop, artist, câu chuyện hoặc concept có personality mạnh. Chính cách làm đó góp phần tạo nên sức hút sưu tầm của SB Dunk trong những năm 2000.</p>
        <p>Nhiều năm sau, Nike SB quay lại với Roswell Rayguns trong những dự án mới, cho thấy mascot này đã trở thành một phần bền vững của archive SB. Việc một campaign hư cấu đầu những năm 2000 có thể tiếp tục sống trong footwear nhiều năm sau là minh chứng cho sức mạnh của storytelling khi nó được gắn vào một hình ảnh đủ rõ và một silhouette đủ có ảnh hưởng.</p>
        <p>Trong Lộc An Sneaker Collection, Raygun Away được lưu như một đại diện của Nike SB thời kỳ đầu: một đôi giày vừa có lịch sử skate, vừa mang dấu vết của advertising culture và graphic storytelling. Patina và dấu hiệu sử dụng trên hiện vật càng làm rõ tuổi đời của nó, khiến đôi giày được đọc như một vật thể đã đi qua gần hai thập niên sneaker culture thay vì một retro reproduction mới.</p>
      `,

      en: `
        <p>The Nike Dunk Low Pro SB 'Raygun Away' is one of the defining designs of early Nike SB and the Pink Box era. Its story begins before the Dunk itself: Nike created the Roswell Rayguns as a fictional basketball team inside a retro-futurist advertising world that mixed basketball with UFO imagery, aliens and American popular culture.</p>
        <p>When the Rayguns concept moved onto the Nike SB Dunk Low Pro, the raygun-wielding alien became the crucial identifying mark. The heel embroidery is physically small but strong enough to place the entire shoe inside the Roswell Rayguns universe. This kind of storytelling was characteristic of early Nike SB: a Dunk could originate from an odd narrative, graphic or cultural reference rather than functioning as just another colorway.</p>
        <p>The Away edition is identified by its white toe, combined with orange at the mid-panel, yellow at the heel and a black Swoosh. The white toe gives the front of the shoe a noticeably brighter appearance than the black-toe version commonly called Home. Orange, yellow, black and white connect the sneaker to the fictional team's visual identity while creating one of the most recognizable early SB Dunk palettes.</p>
        <p>Raygun is also important because it belongs to the period when Nike SB was still establishing a distinct identity within sneaker culture. The SB Dunk was not yet simply a retro silhouette released at constant volume; individual releases were often tied to skate shops, artists, stories or concepts with strong personality. That approach helped build the collecting culture around SB Dunk during the 2000s.</p>
        <p>Nike SB returned to the Roswell Rayguns concept years later, showing that the mascot had become a durable part of the SB archive. The fact that a fictional advertising campaign from the early 2000s could continue living through footwear years later demonstrates the power of storytelling when it is attached to a clear graphic identity and an influential silhouette.</p>
        <p>Within the Lộc An Sneaker Collection, Raygun Away is preserved as an artifact of early Nike SB: a shoe carrying skate history, advertising culture and graphic storytelling at the same time. The patina and signs of use on the object further emphasize its age, allowing it to read as a pair that has lived through nearly two decades of sneaker culture rather than as a newly reproduced retro.</p>
      `
    }
  }

];


/* =========================================================
ADD ONLY IF THE SAME RAYGUN IS NOT ALREADY PRESENT
========================================================= */

if (
  typeof sneakers !== "undefined" &&
  Array.isArray(sneakers)
) {
  const normalizeCatalogText = value =>
    String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/\s+/g, " ")
      .trim();

  const hasRaygun = sneakers.some(sneaker => {
    const title =
      typeof sneaker?.title === "string"
        ? sneaker.title
        : `${sneaker?.title?.vi || ""} ${sneaker?.title?.en || ""}`;

    return (
      normalizeCatalogText(sneaker?.id).includes("raygun") ||
      normalizeCatalogText(title).includes("raygun")
    );
  });

  if (!hasRaygun) {
    sneakers.push(...CATALOG_ADDITIONS);
  } else {
    /*
      If another file already created Raygun, attach the same
      display calibration to that existing object so there is
      still only one Raygun in the collection.
    */
    sneakers.forEach(sneaker => {
      const title =
        typeof sneaker?.title === "string"
          ? sneaker.title
          : `${sneaker?.title?.vi || ""} ${sneaker?.title?.en || ""}`;

      if (
        normalizeCatalogText(sneaker?.id).includes("raygun") ||
        normalizeCatalogText(title).includes("raygun")
      ) {
        sneaker.display = CATALOG_ADDITIONS[0].display;
      }
    });
  }
}


/* =========================================================
RAYGUN RENDER-SIZE SAFETY LOCK

catalog-display.js applies the final image scale through the
CSS `scale` property. The rules below target ONLY sb_raygun.png
and use a higher-specificity selector so the requested visual
size remains stable even if the shared engine recalculates an
automatic fit.

GRID:       0.76
3D DESKTOP: 0.70
3D MOBILE:  0.66
========================================================= */

(() => {
  const styleId = "locan-raygun-display-lock-v3";

  document.getElementById(styleId)?.remove();

  const style = document.createElement("style");
  style.id = styleId;

  style.textContent = `
    html body .grid .card-img-wrapper img[src*="sb_raygun.png"] {
      scale: 0.76 0.76 !important;
      transform-origin: center center !important;
      object-fit: contain !important;
    }

    html body .sneaker-3d-image img[src*="sb_raygun.png"] {
      scale: 0.70 0.70 !important;
      transform-origin: center center !important;
      object-fit: contain !important;
    }

    @media (max-width: 650px) {
      html body .sneaker-3d-image img[src*="sb_raygun.png"] {
        scale: 0.66 0.66 !important;
      }
    }
  `;

  document.head.appendChild(style);
})();
