/* =========================================================
   LỘC AN — SNEAKER DISPLAY CONFIG v1
   SINGLE SOURCE OF TRUTH FOR GRID + 3D

   CHỈNH KÍCH THƯỚC GIÀY Ở FILE NÀY.

   scaleX:
     1.00 = 100% chiều ngang
     0.90 = 90%
     1.10 = 110%

   scaleY:
     1.00 = 100% chiều cao
     0.84 = ép chiều cao còn 84%

   x:
     + sang phải
     - sang trái

   y:
     + xuống
     - lên

   fit:
     "contain" = luôn thấy trọn đôi
     "cover"   = phủ kín khung

   QUAN TRỌNG:
   - Grid và 3D đọc CÙNG MỘT cấu hình.
   - Không MutationObserver.
   - Không dò DOM sau khi render.
   - Không cần sneaker-display-tuning.js nữa.
   ========================================================= */

(() => {
  "use strict";

  const DEFAULT_DISPLAY = {
    scaleX: 1.00,
    scaleY: 1.00,
    x: 0,
    y: 0,
    fit: "cover"
  };

  /*
    Các đôi đã được cân theo Grid hiện tại của bạn.

    Về sau thêm đôi mới:
    - tốt nhất dùng id chính xác:
        {
          id: "shoe-id",
          scaleX: 0.92,
          scaleY: 0.92,
          x: 0,
          y: 0,
          fit: "contain"
        }

    - hoặc dùng any / all theo tên nếu chưa muốn nhớ id.
  */
  const RULES = [
    {
      any: ["bape x stussy", "bape x stüssy"],
      scaleX: 0.90,
      scaleY: 0.90,
      x: 0,
      y: 0,
      fit: "contain"
    },

    {
      any: ["waffle racer", "off-white waffle"],
      scaleX: 0.88,
      scaleY: 0.88,
      x: 0,
      y: 0,
      fit: "contain"
    },

    {
      all: ["jordan 4", "black cement"],
      scaleX: 0.90,
      scaleY: 0.90,
      x: 0,
      y: 0,
      fit: "contain"
    },

    {
      all: ["new balance", "2002r"],
      scaleX: 0.54,
      scaleY: 0.54,
      x: 0,
      y: 0,
      fit: "contain"
    },

    {
      all: ["jordan 1 low", "reverse bred"],
      scaleX: 0.55,
      scaleY: 0.55,
      x: 0,
      y: 0,
      fit: "contain"
    },

    {
      all: ["vans", "knu skool"],
      scaleX: 1.00,
      scaleY: 1.00,
      x: 0,
      y: 0,
      fit: "contain"
    },

    {
      all: ["balenciaga", "defender"],
      scaleX: 1.00,
      scaleY: 0.84,
      x: 0,
      y: 0,
      fit: "contain"
    }
  ];

  function normalize(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[“”‘’]/g, "'")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  function sneakerCorpus(sneaker) {
    return normalize([
      sneaker?.id,
      sneaker?.title?.vi,
      sneaker?.title?.en,
      typeof sneaker?.title === "string" ? sneaker.title : "",
      sneaker?.image
    ].filter(Boolean).join(" "));
  }

  function findRule(sneaker) {
    const id = String(sneaker?.id ?? "");

    const exact = RULES.find(rule =>
      rule.id && rule.id === id
    );

    if (exact) return exact;

    const corpus = sneakerCorpus(sneaker);

    return RULES.find(rule => {
      const any =
        Array.isArray(rule.any)
          ? rule.any
          : [];

      const all =
        Array.isArray(rule.all)
          ? rule.all
          : [];

      const anyMatches =
        any.length === 0 ||
        any.some(keyword =>
          corpus.includes(normalize(keyword))
        );

      const allMatches =
        all.length === 0 ||
        all.every(keyword =>
          corpus.includes(normalize(keyword))
        );

      /*
        - any: chỉ cần một từ khóa khớp.
        - all: tất cả từ khóa phải cùng khớp.
        Nhờ vậy "Jordan 4 Black Cement" không vô tình
        áp dụng cho một mẫu Jordan 4 khác trong tương lai.
      */
      return (
        (any.length > 0 || all.length > 0) &&
        anyMatches &&
        allMatches
      );
    }) || null;
  }

  function numeric(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function getSneakerDisplay(sneaker) {
    const rule = findRule(sneaker) || {};

    /*
      Nếu sau này bạn muốn đặt trực tiếp trong data.js:

      display: {
        scaleX: 0.92,
        scaleY: 0.92,
        x: 0,
        y: 0,
        fit: "contain"
      }

      thì sneaker.display sẽ được ưu tiên cao nhất.
    */
    const inline =
      sneaker &&
      sneaker.display &&
      typeof sneaker.display === "object"
        ? sneaker.display
        : {};

    const merged = {
      ...DEFAULT_DISPLAY,
      ...rule,
      ...inline
    };

    return {
      scaleX: numeric(merged.scaleX, 1),
      scaleY: numeric(merged.scaleY, 1),
      x: numeric(merged.x, 0),
      y: numeric(merged.y, 0),
      fit: merged.fit === "contain" ? "contain" : "cover"
    };
  }

  function getSneakerDisplayStyle(sneaker) {
    const display = getSneakerDisplay(sneaker);

    return [
      `--shoe-scale-x:${display.scaleX}`,
      `--shoe-scale-y:${display.scaleY}`,
      `--shoe-x:${display.x}px`,
      `--shoe-y:${display.y}px`,
      `--shoe-fit:${display.fit}`
    ].join(";");
  }

  function installDisplayStyles() {
    document
      .getElementById("locan-sneaker-display-config-v1")
      ?.remove();

    const style = document.createElement("style");

    style.id = "locan-sneaker-display-config-v1";

    style.textContent = `
      /*
        GRID + 3D dùng cùng CSS individual properties.
        "scale" ở đây KHÔNG đè "transform" của card/3D animation.
      */
      .grid .card-img-wrapper img[data-sneaker-display="true"],
      .sneaker-3d-image img[data-sneaker-display="true"] {
        scale:
          var(--shoe-scale-x, 1)
          var(--shoe-scale-y, 1)
          !important;

        translate:
          var(--shoe-x, 0px)
          var(--shoe-y, 0px)
          !important;

        transform-origin:
          center center
          !important;

        object-fit:
          var(--shoe-fit, cover)
          !important;

        object-position:
          center center
          !important;
      }

      /*
        3D: ảnh luôn dùng toàn bộ vùng ảnh của card.
        Kích thước riêng của đôi giày do scaleX/scaleY ở trên quyết định.
      */
      .sneaker-3d-image img[data-sneaker-display="true"] {
        width: 100% !important;
        height: 100% !important;
        max-width: none !important;
        max-height: none !important;
        margin: 0 !important;
      }
    `;

    document.head.appendChild(style);
  }

  /*
    GRID renderer:
    thay renderCard hiện tại bằng renderer đọc đúng display config.
    Không thay filter / search / sort / density slider.
  */
  function installGridRenderer() {
    if (typeof window.renderCard !== "function") {
      console.warn(
        "[Lộc An Display] renderCard not found. " +
        "Load sneaker-display-config.js AFTER main.js."
      );
      return;
    }

    window.renderCard = function renderCardWithDisplay(sneaker) {
      const title = getLocalizedText(sneaker.title);
      const subtitle = getLocalizedText(sneaker.subtitle);
      const edition = getLocalizedText(sneaker.editionType);

      const detailURL =
        `./shoe.html?id=${encodeURIComponent(sneaker.id)}` +
        `&lang=${encodeURIComponent(currentLang)}`;

      const badge = edition
        ? `<span class="badge">${escapeHTML(edition)}</span>`
        : `<span class="badge badge-placeholder">&nbsp;</span>`;

      const imageStyle = getSneakerDisplayStyle(sneaker);

      return `
        <a
          href="${detailURL}"
          class="card-link"
          aria-label="${escapeHTML(title)}"
        >
          <article
            class="card"
            data-sneaker-id="${escapeHTML(sneaker.id || "")}"
          >

            <div class="card-img-wrapper">
              <img
                src="${escapeHTML(sneaker.image || "")}"
                alt="${escapeHTML(title)}"
                loading="lazy"
                decoding="async"
                data-sneaker-display="true"
                data-sneaker-id="${escapeHTML(sneaker.id || "")}"
                style="${escapeHTML(imageStyle)}"
              >
            </div>

            <div class="card-info">

              <h3>${escapeHTML(title)}</h3>

              <p class="subtitle">
                ${escapeHTML(subtitle)}
              </p>

              <div class="card-meta">
                ${badge}

                <span class="size">
                  ${escapeHTML(sneaker.size || "")}
                </span>
              </div>

              <span class="card-cta">
                ${translations[currentLang].viewMore}
              </span>

            </div>

          </article>
        </a>
      `;
    };
  }

  window.LOCAN_SNEAKER_DISPLAY_RULES = RULES;
  window.getSneakerDisplay = getSneakerDisplay;
  window.getSneakerDisplayStyle = getSneakerDisplayStyle;

  installDisplayStyles();
  installGridRenderer();

  console.info(
    "Lộc An sneaker display config v1 loaded — Grid + 3D shared sizing"
  );
})();
