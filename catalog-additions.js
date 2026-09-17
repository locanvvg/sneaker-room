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

  /* =====================================================
  OWN — NIKE DUNK LOW PRO SB "RAYGUN AWAY" (2005)
  ===================================================== */
  {
    schemaVersion: 2,

    title: {
      vi: "Nike Dunk Low Pro SB 'Raygun Away'",
      en: "Nike Dunk Low Pro SB 'Raygun Away'"
    },

    subtitle: {
      vi: "Bản Raygun Away nguyên bản 2005",
      en: "Original 2005 Raygun Away"
    },

    sku: "304292-802",

    colorway: "Orange Flash/Black-White",

    retail: {
      amount: 65,
      currency: "USD"
    },

    releaseDate: "2005-02-01",

    edition: "GR",

    condition: "Used",

    size: "9 US",

    collectionStatus: "own",

    autoFit: false,

    display: {
      grid: {
        scaleX: 0.72,
        scaleY: 0.72,
        x: 0,
        y: 0
      },
      view3d: {
        scaleX: 0.66,
        scaleY: 0.66,
        x: 0,
        y: 0
      },
      view3dMobile: {
        scaleX: 0.62,
        scaleY: 0.62,
        x: 0,
        y: 0
      }
    },

    images: [
      "pictures/sb_raygun.png"
    ],

    story: {
      vi: `
        <p>Nike SB Dunk Low “Raygun” xuất hiện vào một thời điểm đặc biệt trong lịch sử Nike SB, khi Dunk SB đã vượt ra khỏi vai trò của một đôi skate shoe đơn thuần để trở thành nơi Nike thử nghiệm storytelling, đồ họa và những tham chiếu văn hóa có chiều sâu. Ý tưởng Raygun bắt nguồn từ Roswell Rayguns — một đội bóng rổ hư cấu do Nike tạo ra cho chiến dịch quảng cáo basketball trong giai đoạn NBA Playoffs 2002. Thay vì xây dựng chiến dịch quanh một đội NBA có thật, Nike tạo nên cả một thế giới riêng với tên đội, màu sắc, linh vật người ngoài hành tinh và những nhân vật được thể hiện bởi các ngôi sao NBA đương thời. Vince Carter xuất hiện với hình tượng Dr. Funk, bên cạnh những cầu thủ như Jermaine O’Neal, Paul Pierce, Baron Davis và Jerry Stackhouse, khiến Roswell Rayguns trở thành một ví dụ sớm về cách Nike kết hợp thể thao với fictional world-building.</p>

        <p>Khi câu chuyện đó được chuyển sang Nike SB Dunk vào năm 2005, Raygun trở thành một trong những thiết kế dễ nhận biết nhất của giai đoạn đầu Nike SB. Bản “Away” sử dụng nền trắng ở toe box và nhiều vùng upper, kết hợp với Orange Flash, black và yellow để tái hiện bảng màu của đội bóng hư cấu. Điểm nhận diện quan trọng nhất nằm ở heel: hình linh vật Raygun màu xanh xuất hiện trên nền vàng, đưa một nhân vật từ chiến dịch quảng cáo basketball sang một silhouette gắn với skateboarding. Sự chuyển dịch giữa hai thế giới này là điều làm đôi giày đặc biệt — một câu chuyện sinh ra từ basketball marketing nhưng lại được bảo tồn lâu dài trong văn hóa skate và sneaker.</p>

        <p>Raygun 2005 còn thú vị bởi Nike không phát hành hai phiên bản theo cách hoàn toàn giống nhau trên toàn cầu. Bản trắng “Away” được phân phối bên ngoài Hoa Kỳ và Canada, trong khi bản đen tương ứng được phát hành tại hai thị trường này. Cách phân phối theo khu vực khiến hai đôi hoạt động như một cặp hoàn chỉnh nhưng đồng thời tạo ra những trải nghiệm sưu tầm rất khác nhau tùy nơi người mua sinh sống. Trong bối cảnh Nike SB giữa thập niên 2000, đây là giai đoạn những câu chuyện, cửa hàng skate, khu vực phát hành và số lượng tương đối hạn chế cùng góp phần tạo nên bản sắc của từng Dunk SB — trước khi sneaker collaboration và global launch trở thành những cấu trúc phổ biến như hiện nay.</p>

        <p>Đối với Lộc An Sneaker Collection, Raygun Away là một hiện vật đại diện cho thời kỳ đầu mà Nike SB xây dựng bản sắc thông qua nhiều hơn màu sắc đơn thuần. Nó liên kết basketball advertising, graphic character design, skateboarding và sneaker collecting trong cùng một sản phẩm. Tình trạng Used của chính đôi đang được lưu giữ cũng phù hợp với vai trò archive của nó: dấu vết sử dụng và quá trình lão hóa của vật liệu cho thấy đây là một đôi giày đã thực sự đi qua thời gian, chứ không phải một bản tái hiện mới của một thiết kế cũ. Khi đứng cạnh những đôi Jordan, collaboration, sample và personal custom trong bộ sưu tập, Raygun bổ sung một chương khác — chương của Nike SB đầu những năm 2000, nơi một nhân vật hư cấu từ quảng cáo thể thao có thể trở thành một trong những biểu tượng được ghi nhớ lâu dài của Dunk SB.</p>
      `,

      en: `
        <p>The Nike SB Dunk Low “Raygun” arrived during a particularly important period in Nike SB history, when the Dunk SB was moving beyond the role of a functional skate shoe and becoming a platform for storytelling, graphics and deeper cultural references. The Raygun concept originated with the Roswell Rayguns, a fictional basketball team created by Nike for a basketball advertising campaign around the 2002 NBA Playoffs. Rather than building the campaign around an actual NBA franchise, Nike constructed an entire fictional world with its own team name, colors, alien mascot and characters portrayed by contemporary NBA stars. Vince Carter appeared as Dr. Funk, alongside players including Jermaine O’Neal, Paul Pierce, Baron Davis and Jerry Stackhouse, making the Roswell Rayguns an early example of Nike combining sport with fictional world-building.</p>

        <p>When that concept was translated onto the Nike SB Dunk in 2005, the Raygun became one of the most recognizable designs from the early Nike SB era. The “Away” version uses white across the toe box and much of the upper, combining it with Orange Flash, black and yellow to echo the fictional team’s visual identity. Its most important identifying detail appears at the heel, where the green Raygun alien character sits against a yellow panel, transferring a figure created for basketball advertising onto a silhouette associated with skateboarding. That movement between two different cultural settings is central to the shoe’s importance: a story born from basketball marketing that ultimately became preserved within skate and sneaker culture.</p>

        <p>The 2005 Raygun release is also notable because Nike did not distribute both versions in exactly the same way worldwide. The white “Away” version was released outside the United States and Canada, while the corresponding black version was distributed in those two markets. This regional structure allowed the two shoes to function as a conceptual pair while creating very different collecting experiences depending on where a buyer lived. Within the context of mid-2000s Nike SB, regional distribution, skate-shop culture, distinctive narratives and relatively limited availability all contributed to the identity of individual Dunk SB releases — well before global collaboration launches became as standardized as they are today.</p>

        <p>Within the Lộc An Sneaker Collection, the Raygun Away is preserved as an artifact of an era when Nike SB built identity through far more than color alone. It connects basketball advertising, graphic character design, skateboarding and sneaker collecting within a single object. The Used condition of the pair preserved here also suits its archival role: signs of wear and the natural aging of its materials make clear that this is a sneaker that has actually moved through time rather than a newly reproduced interpretation of an older design. Placed beside Jordan releases, collaborations, samples and personal customs in the collection, Raygun adds another chapter — the chapter of early-2000s Nike SB, when a fictional character from a sports advertisement could become one of the enduring visual symbols associated with the Dunk SB.</p>
      `
    }
  }

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
RAYGUN VISUAL SIZE LOCK
Direct fallback so Auto Fit / renderer cannot enlarge Raygun.
Only targets pictures/sb_raygun.png.
========================================================= */
(() => {
  const styleId = "locan-raygun-size-lock";
  document.getElementById(styleId)?.remove();

  const style = document.createElement("style");
  style.id = styleId;
  style.textContent = `
    .grid .card-img-wrapper img[src*="sb_raygun.png"] {
      transform: scale(0.72) !important;
      transform-origin: center center !important;
    }

    .sneaker-3d-image img[src*="sb_raygun.png"] {
      transform: scale(0.66) !important;
      transform-origin: center center !important;
    }

    @media (max-width: 650px) {
      .sneaker-3d-image img[src*="sb_raygun.png"] {
        transform: scale(0.62) !important;
      }
    }
  `;

  document.head.appendChild(style);
})();
