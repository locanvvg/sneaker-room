/* =========================================================
   LỘC AN SNEAKER COLLECTION
   FULL VI / EN LOCALIZATION PATCH
   2026-09-13

   Purpose
   - VI: Vietnamese throughout the visible UI and Vietnamese
     narrative fields, while preserving official product names,
     brand names, SKU/style codes and archival identifiers.
   - EN: English throughout.
   - Keeps existing layout, CSS, filters and collection logic.
   - Removes "Rope Lace Custom" from the Vans cover presentation
     and uses a release-year subtitle.
   ========================================================= */

(() => {
  "use strict";

  const LANG_KEY = "locan_lang";
  let applying = false;
  let scheduled = false;

  const getLang = () => {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    const stored = localStorage.getItem(LANG_KEY);
    return (urlLang === "en" || stored === "en") ? "en" : "vi";
  };

  /* ---------------------------------------------------------
     Preserve official names / identifiers while cleaning mixed
     Vietnamese narrative text.
  --------------------------------------------------------- */

  const protectedPhrases = [
    "Lộc An Sneaker Collection",
    "Air Jordan",
    "Jordan Brand",
    "Nike SB",
    "Nike",
    "Off-White",
    "New Balance",
    "Balenciaga",
    "Vans",
    "Knu Skool",
    "Old Skool",
    "Swoosh",
    "Wings",
    "Jumpman",
    "Air Zoom",
    "Black Cement",
    "Shadow",
    "Bred",
    "Royal",
    "Chicago",
    "Matcha",
    "UN/LA",
    "Sidestripe",
    "Jackson Pollock",
    "Pollock-Krasner Foundation",
    "Michael Jordan",
    "Peter Moore",
    "Tinker Hatfield",
    "Virgil Abloh",
    "Yuto Horigome"
  ];

  function protectOfficialNames(text) {
    const tokens = [];
    let out = String(text ?? "");

    protectedPhrases
      .sort((a, b) => b.length - a.length)
      .forEach(phrase => {
        const token = `__LOCAN_PROTECTED_${tokens.length}__`;
        if (out.includes(phrase)) {
          tokens.push([token, phrase]);
          out = out.split(phrase).join(token);
        }
      });

    return { out, tokens };
  }

  function restoreOfficialNames(text, tokens) {
    let out = text;
    tokens.forEach(([token, phrase]) => {
      out = out.split(token).join(phrase);
    });
    return out;
  }

  /*
    Long phrases come first. These replacements are deliberately
    semantic, not creative: they only localize mixed English terms
    already embedded in Vietnamese copy.
  */
  const VI_PHRASE_MAP = [
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
    ["heel Air Zoom", "đệm Air Zoom ở gót"],
    ["family crest", "huy hiệu gia đình"],
    ["lateral heel", "gót ngoài"],
    ["skate footwear", "giày trượt ván"],
    ["running heritage", "di sản chạy bộ"],
    ["innovation stories", "câu chuyện đổi mới"],
    ["visible Air cushioning", "đệm Air lộ thiên"],
    ["mesh paneling", "các mảng lưới"],
    ["plastic support wings", "cánh đỡ bằng nhựa"],
    ["red-black identity", "bản sắc đỏ-đen"],
    ["translucent film", "lớp màng bán trong suốt"],
    ["Dual-lacing system", "Hệ thống dây giày kép"],
    ["dual-lacing system", "hệ thống dây giày kép"],
    ["anchor points", "các điểm neo"],
    ["outdoor equipment", "thiết bị ngoài trời"],
    ["hiking hardware", "phụ kiện leo núi"],
    ["performance gear", "trang bị hiệu năng"],
    ["rubber spikes", "gai cao su"],
    ["retro runner", "giày chạy bộ phong cách hoài cổ"],
    ["track spike", "giày đinh chạy sân"],
    ["trail footwear", "giày địa hình"],
    ["exposed construction", "cấu trúc để lộ"],
    ["Industrial typography", "Kiểu chữ công nghiệp"],
    ["industrial typography", "kiểu chữ công nghiệp"],
    ["orange tab", "thẻ màu cam"],
    ["exposed tongue", "lưỡi gà để lộ"],
    ["metallic Swoosh", "Swoosh ánh kim"],
    ["zip-tie language", "ngôn ngữ thiết kế dây rút"],
    ["worn-out effect", "hiệu ứng cũ mòn"],
    ["industrial design", "thiết kế công nghiệp"],
    ["running shoe", "giày chạy bộ"],
    ["sole unit", "cụm đế"],
    ["tire tread", "hoa lốp"],
    ["Tire-Tread Runner", "Giày chạy bộ với đế hoa lốp"],
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
    ["DNA skate", "di sản trượt ván"],
    ["factory configuration", "cấu hình nguyên bản từ nhà máy"],
    ["factory edition", "phiên bản nguyên bản của hãng"],
    ["rope laces", "dây giày dạng thừng"],
    ["rope lace", "dây giày dạng thừng"],
    ["colorway GR", "phối màu phát hành đại trà"],
    ["1-of-1 custom", "tùy chỉnh độc bản 1/1"],
    ["customization process", "quá trình tùy chỉnh"],
    ["hand-applied artwork", "họa tiết được thực hiện thủ công"],
    ["visual treatment", "cách xử lý thị giác"],
    ["Exhibition Note:", "Ghi chú trưng bày:"],
    ["exhibition note", "ghi chú trưng bày"],
    ["First Shadow Retro Release", "Lần tái phát hành Shadow đầu tiên"],
    ["First Black Cement Retro Release", "Lần tái phát hành Black Cement đầu tiên"],
    ["Bred-Inspired Low-Top Edition", "Phiên bản cổ thấp lấy cảm hứng từ Bred"],
    ["Los Angeles / NBA All-Star Edition", "Phiên bản Los Angeles / NBA All-Star"],
    ["Chunky Skate Silhouette", "Phom giày trượt ván phồng đặc trưng"],
    ["Puffy Skate-Inspired Silhouette", "Phom giày phồng lấy cảm hứng từ trượt ván"],

    ["provenance", "nguồn gốc lưu trữ"],
    ["sneakerhead", "người đam mê giày"],
    ["box label", "nhãn hộp"],
    ["stamped", "đóng dấu"],
    ["pair", "đôi giày"],
    ["texture", "kết cấu bề mặt"],
    ["motif", "họa tiết"],
    ["collaboration", "màn hợp tác"],
    ["Padding", "Lớp đệm"],
    ["padding", "lớp đệm"],
    ["colorway", "phối màu"],
    ["trend", "xu hướng"],
    ["everyday", "hằng ngày"],
    ["high-top", "cổ cao"],
    ["panel", "mảng vật liệu"],
    ["upper", "thân giày"],
    ["outsole", "đế ngoài"],
    ["footwear", "giày dép"],
    ["silhouette", "phom dáng"],
    ["movement", "chuyển động"],
    ["traction", "độ bám"],
    ["mesh", "lưới"],
    ["construction", "cấu trúc"],
    ["prototype", "nguyên mẫu"],
    ["cord", "dây"],
    ["fastening", "hệ thống cố định"],
    ["graphic", "đồ họa"],
    ["spike", "gai"],
    ["film", "lớp màng"],
    ["layers", "các lớp vật liệu"],
    ["layer", "lớp vật liệu"],
    ["hardware", "chi tiết phần cứng"],
    ["Yellowing", "Hiện tượng ố vàng"],
    ["yellowing", "hiện tượng ố vàng"],
    ["modification", "tùy chỉnh"],
    ["treatment", "cách xử lý"],
    ["identity", "bản sắc"],
    ["padded", "đệm dày"],
    ["exaggerated", "cường điệu"],
    ["model skate", "mẫu giày trượt ván"],
    ["shoe", "đôi giày"]
  ].sort((a, b) => b[0].length - a[0].length);

  function cleanVietnameseNarrative(value) {
    if (typeof value !== "string") return value;

    const { out: protectedText, tokens } = protectOfficialNames(value);
    let out = protectedText;

    for (const [from, to] of VI_PHRASE_MAP) {
      out = out.split(from).join(to);
    }

    return restoreOfficialNames(out, tokens);
  }

  /* ---------------------------------------------------------
     Sneaker data
  --------------------------------------------------------- */

  function patchSneakerData() {
    try {
      if (typeof sneakers === "undefined" || !Array.isArray(sneakers)) {
        return;
      }

      sneakers.forEach(item => {
        if (!item || typeof item !== "object") return;

        if (item.subtitle && typeof item.subtitle.vi === "string") {
          item.subtitle.vi = cleanVietnameseNarrative(item.subtitle.vi);
        }

        if (item.story && typeof item.story.vi === "string") {
          item.story.vi = cleanVietnameseNarrative(item.story.vi);
        }

        /*
          Requested Vans cover treatment:
          - no "Rope Lace Custom" in title
          - release year included in subtitle
          - rope-lace modification remains in the detailed story
        */
        if (
          item.id === "vans-knu-skool-black-true-white-rope-lace" ||
          String(item.title?.en || "").includes("Vans Knu Skool")
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
      console.warn("[Lộc An localization] Sneaker data patch skipped:", error);
    }
  }

  /* ---------------------------------------------------------
     Existing homepage translation object
  --------------------------------------------------------- */

  function patchMainTranslations() {
    try {
      if (typeof translations === "undefined") return;

      if (translations.vi) {
        Object.assign(translations.vi, {
          mainSubtitle: "Không gian lưu trữ & Bảo tàng Giày Kỹ thuật số",
          sortLabel: "SẮP XẾP",
          sortDefault: "Mặc định",
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
          view3D: "3D VIEW",
          backToGrid: "GRID VIEW"
        });
      }
    } catch (error) {
      console.warn("[Lộc An localization] Main translation patch skipped:", error);
    }
  }

  /* ---------------------------------------------------------
     DOM helpers
  --------------------------------------------------------- */

  function setText(selector, text) {
    const node = document.querySelector(selector);
    if (node && node.textContent !== text) {
      node.textContent = text;
    }
  }

  function setAllText(selector, text) {
    document.querySelectorAll(selector).forEach(node => {
      if (node.textContent !== text) node.textContent = text;
    });
  }

  function setNav(lang) {
    document.querySelectorAll('a[href$="index.html"], a[href="./index.html"]').forEach(a => {
      if (a.classList.contains("museum-nav-link")) {
        a.textContent = lang === "vi" ? "GIÀY THỂ THAO" : "SNEAKERS";
      }
    });

    document.querySelectorAll('a[href$="lego.html"], a[href="./lego.html"]').forEach(a => {
      if (a.classList.contains("museum-nav-link")) {
        a.textContent = "LEGO";
      }
    });

    document.querySelectorAll('a[href$="sneaker-mask.html"], a[href="./sneaker-mask.html"]').forEach(a => {
      if (a.classList.contains("museum-nav-link")) {
        a.textContent = lang === "vi" ? "MẶT NẠ GIÀY" : "SNEAKER MASK";
      }
    });

    document.querySelectorAll(".about-corner-link, .header-about-link").forEach(a => {
      a.textContent = lang === "vi" ? "GIỚI THIỆU" : "ABOUT";
    });
  }

  function setFooter(lang) {
    document.querySelectorAll("footer p").forEach(p => {
      p.textContent =
        lang === "vi"
          ? "© 2026 Lộc An Sneaker Collection. Bảo lưu mọi quyền."
          : "© 2026 Lộc An Sneaker Collection. All Rights Reserved.";
    });
  }

  function setSearch(lang) {
    const label = document.getElementById("archive-search-label");
    const input = document.getElementById("archive-search-input");
    const clear = document.getElementById("archive-search-clear");

    if (label) label.textContent = lang === "vi" ? "TÌM KIẾM" : "SEARCH";

    if (input) {
      input.placeholder = lang === "vi" ? "Tìm kiếm..." : "Search...";
      input.setAttribute(
        "aria-label",
        lang === "vi" ? "Tìm kiếm bộ sưu tập" : "Search collection"
      );
    }

    if (clear) {
      clear.setAttribute(
        "aria-label",
        lang === "vi" ? "Xóa tìm kiếm" : "Clear search"
      );
    }
  }

  function setHomepageControls(lang) {
    const sortLabel = document.getElementById("sort-label");
    if (sortLabel) sortLabel.textContent = lang === "vi" ? "SẮP XẾP" : "SORT";

    const sort = document.getElementById("sort-select");
    if (sort) {
      const labels = lang === "vi"
        ? {
            default: "Mặc định",
            az: "A → Z",
            za: "Z → A",
            "date-desc": "Ngày phát hành: Mới → Cũ",
            "date-asc": "Ngày phát hành: Cũ → Mới",
            "size-asc": "Kích cỡ nhỏ → lớn",
            "size-desc": "Kích cỡ lớn → nhỏ"
          }
        : {
            default: "Default",
            az: "A → Z",
            za: "Z → A",
            "date-desc": "Release date: New → Old",
            "date-asc": "Release date: Old → New",
            "size-asc": "Size: Small → Large",
            "size-desc": "Size: Large → Small"
          };

      Array.from(sort.options).forEach(option => {
        if (labels[option.value]) option.textContent = labels[option.value];
      });
    }

    setText("#filter-title", lang === "vi" ? "BỘ LỌC BỘ SƯU TẬP" : "COLLECTION FILTERS");

    const clearFilters = document.querySelector(".clear-filter-btn");
    if (clearFilters) {
      clearFilters.textContent = lang === "vi" ? "XÓA BỘ LỌC" : "CLEAR FILTERS";
    }

    setText("#edition-filter-label", lang === "vi" ? "PHÂN KHÚC" : "EDITION");
    setText("#condition-filter-label", lang === "vi" ? "TÌNH TRẠNG" : "CONDITION");
    setText("#size-filter-label", lang === "vi" ? "KÍCH CỠ" : "SIZE");

    const chipLabels = lang === "vi"
      ? {
          "PE": "PE",
          "SAMPLE": "MẪU",
          "Sample": "MẪU",
          "F&F": "BẠN BÈ & GIA ĐÌNH",
          "SIGNATURE SIGNED": "CÓ CHỮ KÝ",
          "Signature Signed": "CÓ CHỮ KÝ",
          "CUSTOM 1/1": "TÙY CHỈNH 1/1",
          "Custom 1/1": "TÙY CHỈNH 1/1",
          "GR": "PHÁT HÀNH ĐẠI TRÀ",
          "Deadstock": "CHƯA QUA SỬ DỤNG",
          "Used": "ĐÃ QUA SỬ DỤNG"
        }
      : {
          "PE": "PE",
          "SAMPLE": "SAMPLE",
          "Sample": "SAMPLE",
          "F&F": "F&F",
          "SIGNATURE SIGNED": "SIGNATURE SIGNED",
          "Signature Signed": "SIGNATURE SIGNED",
          "CUSTOM 1/1": "CUSTOM 1/1",
          "Custom 1/1": "CUSTOM 1/1",
          "GR": "GR",
          "Deadstock": "DEADSTOCK",
          "Used": "USED"
        };

    document.querySelectorAll(".filter-chip[data-value]").forEach(button => {
      const value = button.dataset.value;
      if (chipLabels[value]) button.textContent = chipLabels[value];
    });
  }

  function setCategoryPages(lang) {
    const eyebrow = document.querySelector(".collection-category-eyebrow");
    const h2 = document.querySelector(".collection-category-hero h2");

    if (eyebrow) {
      const t = eyebrow.textContent.trim().toUpperCase();

      if (t.includes("SNEAKER MASK")) {
        eyebrow.textContent = lang === "vi"
          ? "KHO LƯU TRỮ MẶT NẠ GIÀY"
          : "SNEAKER MASK ARCHIVE";
      } else if (t.includes("LEGO") || t.includes("NIKE")) {
        eyebrow.textContent = lang === "vi"
          ? "KHO LƯU TRỮ NIKE x LEGO"
          : "NIKE x LEGO ARCHIVE";
      }
    }

    if (h2) {
      const t = h2.textContent.trim().toLowerCase();

      if (t.includes("mask")) {
        h2.textContent = lang === "vi"
          ? "Mặt nạ giày chế tác thủ công"
          : "Handcrafted Sneaker Masks";
      } else if (t.includes("lego")) {
        h2.textContent = lang === "vi"
          ? "Bộ sưu tập Nike x LEGO"
          : "Nike x LEGO Collection";
      }
    }

    const maskCount = document.getElementById("mask-count");
    if (maskCount && lang === "vi") {
      maskCount.textContent = maskCount.textContent
        .replace(/\bMASKS?\b/gi, "MẶT NẠ")
        .replace(/\bTOTAL\b/gi, "TỔNG SỐ");
    }

    const legoCount = document.getElementById("lego-count");
    if (legoCount && lang === "vi") {
      legoCount.textContent = legoCount.textContent
        .replace(/\bSETS?\b/gi, "BỘ")
        .replace(/\bTOTAL\b/gi, "TỔNG SỐ");
    }
  }

  function setAboutPage(lang) {
    const eyebrow = document.querySelector(".about-header .eyebrow, .eyebrow");
    if (eyebrow && /PRIVATE DIGITAL ARCHIVE|LƯU TRỮ KỸ THUẬT SỐ/i.test(eyebrow.textContent)) {
      eyebrow.textContent =
        lang === "vi" ? "KHO LƯU TRỮ KỸ THUẬT SỐ CÁ NHÂN" : "PRIVATE DIGITAL ARCHIVE";
    }
  }

  /* ---------------------------------------------------------
     Detail-page / generic exact UI localization
  --------------------------------------------------------- */

  const EXACT_UI = {
    vi: {
      "ABOUT": "GIỚI THIỆU",
      "SNEAKERS": "GIÀY THỂ THAO",
      "SNEAKER MASK": "MẶT NẠ GIÀY",
      "SEARCH": "TÌM KIẾM",
      "SORT": "SẮP XẾP",
      "COLLECTION FILTERS": "BỘ LỌC BỘ SƯU TẬP",
      "CLEAR FILTERS": "XÓA BỘ LỌC",
      "EDITION": "PHÂN KHÚC",
      "CONDITION": "TÌNH TRẠNG",
      "SIZE": "KÍCH CỠ",
      "RETAIL": "GIÁ BÁN LẺ",
      "RETAIL PRICE": "GIÁ BÁN LẺ",
      "RELEASE DATE": "NGÀY PHÁT HÀNH",
      "COLORWAY": "PHỐI MÀU",
      "STORY": "CÂU CHUYỆN",
      "ARCHIVE NOTE": "GHI CHÚ LƯU TRỮ",
      "EXHIBITION NOTE": "GHI CHÚ TRƯNG BÀY",
      "VIEW MORE →": "XEM THÊM →",
      "VIEW MORE": "XEM THÊM",
      "BACK": "QUAY LẠI",
      "BACK TO COLLECTION": "QUAY LẠI BỘ SƯU TẬP",
      "3D VIEW": "CHẾ ĐỘ 3D",
      "GRID VIEW": "CHẾ ĐỘ LƯỚI",
      "DEADSTOCK": "CHƯA QUA SỬ DỤNG",
      "USED": "ĐÃ QUA SỬ DỤNG",
      "SAMPLE": "MẪU",
      "SIGNATURE SIGNED": "CÓ CHỮ KÝ",
      "CUSTOM 1/1": "TÙY CHỈNH 1/1",
      "GR": "PHÁT HÀNH ĐẠI TRÀ"
    },
    en: {
      "GIỚI THIỆU": "ABOUT",
      "GIÀY THỂ THAO": "SNEAKERS",
      "MẶT NẠ GIÀY": "SNEAKER MASK",
      "TÌM KIẾM": "SEARCH",
      "SẮP XẾP": "SORT",
      "BỘ LỌC BỘ SƯU TẬP": "COLLECTION FILTERS",
      "XÓA BỘ LỌC": "CLEAR FILTERS",
      "PHÂN KHÚC": "EDITION",
      "TÌNH TRẠNG": "CONDITION",
      "KÍCH CỠ": "SIZE",
      "GIÁ BÁN LẺ": "RETAIL",
      "NGÀY PHÁT HÀNH": "RELEASE DATE",
      "PHỐI MÀU": "COLORWAY",
      "CÂU CHUYỆN": "STORY",
      "GHI CHÚ LƯU TRỮ": "ARCHIVE NOTE",
      "GHI CHÚ TRƯNG BÀY": "EXHIBITION NOTE",
      "XEM THÊM →": "VIEW MORE →",
      "XEM THÊM": "VIEW MORE",
      "QUAY LẠI": "BACK",
      "QUAY LẠI BỘ SƯU TẬP": "BACK TO COLLECTION",
      "CHẾ ĐỘ 3D": "3D VIEW",
      "CHẾ ĐỘ LƯỚI": "GRID VIEW",
      "CHƯA QUA SỬ DỤNG": "DEADSTOCK",
      "ĐÃ QUA SỬ DỤNG": "USED",
      "MẪU": "SAMPLE",
      "CÓ CHỮ KÝ": "SIGNATURE SIGNED",
      "TÙY CHỈNH 1/1": "CUSTOM 1/1",
      "PHÁT HÀNH ĐẠI TRÀ": "GR"
    }
  };

  function localizeExactTextNodes(lang) {
    if (!document.body) return;

    const map = EXACT_UI[lang];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (!node.parentElement) return NodeFilter.FILTER_REJECT;

          const tag = node.parentElement.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
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
      const replacement = map[trimmed];

      if (!replacement) return;

      const leading = raw.match(/^\s*/)?.[0] || "";
      const trailing = raw.match(/\s*$/)?.[0] || "";
      node.nodeValue = `${leading}${replacement}${trailing}`;
    });
  }

  /* ---------------------------------------------------------
     Display-only metadata localization.
     Underlying filter/data values remain untouched so filters
     continue to work exactly as before.
  --------------------------------------------------------- */

  function localizeDisplayedMetadata(lang) {
    if (lang !== "vi") return;

    const candidates = document.querySelectorAll(
      ".card, .detail-page, .sneaker-detail, .metadata, .info-box, .detail-info"
    );

    candidates.forEach(root => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];

      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach(node => {
        const raw = node.nodeValue;
        const t = raw.trim();

        const map = {
          "Deadstock": "Chưa qua sử dụng",
          "Used": "Đã qua sử dụng",
          "PE Sample": "Mẫu PE",
          "Sample": "Mẫu",
          "Signature Signed": "Có chữ ký",
          "Custom 1/1": "Tùy chỉnh 1/1",
          "GR": "Phát hành đại trà"
        };

        if (!map[t]) return;

        const leading = raw.match(/^\s*/)?.[0] || "";
        const trailing = raw.match(/\s*$/)?.[0] || "";
        node.nodeValue = `${leading}${map[t]}${trailing}`;
      });
    });
  }

  function applyAll() {
    if (applying) return;
    applying = true;

    try {
      const lang = getLang();

      patchSneakerData();
      patchMainTranslations();

      setNav(lang);
      setFooter(lang);
      setSearch(lang);
      setHomepageControls(lang);
      setCategoryPages(lang);
      setAboutPage(lang);
      localizeExactTextNodes(lang);
      localizeDisplayedMetadata(lang);

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

  /* ---------------------------------------------------------
     Run after existing page scripts, and re-run after dynamic
     card/grid/3D rendering or language-button clicks.
  --------------------------------------------------------- */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyAll, { once: true });
  } else {
    applyAll();
  }

  window.addEventListener("load", applyAll);

  document.addEventListener("click", event => {
    const target = event.target.closest("#btn-vi, #btn-en, .lang-btn");
    if (!target) return;

    setTimeout(applyAll, 0);
    setTimeout(applyAll, 50);
  });

  const observer = new MutationObserver(scheduleApply);

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }, { once: true });
  }

  /*
    A few delayed passes cover scripts that render after initial
    DOMContentLoaded without requiring any change to existing files.
  */
  [100, 300, 800, 1500].forEach(ms => setTimeout(applyAll, ms));
})();
