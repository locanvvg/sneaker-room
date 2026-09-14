/* =========================================================
   LỘC AN — VI / EN LOCALIZATION PATCH v3 — CLEAN / NO IMAGE SIZING
   2026-09-13

   User rules implemented:
   1) "Sneaker Collection" -> "Bộ Sưu Tập Giày" in VI.
   2) Generic "Sneaker" -> "Giày" in VI, not "Giày thể thao".
   3) PRIVATE COLLECTION — NOT FOR SALE is translated in VI.
   4) Filter chips remain in English.
   5) ABOUT / GIỚI THIỆU is moved to the top-left.
   6) Vietnamese 3D-mode label uses a Vietnamese-safe font stack.
   7) Edition/type labels on sneaker cards remain in English.

   This file does NOT change the underlying filter values, sneaker
   edition types, condition values, SKU/style codes, or product names.
   ========================================================= */

(() => {
  "use strict";

  const LANG_KEY = "locan_lang";
  let applying = false;
  let scheduled = false;

  const getLang = () => {
    const queryLang = new URLSearchParams(window.location.search).get("lang");
    const storedLang = localStorage.getItem(LANG_KEY);

    if (queryLang === "en" || storedLang === "en") return "en";
    return "vi";
  };

  /* =========================================================
     STYLE PATCH
     - ABOUT at top-left
     - language controls stay on right
     - Vietnamese-safe font for 3D/Grid toggle
  ========================================================= */

  function ensureStylePatch() {
    if (document.getElementById("locan-localization-style-v2")) return;

    const style = document.createElement("style");
    style.id = "locan-localization-style-v2";

    style.textContent = `
      .home-header,
      .about-header {
        position: relative !important;
      }

      .about-corner-link {
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: auto !important;
        margin: 0 !important;
        z-index: 30 !important;
      }

      .header-corner-tools {
        right: 0 !important;
        left: auto !important;
      }

      #collection-3d-toggle,
      .collection-3d-toggle,
      .collection-view-toggle,
      .view-mode-toggle,
      .grid-view-toggle {
        font-family:
          Arial,
          "Segoe UI",
          "Helvetica Neue",
          sans-serif !important;
        font-variant-ligatures: none !important;
        text-rendering: geometricPrecision;
      }
    `;

    document.head.appendChild(style);
  }

  function moveAboutLeft() {
    document
      .querySelectorAll(".about-corner-link")
      .forEach(link => {
        const header = link.closest("header");
        if (!header) return;

        if (link.parentElement !== header) {
          header.appendChild(link);
        }
      });
  }

  /* =========================================================
     MAIN TRANSLATION OBJECT
  ========================================================= */

  function patchMainTranslations() {
    try {
      if (typeof translations === "undefined") return;

      if (translations.vi) {
        Object.assign(translations.vi, {
          mainTitle: "BỘ SƯU TẬP GIÀY LỘC AN",
          mainSubtitle: "Không gian lưu trữ & Bảo tàng Giày Kỹ thuật số",

          sortLabel: "SẮP XẾP",
          sortDefault: "Mặc định",
          sortAZ: "A → Z",
          sortZA: "Z → A",
          sortDateDesc: "Ngày phát hành: Mới → Cũ",
          sortDateAsc: "Ngày phát hành: Cũ → Mới",
          sortSizeAsc: "Kích cỡ nhỏ → lớn",
          sortSizeDesc: "Kích cỡ lớn → nhỏ",

          filterTitle: "BỘ LỌC BỘ SƯU TẬP",
          clearFilters: "XÓA BỘ LỌC",
          editionLabel: "PHÂN KHÚC",
          conditionLabel: "TÌNH TRẠNG",
          sizeLabel: "KÍCH CỠ",

          viewMore: "XEM THÊM →",
          noResults: "Không có hiện vật phù hợp với bộ lọc hiện tại.",

          gridLabel: columns => `LƯỚI · ${columns} CỘT`,
          decreaseGrid: "Giảm số cột",
          increaseGrid: "Tăng số cột",
          gridRange: "Điều chỉnh số cột trong lưới",

          view3D: "CHẾ ĐỘ 3D",
          backToGrid: "CHẾ ĐỘ LƯỚI"
        });
      }

      if (translations.en) {
        Object.assign(translations.en, {
          mainTitle: "LỘC AN SNEAKER COLLECTION",
          mainSubtitle: "Digital Sneaker Archive & Museum",
          view3D: "3D VIEW",
          backToGrid: "GRID VIEW"
        });
      }
    } catch (error) {
      console.warn("[Lộc An v2] Translation object patch skipped:", error);
    }
  }

  /* =========================================================
     VANS CARD
  ========================================================= */

  function patchVansCardData() {
    try {
      if (typeof sneakers === "undefined" || !Array.isArray(sneakers)) return;

      sneakers.forEach(item => {
        const enTitle = String(item?.title?.en || "");

        if (
          item?.id === "vans-knu-skool-black-true-white-rope-lace" ||
          enTitle.includes("Vans Knu Skool")
        ) {
          item.title = item.title || {};
          item.subtitle = item.subtitle || {};

          item.title.vi = "Vans Knu Skool 'Black/True White'";
          item.title.en = "Vans Knu Skool 'Black/True White'";

          item.subtitle.vi = "Phom giày trượt ván phồng đặc trưng (2023)";
          item.subtitle.en = "Chunky Skate Silhouette (2023)";
        }
      });
    } catch (error) {
      console.warn("[Lộc An v2] Vans data patch skipped:", error);
    }
  }

  /* =========================================================
     VI NARRATIVE CLEANUP
     Only generic descriptive vocabulary is localized.
     Product/brand/model names and archival identifiers remain intact.
  ========================================================= */

  const VI_REPLACEMENTS = [
    ["Lộc An Sneaker Collection", "Bộ Sưu Tập Giày Lộc An"],
    ["PRIVATE COLLECTION — NOT FOR SALE", "BỘ SƯU TẬP CÁ NHÂN — KHÔNG BÁN"],
    ["PRIVATE COLLECTION - NOT FOR SALE", "BỘ SƯU TẬP CÁ NHÂN — KHÔNG BÁN"],

    ["Personal Rope-Lace Modification", "Tùy chỉnh dây giày dạng thừng cá nhân"],
    ["Friends & Family Sample", "Mẫu dành cho Bạn bè & Gia đình"],
    ["Friends & Family", "Bạn bè & Gia đình"],
    ["Player Exclusive", "phiên bản dành riêng cho vận động viên"],
    ["pre-release sample", "mẫu tiền phát hành"],
    ["limited release", "đợt phát hành giới hạn"],
    ["signature collaboration", "màn hợp tác mang dấu ấn cá nhân"],
    ["athlete colorway", "phối màu dành cho vận động viên"],
    ["lifestyle collectible", "vật phẩm sưu tầm thời trang"],
    ["performance identity", "bản sắc hiệu năng"],
    ["impact protection", "khả năng bảo vệ khi va đập"],
    ["family crest", "huy hiệu gia đình"],
    ["skate footwear", "giày trượt ván"],
    ["running heritage", "di sản chạy bộ"],
    ["visible Air cushioning", "đệm Air lộ thiên"],
    ["plastic support wings", "cánh đỡ bằng nhựa"],
    ["red-black identity", "bản sắc đỏ-đen"],
    ["translucent film", "lớp màng bán trong suốt"],
    ["dual-lacing system", "hệ thống dây giày kép"],
    ["Dual-lacing system", "Hệ thống dây giày kép"],
    ["anchor points", "các điểm neo"],
    ["outdoor equipment", "thiết bị ngoài trời"],
    ["hiking hardware", "phụ kiện leo núi"],
    ["performance gear", "trang bị hiệu năng"],
    ["rubber spikes", "gai cao su"],
    ["retro runner", "giày chạy bộ phong cách hoài cổ"],
    ["track spike", "giày đinh chạy sân"],
    ["trail footwear", "giày địa hình"],
    ["exposed construction", "cấu trúc để lộ"],
    ["industrial typography", "kiểu chữ công nghiệp"],
    ["Industrial typography", "Kiểu chữ công nghiệp"],
    ["orange tab", "thẻ màu cam"],
    ["exposed tongue", "lưỡi gà để lộ"],
    ["metallic Swoosh", "Swoosh ánh kim"],
    ["zip-tie language", "ngôn ngữ thiết kế dây rút"],
    ["worn-out effect", "hiệu ứng cũ mòn"],
    ["industrial design", "thiết kế công nghiệp"],
    ["running shoe", "giày chạy bộ"],
    ["sole unit", "cụm đế"],
    ["tire tread", "hoa lốp"],
    ["Oversized tongue", "Lưỡi gà ngoại cỡ"],
    ["oversized tongue", "lưỡi gà ngoại cỡ"],
    ["padded collar", "cổ giày đệm dày"],
    ["thick laces", "dây giày bản lớn"],
    ["Black suede upper", "Thân giày da lộn màu đen"],
    ["black suede upper", "thân giày da lộn màu đen"],
    ["black-and-white composition", "bố cục đen-trắng"],
    ["Vulcanized construction", "Kết cấu lưu hóa"],
    ["vulcanized construction", "kết cấu lưu hóa"],
    ["waffle outsole", "đế ngoài dạng waffle"],
    ["factory configuration", "cấu hình nguyên bản từ nhà máy"],
    ["factory edition", "phiên bản nguyên bản của hãng"],
    ["rope laces", "dây giày dạng thừng"],
    ["rope lace", "dây giày dạng thừng"],
    ["1-of-1 custom", "tùy chỉnh độc bản 1/1"],
    ["customization process", "quá trình tùy chỉnh"],
    ["hand-applied artwork", "họa tiết được thực hiện thủ công"],
    ["visual treatment", "cách xử lý thị giác"],

    ["provenance", "nguồn gốc lưu trữ"],
    ["sneakerhead", "người đam mê giày"],
    ["sneakers", "giày"],
    ["sneaker", "giày"],
    ["Sneakers", "Giày"],
    ["Sneaker", "Giày"],
    ["box label", "nhãn hộp"],
    ["pair", "đôi giày"],
    ["texture", "kết cấu bề mặt"],
    ["motif", "họa tiết"],
    ["collaboration", "màn hợp tác"],
    ["padding", "lớp đệm"],
    ["colorway", "phối màu"],
    ["high-top", "cổ cao"],
    ["upper", "thân giày"],
    ["outsole", "đế ngoài"],
    ["footwear", "giày dép"],
    ["silhouette", "phom dáng"],
    ["traction", "độ bám"],
    ["construction", "cấu trúc"],
    ["prototype", "nguyên mẫu"],
    ["Yellowing", "Hiện tượng ố vàng"],
    ["yellowing", "hiện tượng ố vàng"],
    ["modification", "tùy chỉnh"],
    ["treatment", "cách xử lý"],
    ["identity", "bản sắc"],
    ["padded", "đệm dày"],
    ["exaggerated", "cường điệu"]
  ].sort((a, b) => b[0].length - a[0].length);

  function cleanVietnameseNarratives() {
    try {
      if (typeof sneakers === "undefined" || !Array.isArray(sneakers)) return;

      sneakers.forEach(item => {
        if (item?.story && typeof item.story.vi === "string") {
          let text = item.story.vi;

          for (const [from, to] of VI_REPLACEMENTS) {
            text = text.split(from).join(to);
          }

          item.story.vi = text;
        }

        if (item?.subtitle && typeof item.subtitle.vi === "string") {
          let text = item.subtitle.vi;

          for (const [from, to] of VI_REPLACEMENTS) {
            text = text.split(from).join(to);
          }

          item.subtitle.vi = text;
        }
      });
    } catch (error) {
      console.warn("[Lộc An v2] Narrative localization skipped:", error);
    }
  }

  /* =========================================================
     NAVIGATION / STATIC UI
  ========================================================= */

  function setNavigation(lang) {
    document.querySelectorAll(".about-corner-link, .header-about-link").forEach(link => {
      link.textContent = lang === "vi" ? "GIỚI THIỆU" : "ABOUT";
    });

    document.querySelectorAll(".museum-nav-link").forEach(link => {
      const href = link.getAttribute("href") || "";

      if (href.includes("index.html")) {
        link.textContent = lang === "vi" ? "GIÀY" : "SNEAKERS";
      }

      if (href.includes("lego.html")) {
        link.textContent = "LEGO";
      }

      if (href.includes("sneaker-mask.html")) {
        link.textContent = lang === "vi" ? "MẶT NẠ GIÀY" : "SNEAKER MASK";
      }
    });
  }

  function setHeader(lang) {
    const mainTitle = document.querySelector('[data-i18n="mainTitle"], .home-header h1');

    if (mainTitle) {
      mainTitle.textContent =
        lang === "vi"
          ? "BỘ SƯU TẬP GIÀY LỘC AN"
          : "LỘC AN SNEAKER COLLECTION";
    }

    const subtitle = document.querySelector(
      '[data-i18n="mainSubtitle"], #lego-main-subtitle, #mask-main-subtitle'
    );

    if (subtitle) {
      subtitle.textContent =
        lang === "vi"
          ? "Không gian lưu trữ & Bảo tàng Giày Kỹ thuật số"
          : "Digital Sneaker Archive & Museum";
    }
  }

  function setPrivateNotice(lang) {
    if (!document.body) return;

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodes = [];

    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(node => {
      const raw = node.nodeValue;
      const trimmed = raw.trim();

      const isEnglishNotice =
        trimmed === "PRIVATE COLLECTION — NOT FOR SALE" ||
        trimmed === "PRIVATE COLLECTION - NOT FOR SALE";

      const isVietnameseNotice =
        trimmed === "BỘ SƯU TẬP CÁ NHÂN — KHÔNG BÁN" ||
        trimmed === "BỘ SƯU TẬP CÁ NHÂN - KHÔNG BÁN";

      if (lang === "vi" && isEnglishNotice) {
        node.nodeValue =
          raw.replace(trimmed, "BỘ SƯU TẬP CÁ NHÂN — KHÔNG BÁN");
      }

      if (lang === "en" && isVietnameseNotice) {
        node.nodeValue =
          raw.replace(trimmed, "PRIVATE COLLECTION — NOT FOR SALE");
      }
    });
  }

  function setFooter(lang) {
    document.querySelectorAll("footer p").forEach(p => {
      p.textContent =
        lang === "vi"
          ? "© 2026 Bộ sưu tập giày Lộc An. Bảo lưu mọi quyền."
          : "© 2026 Lộc An Sneaker Collection. All Rights Reserved.";
    });
  }

  /* =========================================================
     FILTERS
     IMPORTANT:
     User wants filter choices to remain English even in VI mode.
  ========================================================= */

  function keepFilterValuesEnglish() {
    const editionLabels = {
      "PE": "PE",
      "Sample": "SAMPLE",
      "SAMPLE": "SAMPLE",
      "F&F": "F&F",
      "Signature Signed": "SIGNATURE SIGNED",
      "SIGNATURE SIGNED": "SIGNATURE SIGNED",
      "Custom 1/1": "CUSTOM 1/1",
      "CUSTOM 1/1": "CUSTOM 1/1",
      "GR": "GR",
      "Deadstock": "DEADSTOCK",
      "Used": "USED"
    };

    document.querySelectorAll(".filter-chip[data-value]").forEach(button => {
      const value = button.dataset.value;

      if (editionLabels[value]) {
        button.textContent = editionLabels[value];
      }
    });
  }

  /* =========================================================
     CARD TYPE LABELS
     IMPORTANT:
     Edition/type/condition badges on the cards remain English.
  ========================================================= */

  function keepCardBadgesEnglish() {
    const EnglishBadge = {
      "PE": "PE",
      "MẪU": "SAMPLE",
      "SAMPLE": "SAMPLE",
      "PE SAMPLE": "PE SAMPLE",
      "MẪU PE": "PE SAMPLE",
      "F&F": "F&F",
      "BẠN BÈ & GIA ĐÌNH": "F&F",
      "SIGNATURE SIGNED": "SIGNATURE SIGNED",
      "CÓ CHỮ KÝ": "SIGNATURE SIGNED",
      "CUSTOM 1/1": "CUSTOM 1/1",
      "TÙY CHỈNH 1/1": "CUSTOM 1/1",
      "GR": "GR",
      "PHÁT HÀNH ĐẠI TRÀ": "GR",
      "DEADSTOCK": "DEADSTOCK",
      "CHƯA QUA SỬ DỤNG": "DEADSTOCK",
      "USED": "USED",
      "ĐÃ QUA SỬ DỤNG": "USED"
    };

    document
      .querySelectorAll(
        ".card .tag, .card .badge, .card .edition, .card .condition, " +
        ".card [class*='tag'], .card [class*='badge'], " +
        ".card [class*='edition'], .card [class*='condition']"
      )
      .forEach(node => {
        const key = node.textContent.trim().toUpperCase();

        if (EnglishBadge[key]) {
          node.textContent = EnglishBadge[key];
        }
      });
  }

  /* =========================================================
     3D / GRID LABEL
  ========================================================= */

  function fixViewToggle(lang) {
    const toggle = document.getElementById("collection-3d-toggle");

    if (!toggle) return;

    const text = toggle.textContent.trim().toUpperCase();

    if (lang === "vi") {
      if (
        text.includes("3D") &&
        !text.includes("LƯỚI")
      ) {
        toggle.textContent = "CHẾ ĐỘ 3D";
      } else if (
        text.includes("GRID") ||
        text.includes("LƯỚI")
      ) {
        toggle.textContent = "CHẾ ĐỘ LƯỚI";
      }
    } else {
      if (
        text.includes("3D")
      ) {
        toggle.textContent = "3D VIEW";
      } else if (
        text.includes("LƯỚI") ||
        text.includes("GRID")
      ) {
        toggle.textContent = "GRID VIEW";
      }
    }
  }

  /* =========================================================
     ABOUT PAGE
  ========================================================= */

  function setAboutPage(lang) {
    const eyebrow = document.querySelector(".about-header .eyebrow, .eyebrow");

    if (eyebrow) {
      const current = eyebrow.textContent.trim().toUpperCase();

      if (
        current.includes("PRIVATE DIGITAL ARCHIVE") ||
        current.includes("KHO LƯU TRỮ")
      ) {
        eyebrow.textContent =
          lang === "vi"
            ? "KHO LƯU TRỮ KỸ THUẬT SỐ CÁ NHÂN"
            : "PRIVATE DIGITAL ARCHIVE";
      }
    }
  }

  /* =========================================================
     APPLY
  ========================================================= */

  function applyAll() {
    if (applying) return;
    applying = true;

    try {
      const lang = getLang();

      ensureStylePatch();
      moveAboutLeft();

      patchMainTranslations();
      patchVansCardData();
      cleanVietnameseNarratives();

      setNavigation(lang);
      setHeader(lang);
      setPrivateNotice(lang);
      setFooter(lang);

      /*
        Deliberately keep these in English in both modes:
        - filter values
        - card edition/type/condition badges
      */
      keepFilterValuesEnglish();
      keepCardBadgesEnglish();

      fixViewToggle(lang);
      setAboutPage(lang);

      document.documentElement.lang = lang;
    } finally {
      applying = false;
    }
  }

  function scheduleApply() {
    if (scheduled) return;
    scheduled = true;

    requestAnimationFrame(() => {
      scheduled = false;
      applyAll();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll, { once: true });
  } else {
    applyAll();
  }

  window.addEventListener("load", applyAll);

  document.addEventListener("click", event => {
    const button = event.target.closest("#btn-vi, #btn-en, .lang-btn");
    if (!button) return;

    setTimeout(applyAll, 0);
    setTimeout(applyAll, 50);
    setTimeout(applyAll, 150);
  });

  const observer = new MutationObserver(scheduleApply);

  const startObserver = () => {
    if (!document.body) return;

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  if (document.body) {
    startObserver();
  } else {
    document.addEventListener("DOMContentLoaded", startObserver, { once: true });
  }

  [100, 300, 800, 1500].forEach(ms => setTimeout(applyAll, ms));
})();
