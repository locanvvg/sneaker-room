/* =========================================================
   LỘC AN — JORDAN 1 YELLOW OCHRE 2018 CORRECTION v1

   Corrects the archived/sold pair to the 2018 release:
   - Style: 555088-109
   - Colorway: Yellow Ochre/Black-White
   - Retail: $160 USD
   - Release date: 2018-05-09
   - Best Hand in the Game context

   Runs before the homepage/timeline renderers.
========================================================= */
(() => {
  "use strict";

  if (
    typeof sneakers === "undefined" ||
    !Array.isArray(sneakers)
  ) {
    return;
  }

  const item = sneakers.find(
    sneaker =>
      sneaker &&
      sneaker.id === "jordan-1-yellow-ochre"
  );

  if (!item) return;

  item.title = {
    vi: "Jordan 1 Retro High OG 'Yellow Ochre'",
    en: "Jordan 1 Retro High OG 'Yellow Ochre'"
  };

  item.subtitle = {
    vi: "Best Hand in the Game Edition (2018)",
    en: "Best Hand in the Game Edition (2018)"
  };

  item.sku = "555088-109";
  item.colorway = "Yellow Ochre/Black-White";
  item.retailPrice = "$160 USD";
  item.releaseDate = "2018-05-09";
  item.editionType = { vi: "GR", en: "GR" };
  item.condition = { vi: "Used", en: "Used" };
  item.size = "11 US";
  item.collectionStatus = "sold";
  item.archiveFit = true;

  /* Keep the existing collection image unchanged. */
  item.image = "pictures/jordan1_yelloworche.png";

  item.story = {
    vi: `
      <p><b>Jordan 1 Retro High OG 'Yellow Ochre'</b> thuộc bộ <i>Best Hand in the Game</i>, một nhóm Air Jordan 1 năm 2018 sử dụng các phối màu khác nhau để diễn giải những cột mốc trong sự nghiệp của Michael Jordan. Phiên bản Yellow Ochre đặt sắc vàng đất lên cấu trúc Black Toe quen thuộc, tạo sự tương phản với nền trắng và đen nhưng vẫn giữ cảm giác rất gần với ngôn ngữ Air Jordan 1 cổ điển.</p>
      <p>Thiết kế sử dụng branding Nike Air trên tongue và cách phân mảng màu gọn, khiến Yellow Ochre vừa mang tinh thần retro vừa có nhận diện riêng trong nhóm phát hành năm 2018. Đây là một ví dụ rõ về cách Jordan Brand tái sử dụng cấu trúc OG để kể lại lịch sử dòng Air Jordan bằng một bảng màu mới.</p>
    `,
    en: `
      <p>The <b>Jordan 1 Retro High OG 'Yellow Ochre'</b> belongs to the 2018 <i>Best Hand in the Game</i> collection, a group of Air Jordan 1 colorways created around milestones from Michael Jordan's career. Yellow Ochre places an earthy yellow tone onto familiar Black Toe-style blocking, contrasting against the white and black base while remaining closely connected to classic Air Jordan 1 design language.</p>
      <p>Nike Air branding on the tongue and the restrained color blocking give the pair a distinctly retro character while separating it from the other releases in the 2018 group. It is a clear example of Jordan Brand using an established OG framework to revisit Air Jordan history through a new palette.</p>
    `
  };
})();
